'use client'

/**
 * G1 HERO — el corazón WebGL de la landing G1 (F2).
 *
 * REUTILIZA, NO PORTA: las partículas forman el SÍMBOLO GÉNESIS con la primitiva
 * `buildGenesisLogoMaskPoints` (el mask pool ya generado desde
 * `public/brand/genesis-symbol-512.png`), el patrón de Canvas de `WorldCanvasInner`
 * y la receta de bloom de `PostEffects`. NO monta el `ParticleMorphSystem`
 * (que es el motor scroll de toda la landing AiGenesis), y NO usa el canvas 2D
 * del prototipo — eso era solo para verlo.
 *
 * Coreografía: campo → símbolo Génesis → wordmark «G1» → dispersión, en bucle.
 * Colores por vértice con la rampa G1 (violeta→cian→ámbar). Parallax por puntero.
 * FALLBACK: en `prefers-reduced-motion` o antes de montar, muestra un póster
 * estático — el efecto nunca deja la pantalla en blanco ni rompe en gama baja.
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import { buildGenesisLogoMaskPoints } from '@/lib/trust/GenesisLogoMaskSampler'
import { partir, pegarMarca, useCorpus } from '@/hooks/useCorpus'
import { G1 } from '@/lib/design/g1'
import { Eyebrow } from './Eyebrow'
import { PillCTA } from './PillCTA'
import { DisclaimerBar } from './DisclaimerBar'

const HERO_HALF = 1.6 // media anchura de la formación en unidades de mundo

/* ── rampa de color G1: violeta → cian → ámbar ────────────────────────── */
const C_VIOLET = new THREE.Color(G1.violet)
const C_CYAN = new THREE.Color(G1.cyan)
const C_AMBER = new THREE.Color(G1.amber)
function rampG1(u: number, out: THREE.Color) {
  if (u < 0.5) out.copy(C_VIOLET).lerp(C_CYAN, u * 2)
  else out.copy(C_CYAN).lerp(C_AMBER, (u - 0.5) * 2)
  return out
}

/* ── normaliza un set de posiciones a media-extensión HERO_HALF ───────── */
function normalizeToHalf(src: Float32Array, half: number): Float32Array {
  let maxAbs = 1e-6
  for (let i = 0; i < src.length; i++) { const a = Math.abs(src[i]!); if (a > maxAbs) maxAbs = a }
  const k = half / maxAbs
  const out = new Float32Array(src.length)
  for (let i = 0; i < src.length; i++) out[i] = src[i]! * k
  return out
}

/* ── muestrea "G1" de un canvas offscreen → N posiciones (x,y,0) ───────── */
function sampleTextTargets(text: string, count: number, half: number): Float32Array {
  const out = new Float32Array(count * 3)
  if (typeof document === 'undefined') return out
  const W = 420, H = 220
  const c = document.createElement('canvas'); c.width = W; c.height = H
  const g = c.getContext('2d')!
  g.fillStyle = 'white'; g.textAlign = 'center'; g.textBaseline = 'middle'
  g.font = '800 168px "Space Grotesk", system-ui, sans-serif'
  g.fillText(text, W / 2, H / 2 + 8)
  const data = g.getImageData(0, 0, W, H).data
  const px: number[] = []
  for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 2) if (data[(y * W + x) * 4 + 3]! > 128) px.push(x, y)
  const n = px.length / 2
  const sx = (half * 2) / W
  for (let i = 0; i < count; i++) {
    const j = (i % n) * 2
    out[i * 3] = (px[j]! - W / 2) * sx
    out[i * 3 + 1] = -(px[j + 1]! - H / 2) * sx
    out[i * 3 + 2] = (Math.random() - 0.5) * 0.06
  }
  return out
}

function fieldTargets(count: number, half: number): Float32Array {
  const out = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2
    const r = (0.14 + Math.pow(Math.random(), 0.55) * 1.0) * half
    out[i * 3] = Math.cos(a) * r * 1.15
    out[i * 3 + 1] = Math.sin(a) * r * 0.8
    out[i * 3 + 2] = (Math.random() - 0.5) * 0.9
  }
  return out
}

const PHASES = [
  { key: 'genesis', label: 'símbolo Génesis', dur: 5 },
  { key: 'g1', label: 'wordmark G1', dur: 5 },
  { key: 'field', label: 'campo · alianza', dur: 4.2 },
] as const

