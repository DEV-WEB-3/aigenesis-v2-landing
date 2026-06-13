/**
 * Phase 20.5 — Genesis Token Economic Core.
 * Núcleo central + órbitas deformadas, streams de liquidez, holder nodes y flujo económico.
 */
import {
  amplifyTokenNeon,
  computeTokenAIPosition,
  fillTokenCoreAI,
  tokenAiNeonColor,
} from '@/lib/token/tokenCoreAI'

type Rgb = readonly [number, number, number]
type Vec3 = readonly [number, number, number]

export const TOKEN_SECTION_INDEX = 3

export const TOKEN_ROLE = {
  CORE: 0,
  ORBIT: 1,
  INFALL: 2,
  ESCAPE: 3,
  AI: 4,
  STREAM: 5,
  CLUSTER: 6,
  HOLDER: 7,
  FLOW: 8,
} as const

const META_STRIDE = 6

export const TOKEN_ORBIT_COUNT = 3

export const TOKEN_VISUAL_SCALE = 1.28

export const TOKEN_POINT_SIZE_MULT = 1.94

export const TOKEN_QUANTUM_PULSE_S = 4.2

const SHELL_R = [0.98, 1.48, 2.18] as const

const HOLDER_COUNT = 7
const STREAM_COUNT = 9
const FLOW_LINK_COUNT = 9

const HOLDER_SIZES = [1.08, 0.86, 1.14, 0.92, 1.02, 0.88, 1.06] as const

const HOLDER_LINKS: readonly (readonly [number, number])[] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [6, 0],
  [0, 3],
  [1, 4],
] as const

/** Structured economic layers — ambient liquidity reduced ~40%. */
const SHARE = {
  ai: 0.1,
  core: 0.08,
  halo: 0.09,
  orbit: 0.24,
  stream: 0.18,
  holder: 0.07,
  flow: 0.14,
  liquidity: 0.1,
} as const

const NEON_CAP = 0.96

let cachedTokenMeta: Float32Array | null = null

const SIG = {
  MAGENTA: [1, 0, 0.784] as Rgb,
  FUCHSIA: [1, 0.18, 0.859] as Rgb,
  PURPLE: [0.616, 0.302, 1] as Rgb,
  BLUE: [0.161, 0.384, 1] as Rgb,
  CYAN: [0, 0.961, 1] as Rgb,
  WHITE: [0.96, 0.98, 1] as Rgb,
} as const

function write(
  out: Float32Array,
  idx: number,
  x: number,
  y: number,
  z: number,
  jitter = 0.009
): void {
  out[idx * 3] = x + (Math.random() - 0.5) * jitter
  out[idx * 3 + 1] = y + (Math.random() - 0.5) * jitter
  out[idx * 3 + 2] = z + (Math.random() - 0.5) * jitter * 0.55
}

function writeMeta(
  meta: Float32Array,
  idx: number,
  role: number,
  ring: number,
  angle: number,
  radius: number,
  wobble: number,
  speed: number
): void {
  const bi = idx * META_STRIDE
  meta[bi] = role
  meta[bi + 1] = ring
  meta[bi + 2] = angle
  meta[bi + 3] = radius
  meta[bi + 4] = wobble
  meta[bi + 5] = speed
}

function holderAngle(nodeId: number): number {
  return (nodeId / HOLDER_COUNT) * Math.PI * 2 - Math.PI / 2 + nodeId * 0.18
}

/** Irregular elliptical shell — no perfect rings. */
export function deformedOrbitPoint(shell: number, angle: number, layer: number): Vec3 {
  const baseR = SHELL_R[shell] ?? SHELL_R[SHELL_R.length - 1]
  const warp = 0.1 + shell * 0.035
  const ex = 1.14 + Math.sin(shell * 1.65 + 0.4) * 0.16 + Math.cos(angle * 2.3) * warp
  const ey = 0.74 + Math.cos(shell * 2.1) * 0.12 + Math.sin(angle * 1.8) * (warp * 0.85)
  const r =
    baseR *
    (1 +
      Math.sin(angle * 3.9 + shell * 1.1) * 0.085 +
      Math.cos(angle * 5.4 + shell * 0.7) * 0.048 +
      Math.sin(angle * 1.4 - shell * 0.5) * 0.032)
  const z =
    (layer - 1) * 0.048 +
    Math.sin(angle * 2.6 + shell * 0.8) * (0.05 + shell * 0.012) +
    Math.cos(angle * 1.3) * 0.018
  return [Math.cos(angle) * r * ex, Math.sin(angle) * r * ey, z]
}

