'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import type { BloomEffect, ChromaticAberrationEffect } from 'postprocessing'
import { Vector2 } from 'three'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { G1 } from '@/lib/design/g1'
import { G1GpgpuField } from '../hero/G1GpgpuField'
import { G1ParticleSky } from './G1ParticleSky'
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
    // A partir de 0.93 la cámara SE DETIENE: el lockup ya está aterrizado y su
    // tamaño en pantalla no debe derivar antes del relevo al 2D.
    else z = 4.7 + ((Math.min(p, 0.93) - 0.82) / 0.18) * 0.9
    cam.position.z += (z - cam.position.z) * 0.06
    cam.lookAt(0, 0, 0)
  })
  return null
}

const smoothstep = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)))
  return t * t * (3 - 2 * t)
}
const bump = (p: number, c: number, half: number) => Math.max(0, 1 - Math.abs(p - c) / half)

/** Postprocessing coreografiado por scroll: pico de luz en la fusión + aberración en las transiciones. */
function ScrollPostDriver({
  progressRef, bloomRef, caRef,
}: {
  progressRef: { current: number }
  bloomRef: { current: BloomEffect | null }
  caRef: { current: ChromaticAberrationEffect | null }
}) {
  useFrame((_s, dt) => {
    const p = progressRef.current
    // BLOOM: base tenue; sube SUAVE hacia la fusión (Acto 4) — glow elegante, sin flash
    const bloomTarget = 0.42 + smoothstep(0.5, 0.7, p) * (1 - smoothstep(0.82, 0.92, p)) * 0.42
    // CHROMATIC ABERRATION: chispa SUTIL en la fusión (0.62) y en la disolución (0.85)
    const ca = 0.0004 + (bump(p, 0.62, 0.07) + bump(p, 0.85, 0.05)) * 0.0011
    const k = 1 - Math.pow(0.05, dt)
    if (bloomRef.current) bloomRef.current.intensity += (bloomTarget - bloomRef.current.intensity) * k
    if (caRef.current) {
      const o = caRef.current.offset
      o.set(o.x + (ca - o.x) * k, o.y + (ca - o.y) * k)
    }
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

/** Ventanas [inicio,fin] de cada acto sobre el progreso 0..1, SIN solape (huecos = handoff). */
const WIN: [number, number][] = [
  [0.0, 0.12], [0.15, 0.27], [0.31, 0.43], [0.47, 0.59], [0.63, 0.79], [0.83, 1.0],
]

export function G1Narrative() {
  const progressRef = useRef(0)
  // El canvas de la narrativa (65k partículas + postFX) es lo más caro de la
  // página. Cuando el relato termina y el stage se funde, se APAGA el frameloop:
  // deja de consumir GPU mientras se navega el resto del sitio.
  const [live, setLive] = useState(true)
  const liveRef = useRef(true)
  const jumpedRef = useRef(false)
  const cueRef = useRef<HTMLDivElement>(null)
  const bloomRef = useRef<any>(null) // el ref del efecto se tipa como la clase; any evita el choque
  const caRef = useRef<any>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
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
        // al final del relato, el stage se funde y le entrega el fondo al ambiente persistente
        if (stageRef.current) {
          const fade = 1 - smoothstep(0.9, 1.0, p)
          stageRef.current.style.opacity = String(fade)
          stageRef.current.style.pointerEvents = fade < 0.05 ? 'none' : 'auto'
          // apaga/enciende el frameloop del canvas según se vea o no (perf)
          const shouldLive = fade > 0.02
          if (shouldLive !== liveRef.current) { liveRef.current = shouldLive; setLive(shouldLive) }
        }
        // la señal de scroll vive solo al principio: se apaga apenas arranca
        if (cueRef.current) cueRef.current.style.opacity = String(1 - smoothstep(0.004, 0.03, p))
        for (let i = 0; i < WIN.length; i++) {
          const [a, b] = WIN[i]!
          // 1 en el plateau, ramp de 0.04 en cada borde, 0 fuera de [a,b] → sin solape
          const o = Math.min(1, Math.max(0, Math.min((p - a) / 0.04, (b - p) / 0.04)))
          const el = actRefs.current[i]
          if (el) {
            el.style.opacity = String(o)
            el.style.display = o < 0.02 ? 'none' : 'flex'
          }
        }
      },
    })

    /*
     * EL ATERRIZAJE — cuando el show termina, UN scroll más NO debe obligar a
     * recorrer el silencio visual que queda: salta directo a donde el logo 3D
     * quedó parqueado en 2D (la cabeza del contenido). Un solo disparo, y solo
     * hacia abajo: subiendo, el relato se recorre normal (smooth en ambos).
     */
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY <= 0 || jumpedRef.current) return
      if (progressRef.current < 0.93) return
      const next = wrapRef.current?.nextElementSibling as HTMLElement | null
      if (!next) return
      jumpedRef.current = true
      e.preventDefault()
      lenis.scrollTo(next, { offset: -72, duration: 1.5 })
      window.setTimeout(() => { jumpedRef.current = false }, 1800)
    }
    window.addEventListener('wheel', onWheel, { passive: false })

    /*
     * ASENTAMIENTO MAGNÉTICO — el scrub queda LIBRE (el morph de partículas se
     * ve completo, nunca se saltea). Solo cuando el usuario DEJA de desplazarse
     * en una zona muerta entre actos, la escena se asienta sola en el punto
     * dulce del acto más cercano, como una cámara que encuentra su encuadre.
     * Nunca interrumpe mientras se desplaza. Off en táctil y reduced-motion.
     */
    const CENTERS = WIN.map(([a, b]) => (a + b) / 2)
    let idle: number | undefined
    let touch = false
    const onTouch = () => { touch = true }
    window.addEventListener('touchstart', onTouch, { passive: true })
    const settle = () => {
      if (reduce || touch || jumpedRef.current) return
      const p = progressRef.current
      if (p < 0.02 || p > 0.9) return // arranque y zona de aterrizaje: sin magnetismo
      let best = CENTERS[0]!
      for (const c of CENTERS) if (Math.abs(c - p) < Math.abs(best - p)) best = c
      const d = Math.abs(best - p)
      if (d < 0.012 || d > 0.075) return // ya está encuadrado, o demasiado lejos: no forzar
      const wrap = wrapRef.current
      if (!wrap) return
      const top = wrap.getBoundingClientRect().top + window.scrollY
      lenis.scrollTo(top + best * (wrap.offsetHeight - window.innerHeight), { duration: 0.75 })
    }
    const onScrollIdle = () => {
      window.clearTimeout(idle)
      idle = window.setTimeout(settle, 160)
    }
    lenis.on('scroll', onScrollIdle)

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouch)
      window.clearTimeout(idle)
      trigger.kill()
      gsap.ticker.remove(ticker)
      lenis.destroy()
    }
  }, [])

  const actClass =
    'pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-[clamp(18px,4vw,46px)] text-center [text-shadow:0_2px_18px_rgba(2,4,10,0.95),0_0_46px_rgba(2,4,10,0.8)]'
  /*
   * VELO DE LECTURA — sobre el campo de partículas y los cristales, la copia
   * perdía contraste (reportado por el owner). Un degradado radial oscuro,
   * centrado en el texto y disuelto en los bordes, devuelve la legibilidad sin
   * tapar el show ni introducir una caja visible.
   */
  const scrim = (at: string) => ({
    background: `radial-gradient(58% 46% at ${at}, rgba(2,4,10,0.82) 0%, rgba(2,4,10,0.55) 48%, rgba(2,4,10,0) 78%)`,
  })

  return (
    <div ref={wrapRef} className="relative w-full" style={{ height: '620vh' }}>
      {/* stage FIJO al viewport (no sticky: el overflow-x del body rompe sticky). Se funde al final. */}
      <div ref={stageRef} className="fixed inset-0 z-0 h-[100svh] w-full overflow-hidden bg-genesis-void">
        {/* WEBGL persistente (continuous hero morph) */}
        <div className="absolute inset-0 z-0">
          <Canvas
            camera={{ position: [0, 0, 5.4], fov: 58 }}
            dpr={[1, 1.5]}
            frameloop={live ? 'always' : 'never'}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          >
            <G1ParticleSky count={6000} progressRef={progressRef} />
            <G1GpgpuField baseOpacity={0.82} progressRef={progressRef} />
            <ScrollCamera progressRef={progressRef} />
            <ScrollPostDriver progressRef={progressRef} bloomRef={bloomRef} caRef={caRef} />
            <EffectComposer>
              <Bloom ref={bloomRef} luminanceThreshold={0.5} luminanceSmoothing={0.45} intensity={0.5} blendFunction={BlendFunction.ADD} mipmapBlur />
              <ChromaticAberration ref={caRef} offset={new Vector2(0.0006, 0.0006)} radialModulation={false} modulationOffset={0} />
              <Noise premultiply blendFunction={BlendFunction.OVERLAY} opacity={0.035} />
              <Vignette eskil={false} offset={0.28} darkness={0.72} />
            </EffectComposer>
          </Canvas>
        </div>

        {/* velo */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{ background: 'radial-gradient(120% 92% at 50% 46%, transparent 50%, rgba(2,4,10,.5) 82%, rgba(2,4,10,.8) 100%)' }}
        />

        {/* El logo real (monograma cristal + órbitas) ahora se renderiza EN 3D
            dentro del mismo grupo de partículas (G1GpgpuField) → converge con el
            polvo sin divergencia. Ver Movida F2. */}

        {/* ACTO 0 */}
        <div ref={(el) => { actRefs.current[0] = el }} className={actClass} style={{ opacity: 1, zIndex: 2, ...scrim('50% 50%') }}>
          <Eyebrow>Génesis × Aitech × TAG</Eyebrow>
          <h2 className="mt-6 font-display text-[clamp(30px,5.4vw,60px)] font-extrabold leading-[1.05] tracking-tight text-genesis-text">
            Todo empieza con<br /><span style={{ background: GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>una comunidad.</span>
          </h2>
        </div>

        {/* ACTO 1 · AITECH */}
        <div ref={(el) => { actRefs.current[1] = el }} className={actClass} style={{ opacity: 0, zIndex: 2, ...scrim('50% 50%') }}>
          <Eyebrow>Aitech △ · la tecnología</Eyebrow>
          <h2 className="mt-5 font-display text-[clamp(26px,4.6vw,52px)] font-extrabold leading-[1.06] tracking-tight text-genesis-text">Herramientas que ya funcionan.</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-2"><Pill>Educación</Pill><Pill>Tecnología</Pill><Pill>Comunidad</Pill></div>
        </div>

        {/* ACTO 2 · TAG */}
        <div ref={(el) => { actRefs.current[2] = el }} className={actClass} style={{ opacity: 0, zIndex: 2, ...scrim('50% 50%') }}>
          <Eyebrow>TAG △ · el mercado</Eyebrow>
          <h2 className="mt-5 font-display text-[clamp(26px,4.6vw,52px)] font-extrabold leading-[1.06] tracking-tight text-genesis-text">Acceso real a los mercados.</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-2"><Pill>TagMarkets · broker</Pill><Pill>Bit1 · exchange</Pill><Pill>BIX · tarjeta</Pill></div>
        </div>

        {/* ACTO 3 · GÉNESIS */}
        <div ref={(el) => { actRefs.current[3] = el }} className={actClass} style={{ opacity: 0, zIndex: 2, ...scrim('50% 50%') }}>
          <Eyebrow>Génesis △ · la comunidad</Eyebrow>
          <h2 className="mt-5 font-display text-[clamp(26px,4.6vw,52px)] font-extrabold leading-[1.06] tracking-tight text-genesis-text">La comunidad que las une.</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-2"><Pill>G-Pulse</Pill><Pill>AIG · token</Pill><Pill>G11 · Marketplace</Pill></div>
        </div>

        {/* ACTO 4 · FUSIÓN G1 — el logo lo lleva la capa de reveal; aquí solo el
            texto de apoyo, abajo, para no tapar el logo. */}
        <div
          ref={(el) => { actRefs.current[4] = el }}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end px-[clamp(18px,4vw,46px)] pb-[15vh] text-center drop-shadow-[0_2px_22px_rgba(2,4,10,0.92)]"
          style={{ opacity: 0, zIndex: 3, ...scrim('50% 82%') }}
        >
          <Eyebrow>El nacimiento de G1</Eyebrow>
          <h2 className="mt-4 font-display text-[clamp(22px,3.6vw,40px)] font-bold tracking-tight text-genesis-text">Tu comunidad, con herramientas reales.</h2>
        </div>

        {/* ACTO 5 · CTA */}
        <div ref={(el) => { actRefs.current[5] = el }} className={actClass} style={{ opacity: 0, zIndex: 4, ...scrim('50% 50%') }}>
          <Eyebrow>El nacimiento de G1</Eyebrow>
          <h2 className="mt-5 font-display text-[clamp(28px,5vw,56px)] font-extrabold tracking-tight text-genesis-text">Empieza con G1.</h2>
          <div className="pointer-events-auto mt-7 flex flex-wrap justify-center gap-3">
            <PillCTA href="/g1/ecosistema" variant="primary">Conocer el ecosistema →</PillCTA>
            <PillCTA href="/g1/como-funciona" variant="ghost">Cómo funciona ↗</PillCTA>
          </div>
          <div className="mt-6"><DisclaimerBar className="text-center" /></div>
        </div>

        {/* SEÑAL DE SCROLL — que se entienda desde el segundo cero que la
            experiencia se vive desplazándose. Se desvanece al empezar. */}
        <div
          ref={cueRef}
          className="pointer-events-none absolute inset-x-0 bottom-[clamp(18px,4vh,42px)] z-[6] flex flex-col items-center gap-2.5 transition-opacity duration-500"
        >
          <span className="font-mono text-[10.5px] uppercase tracking-[0.28em] text-genesis-mist">
            Desplázate para vivir la experiencia
          </span>
          <span
            className="relative grid h-9 w-[22px] place-items-start justify-center rounded-full pt-1.5"
            style={{ border: `1px solid ${G1.cyan}55` }}
          >
            <span className="h-1.5 w-1.5 rounded-full motion-safe:animate-[g1cue_1.7s_ease-in-out_infinite]" style={{ background: G1.cyan }} />
          </span>
          <style>{`@keyframes g1cue{0%{transform:translateY(0);opacity:0}30%{opacity:1}100%{transform:translateY(13px);opacity:0}}`}</style>
        </div>
      </div>
    </div>
  )
}
