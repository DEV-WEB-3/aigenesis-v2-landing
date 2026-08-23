'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { G1 } from '@/lib/design/g1'
import { G1GpgpuField } from '../hero/G1GpgpuField'
import { Eyebrow } from '../Eyebrow'
import { PillCTA } from '../PillCTA'
import { DisclaimerBar } from '../DisclaimerBar'

/** Cámara coreografiada por scroll: dolly suave a lo largo del relato. */
function ScrollCamera({ progressRef }: { progressRef: { current: number } }) {
  const cam = useThree((s) => s.camera)
  useFrame(() => {
    const p = progressRef.current
    let z = 5.4
    if (p < 0.12) z = 5.4 - (p / 0.12) * 0.6
    else if (p < 0.6) z = 4.8 - ((p - 0.12) / 0.48) * 0.5
    else if (p < 0.82) z = 4.3 + ((p - 0.6) / 0.22) * 0.4
    else z = 4.7 + ((p - 0.82) / 0.18) * 0.9
    cam.position.z += (z - cam.position.z) * 0.06
    cam.lookAt(0, 0, 0)
  })
  return null
}

const GRAD = `linear-gradient(100deg, ${G1.violet}, ${G1.cyan} 60%, ${G1.amber})`

function Pill({ children }: { children: ReactNode }) {
  return (
    <span
      className="rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-genesis-mist"
      style={{ border: `1px solid ${G1.cyan}33` }}
    >
      {children}
    </span>
  )
}

/** Ventanas de opacidad de cada acto sobre el progreso 0..1. */
const WIN: [number, number][] = [
  [0.0, 0.14], [0.14, 0.3], [0.3, 0.46], [0.46, 0.62], [0.62, 0.86], [0.84, 1.0],
]