export function holderNodePosition(nodeId: number): Vec3 {
  const angle = holderAngle(nodeId)
  const size = HOLDER_SIZES[nodeId % HOLDER_SIZES.length] ?? 1
  const [x, y, z] = deformedOrbitPoint(2, angle, nodeId % 3)
  return [x * size, y * size, z * 0.92]
}

function liquidityStreamEndpoints(streamId: number): {
  ax: number
  ay: number
  az: number
  bx: number
  by: number
  bz: number
} {
  const shell = streamId % TOKEN_ORBIT_COUNT
  const slot = Math.floor(streamId / TOKEN_ORBIT_COUNT)
  const angle = (slot / TOKEN_ORBIT_COUNT) * Math.PI * 2 - Math.PI / 2 + shell * 0.52
  const [ax, ay, az] = deformedOrbitPoint(shell, angle, 1)
  const coreR = 0.08 + shell * 0.02
  const bx = Math.cos(angle + 0.2) * coreR
  const by = Math.sin(angle + 0.2) * coreR * 0.9
  const bz = Math.sin(angle) * 0.015
  return { ax, ay, az, bx, by, bz }
}

function flowEndpoints(linkId: number): {
  ax: number
  ay: number
  az: number
  bx: number
  by: number
  bz: number
} {
  const link = HOLDER_LINKS[linkId % HOLDER_LINKS.length] ?? [0, 1]
  const [a, b] = link
  const [ax, ay, az] = holderNodePosition(a)
  const [bx, by, bz] = holderNodePosition(b)
  return { ax, ay, az, bx, by, bz }
}

function fillQuantumCore(out: Float32Array, meta: Float32Array, idx: number, n: number): number {
  for (let i = 0; i < n; i++) {
    const u = Math.random()
    const v = Math.random()
    const theta = 2 * Math.PI * u
    const phi = Math.acos(2 * v - 1)
    const r = 0.22 * Math.cbrt(Math.random())
    write(
      out,
      idx,
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi) * 0.42,
      0.006
    )
    writeMeta(meta, idx, TOKEN_ROLE.CORE, 0, theta, r, Math.random() * Math.PI * 2, 0.55)
    idx++
  }
  return idx
}

function fillQuantumHalo(out: Float32Array, meta: Float32Array, idx: number, n: number): number {
  for (let i = 0; i < n; i++) {
    const layer = i % 3
    const u = Math.random() * Math.PI * 2
    const r = 0.28 + Math.random() ** 0.7 * 0.32
    const z = (Math.random() - 0.5) * 0.08
    write(out, idx, Math.cos(u) * r, Math.sin(u) * r * 0.92, z, 0.012)
    writeMeta(meta, idx, TOKEN_ROLE.CORE, 1 + layer, u, r, Math.random() * Math.PI * 2, 0.38 + layer * 0.08)
    idx++
  }
  return idx
}

/** Residual ambient breath — reduced vs Phase 20.0. */
function fillLiquidityCloud(out: Float32Array, meta: Float32Array, idx: number, n: number): number {
  for (let i = 0; i < n; i++) {
    const inward = i % 2 === 0
    const shell = i % TOKEN_ORBIT_COUNT
    const angle = (i / Math.max(1, n)) * Math.PI * 2 + shell * 0.4
    const r = (SHELL_R[shell] ?? 1.5) * (0.42 + (i % 5) * 0.06)
    write(out, idx, Math.cos(angle) * r, Math.sin(angle) * r * 0.86, (i % 3 - 1) * 0.03, 0.002)
    const role = inward ? TOKEN_ROLE.INFALL : TOKEN_ROLE.ESCAPE
    writeMeta(meta, idx, role, shell, angle, r, i * 0.41, 0.14 + (i % 4) * 0.03)
    idx++
  }
  return idx
}

