'use client'

import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { G1 } from '@/lib/design/g1'
import { Eyebrow } from '../Eyebrow'
import { G1ParticleSky } from './G1ParticleSky'

function skyCount() {
  if (typeof window === 'undefined') return 7000
  const w = window.innerWidth
  return w < 640 ? 3800 : w < 1100 ? 6500 : 9000
}

/**
 * ACTO 0 — la apertura del relato de G1. El cielo de partículas + la primera
 * línea. Es la primera pantalla del scrollytelling; en la Fase 3 se conecta a
 * Lenis/ScrollTrigger para dar paso al Acto 1 (Aitech).
 */
export function G1Act0() {
  const [mounted, setMounted] = useState(false)
  const reduce =
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion:reduce)').matches
  useEffect(() => setMounted(true), [])
  const show = mounted && !reduce

  return (
    <section className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-genesis-void">
      <div className="absolute inset-0 z-0">
        {show ? (
          <Canvas
            camera={{ position: [0, 0, 5], fov: 58 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          >
            <G1ParticleSky count={skyCount()} />
            <EffectComposer>
              <Bloom
                luminanceThreshold={0.42}
                luminanceSmoothing={0.5}
                intensity={0.7}
                blendFunction={BlendFunction.ADD}
                mipmapBlur
              />
            </EffectComposer>
          </Canvas>
        ) : (
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                `radial-gradient(60% 50% at 50% 42%, ${G1.violet}22, transparent 62%),` +
                `radial-gradient(50% 42% at 62% 46%, ${G1.cyan}18, transparent 64%)`,
            }}
          />
        )}
      </div>

      {/* velo de legibilidad */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: 'radial-gradient(120% 90% at 50% 44%, transparent 52%, rgba(2,4,10,.55) 84%, rgba(2,4,10,.82) 100%)' }}
      />

      {/* copy de apertura */}
      <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center px-[clamp(18px,4vw,46px)] text-center">
        <Eyebrow>Génesis × Aitech × TAG</Eyebrow>
        <h1 className="mt-6 font-display text-[clamp(30px,5.6vw,64px)] font-extrabold leading-[1.05] tracking-tight text-genesis-text">
          Todo empieza con
          <br />
          <span
            style={{
              background: `linear-gradient(100deg, ${G1.violet}, ${G1.cyan} 60%, ${G1.amber})`,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            una comunidad.
          </span>
        </h1>
      </div>

      {/* señal de scroll */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[5svh] z-[3] flex flex-col items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-genesis-mist">Desliza</span>
        <span className="h-8 w-px animate-pulse bg-gradient-to-b from-genesis-mist to-transparent" />
      </div>

      <div className="absolute bottom-5 right-[clamp(18px,4vw,46px)] z-[3] font-mono text-[10px] uppercase tracking-[0.14em] text-genesis-mist">
        Acto 0 · el cielo
      </div>
    </section>
  )
}
