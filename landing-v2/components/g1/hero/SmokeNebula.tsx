'use client'

import { G1 } from '@/lib/design/g1'

/**
 * SMOKE / NEBULA — capa volumétrica de «humo» de marca detrás de las partículas.
 * Blobs suaves en la paleta (violeta/cian/ámbar) que respiran y derivan. CSS puro
 * (sin coste GPU del canvas), con `mix-blend: screen` para que sume luz, no tape.
 * Aporta el «light morph» atmosférico premium. Respeta `prefers-reduced-motion`.
 */
export function SmokeNebula({ intensity = 1 }: { intensity?: number }) {
  const blobs = [
    { c: G1.violet, x: '32%', y: '34%', s: '46vw', d: '0s', dur: '13s' },
    { c: G1.cyan, x: '64%', y: '40%', s: '40vw', d: '-4s', dur: '16s' },
    { c: G1.amber, x: '52%', y: '58%', s: '30vw', d: '-8s', dur: '19s' },
  ]
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {blobs.map((b, i) => (
        <span
          key={i}
          className="g1-nebula-blob absolute rounded-full"
          style={{
            left: b.x,
            top: b.y,
            width: b.s,
            height: b.s,
            transform: 'translate(-50%,-50%)',
            background: `radial-gradient(circle, ${b.c}${Math.round(38 * intensity).toString(16).padStart(2, '0')} 0%, transparent 66%)`,
            mixBlendMode: 'screen',
            filter: 'blur(40px)',
            animationDelay: b.d,
            animationDuration: b.dur,
          }}
        />
      ))}
      <style>{`
        .g1-nebula-blob{animation-name:g1NebulaDrift;animation-timing-function:ease-in-out;animation-iteration-count:infinite}
        @keyframes g1NebulaDrift{
          0%,100%{opacity:.55;transform:translate(-50%,-50%) scale(1)}
          50%{opacity:.9;transform:translate(-46%,-54%) scale(1.12)}
        }
        @media (prefers-reduced-motion:reduce){.g1-nebula-blob{animation:none}}
      `}</style>
    </div>
  )
}