function fillDeformedOrbit(out: Float32Array, meta: Float32Array, idx: number, n: number): number {
  const perShell = Math.floor(n / TOKEN_ORBIT_COUNT)
  for (let shell = 0; shell < TOKEN_ORBIT_COUNT; shell++) {
    const count = shell < TOKEN_ORBIT_COUNT - 1 ? perShell : n - perShell * (TOKEN_ORBIT_COUNT - 1)
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + shell * 0.22
      const layer = i % 3
      const [x, y, z] = deformedOrbitPoint(shell, angle, layer)
      write(out, idx, x, y, z, 0.006)
      writeMeta(
        meta,
        idx,
        TOKEN_ROLE.ORBIT,
        shell,
        angle,
        SHELL_R[shell] ?? 1.5,
        layer,
        0.14 + shell * 0.04
      )
      idx++
    }
  }
  return idx
}

function fillLiquidityStreams(out: Float32Array, meta: Float32Array, idx: number, n: number): number {
  const perStream = Math.max(4, Math.floor(n / STREAM_COUNT))
  for (let s = 0; s < STREAM_COUNT; s++) {
    const { ax, ay, az, bx, by, bz } = liquidityStreamEndpoints(s)
    for (let i = 0; i < perStream; i++) {
      const h = (i + 0.5) / perStream
      const ease = h * h * (3 - 2 * h)
      write(
        out,
        idx,
        ax * (1 - ease) + bx * ease,
        ay * (1 - ease) + by * ease,
        az * (1 - ease) + bz * ease,
        0.004
      )
      writeMeta(meta, idx, TOKEN_ROLE.STREAM, s, h, ease, s * 0.52, 0.22 + (s % 3) * 0.04)
      idx++
    }
  }
  return idx
}

function fillHolderNodes(out: Float32Array, meta: Float32Array, idx: number, n: number): number {
  const perNode = Math.max(5, Math.floor(n / HOLDER_COUNT))
  for (let node = 0; node < HOLDER_COUNT; node++) {
    const [cx, cy, cz] = holderNodePosition(node)
    const size = HOLDER_SIZES[node] ?? 1
    for (let i = 0; i < perNode; i++) {
      const u = (i + 0.5) / perNode
      const a = u * Math.PI * 2
      const r = 0.028 * size * (0.65 + Math.random() * 0.35)
      write(out, idx, cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.9, cz + Math.sin(a * 2) * 0.012, 0.003)
      writeMeta(meta, idx, TOKEN_ROLE.HOLDER, node, a, size, node * 0.73, 0.18)
      idx++
    }
  }
  return idx
}

function fillEconomicFlow(out: Float32Array, meta: Float32Array, idx: number, n: number): number {
  const perLink = Math.max(4, Math.floor(n / FLOW_LINK_COUNT))
  for (let link = 0; link < FLOW_LINK_COUNT; link++) {
    const { ax, ay, az, bx, by, bz } = flowEndpoints(link)
    for (let i = 0; i < perLink; i++) {
      const h = (i + 0.5) / perLink
      write(
        out,
        idx,
        ax * (1 - h) + bx * h,
        ay * (1 - h) + by * h,
        az * (1 - h) + bz * h,
        0.003
      )
      writeMeta(meta, idx, TOKEN_ROLE.FLOW, link, h, 0, link * 0.61, 0.16 + (link % 3) * 0.03)
      idx++
    }
  }
  return idx
}