function G1Particles({ count, onPhase }: { count: number; onPhase: (l: string) => void }) {
  const pts = useRef<THREE.Points>(null)
  const grp = useRef<THREE.Group>(null)
  const state = useRef({ phase: 0, t: 0 })

  const { positions, colors, targets } = useMemo(() => {
    const genesis = normalizeToHalf(buildGenesisLogoMaskPoints(count), HERO_HALF)
    const g1 = sampleTextTargets('G1', count, HERO_HALF * 1.05)
    const field = fieldTargets(count, HERO_HALF)
    // arranque = campo disperso
    const positions = field.slice()
    const colors = new Float32Array(count * 3)
    const tmp = new THREE.Color()
    for (let i = 0; i < count; i++) {
      const u = (genesis[i * 3]! / HERO_HALF + 1) / 2 // x normalizada → rampa
      rampG1(Math.min(1, Math.max(0, u)), tmp)
      colors[i * 3] = tmp.r; colors[i * 3 + 1] = tmp.g; colors[i * 3 + 2] = tmp.b
    }
    return { positions, colors, targets: [genesis, g1, field] as Float32Array[] }
  }, [count])

  useFrame((st, dt) => {
    const s = state.current
    s.t += dt
    if (s.t > PHASES[s.phase]!.dur) { s.t = 0; s.phase = (s.phase + 1) % PHASES.length; onPhase(PHASES[s.phase]!.label) }
    const tgt = targets[s.phase]!
    const geo = pts.current?.geometry
    if (geo) {
      const arr = (geo.attributes.position as THREE.BufferAttribute).array as Float32Array
      const ease = 1 - Math.pow(0.0025, dt) // suave, independiente de FPS
      const time = st.clock.elapsedTime
      for (let i = 0; i < count; i++) {
        const b = i * 3
        const dx = Math.sin(time * 0.6 + i) * 0.012
        const dy = Math.cos(time * 0.5 + i * 1.3) * 0.012
        arr[b] += (tgt[b]! + dx - arr[b]!) * ease
        arr[b + 1] += (tgt[b + 1]! + dy - arr[b + 1]!) * ease
        arr[b + 2] += (tgt[b + 2]! - arr[b + 2]!) * ease
      }
      ;(geo.attributes.position as THREE.BufferAttribute).needsUpdate = true
    }
    if (grp.current) {
      const mx = st.pointer.x, my = st.pointer.y
      grp.current.rotation.y += (mx * 0.18 - grp.current.rotation.y) * 0.04
      grp.current.rotation.x += (-my * 0.12 - grp.current.rotation.x) * 0.04
    }
  })

  return (
    <group ref={grp}>
      <points ref={pts}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} count={count} />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0.92}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}

function Poster() {
  return (
    <div
      aria-hidden
      className="absolute inset-0"
      style={{
        background:
          `radial-gradient(60% 50% at 50% 42%, ${G1.violet}22, transparent 60%),` +
          `radial-gradient(46% 40% at 62% 44%, ${G1.cyan}1c, transparent 62%),` +
          `radial-gradient(40% 36% at 40% 40%, ${G1.amber}14, transparent 60%)`,
      }}
    />
  )
}

export function G1Hero() {
  const c = useCorpus()
  /* La frase entera es UNA clave y la barra la pone cada traducción: así el
     degradado cae donde el idioma quiera, no donde cayó en español. */
  const titular = c('Tu comunidad,|con herramientas reales.')
  const [arriba, abajo] = partir(titular.texto)
  const entrada = c(
    'Trading, exchange y tarjeta cripto de la alianza, con la usabilidad del AiG Token. Una comunidad global que se une al ecosistema.'
  )
  const [mounted, setMounted] = useState(false)
  const [phaseLabel, setPhaseLabel] = useState<string>(PHASES[0].label)
  const [count, setCount] = useState(3600)
  const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion:reduce)').matches

  useEffect(() => {
    setMounted(true)
    const w = window.innerWidth
    setCount(w < 640 ? 2000 : w < 1100 ? 3200 : 4600)
  }, [])

  const showCanvas = mounted && !reduce

  return (
    <section className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-genesis-void">
      <div className="absolute inset-0 z-0">
        {showCanvas ? (
          <Canvas
            camera={{ position: [0, 0, 5], fov: 58 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          >
            <G1Particles count={count} onPhase={setPhaseLabel} />
            <EffectComposer>
              <Bloom
                luminanceThreshold={0.55}
                luminanceSmoothing={0.42}
                intensity={0.55}
                blendFunction={BlendFunction.ADD}
                mipmapBlur
              />
            </EffectComposer>
          </Canvas>
        ) : (
          <Poster />
        )}
      </div>

      {/* velo para legibilidad */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: 'radial-gradient(120% 90% at 50% 42%, transparent 46%, rgba(2,4,10,.55) 80%, #02040A 100%)' }}
      />

      {/* copy */}
      <div className="absolute inset-x-0 bottom-[11svh] z-[2] px-[clamp(18px,4vw,46px)]">
        <div className="mx-auto max-w-3xl text-center">
          {/* La marca no se traduce: son tres nombres propios. */}
          <Eyebrow className="justify-center">Génesis × Aitech × TAG</Eyebrow>
          <h1 lang={titular.lang} className="mt-5 font-display text-[clamp(34px,6.4vw,74px)] font-extrabold leading-[1.02] tracking-tight text-genesis-text">
            {arriba}
            <br />
            <span
              style={{
                background: `linear-gradient(100deg, ${G1.violet}, ${G1.cyan} 60%, ${G1.amber})`,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              {abajo}
            </span>
          </h1>
          <p lang={entrada.lang} className="mx-auto mt-5 max-w-[58ch] text-[clamp(14.5px,2vw,18px)] leading-relaxed text-genesis-mist">
            {pegarMarca(entrada.texto)}
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <PillCTA href="/ecosistema" variant="primary">{c('Conocer el ecosistema').texto} →</PillCTA>
            <PillCTA href="/como-funciona" variant="ghost">{c('Cómo funciona').texto} ↗</PillCTA>
          </div>
          <div className="mt-6">
            <DisclaimerBar className="text-center" />
          </div>
        </div>
      </div>

      {/* indicador de fase (dev/QA) */}
      <div className="absolute bottom-5 right-[clamp(18px,4vw,46px)] z-[3] flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-genesis-mist">
        <span className="h-[7px] w-[7px] rounded-full bg-genesis-cyan shadow-[0_0_10px_#00F5FF]" />
        {phaseLabel}
      </div>
    </section>
  )
}
