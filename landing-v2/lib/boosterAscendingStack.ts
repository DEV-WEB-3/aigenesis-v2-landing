/**
 * Phase 8.0 — Booster Quantum Accelerator (WebGL star dust).
 * Activación → Multiplicador → Progresión · columna energética · hélice
 */
import { GENESIS_RGB_NORM } from '@/lib/genesis-brand'
import { BOOSTER_ACCELERATOR_PULSE_S } from '@/lib/booster/quantumAcceleratorLayout'

type Rgb = readonly [number, number, number]

export const BOOSTER_SECTION_INDEX = 5

export const BOOSTER_ROLE = {
  PLATFORM: 0,
  HALO: 1,
  ORBIT: 2,
  COLUMN: 3,
  PULSE: 4,
  NODE: 5,
  LINK: 6,
  DUST: 7,
} as const

const META_STRIDE = 6
const SCALE = 1.28
const COLUMN_CX = 0

/** Stardust only — ORBIT/COLUMN stay off; DUST converges from rear to center. */
const BOOSTER_STARDUST_SHARE = 0.1
const BOOSTER_ORBIT_BURST_SHARE = 0
const BOOSTER_COLUMN_HELIX_SHARE = 0
/** Spawn depth (behind scene) → center column. */
const BOOSTER_STARDUST_SPAWN_Z_MIN = -1.42
const BOOSTER_STARDUST_SPAWN_Z_MAX = -0.72

const TIER_Y = [-0.88 * SCALE, -0.14 * SCALE, 0.62 * SCALE] as const
const TIER_RX = [0.2 * SCALE, 0.24 * SCALE, 0.28 * SCALE] as const

const COLUMN_BOTTOM = -1.02 * SCALE
const COLUMN_TOP = 0.88 * SCALE

const TIER_RGB: readonly Rgb[] = [
  GENESIS_RGB_NORM.fuchsia,
  GENESIS_RGB_NORM.core,
  GENESIS_RGB_NORM.cyan,
]

let cachedBoosterMeta: Float32Array | null = null

function write(
  out: Float32Array,
  idx: number,
  x: number,
  y: number,
  z: number,
  jitter = 0.014
): void {
  out[idx * 3] = x + (Math.random() - 0.5) * jitter
  out[idx * 3 + 1] = y + (Math.random() - 0.5) * jitter
  out[idx * 3 + 2] = z + (Math.random() - 0.5) * jitter
}

function writeMeta(
  meta: Float32Array,
  idx: number,
  role: number,
  slot: number,
  param: number,
  aux: number,
  phase: number,
  speed: number
): void {
  const bi = idx * META_STRIDE
  meta[bi] = role
  meta[bi + 1] = slot
  meta[bi + 2] = param
  meta[bi + 3] = aux
  meta[bi + 4] = phase
  meta[bi + 5] = speed
}

function tierY(slot: number): number {
  return TIER_Y[Math.min(2, Math.max(0, slot))] ?? TIER_Y[0]
}

function tierRx(slot: number): number {
  return TIER_RX[Math.min(2, Math.max(0, slot))] ?? TIER_RX[0]
}

function ringPoint(slot: number, angle: number, radiusT: number): [number, number, number] {
  const r = tierRx(slot) * radiusT
  const y = tierY(slot) + Math.sin(angle * 2) * 0.008 * SCALE
  return [COLUMN_CX + Math.cos(angle) * r, y, Math.sin(angle) * r * 0.82]
}

function helixPoint(h: number, strand: number, strands: number): [number, number, number] {
  const y = COLUMN_BOTTOM + (COLUMN_TOP - COLUMN_BOTTOM) * h
  const phase = (strand / strands) * Math.PI * 2
  const amp = 0.11 * SCALE * (0.5 + h * 0.55)
  const twist = h * Math.PI * 3.4 + phase
  const x = COLUMN_CX + Math.sin(twist) * amp
  const z = Math.cos(twist) * amp * 0.88
  return [x, y, z]
}