export function buildTokenGravityCore(count: number): {
  positions: Float32Array
  meta: Float32Array
} {
  const out = new Float32Array(count * 3)
  const meta = new Float32Array(count * META_STRIDE)
  let idx = 0

  const nAi = Math.floor(count * SHARE.ai)
  const nCore = Math.floor(count * SHARE.core)
  const nHalo = Math.floor(count * SHARE.halo)
  const nOrbit = Math.floor(count * SHARE.orbit)
  const nStream = Math.floor(count * SHARE.stream)
  const nHolder = Math.floor(count * SHARE.holder)
  const nFlow = Math.floor(count * SHARE.flow)
  const nLiquidity = count - nAi - nCore - nHalo - nOrbit - nStream - nHolder - nFlow

  idx = fillTokenCoreAI(out, meta, idx, nAi)
  idx = fillQuantumCore(out, meta, idx, nCore)
  idx = fillQuantumHalo(out, meta, idx, nHalo)
  idx = fillDeformedOrbit(out, meta, idx, nOrbit)
  idx = fillLiquidityStreams(out, meta, idx, nStream)
  idx = fillHolderNodes(out, meta, idx, nHolder)
  idx = fillEconomicFlow(out, meta, idx, nFlow)
  idx = fillLiquidityCloud(out, meta, idx, Math.max(0, nLiquidity))

  while (idx < count) {
    const shell = idx % TOKEN_ORBIT_COUNT
    const angle = (idx / count) * Math.PI * 2
    const [x, y, z] = deformedOrbitPoint(shell, angle, 1)
    write(out, idx, x, y, z, 0.004)
    writeMeta(meta, idx, TOKEN_ROLE.ORBIT, shell, angle, SHELL_R[shell] ?? 1.5, 1, 0.12)
    idx++
  }

  return { positions: out, meta }
}

export function genTokenGravityCore(count: number): Float32Array {
  const { positions, meta } = buildTokenGravityCore(count)
  cachedTokenMeta = meta
  return positions
}

export function getTokenGravityMeta(): Float32Array | null {
  return cachedTokenMeta
}

function lerpRgb(a: Rgb, b: Rgb, t: number): Rgb {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
}

function clampChannel(v: number): number {
  return Math.min(NEON_CAP, Math.max(0, v))
}

function sampleSignatureGradient(t: number): Rgb {
  const u = Math.max(0, Math.min(1, t))
  if (u < 0.25) return lerpRgb(SIG.MAGENTA, SIG.FUCHSIA, u / 0.25)
  if (u < 0.5) return lerpRgb(SIG.FUCHSIA, SIG.PURPLE, (u - 0.25) / 0.25)
  if (u < 0.75) return lerpRgb(SIG.PURPLE, SIG.BLUE, (u - 0.5) / 0.25)
  return lerpRgb(SIG.BLUE, SIG.CYAN, (u - 0.75) / 0.25)
}

export function tokenDepthBrightness(z: number, role: number): number {
  if (role === TOKEN_ROLE.AI) return 1.22
  if (role === TOKEN_ROLE.CORE) return 1.28
  if (role === TOKEN_ROLE.HOLDER) return 1.18
  if (role === TOKEN_ROLE.STREAM || role === TOKEN_ROLE.FLOW) return 1.12
  if (role === TOKEN_ROLE.ORBIT) return 0.88 + Math.max(0, 1 - Math.abs(z) / 0.12) * 0.22
  const fg = Math.max(0, 1 - Math.abs(z - 0.04) / 0.12)
  const bg = Math.max(0, 1 - Math.abs(z + 0.05) / 0.1)
  return 0.62 + fg * 0.3 + bg * 0.08
}

