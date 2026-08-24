'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import type { BloomEffect, ChromaticAberrationEffect } from 'postprocessing'
import { Vector2, NoToneMapping as THREE_NoToneMapping } from 'three'
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
    // ...y se ATENÚA en el aterrizaje: el glow del 3D no existe en el lockup 2D,
    // así que sostenerlo hasta el relevo produce un salto de brillo (medido:
    // +15 de luminancia). Bajarlo iguala los dos escenarios.
    const bloomTarget = (0.42 + smoothstep(0.5, 0.7, p) * (1 - smoothstep(0.82, 0.92, p)) * 0.42)
      * (1 - smoothstep(0.84, 0.94, p) * 0.62)
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
  const jumpRef = useRef({ active: false, t0: 0, startY: 0, targetY: 0 })
  const cueRef = useRef<HTMLDivElement>(null)
  const contRef = useRef<HTMLDivElement>(null)
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
        // el fundido del stage lo maneja `syncStage` (por distancia al aterrizaje)
        // la señal de scroll vive solo al principio: se apaga apenas arranca
        if (cueRef.current) cueRef.current.style.opacity = String(1 - smoothstep(0.004, 0.03, p))
        // aviso de continuidad: entra con la CTA final del relato
        if (contRef.current) {
          const o = smoothstep(0.87, 0.94, p)
          contRef.current.style.opacity = String(o)
          contRef.current.style.display = o < 0.02 ? 'none' : 'flex'
        }
        for (let i = 0; i < WIN.length; i++) {
          const [a, b] = WIN[i]!
          // 1 en el plateau, ramp de 0.04 en cada borde, 0 fuera de [a,b] → sin solape
          // el último acto NO se desvanece al final: sostiene la CTA durante el
          // acople y se va junto con el stage (si no, quedaba un hueco sin texto).
          const o = i === WIN.length - 1
            ? Math.min(1, Math.max(0, (p - a) / 0.04))
            : Math.min(1, Math.max(0, Math.min((p - a) / 0.04, (b - p) / 0.04)))
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
    /*
     * EL ACOPLE DE LOS DOS ESCENARIOS — auditoría forense sobre las capturas del
     * owner. Al terminar el relato, el contenido arranca en el BORDE INFERIOR de
     * la pantalla: quedan ~830 px en los que la galaxia ya se había apagado (el
     * fundido colgaba del PROGRESO, que se agota ahí) y el lockup 2D todavía no
     * había llegado. De ahí los dos síntomas de las capturas: primero DOS logos
     * a distinta altura, después una pantalla VACÍA.
     *
     * Arreglo: el fundido cuelga de la DISTANCIA que falta para el aterrizaje.
     * La galaxia se sostiene entera —tapando el contenido— mientras el lockup 2D
     * sube por debajo, y sólo se disuelve en los últimos px, justo cuando ambos
     * ocupan el MISMO lugar (verificado: dx 0, dy 0). Sirve igual con scroll
     * manual que con el brinco, y es simétrico al volver hacia arriba.
     */
    const landingY = () => {
      const next = wrapRef.current?.nextElementSibling as HTMLElement | null
      return next ? next.getBoundingClientRect().top + window.scrollY - 72 : Infinity
    }
    const syncStage = () => {
      const st = stageRef.current
      if (!st) return
      const d = landingY() - window.scrollY // px que faltan para el relevo
      const fade = smoothstep(-30, 220, d) // galaxia: 1 lejos · 0 al llegar
      /*
       * La escena que LLEGA tampoco debe pisar a la que se va: el contenido entra
       * en cruce con la galaxia en los últimos px (si no, se veían el CTA del
       * relato y el titular de la página a la vez).
       */
      const next = wrapRef.current?.nextElementSibling as HTMLElement | null
      if (next) next.style.opacity = String(1 - smoothstep(0, 240, d))
      st.style.opacity = String(fade)
      st.style.pointerEvents = fade < 0.05 ? 'none' : 'auto'
      const shouldLive = fade > 0.02
      if (shouldLive !== liveRef.current) { liveRef.current = shouldLive; setLive(shouldLive) }
      /*
       * EL RELEVO (idea del owner) — el lockup 2D NO sube a la vista: se mantiene
       * OCULTO mientras la página se arrastra por debajo y sólo aparece en el
       * punto exacto en el que debe continuar, que es donde el 3D está esperando.
       * Así nunca hay dos logos: uno entrega y el otro sigue, y son el mismo.
       */
      const dock2d = document.querySelector('[data-g1-dock]') as HTMLElement | null
      if (dock2d) dock2d.style.opacity = String(1 - smoothstep(0, 70, d))
    }
    lenis.on('scroll', syncStage)
    syncStage()

    const JUMP_MS = 1500
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY <= 0 || jumpedRef.current) return
      if (progressRef.current < 0.93) return
      const next = wrapRef.current?.nextElementSibling as HTMLElement | null
      if (!next) return
      jumpedRef.current = true
      e.preventDefault()
      // el lockup 3D queda encendido y viaja; se funde recién sobre el final,
      // cuando el 2D ya ocupa su lugar exacto → sin vacío en el medio.
      const startY = window.scrollY
      const targetY = Math.round(next.getBoundingClientRect().top + window.scrollY) - 72
      jumpRef.current = { active: true, t0: performance.now(), startY, targetY }
      if (!liveRef.current) { liveRef.current = true; setLive(true) }
      // `easing` explícito: si la instancia usa `lerp`, Lenis IGNORA `duration`
      // (medido: el viaje terminaba en ~0.6s) y el fundido quedaba desfasado.
      lenis.scrollTo(targetY, {
        duration: JUMP_MS / 1000,
        easing: (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
      })
      window.setTimeout(() => { jumpedRef.current = false }, JUMP_MS + 400)
    }
    // el fundido durante el brinco ya lo cubre `syncStage` (mismo criterio de
    // distancia), así que el brinco solo acelera el viaje.
    const jumpTick = () => { if (jumpRef.current.active && performance.now() - jumpRef.current.t0 > JUMP_MS + 600) jumpRef.current.active = false }
    gsap.ticker.add(jumpTick)
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
      if (p < 0.02 || p > 0.93) return // arranque y zona de aterrizaje: sin magnetismo
      let best = CENTERS[0]!
      for (const c of CENTERS) if (Math.abs(c - p) < Math.abs(best - p)) best = c
      const d = Math.abs(best - p)
      // 0.09 cubre la mitad del hueco más ancho entre actos (0.15) → ninguna
      // zona muerta queda sin asentamiento.
      if (d < 0.012 || d > 0.09) return // ya está encuadrado, o demasiado lejos: no forzar
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
      // al desmontar, lockup y contenido vuelven a ser visibles (otras rutas los usan)
      const d2 = document.querySelector('[data-g1-dock]') as HTMLElement | null
      if (d2) d2.style.opacity = ''
      const nx = wrapRef.current?.nextElementSibling as HTMLElement | null
      if (nx) nx.style.opacity = ''
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouch)
      window.clearTimeout(idle)
      trigger.kill()
      gsap.ticker.remove(jumpTick)
      gsap.ticker.remove(ticker)
      lenis.destroy()
    }
  }, [])

  const actClass =
    'pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-[clamp(18px,4vw,46px)] text-center [text-shadow:0_2px_18px_rgba(2,4,10,0.95),0_0_46px_rgba(2,4,10,0.8)]'
  /*
   * PLACA DE LECTURA — la copia perdía contraste sobre las partículas. Un velo a
   * pantalla completa lo arreglaba pero APAGABA EL LOGO (reportado por el owner),
   * así que el velo va SOLO detrás del bloque de texto: se dimensiona con el
   * contenido y se disuelve en los bordes. El logo nunca queda debajo.
   */
  const plate =
    'relative rounded-[28px] px-[clamp(20px,5vw,64px)] py-[clamp(14px,3vw,28px)] [background:radial-gradient(72%_78%_at_50%_50%,rgba(2,4,10,0.86)_0%,rgba(2,4,10,0.6)_52%,rgba(2,4,10,0)_80%)]'

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
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', toneMapping: THREE_NoToneMapping }}
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
        <div ref={(el) => { actRefs.current[0] = el }} className={actClass} style={{ opacity: 1, zIndex: 2 }}>
          <div className={plate}>
            <Eyebrow>Génesis × Aitech × TAG</Eyebrow>
            <h2 className="mt-6 font-display text-[clamp(30px,5.4vw,60px)] font-extrabold leading-[1.05] tracking-tight text-genesis-text">
            Todo empieza con<br /><span style={{ background: GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>una comunidad.</span>
            </h2>
          </div>
        </div>

        {/* ACTO 1 · AITECH */}
        <div ref={(el) => { actRefs.current[1] = el }} className={actClass} style={{ opacity: 0, zIndex: 2 }}>
          <div className={plate}>
            <Eyebrow>Aitech △ · la tecnología</Eyebrow>
            <h2 className="mt-5 font-display text-[clamp(26px,4.6vw,52px)] font-extrabold leading-[1.06] tracking-tight text-genesis-text">Herramientas que ya funcionan.</h2>
            <div className="mt-6 flex flex-wrap justify-center gap-2"><Pill>Educación</Pill><Pill>Tecnología</Pill><Pill>Comunidad</Pill></div>
          </div>
        </div>

        {/* ACTO 2 · TAG */}
        <div ref={(el) => { actRefs.current[2] = el }} className={actClass} style={{ opacity: 0, zIndex: 2 }}>
          <div className={plate}>
            <Eyebrow>TAG △ · el mercado</Eyebrow>
            <h2 className="mt-5 font-display text-[clamp(26px,4.6vw,52px)] font-extrabold leading-[1.06] tracking-tight text-genesis-text">Acceso real a los mercados.</h2>
            <div className="mt-6 flex flex-wrap justify-center gap-2"><Pill>TagMarkets · broker</Pill><Pill>Bit1 · exchange</Pill><Pill>BIX · tarjeta</Pill></div>
          </div>
        </div>

        {/* ACTO 3 · GÉNESIS */}
        <div ref={(el) => { actRefs.current[3] = el }} className={actClass} style={{ opacity: 0, zIndex: 2 }}>
          <div className={plate}>
            <Eyebrow>Génesis △ · la comunidad</Eyebrow>
            <h2 className="mt-5 font-display text-[clamp(26px,4.6vw,52px)] font-extrabold leading-[1.06] tracking-tight text-genesis-text">La comunidad que las une.</h2>
            <div className="mt-6 flex flex-wrap justify-center gap-2"><Pill>G-Pulse</Pill><Pill>AIG · token</Pill><Pill>G11 · Marketplace</Pill></div>
          </div>
        </div>

        {/* ACTO 4 · FUSIÓN G1 — el logo lo lleva la capa de reveal; aquí solo el
            texto de apoyo, abajo, para no tapar el logo. */}
        <div
          ref={(el) => { actRefs.current[4] = el }}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end px-[clamp(18px,4vw,46px)] pb-[15vh] text-center drop-shadow-[0_2px_22px_rgba(2,4,10,0.92)]"
          style={{ opacity: 0, zIndex: 3 }}
        >
          <div className={plate}>
            <Eyebrow>El nacimiento de G1</Eyebrow>
            <h2 className="mt-4 font-display text-[clamp(22px,3.6vw,40px)] font-bold tracking-tight text-genesis-text">Tu comunidad, con herramientas reales.</h2>
          </div>
        </div>

        {/* ACTO 5 · CTA */}
        <div ref={(el) => { actRefs.current[5] = el }} className={actClass} style={{ opacity: 0, zIndex: 4 }}>
          <div className={plate}>
            <Eyebrow>El nacimiento de G1</Eyebrow>
            <h2 className="mt-5 font-display text-[clamp(28px,5vw,56px)] font-extrabold tracking-tight text-genesis-text">Empieza con G1.</h2>
            <div className="pointer-events-auto mt-7 flex flex-wrap justify-center gap-3">
            <PillCTA href="/g1/ecosistema" variant="primary">Conocer el ecosistema →</PillCTA>
            <PillCTA href="/g1/como-funciona" variant="ghost">Cómo funciona ↗</PillCTA>
            </div>
            <div className="mt-6"><DisclaimerBar className="text-center" /></div>
          </div>
        </div>

        {/* SEÑAL DE CONTINUIDAD — al final del relato la escena se sostiene
            esperando el relevo, y sin un aviso mucha gente cree que la página
            termina ahí. Aparece con la CTA y se va con el propio stage. */}
        <div
          ref={contRef}
          className="pointer-events-none absolute inset-x-0 bottom-[clamp(128px,19vh,200px)] z-[6] flex flex-col items-center gap-2"
          style={{ opacity: 0, display: 'none' }}
        >
          <span className="font-mono text-[10.5px] uppercase tracking-[0.26em]" style={{ color: G1.cyan }}>
            La web continúa · sigue bajando
          </span>
          <svg width="22" height="13" viewBox="0 0 22 13" fill="none" aria-hidden className="motion-safe:animate-[g1down_1.6s_ease-in-out_infinite]">
            <path d="M2 2l9 8 9-8" stroke={G1.cyan} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <style>{`@keyframes g1down{0%,100%{transform:translateY(-3px);opacity:.55}50%{transform:translateY(3px);opacity:1}}`}</style>
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
