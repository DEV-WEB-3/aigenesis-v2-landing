'use client'

/**
 * G1 PARTICLE CORE — sistema de partículas CRISTALINAS compartido por las variantes.
 *
 * Cada partícula es un destello de cristal/diamante (textura de glint + titileo por
 * partícula) teñido con la paleta de marca (violeta→cian→ámbar). El morph recorre
 * estados guiados: cristal (hold sólido, partículas atenuadas para leer el logo) →
 * PULVERIZACIÓN (al salir del hold estallan hacia afuera como esquirlas) → polvo/luz
 * (campo disperso) → reconstrucción. La pulverización es un impulso radial transitorio
 * front-loaded + un pico de tamaño/brillo, encima del lerp hacia el objetivo.
 *
 * Emite `onPhase({ solid, key })` sólo en cambios de fase (no setState por frame).
 */
import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { buildGenesisLogoMaskPoints } from '@/lib/trust/GenesisLogoMaskSampler'
import { G1 } from '@/lib/design/g1'

const HERO_HALF = 1.55

const C_VIOLET = new THREE.Color(G1.violet)
const C_CYAN = new THREE.Color(G1.cyan)
const C_AMBER = new THREE.Color(G1.amber)
function rampG1(u: number, out: THREE.Color) {
  if (u < 0.5) out.copy(C_VIOLET).lerp(C_CYAN, u * 2)
  else out.copy(C_CYAN).lerp(C_AMBER, (u - 0.5) * 2)
  return out
}
function normalizeToHalf(src: Float32Array, half: number): Float32Array {
  let m = 1e-6
  for (let i = 0; i < src.length; i++) { const a = Math.abs(src[i]!); if (a > m) m = a }
  const k = half / m
  const out = new Float32Array(src.length)
  for (let i = 0; i < src.length; i++) out[i] = src[i]! * k
  return out
}
function textTargets(text: string, count: number, half: number): Float32Array {
  const out = new Float32Array(count * 3)
  if (typeof document === 'undefined') return out
  const W = 440, H = 220
  const c = document.createElement('canvas'); c.width = W; c.height = H
  const g = c.getContext('2d')!
  g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'
  g.font = '800 172px "Space Grotesk", system-ui, sans-serif'
  g.fillText(text, W / 2, H / 2 + 8)
  const d = g.getImageData(0, 0, W, H).data
  const px: number[] = []
  for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 2) if (d[(y * W + x) * 4 + 3]! > 128) px.push(x, y)
  const n = px.length / 2 || 1
  const sx = (half * 2) / W
  for (let i = 0; i < count; i++) {
    const j = (i % n) * 2
    out[i * 3] = (px[j]! - W / 2) * sx
    out[i * 3 + 1] = -(px[j + 1]! - H / 2) * sx
    out[i * 3 + 2] = (Math.random() - 0.5) * 0.05
  }
  return out
}
function fieldTargets(count: number, half: number): Float32Array {
  const out = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2
    const r = (0.16 + Math.pow(Math.random(), 0.55) * 1.05) * half
    out[i * 3] = Math.cos(a) * r * 1.2
    out[i * 3 + 1] = Math.sin(a) * r * 0.82
    out[i * 3 + 2] = (Math.random() - 0.5) * 1.0
  }
  return out
}

/** Textura de destello cristalino: núcleo brillante + cruz + diagonales (blanco → lo tiñe vertexColor). */
function makeCrystalSprite(): THREE.CanvasTexture {
  const S = 64
  const c = document.createElement('canvas'); c.width = S; c.height = S
  const g = c.getContext('2d')!
  const cx = S / 2, cy = S / 2
  // halo radial
  const rg = g.createRadialGradient(cx, cy, 0, cx, cy, S / 2)
  rg.addColorStop(0, 'rgba(255,255,255,1)')
  rg.addColorStop(0.18, 'rgba(255,255,255,0.9)')
  rg.addColorStop(0.5, 'rgba(255,255,255,0.18)')
  rg.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = rg; g.fillRect(0, 0, S, S)
  // espigas (cruz + diagonales) para el brillo de faceta
  g.globalCompositeOperation = 'lighter'
  g.translate(cx, cy)
  const spike = (len: number, w: number, alpha: number) => {
    const lg = g.createLinearGradient(-len, 0, len, 0)
    lg.addColorStop(0, 'rgba(255,255,255,0)')
    lg.addColorStop(0.5, `rgba(255,255,255,${alpha})`)
    lg.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = lg
    g.fillRect(-len, -w / 2, len * 2, w)
  }
  for (let k = 0; k < 4; k++) {
    g.save(); g.rotate((Math.PI / 4) * k)
    spike(S * 0.5, k % 2 === 0 ? 2.4 : 1.3, k % 2 === 0 ? 0.85 : 0.4)
    g.restore()
  }
  const t = new THREE.CanvasTexture(c)
  t.needsUpdate = true
  return t
}