function fillActivationRing(
  out: Float32Array,
  meta: Float32Array,
  idx: number,
  n: number
): number {
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * Math.PI * 2 + Math.random() * 0.04
    const r = 0.72 + Math.random() * 0.28
    const [x, y, z] = ringPoint(0, angle, r)
    write(out, idx, x, y, z, 0.012)
    writeMeta(meta, idx, BOOSTER_ROLE.PLATFORM, 0, angle / (Math.PI * 2), r, Math.random() * Math.PI * 2, 0.42)
    idx++
  }
  return idx
}

function fillMultiplierRings(
  out: Float32Array,
  meta: Float32Array,
  idx: number,
  n: number
): number {
  const half = Math.floor(n / 2)
  for (let i = 0; i < half; i++) {
    const angle = (i / half) * Math.PI * 2
    const [x, y, z] = ringPoint(1, angle, 0.88 + Math.random() * 0.1)
    write(out, idx, x, y, z, 0.011)
    writeMeta(meta, idx, BOOSTER_ROLE.HALO, 1, angle, 0.92, Math.random() * Math.PI * 2, 0.55)
    idx++
  }
  for (let i = 0; i < n - half; i++) {
    const angle = (i / (n - half)) * Math.PI * 2 + 0.22
    const [x, y, z] = ringPoint(1, angle, 1.08 + Math.random() * 0.08)
    write(out, idx, x, y, z, 0.01)
    writeMeta(meta, idx, BOOSTER_ROLE.HALO, 1, angle, 1.12, Math.random() * Math.PI * 2, -0.48)
    idx++
  }
  return idx
}

function fillProgressionBurst(
  out: Float32Array,
  meta: Float32Array,
  idx: number,
  n: number
): number {
  for (let i = 0; i < n; i++) {
    const angle = Math.random() * Math.PI * 2
    const r = 0.35 + Math.random() ** 0.65 * 1.05
    const [x, y, z] = ringPoint(2, angle, r)
    const lift = Math.random() * 0.12 * SCALE
    write(out, idx, x, y + lift, z, 0.016)
    writeMeta(meta, idx, BOOSTER_ROLE.ORBIT, 2, angle, r, Math.random() * Math.PI * 2, 0.38 + Math.random() * 0.22)
    idx++
  }
  return idx
}

function fillHelixColumn(
  out: Float32Array,
  meta: Float32Array,
  idx: number,
  n: number
): number {
  const strands = 5
  for (let i = 0; i < n; i++) {
    const strand = i % strands
    const h = (Math.floor(i / strands) + Math.random() * 0.15) / Math.max(1, Math.floor(n / strands))
    const [x, y, z] = helixPoint(Math.min(1, h), strand, strands)
    write(out, idx, x, y, z, 0.01)
    writeMeta(meta, idx, BOOSTER_ROLE.COLUMN, strand, h, strand, Math.random() * Math.PI * 2, 0.52)
    idx++
  }
  return idx
}

function fillGenesisPulses(
  out: Float32Array,
  meta: Float32Array,
  idx: number,
  n: number
): number {
  for (let i = 0; i < n; i++) {
    const h = Math.random()
    const y = COLUMN_BOTTOM + (COLUMN_TOP - COLUMN_BOTTOM) * h
    write(out, idx, COLUMN_CX, y, 0, 0.008)
    writeMeta(meta, idx, BOOSTER_ROLE.PULSE, 0, h, 0, Math.random() * Math.PI * 2, 0.62 + Math.random() * 0.28)
    idx++
  }
  return idx
}

function fillStreamLinks(
  out: Float32Array,
  meta: Float32Array,
  idx: number,
  n: number
): number {
  for (let i = 0; i < n; i++) {
    const tierA = i % 3
    const tierB = Math.min(2, tierA + 1)
    const t = Math.random()
    const angle = (i * 0.41) % (Math.PI * 2)
    const [ax, ay, az] = ringPoint(tierA, angle, 0.55)
    const [bx, by, bz] = ringPoint(tierB, angle + 0.35, 0.48)
    const x = ax + (bx - ax) * t
    const y = ay + (by - ay) * t
    const z = az + (bz - az) * t
    write(out, idx, x, y, z, 0.01)
    writeMeta(meta, idx, BOOSTER_ROLE.LINK, tierA, t, tierB, Math.random() * Math.PI * 2, 0.45)
    idx++
  }
  return idx
}