export function buildTokenGravityColors(count: number, meta: Float32Array): Float32Array {
  const colors = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const mi = i * META_STRIDE
    const role = meta[mi]
    const ring = meta[mi + 1]
    const param = meta[mi + 2]
    const radius = meta[mi + 3]
    const wobble = meta[mi + 4]
    const depthLayer = Math.floor(wobble) % 3
    const zProxy = (depthLayer - 1) * 0.045
    let c: Rgb

    if (role === TOKEN_ROLE.AI) {
      const part = ring
      const slot = Math.floor(param)
      const [cr, cg, cb] = tokenAiNeonColor(part, slot)
      c = [cr, cg, cb]
    } else if (role === TOKEN_ROLE.CORE) {
      if (ring === 0) {
        c = SIG.MAGENTA
      } else if (ring === 1) {
        c = lerpRgb(SIG.PURPLE, SIG.MAGENTA, 0.35)
      } else if (ring === 2) {
        c = lerpRgb(SIG.WHITE, SIG.FUCHSIA, 0.32)
      } else {
        c = lerpRgb(SIG.CYAN, SIG.PURPLE, 0.42)
      }
    } else if (role === TOKEN_ROLE.STREAM) {
      const h = param
      c = lerpRgb(SIG.CYAN, SIG.MAGENTA, h * 0.88 + 0.06)
      c = [c[0] * 1.06, c[1] * 1.02, c[2] * 1.1]
    } else if (role === TOKEN_ROLE.FLOW) {
      const h = param
      c = lerpRgb(SIG.PURPLE, SIG.CYAN, 0.35 + h * 0.45)
      c = [c[0] * 0.94, c[1] * 0.92, c[2] * 1.05]
    } else if (role === TOKEN_ROLE.HOLDER) {
      const size = radius
      c = lerpRgb(SIG.PURPLE, SIG.CYAN, 0.38 + (ring % 3) * 0.12)
      c = [c[0] * (0.92 + size * 0.08), c[1] * (0.9 + size * 0.06), c[2] * (0.98 + size * 0.06)]
    } else if (role === TOKEN_ROLE.ORBIT) {
      const t = ring / Math.max(1, TOKEN_ORBIT_COUNT - 1)
      c = sampleSignatureGradient(0.3 + t * 0.55)
      c = [c[0] * (0.96 - ring * 0.04), c[1] * (0.94 - ring * 0.035), c[2] * (1 - ring * 0.02)]
    } else if (role === TOKEN_ROLE.INFALL) {
      c = lerpRgb(SIG.CYAN, SIG.PURPLE, 0.48)
      c = [c[0] * 0.72, c[1] * 0.76, c[2] * 0.88]
    } else {
      c = lerpRgb(SIG.PURPLE, SIG.MAGENTA, 0.4)
      c = [c[0] * 0.68, c[1] * 0.64, c[2] * 0.82]
    }

    const depth = tokenDepthBrightness(zProxy, role)
    let r = c[0] * depth
    let g = c[1] * depth
    let b = c[2] * depth
    ;[r, g, b] = amplifyTokenNeon(r, g, b, 0, wobble)
    colors[i * 3] = clampChannel(r)
    colors[i * 3 + 1] = clampChannel(g)
    colors[i * 3 + 2] = clampChannel(b)
  }
  return colors
}

export { amplifyTokenNeon, tokenAiNeonColor } from '@/lib/token/tokenCoreAI'

function quantumCorePulse(t: number, motion: number): number {
  return 1 + Math.sin((t / TOKEN_QUANTUM_PULSE_S) * Math.PI * 2) * 0.012 * motion
}

export function tokenAtmosphericDepthMul(z: number, dist: number): number {
  const depth = Math.max(0, 1 - Math.abs(z) / 0.14)
  const radial = Math.max(0.42, 1 - dist / 3.2)
  return 0.58 + depth * 0.22 + radial * 0.2
}

function liquidityBreathPhase(t: number, wobble: number, speed: number): number {
  return (Math.sin(t * speed * 0.28 + wobble) + 1) * 0.5
}