export type SolidKind = 'genesis' | 'g1' | null
export type CorePhase = { key: string; target: 'genesis' | 'g1' | 'field'; dur: number; solid: SolidKind; bright: number }

/** Coreografía por defecto (variantes A/B). C pasa la suya. */
export const DEFAULT_PHASES: CorePhase[] = [
  { key: 'genesis-in', target: 'genesis', dur: 1.9, solid: null, bright: 1.0 },
  { key: 'genesis-hold', target: 'genesis', dur: 2.4, solid: 'genesis', bright: 0.24 },
  { key: 'to-field-1', target: 'field', dur: 1.7, solid: null, bright: 1.0 },
  { key: 'g1-in', target: 'g1', dur: 1.9, solid: null, bright: 1.0 },
  { key: 'g1-hold', target: 'g1', dur: 2.4, solid: 'g1', bright: 0.24 },
  { key: 'to-field-2', target: 'field', dur: 1.7, solid: null, bright: 1.0 },
]

function smoothstep(e0: number, e1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)))
  return t * t * (3 - 2 * t)
}

export function G1ParticleCore({
  count,
  phases = DEFAULT_PHASES,
  onPhase,
  baseOpacity = 0.95,
  parallax = true,
}: {
  count: number
  phases?: CorePhase[]
  onPhase?: (p: CorePhase) => void
  baseOpacity?: number
  parallax?: boolean
}) {
  const pts = useRef<THREE.Points>(null)
  const mat = useRef<THREE.PointsMaterial>(null)
  const grp = useRef<THREE.Group>(null)
  const st = useRef({ phase: 0, t: 0, started: false })
  const uTime = useRef({ value: 0 })
  const sprite = useMemo(() => (typeof document !== 'undefined' ? makeCrystalSprite() : null), [])
  useEffect(() => () => sprite?.dispose(), [sprite])

  const { positions, colors, seeds, targets } = useMemo(() => {
    const genesis = normalizeToHalf(buildGenesisLogoMaskPoints(count), HERO_HALF)
    const g1 = textTargets('G1', count, HERO_HALF * 1.05)
    const field = fieldTargets(count, HERO_HALF)
    const positions = field.slice()
    const colors = new Float32Array(count * 3)
    const seeds = new Float32Array(count)
    const tmp = new THREE.Color()
    for (let i = 0; i < count; i++) {
      const u = (genesis[i * 3]! / HERO_HALF + 1) / 2
      rampG1(Math.min(1, Math.max(0, u)), tmp)
      colors[i * 3] = tmp.r; colors[i * 3 + 1] = tmp.g; colors[i * 3 + 2] = tmp.b
      seeds[i] = Math.random()
    }
    return { positions, colors, seeds, targets: { genesis, g1, field } }
  }, [count])

  // inyecta tamaño + titileo por partícula sin perder la atenuación de PointsMaterial
  const onBeforeCompile = useMemo(
    () => (shader: THREE.WebGLProgramParametersWithUniforms) => {
      shader.uniforms.uTime = uTime.current
      shader.vertexShader =
        'attribute float aSeed;\nvarying float vTw;\nuniform float uTime;\n' +
        shader.vertexShader.replace(
          'gl_PointSize = size;',
          'float tw = 0.5 + 0.5 * sin(uTime * 2.3 + aSeed * 6.2831853);\n' +
            'vTw = tw;\n' +
            'gl_PointSize = size * (0.4 + aSeed * 1.7) * (0.55 + 0.55 * tw);'
        )
      shader.fragmentShader =
        'varying float vTw;\n' +
        shader.fragmentShader.replace(
          '#include <color_fragment>',
          '#include <color_fragment>\n  diffuseColor.rgb *= (0.7 + 0.9 * vTw);'
        )
    },
    []
  )

  useFrame((s, dt) => {
    const S = st.current
    if (!S.started) { S.started = true; onPhase?.(phases[0]!) }
    S.t += dt
    if (S.t > phases[S.phase]!.dur) { S.t = 0; S.phase = (S.phase + 1) % phases.length; onPhase?.(phases[S.phase]!) }
    const ph = phases[S.phase]!
    const prev = phases[(S.phase - 1 + phases.length) % phases.length]!
    const p = Math.min(1, S.t / ph.dur)
    // PULVERIZACIÓN: al salir de un hold sólido hacia el campo, estallido radial front-loaded
    const isShatter = ph.target === 'field' && prev.solid !== null
    const burst = isShatter ? Math.max(0, 1 - p * 1.7) : 0

    uTime.current.value = s.clock.elapsedTime

    const tgt = ph.target === 'genesis' ? targets.genesis : ph.target === 'g1' ? targets.g1 : targets.field
    const geo = pts.current?.geometry
    if (geo) {
      const arr = (geo.attributes.position as THREE.BufferAttribute).array as Float32Array
      // el lerp acelera al reconstruir (in) y afloja al pulverizar para que el estallido se vea
      const easeBase = isShatter ? 0.05 : ph.solid !== null ? 0.02 : 0.007
      const time = s.clock.elapsedTime
      const t = time * 0.5
      // flujo tipo curl: mucho en transición (fluidez), casi nulo en hold (logo estable)
      const flowAmp = ph.solid !== null ? 0.01 : 0.05 + burst * 0.03
      for (let i = 0; i < count; i++) {
        const b = i * 3
        const seed = seeds[i]!
        // ease escalonado por partícula → la figura fluye al formarse (unas guían, otras rezagan)
        const ease = 1 - Math.pow(easeBase * (0.55 + seed * 1.1), dt)
        const x = arr[b]!, y = arr[b + 1]!, z = arr[b + 2]!
        const ang = seed * 6.2831853
        const fx = Math.sin(y * 1.6 + t + ang) * flowAmp
        const fy = Math.cos(x * 1.6 - t * 0.9 + ang) * flowAmp
        const fz = Math.sin((x + y) * 1.1 + t * 0.7) * flowAmp * 0.7
        arr[b] += (tgt[b]! + fx - x) * ease
        arr[b + 1] += (tgt[b + 1]! + fy - y) * ease
        arr[b + 2] += (tgt[b + 2]! + fz - z) * ease
        if (burst > 0) {
          const inv = 1 / (Math.hypot(x, y, z) + 1e-3)
          const kick = burst * (0.6 + seed) * 0.06
          arr[b] += x * inv * kick
          arr[b + 1] += y * inv * kick
          arr[b + 2] += z * inv * kick
        }
      }
      ;(geo.attributes.position as THREE.BufferAttribute).needsUpdate = true
    }
    if (mat.current) {
      const targetOp = baseOpacity * ph.bright
      mat.current.opacity += (targetOp - mat.current.opacity) * (1 - Math.pow(0.02, dt))
      // pico de tamaño en el estallido (luz) — vuelve al reformar
      const sizeTarget = 0.03 * (1 + burst * 0.9) * (1 + smoothstep(0, 0.4, p) * (ph.solid !== null ? -0.15 : 0))
      mat.current.size += (sizeTarget - mat.current.size) * (1 - Math.pow(0.05, dt))
    }
    if (grp.current && parallax) {
      grp.current.rotation.y += (s.pointer.x * 0.16 - grp.current.rotation.y) * 0.04
      grp.current.rotation.x += (-s.pointer.y * 0.1 - grp.current.rotation.x) * 0.04
    }
  })

  return (
    <group ref={grp}>
      <points ref={pts}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} count={count} />
          <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} count={count} />
        </bufferGeometry>
        <pointsMaterial
          ref={mat}
          size={0.03}
          map={sprite ?? undefined}
          alphaTest={0.01}
          sizeAttenuation
          vertexColors
          transparent
          opacity={baseOpacity}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          onBeforeCompile={onBeforeCompile}
        />
      </points>
    </group>
  )
}

export { HERO_HALF }