function fillConvergingStardust(
  out: Float32Array,
  meta: Float32Array,
  idx: number,
  n: number
): number {
  for (let i = 0; i < n; i++) {
    const angle = Math.random() * Math.PI * 2
    const tier = Math.floor(Math.random() * 3)
    const yLerp = 0.22 + Math.random() * 0.56
    const y = COLUMN_BOTTOM + (COLUMN_TOP - COLUMN_BOTTOM) * yLerp
    const r = 0.028 + Math.random() ** 1.65 * 0.11 * SCALE
    const x = Math.cos(angle) * r
    const z = Math.sin(angle) * r * 0.78
    write(out, idx, x, y, z, 0.005)
    writeMeta(
      meta,
      idx,
      BOOSTER_ROLE.DUST,
      tier,
      angle / (Math.PI * 2),
      r,
      Math.random() * Math.PI * 2,
      0.22 + Math.random() * 0.28
    )
    idx++
  }
  return idx
}

function fillTierNodes(
  out: Float32Array,
  meta: Float32Array,
  idx: number,
  n: number
): number {
  for (let tier = 0; tier < 3; tier++) {
    const perTier = Math.floor(n / 3)
    for (let i = 0; i < perTier && idx < out.length / 3; i++) {
      const angle = (i / perTier) * Math.PI * 2
      const [x, y, z] = ringPoint(tier, angle, 0.95)
      write(out, idx, x, y, z, 0.008)
      writeMeta(meta, idx, BOOSTER_ROLE.NODE, tier, i / perTier, angle, Math.random() * Math.PI * 2, 0.58)
      idx++
    }
  }
  return idx
}

function fillHiddenDustSlot(
  out: Float32Array,
  meta: Float32Array,
  idx: number
): number {
  write(out, idx, 0, 0, 0, 0)
  writeMeta(meta, idx, BOOSTER_ROLE.DUST, 0, 0, 0, 0, 0)
  return idx + 1
}

export function buildBoosterAscendingStack(count: number): {
  positions: Float32Array
  meta: Float32Array
} {
  const out = new Float32Array(count * 3)
  const meta = new Float32Array(count * META_STRIDE)
  let idx = 0

  const nActivation = Math.floor(count * 0.14)
  const nMultiplier = Math.floor(count * 0.16)
  const nProgression = Math.floor(count * BOOSTER_ORBIT_BURST_SHARE)
  const nColumn = Math.floor(count * BOOSTER_COLUMN_HELIX_SHARE)
  const nPulse = Math.floor(count * 0.1)
  const nNode = Math.floor(count * 0.06)
  const nLink = Math.floor(count * 0.08)
  const nDust = Math.floor(count * BOOSTER_STARDUST_SHARE)

  idx = fillActivationRing(out, meta, idx, nActivation)
  idx = fillMultiplierRings(out, meta, idx, nMultiplier)
  idx = fillProgressionBurst(out, meta, idx, nProgression)
  idx = fillHelixColumn(out, meta, idx, nColumn)
  idx = fillGenesisPulses(out, meta, idx, nPulse)
  idx = fillTierNodes(out, meta, idx, nNode)
  idx = fillStreamLinks(out, meta, idx, nLink)
  if (nDust > 0) {
    idx = fillConvergingStardust(out, meta, idx, nDust)
  }

  while (idx < count) {
    idx = fillHiddenDustSlot(out, meta, idx)
  }

  return { positions: out, meta }
}

export function genBoosterAscendingStack(count: number): Float32Array {
  const { positions, meta } = buildBoosterAscendingStack(count)
  cachedBoosterMeta = meta
  return positions
}

export function getBoosterStackMeta(): Float32Array | null {
  return cachedBoosterMeta
}

