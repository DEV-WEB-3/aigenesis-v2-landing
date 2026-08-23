'use client'

import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { G1 } from '@/lib/design/g1'
import { G1ParticleSky } from '../scenes/G1ParticleSky'

/**
 * FONDO WEBGL PERSISTENTE de la web G1. Vive en el layout (site) → se monta UNA
 * vez y NO se re-monta al navegar entre páginas (los layouts de App Router
 * persisten). Así el fondo de partículas es continuo en toda la web, sin
 * parpadeo al saltar de ruta. Es el ambiente al que la narrativa le entrega el
 * relevo cuando termina.
 */
function skyCount() {
  if (typeof window === 'undefined') return 4000
  const w = window.innerWidth
  return w < 640 ? 2600 : w < 1100 ? 4000 : 5200
}

export function G1SiteBackground() {
  const [mounted, setMounted] = useState(false)
  const reduce =
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion:reduce)').matches
  useEffect(() => setMounted(true), [])

  if (!mounted || reduce) {
    return (
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            `radial-gradient(60% 50% at 50% 30%, ${G1.violet}18, transparent 60%),` +
            `radial-gradient(50% 45% at 65% 60%, ${G1.cyan}12, transparent 62%)`,
        }}
      />
    )
  }

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 58 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <G1ParticleSky count={skyCount()} />
        <EffectComposer>
          <Bloom luminanceThreshold={0.45} luminanceSmoothing={0.5} intensity={0.55} blendFunction={BlendFunction.ADD} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