export function G1Narrative() {
  const progressRef = useRef(0)
  const wrapRef = useRef<HTMLDivElement>(null)
  const actRefs = useRef<Array<HTMLDivElement | null>>([])

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion:reduce)').matches
    gsap.registerPlugin(ScrollTrigger)
    const lenis = new Lenis({ smoothWheel: !reduce, lerp: 0.1 })
    lenis.on('scroll', ScrollTrigger.update)
    const ticker = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)

    const trigger = ScrollTrigger.create({
      trigger: wrapRef.current!,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress
        progressRef.current = p
        for (let i = 0; i < WIN.length; i++) {
          const [a, b] = WIN[i]!
          const mid = (a + b) / 2
          const half = (b - a) / 2
          const d = Math.abs(p - mid)
          const o = Math.min(1, Math.max(0, 1 - Math.max(0, d - half * 0.4) / (half * 0.8)))
          const el = actRefs.current[i]
          if (el) {
            el.style.opacity = String(o)
            el.style.display = o < 0.02 ? 'none' : 'flex'
          }
        }
      },
    })

    return () => {
      trigger.kill()
      gsap.ticker.remove(ticker)
      lenis.destroy()
    }
  }, [])

  const actClass =
    'pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-[clamp(18px,4vw,46px)] text-center'

  return (
    <div ref={wrapRef} className="relative w-full" style={{ height: '620vh' }}>
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-genesis-void">
        {/* WEBGL persistente (continuous hero morph) */}
        <div className="absolute inset-0 z-0">
          <Canvas
            camera={{ position: [0, 0, 5.4], fov: 58 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          >
            <G1GpgpuField baseOpacity={0.82} progressRef={progressRef} />
            <ScrollCamera progressRef={progressRef} />
            <EffectComposer>
              <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.45} intensity={0.5} blendFunction={BlendFunction.ADD} mipmapBlur />
            </EffectComposer>
          </Canvas>
        </div>

        {/* velo */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{ background: 'radial-gradient(120% 92% at 50% 46%, transparent 50%, rgba(2,4,10,.5) 82%, rgba(2,4,10,.8) 100%)' }}
        />

        {/* ACTO 0 */}
        <div ref={(el) => { actRefs.current[0] = el }} className={actClass} style={{ opacity: 1, zIndex: 2 }}>
          <Eyebrow>Génesis × Aitech × TAG</Eyebrow>
          <h2 className="mt-6 font-display text-[clamp(30px,5.4vw,60px)] font-extrabold leading-[1.05] tracking-tight text-genesis-text">
            Todo empieza con<br /><span style={{ background: GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>una comunidad.</span>
          </h2>
        </div>

        {/* ACTO 1 · AITECH */}
        <div ref={(el) => { actRefs.current[1] = el }} className={actClass} style={{ opacity: 0, zIndex: 2 }}>
          <Eyebrow>Aitech △ · la tecnología</Eyebrow>
          <h2 className="mt-5 font-display text-[clamp(26px,4.6vw,52px)] font-extrabold leading-[1.06] tracking-tight text-genesis-text">Herramientas que ya funcionan.</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-2"><Pill>Educación</Pill><Pill>Tecnología</Pill><Pill>Comunidad</Pill></div>
        </div>

        {/* ACTO 2 · TAG */}
        <div ref={(el) => { actRefs.current[2] = el }} className={actClass} style={{ opacity: 0, zIndex: 2 }}>
          <Eyebrow>TAG △ · el mercado</Eyebrow>
          <h2 className="mt-5 font-display text-[clamp(26px,4.6vw,52px)] font-extrabold leading-[1.06] tracking-tight text-genesis-text">Acceso real a los mercados.</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-2"><Pill>TagMarkets · broker</Pill><Pill>Bit1 · exchange</Pill><Pill>BIX · tarjeta</Pill></div>
        </div>

        {/* ACTO 3 · GÉNESIS */}
        <div ref={(el) => { actRefs.current[3] = el }} className={actClass} style={{ opacity: 0, zIndex: 2 }}>
          <Eyebrow>Génesis △ · la comunidad</Eyebrow>
          <h2 className="mt-5 font-display text-[clamp(26px,4.6vw,52px)] font-extrabold leading-[1.06] tracking-tight text-genesis-text">La comunidad que las une.</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-2"><Pill>G-Pulse</Pill><Pill>AIG · token</Pill><Pill>G11 · Marketplace</Pill></div>
        </div>

        {/* ACTO 4 · FUSIÓN G1 */}
        <div ref={(el) => { actRefs.current[4] = el }} className={actClass} style={{ opacity: 0, zIndex: 3 }}>
          <span className="font-display text-[clamp(64px,14vw,150px)] font-extrabold leading-none" style={{ background: GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextStroke: `1px ${G1.cyan}55` }}>G1</span>
          <h2 className="mt-4 font-display text-[clamp(22px,3.6vw,40px)] font-bold tracking-tight text-genesis-text">Tu comunidad, con herramientas reales.</h2>
        </div>

        {/* ACTO 5 · CTA */}
        <div ref={(el) => { actRefs.current[5] = el }} className={actClass} style={{ opacity: 0, zIndex: 4 }}>
          <Eyebrow>El nacimiento de G1</Eyebrow>
          <h2 className="mt-5 font-display text-[clamp(28px,5vw,56px)] font-extrabold tracking-tight text-genesis-text">Empezá con G1.</h2>
          <div className="pointer-events-auto mt-7 flex flex-wrap justify-center gap-3">
            <PillCTA href="/ecosistema" variant="primary">Conocer el ecosistema →</PillCTA>
            <PillCTA href="/como-funciona" variant="ghost">Cómo funciona ↗</PillCTA>
          </div>
          <div className="mt-6"><DisclaimerBar className="text-center" /></div>
        </div>

        <div className="pointer-events-none absolute bottom-5 right-[clamp(18px,4vw,46px)] z-[5] font-mono text-[10px] uppercase tracking-[0.14em] text-genesis-mist">
          Narrativa G1 · scroll
        </div>
      </div>
    </div>
  )
}