export function computeBoosterStackPosition(
  meta: Float32Array,
  i: number,
  t: number,
  motion: number
): [number, number, number] {
  const mi = i * META_STRIDE
  const role = meta[mi]
  const slot = meta[mi + 1]
  const param = meta[mi + 2]
  const aux = meta[mi + 3]
  const phase = meta[mi + 4]
  const speed = meta[mi + 5]
  const breathe = Math.sin(t * 0.38 + phase) * 0.005 * motion

  if (role === BOOSTER_ROLE.PLATFORM) {
    const gather = 0.68 + Math.sin(t * 0.45 + phase) * 0.08 * motion
    const angle = param * Math.PI * 2 + t * 0.06 * motion
    const [x, y, z] = ringPoint(0, angle, aux * gather)
    return [x, y + breathe, z]
  }

  if (role === BOOSTER_ROLE.HALO) {
    const dir = speed >= 0 ? 1 : -1
    const angle = param + t * Math.abs(speed) * 0.55 * dir * motion
    const expand = aux + Math.sin(t * 0.62 + phase) * 0.06 * motion
    const [x, y, z] = ringPoint(1, angle, expand)
    const duplicate = Math.sin(t * 0.85 + phase) * 0.012 * motion
    return [x * (1 + duplicate * 0.08), y + breathe, z * (1 + duplicate * 0.08)]
  }

  if (role === BOOSTER_ROLE.ORBIT) {
    const angle = param + t * speed * motion * 0.4
    const burst = aux + Math.sin(t * 0.5 + phase) * 0.12 * motion
    const [x, y, z] = ringPoint(2, angle, burst)
    const rise = ((t * 0.08 + phase * 0.05) % 1) * 0.18 * SCALE * motion
    return [x, y + rise + breathe, z]
  }

  if (role === BOOSTER_ROLE.NODE) {
    const tier = Math.min(2, Math.max(0, slot))
    const angle = aux + t * 0.12 * motion
    const [x, y, z] = ringPoint(tier, angle, 0.92)
    return [x, y + breathe * 0.5, z]
  }

  if (role === BOOSTER_ROLE.LINK) {
    const tierA = Math.min(2, Math.max(0, slot))
    const tierB = Math.min(2, Math.max(0, aux))
    const angle = param * Math.PI * 2 + phase * 0.08
    const [ax, ay, az] = ringPoint(tierA, angle, 0.62)
    const [bx, by, bz] = ringPoint(tierB, angle + 0.4, 0.55)
    const wave = boosterTravelWave(t, phase)
    const lt = (param * 0.4 + wave * 0.6) % 1
    return [ax + (bx - ax) * lt, ay + (by - ay) * lt + breathe * 0.4, az + (bz - az) * lt]
  }

  if (role === BOOSTER_ROLE.COLUMN) {
    const h = (param + t * 0.04 * motion) % 1
    const [x, y, z] = helixPoint(h, slot, 5)
    const shimmer = Math.sin(t * 1.1 + h * 10 + phase) * 0.004 * motion
    return [x + shimmer, y + breathe * 0.5, z + shimmer]
  }

  if (role === BOOSTER_ROLE.PULSE) {
    const wave = boosterTravelWave(t, phase)
    const h = (param * 0.15 + wave * 0.85) % 1
    const [x, y, z] = helixPoint(h, Math.floor(phase * 3) % 5, 5)
    const bloom = Math.sin(t * 1.6 + phase) * 0.014 * motion
    return [x, y + bloom, z]
  }

  if (role === BOOSTER_ROLE.DUST) {
    const angle = param * Math.PI * 2 + t * 0.04 * motion
    const r = aux * (0.88 + Math.sin(t * 0.42 + phase) * 0.08 * motion)
    const yBase = COLUMN_BOTTOM + (COLUMN_TOP - COLUMN_BOTTOM) * (0.18 + (phase / (Math.PI * 2)) * 0.64)
    const y = yBase + Math.sin(t * 0.36 + phase * 1.1) * 0.014 * motion
    return [Math.cos(angle) * r, y + breathe * 0.35, Math.sin(angle) * r * 0.78]
  }

  const h = (param + t * speed * 0.12 * motion) % 1
  const [x, y, z] = helixPoint(h, slot, 5)
  const accel = Math.pow(h, 1.4) * 0.06 * SCALE * motion
  return [x + aux * Math.sin(t * 0.4 + phase), y + accel + breathe, z]
}

/** Pulso Genesis cada 4s — activación → progresión */
export function boosterTravelWave(t: number, phase: number): number {
  return ((t + phase * 0.28) % BOOSTER_ACCELERATOR_PULSE_S) / BOOSTER_ACCELERATOR_PULSE_S
}

