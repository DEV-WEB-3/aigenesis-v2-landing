'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { G1 } from '@/lib/design/g1'
import { Eyebrow } from '../Eyebrow'
import { PillCTA } from '../PillCTA'
import { DisclaimerBar } from '../DisclaimerBar'
import { SmokeNebula } from './SmokeNebula'

function Poster() {
  return (
    <div
      aria-hidden
      className="absolute inset-0"
      style={{
        background:
          `radial-gradient(56% 46% at 50% 40%, ${G1.violet}22, transparent 60%),` +
          `radial-gradient(44% 38% at 60% 42%, ${G1.cyan}18, transparent 62%),` +
          `radial-gradient(40% 34% at 42% 40%, ${G1.amber}10, transparent 60%)`,
      }}
    />
  )
}

/**
 * G1 HERO SHELL — marco común de las 3 variantes F2b: Canvas + bloom, capa de
 * humo/nebula opcional, slot para el cristal HTML, velo de legibilidad, copy y
 * póster de fallback. Cada variante inyecta el contenido del Canvas y su cristal.
 */
export function G1HeroShell({
  children,
  glass,
  smoke = false,
  smokeIntensity = 1,
  bloomIntensity = 0.5,
  label,
}: {
  children: ReactNode
  glass?: ReactNode
  smoke?: boolean
  smokeIntensity?: number
  bloomIntensity?: number
  label: string
}) {
  const [mounted, setMounted] = useState(false)
  const reduce =
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion:reduce)').matches
  useEffect(() => setMounted(true), [])
  const show = mounted && !reduce

  return (
    <section className="relative flex h-[100svh] min-h-[600px] w-full flex-col overflow-hidden bg-genesis-void">
      {show && smoke ? (
        <div className="pointer-events-none absolute inset-0 z-0">
          <SmokeNebula intensity={smokeIntensity} />
        </div>
      ) : null}

      {/* BANDA VISUAL — Canvas + cristal centrados en la misma región → alineados en todo aspecto */}
      <div className="relative z-[1] min-h-0 flex-1">
        {show ? (
          <Canvas
            className="!absolute inset-0"
            camera={{ position: [0, 0, 5], fov: 58 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          >
            {children}
            <EffectComposer>
              <Bloom
                luminanceThreshold={0.5}
                luminanceSmoothing={0.42}
                intensity={bloomIntensity}
                blendFunction={BlendFunction.ADD}
                mipmapBlur
              />
            </EffectComposer>
          </Canvas>
        ) : (
          <Poster />
        )}

        {show && glass ? <div className="pointer-events-none absolute inset-0 z-[3]">{glass}</div> : null}

        {/* velo suave que funde la banda visual hacia el copy */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{ background: 'radial-gradient(120% 82% at 50% 38%, transparent 46%, rgba(2,4,10,.42) 82%, rgba(2,4,10,.72) 100%)' }}
        />
      </div>

      {/* BANDA COPY — zona propia, sin solaparse con el emblema, con plato oscuro para legibilidad */}
      <div className="relative z-[4] shrink-0 px-[clamp(18px,4vw,46px)] pb-[7svh] pt-2">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-24 bottom-0 z-[-1]"
          style={{ background: 'linear-gradient(to top, #02040A 42%, rgba(2,4,10,.86) 70%, transparent 100%)' }}
        />
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>Génesis × Aitech × TAG</Eyebrow>
          <h1 className="mt-5 font-display text-[clamp(34px,6.4vw,72px)] font-extrabold leading-[1.02] tracking-tight text-genesis-text">
            Tu comunidad,
            <br />
            <span
              style={{
                background: `linear-gradient(100deg, ${G1.violet}, ${G1.cyan} 60%, ${G1.amber})`,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              con herramientas reales.
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-[56ch] text-[clamp(14px,2vw,17px)] leading-relaxed text-genesis-mist">
            Trading, exchange y tarjeta cripto de la alianza, con la usabilidad del AiG&nbsp;Token.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <PillCTA href="/ecosistema" variant="primary">Conocer el ecosistema →</PillCTA>
            <PillCTA href="/como-funciona" variant="ghost">Cómo funciona ↗</PillCTA>
          </div>
          <div className="mt-5">
            <DisclaimerBar className="text-center" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-5 right-[clamp(18px,4vw,46px)] z-[4] font-mono text-[10px] uppercase tracking-[0.14em] text-genesis-mist">
        {label}
      </div>
    </section>
  )
}
