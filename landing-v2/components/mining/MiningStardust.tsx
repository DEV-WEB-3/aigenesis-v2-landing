'use client'

import { useMemo } from 'react'
import { PARALAJE } from '@/lib/design/motion'

interface MiningStardustProps {
  count?: number
  layer?: 1 | 2 | 3
}

type DustSpec = {
  x: number
  y: number
  size: number
  delay: number
  dur: number
  hue: 'fuchsia' | 'purple' | 'cyan'
}

function buildDust(count: number, seed: number): DustSpec[] {
  const hues: DustSpec['hue'][] = ['fuchsia', 'purple', 'cyan']
  return Array.from({ length: count }, (_, i) => {
    const r1 = Math.sin(seed + i * 12.9898) * 43758.5453
    const r2 = Math.sin(seed + i * 78.233) * 43758.5453
    const r3 = Math.sin(seed + i * 39.425) * 43758.5453
    const f = (n: number) => n - Math.floor(n)
    return {
      x: 8 + f(r1) * 84,
      y: 8 + f(r2) * 84,
      size: 1 + f(r3) * 1.8,
      delay: f(r1 * 0.7) * 6,
      // el polvo deriva al escalon de fondo del paralaje; la separacion
      // la sigue dando `delay`, que es aleatorio por semilla y no va en rejilla
      dur: PARALAJE.frente,
      hue: hues[i % hues.length]!,
    }
  })
}

export default function MiningStardust({ count = 10, layer = 2 }: MiningStardustProps) {
  const particles = useMemo(() => buildDust(count, layer * 17), [count, layer])

  return (
    <div className={`mining-stardust mining-stardust--layer-${layer}`} aria-hidden="true">
      {particles.map((p, i) => (
        <span
          key={`${layer}-${i}`}
          className={`mining-stardust__particle mining-stardust__particle--${p.hue}`}
          style={
            {
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.dur}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}