export function boosterPulseStrength(t: number, phase: number): number {
  const wave = boosterTravelWave(t, phase)
  const dist = Math.abs(((wave - 0.5) % 1) - 0.5) * 2
  return Math.max(0, 1 - dist * 2.4) ** 2.2
}

export function boosterTierActivation(formT: number, tier: number): number {
  const start = tier * 0.18
  const dur = 0.26
  return Math.min(1, Math.max(0, (formT - start) / dur))
}

export function boosterColumnActivation(formT: number): number {
  return Math.min(1, Math.max(0, (formT - 0.38) / 0.32))
}

export function boosterPulseActivation(formT: number): number {
  return Math.min(1, Math.max(0, (formT - 0.68) / 0.24))
}

function easeOutCubic(t: number): number {
  const x = Math.min(1, Math.max(0, t))
  return 1 - (1 - x) ** 3
}

/** Stardust forms from rear → center with per-particle stagger. */
export function boosterStardustFormationBlend(formT: number, phase: number): number {
  const stagger = (phase / (Math.PI * 2)) * 0.38
  return easeOutCubic(Math.min(1, Math.max(0, (formT - stagger) / 0.78)))
}

/** Morph spawn — wide shell behind the accelerator, converging toward center. */
export function scatterBoosterStardustFromRear(
  morph: Float32Array,
  meta: Float32Array,
  count: number
): void {
  for (let i = 0; i < count; i++) {
    const mi = i * META_STRIDE
    if (meta[mi] !== BOOSTER_ROLE.DUST) continue
    if ((meta[mi + 3] ?? 0) <= 0.0001) continue
    const phase = meta[mi + 4] ?? 0
    const param = meta[mi + 2] ?? 0
    const angle = param * Math.PI * 2 + phase * 0.35
    const shell = 0.42 + (phase / (Math.PI * 2)) * 0.48
    const bi = i * 3
    morph[bi] = Math.cos(angle) * shell
    morph[bi + 1] = (COLUMN_BOTTOM + COLUMN_TOP) * 0.5 + Math.sin(phase * 2.1) * 0.55 * SCALE
    morph[bi + 2] =
      BOOSTER_STARDUST_SPAWN_Z_MIN +
      (phase / (Math.PI * 2)) * (BOOSTER_STARDUST_SPAWN_Z_MAX - BOOSTER_STARDUST_SPAWN_Z_MIN)
  }
}

function colorForRole(role: number, slot: number): Rgb {
  const tier = Math.min(2, Math.max(0, slot))
  const base = TIER_RGB[tier] ?? GENESIS_RGB_NORM.core
  const dim = 0.88 + Math.random() * 0.14

  if (role === BOOSTER_ROLE.PULSE) {
    const blend = Math.random()
    if (blend < 0.4) return TIER_RGB[0]!
    if (blend < 0.7) return TIER_RGB[1]!
    return TIER_RGB[2]!
  }
  if (role === BOOSTER_ROLE.DUST) {
    const tier = Math.min(2, Math.max(0, slot))
    const base = TIER_RGB[tier] ?? GENESIS_RGB_NORM.core
    const dim = 0.72 + Math.random() * 0.18
    return [base[0] * dim, base[1] * dim, base[2] * dim]
  }
  if (role === BOOSTER_ROLE.COLUMN || role === BOOSTER_ROLE.LINK) {
    if (Math.random() < 0.45) return [base[0] * dim, base[1] * dim, base[2] * dim]
    const next = TIER_RGB[Math.min(2, tier + 1)] ?? base
    return next
  }
  return [base[0] * dim, base[1] * dim, base[2] * dim]
}

export function buildBoosterStackColors(count: number, meta: Float32Array): Float32Array {
  const colors = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const role = meta[i * META_STRIDE]
    const slot = meta[i * META_STRIDE + 1]
    const c = colorForRole(role, slot)
    const boost =
      role === BOOSTER_ROLE.PULSE || role === BOOSTER_ROLE.HALO ? 1.04 + Math.random() * 0.1 : 1
    colors[i * 3] = Math.min(1, c[0] * boost)
    colors[i * 3 + 1] = Math.min(1, c[1] * boost)
    colors[i * 3 + 2] = Math.min(1, c[2] * boost)
  }
  return colors
}

export const BOOSTER_META_STRIDE = META_STRIDE