export function computeTokenGravityPosition(
  meta: Float32Array,
  i: number,
  t: number,
  motion: number
): [number, number, number] {
  const mi = i * META_STRIDE
  const role = meta[mi]
  const ring = meta[mi + 1]
  const angle0 = meta[mi + 2]
  const baseR = meta[mi + 3]
  const wobble = meta[mi + 4]
  const speed = meta[mi + 5]

  const corePulse = quantumCorePulse(t, motion)

  if (role === TOKEN_ROLE.AI) {
    return computeTokenAIPosition(meta, i, t, motion)
  }

  if (role === TOKEN_ROLE.CORE) {
    if (ring === 0) {
      const pulse = (1 + Math.sin(t * 0.38 + wobble) * 0.008 * motion) * corePulse
      const r = baseR * pulse
      return [
        Math.cos(angle0) * r + Math.sin(t * 0.45 + wobble) * 0.002,
        Math.sin(angle0) * r + Math.cos(t * 0.42 + wobble) * 0.002,
        Math.sin(wobble) * 0.004,
      ]
    }
    const haloPulse = 1 + Math.sin(t * 0.3 + wobble * 1.4) * 0.01 * motion
    const r = baseR * haloPulse * corePulse
    const u = angle0 + t * 0.05 * (ring % 2 === 0 ? 1 : -1)
    return [Math.cos(u) * r, Math.sin(u) * r * 0.9, Math.sin(u * 2) * 0.024]
  }

  if (role === TOKEN_ROLE.STREAM) {
    const streamId = ring
    const { ax, ay, az, bx, by, bz } = liquidityStreamEndpoints(streamId)
    const travel = (t * speed * 0.08 + wobble / (Math.PI * 2)) % 1
    const ease = travel < 0.5 ? travel * 2 : 2 - travel * 2
    const e = ease * ease * (3 - 2 * ease)
    const px = ax * (1 - e) + bx * e
    const py = ay * (1 - e) + by * e
    const pz = az * (1 - e) + bz * e
    return [px, py, pz]
  }

  if (role === TOKEN_ROLE.FLOW) {
    const linkId = ring
    const { ax, ay, az, bx, by, bz } = flowEndpoints(linkId)
    const ping = (t * speed * 0.06 + angle0) % 2
    const h = ping < 1 ? ping : 2 - ping
    const e = h * h * (3 - 2 * h)
    const breathe = Math.sin(t * 0.22 + wobble) * 0.003 * motion
    return [
      ax * (1 - e) + bx * e + breathe,
      ay * (1 - e) + by * e + breathe * 0.85,
      az * (1 - e) + bz * e,
    ]
  }

  if (role === TOKEN_ROLE.HOLDER) {
    const nodeId = ring
    const [cx, cy, cz] = holderNodePosition(nodeId)
    const size = baseR
    const glow = 1 + Math.sin(t * 0.32 + wobble) * 0.008 * motion
    const r = 0.032 * size * glow
    return [
      cx + Math.cos(angle0) * r,
      cy + Math.sin(angle0) * r * 0.9,
      cz + Math.sin(angle0 * 2) * 0.01,
    ]
  }

  if (role === TOKEN_ROLE.ORBIT) {
    const dir = ring % 2 === 0 ? 1 : -1
    const depthLayer = Math.floor(wobble) % 3
    const ang = angle0 + t * speed * dir * (0.1 / (ring + 1.1))
    const [x, y, z] = deformedOrbitPoint(ring, ang, depthLayer)
    const breathe = 1 + Math.sin(t * 0.24 + wobble * 2) * 0.004 * motion
    const parallax = Math.sin(t * 0.15 + ring * 0.5) * 0.006 * motion
    return [x * breathe, y * breathe, z + parallax]
  }

  if (role === TOKEN_ROLE.INFALL) {
    const breath = liquidityBreathPhase(t, wobble, speed)
    const r = baseR * (0.32 + breath * 0.68) * corePulse
    const ang = angle0 + t * 0.08 + breath * Math.PI * 0.22
    return [Math.cos(ang) * r, Math.sin(ang) * r * 0.88, Math.sin(ang * 2.1) * 0.03 * (1 - breath * 0.5)]
  }

  const breath = liquidityBreathPhase(t, wobble + Math.PI, speed)
  const r = baseR * (0.36 + (1 - breath) * 0.64) * (0.98 + corePulse * 0.02)
  const ang = angle0 - t * 0.08 - (1 - breath) * 0.22
  return [Math.cos(ang) * r, Math.sin(ang) * r * 0.86, Math.sin(ang) * 0.035]
}

export function tokenRadialPulseStrength(x: number, y: number, t: number): number {
  const dist = Math.hypot(x, y)
  const pulsePhase = (t % TOKEN_QUANTUM_PULSE_S) / TOKEN_QUANTUM_PULSE_S
  const pulseR = pulsePhase * 1.35
  const band = Math.max(0, 1 - Math.abs(dist - pulseR) / 0.16) ** 2.2
  const fadeOut = 1 - pulsePhase * 0.88
  const coreBoost = Math.max(0, 1 - dist / 0.32) * Math.sin(pulsePhase * Math.PI) * 0.32
  return band * fadeOut * 0.55 + coreBoost
}

export function tokenCoreEmissionStrength(t: number): number {
  const phase = (t % TOKEN_QUANTUM_PULSE_S) / TOKEN_QUANTUM_PULSE_S
  if (phase > 0.1) return 0
  return (1 - phase / 0.1) ** 1.8 * 0.78
}

export const TOKEN_META_STRIDE = META_STRIDE
