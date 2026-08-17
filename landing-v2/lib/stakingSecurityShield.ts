/**
 * Phase 9.0 — Genesis Time Vault (WebGL star dust, sección 6).
 */
import { STAKING_VAULT_PULSE_S } from '@/lib/staking/timeVaultLayout'
import { llegadaDe } from '@/lib/design/motion'

type Rgb = readonly [number, number, number]

export const STAKING_SECTION_INDEX = 6
export const STAKING_FORM_DURATION = llegadaDe('staking')

export const STAKING_ROLE = {
  SHACKLE: 0,
  SHACKLE_INNER: 1,
  BODY_SHELL: 2,
  BODY_FILL: 3,
  CORE: 4,
  SPARKLE: 5,
  MICRO_ORBIT: 6,
  AURA: 7,
} as const

/** @deprecated kept for imports — vault uses moderate scale */
export const STAKING_LOCK_VISUAL_SCALE = 1.8

const META_STRIDE = 6
const SCALE = STAKING_LOCK_VISUAL_SCALE
const CX = 0

const RING_Y = [-0.38, 0, 0.36] as const
const RING_RX = [0.3, 0.36, 0.42] as const

const FUCHSIA: Rgb = [1, 0, 0.784]
const PURPLE: Rgb = [0.616, 0.302, 1]
const BLUE: Rgb = [0.161, 0.384, 1]
const CYAN: Rgb = [0, 0.961, 1]

let cachedStakingMeta: Float32Array | null = null

function write(
  out: Float32Array,
  idx: number,
  x: number,
  y: number,
  z: number,
  jitter = 0.01
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

function timeRingPoint(ring: number, angle: number, radiusT: number): [number, number, number] {
  const y = RING_Y[Math.min(2, Math.max(0, ring))]! * SCALE
  const rx = RING_RX[Math.min(2, Math.max(0, ring))]! * SCALE * radiusT
  const rz = rx * 0.74
  return [CX + Math.cos(angle) * rx, y, Math.sin(angle) * rz]
}

function shieldContourPoint(t: number): [number, number, number] {
  const a = t * Math.PI * 2
  const shieldRx = 0.46 * SCALE
  const shieldRy = 0.52 * SCALE
  const topBias = Math.max(0, Math.cos(a - Math.PI / 2)) * 0.08 * SCALE
  return [CX + Math.cos(a) * shieldRx * 0.92, Math.sin(a) * shieldRy * 0.88 - topBias, Math.sin(a * 2) * 0.02 * SCALE]
}

function vaultCorePoint(angle: number, radiusT: number): [number, number, number] {
  const r = (0.06 + radiusT * 0.12) * SCALE
  return [CX + Math.cos(angle) * r, Math.sin(angle) * r * 0.85, Math.sin(angle * 2) * 0.015 * SCALE]
}

function lockStreamPoint(stream: number, h: number, inward: boolean): [number, number, number] {
  const spread = 0.22 * SCALE
  const x0 = CX + (stream - 2) * spread * 0.55
  const yTop = 0.72 * SCALE
  const yCore = 0
  const t = inward ? 1 - h : h
  const x = x0 + (CX - x0) * (inward ? t * 0.85 : t * 0.35)
  const y = yTop + (yCore - yTop) * (inward ? t : t * 0.6)
  return [x, y, Math.sin(h * 8 + stream) * 0.012 * SCALE]
}

function fillTimeRing(
  out: Float32Array,
  meta: Float32Array,
  idx: number,
  ring: number,
  n: number,
  role: number
): number {
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * Math.PI * 2 + Math.random() * 0.03
    const r = 0.82 + Math.random() * 0.16
    const [x, y, z] = timeRingPoint(ring, angle, r)
    write(out, idx, x, y, z, 0.009)
    writeMeta(meta, idx, role, ring, angle, r, Math.random() * Math.PI * 2, 0.04 + ring * 0.008)
    idx++
  }
  return idx
}

function fillShieldShell(out: Float32Array, meta: Float32Array, idx: number, n: number): number {
  for (let i = 0; i < n; i++) {
    const t = i / Math.max(1, n - 1)
    const [x, y, z] = shieldContourPoint(t)
    write(out, idx, x, y, z, 0.008)
    writeMeta(meta, idx, STAKING_ROLE.BODY_SHELL, 0, t, 0, Math.random() * Math.PI * 2, 0.05)
    idx++
  }
  return idx
}

function fillVaultChamber(out: Float32Array, meta: Float32Array, idx: number, n: number): number {
  for (let i = 0; i < n; i++) {
    const angle = Math.random() * Math.PI * 2
    const r = Math.random() ** 0.7 * 0.28 * SCALE
    write(out, idx, CX + Math.cos(angle) * r, Math.sin(angle) * r * 0.75, (Math.random() - 0.5) * 0.04 * SCALE, 0.012)
    writeMeta(meta, idx, STAKING_ROLE.BODY_FILL, 0, angle, r, Math.random() * Math.PI * 2, 0.06)
    idx++
  }
  return idx
}

function fillVaultCore(out: Float32Array, meta: Float32Array, idx: number, n: number): number {
  for (let i = 0; i < n; i++) {
    const angle = Math.random() * Math.PI * 2
    const r = Math.random() ** 0.65
    const [x, y, z] = vaultCorePoint(angle, r)
    write(out, idx, x, y, z, 0.007)
    writeMeta(meta, idx, STAKING_ROLE.CORE, 0, r, angle, Math.random() * Math.PI * 2, 0.08)
    idx++
  }
  return idx
}

function fillLockStreams(out: Float32Array, meta: Float32Array, idx: number, n: number): number {
  for (let i = 0; i < n; i++) {
    const stream = i % 5
    const inward = i % 2 === 0
    const h = Math.random()
    const [x, y, z] = lockStreamPoint(stream, h, inward)
    write(out, idx, x, y, z, 0.006)
    writeMeta(meta, idx, STAKING_ROLE.SPARKLE, stream, h, inward ? 1 : 0, Math.random() * Math.PI * 2, 0.12)
    idx++
  }
  return idx
}

function fillSlowOrbit(out: Float32Array, meta: Float32Array, idx: number, n: number): number {
  for (let i = 0; i < n; i++) {
    const band = i % 3
    const angle = (i / n) * Math.PI * 2
    const rx = (0.52 + band * 0.06) * SCALE
    const ry = (0.48 + band * 0.05) * SCALE
    write(out, idx, CX + Math.cos(angle) * rx, Math.sin(angle) * ry * 0.55, 0.05 * SCALE, 0.008)
    writeMeta(meta, idx, STAKING_ROLE.MICRO_ORBIT, band, angle, rx, Math.random() * Math.PI * 2, 0.035 + band * 0.01)
    idx++
  }
  return idx
}

function fillShieldAura(out: Float32Array, meta: Float32Array, idx: number, n: number): number {
  for (let i = 0; i < n; i++) {
    const t = i / Math.max(1, n - 1)
    const [x, y, z] = shieldContourPoint(t)
    const expand = 1.06 + Math.random() * 0.08
    write(out, idx, x * expand, y * expand, z, 0.014)
    writeMeta(meta, idx, STAKING_ROLE.AURA, 0, t, expand, Math.random() * Math.PI * 2, 0.045)
    idx++
  }
  return idx
}

export function buildStakingSecurityShield(count: number): {
  positions: Float32Array
  meta: Float32Array
} {
  const out = new Float32Array(count * 3)
  const meta = new Float32Array(count * META_STRIDE)
  let idx = 0

  const nRing0 = Math.floor(count * 0.1)
  const nRing1 = Math.floor(count * 0.11)
  const nRing2 = Math.floor(count * 0.11)
  const nShell = Math.floor(count * 0.14)
  const nFill = Math.floor(count * 0.16)
  const nCore = Math.floor(count * 0.12)
  const nStream = Math.floor(count * 0.1)
  const nOrbit = Math.floor(count * 0.12)
  const nAura = count - nRing0 - nRing1 - nRing2 - nShell - nFill - nCore - nStream - nOrbit

  idx = fillTimeRing(out, meta, idx, 0, nRing0, STAKING_ROLE.SHACKLE)
  idx = fillTimeRing(out, meta, idx, 1, nRing1, STAKING_ROLE.SHACKLE_INNER)
  idx = fillTimeRing(out, meta, idx, 2, nRing2, STAKING_ROLE.SHACKLE_INNER)
  idx = fillShieldShell(out, meta, idx, nShell)
  idx = fillVaultChamber(out, meta, idx, nFill)
  idx = fillVaultCore(out, meta, idx, nCore)
  idx = fillLockStreams(out, meta, idx, nStream)
  idx = fillSlowOrbit(out, meta, idx, nOrbit)
  idx = fillShieldAura(out, meta, idx, nAura)

  while (idx < count) {
    idx = fillVaultCore(out, meta, idx, 1)
  }

  return { positions: out, meta }
}

export function genStakingSecurityShield(count: number): Float32Array {
  const { positions, meta } = buildStakingSecurityShield(count)
  cachedStakingMeta = meta
  return positions
}

export function getStakingShieldMeta(): Float32Array | null {
  return cachedStakingMeta
}

export function scatterStakingExterior(count: number): Float32Array {
  const scatter = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const bi = i * 3
    const a = Math.random() * Math.PI * 2
    const dist = (0.85 + Math.random() * 0.95) * SCALE
    scatter[bi] = CX + Math.cos(a) * dist
    scatter[bi + 1] = Math.sin(a) * dist * 0.72
    scatter[bi + 2] = (Math.random() - 0.5) * 0.35 * SCALE
  }
  return scatter
}

export function computeStakingShieldPosition(
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
  const slow = motion * 0.22
  const breathe = Math.sin(t * 0.14 + phase) * 0.002 * slow

  if (role === STAKING_ROLE.SHACKLE || role === STAKING_ROLE.SHACKLE_INNER) {
    const ring = role === STAKING_ROLE.SHACKLE ? 0 : Math.min(2, Math.max(1, slot))
    const dir = ring % 2 === 0 ? 1 : -1
    const angle = param + t * speed * dir * slow * 0.35
    const close = 0.72 + Math.min(1, t * 0.08) * 0.28
    const [x, y, z] = timeRingPoint(ring, angle, aux * close)
    return [x, y + breathe, z]
  }

  if (role === STAKING_ROLE.BODY_SHELL) {
    const [x, y, z] = shieldContourPoint(param)
    return [x, y + breathe * 0.5, z]
  }

  if (role === STAKING_ROLE.BODY_FILL) {
    const angle = param
    const r = aux * (1 + Math.sin(t * 0.12 + phase) * 0.03 * slow)
    return [CX + Math.cos(angle) * r, Math.sin(angle) * r * 0.75, Math.sin(angle * 2) * 0.02 * SCALE]
  }

  if (role === STAKING_ROLE.CORE) {
    const pulse = 1 + Math.sin((t / STAKING_VAULT_PULSE_S) * Math.PI * 2 + phase) * 0.08 * slow
    const burst = stakingCorePulse(t, phase) * 0.022 * SCALE
    const r = (param + burst) * pulse * SCALE
    return [CX + Math.cos(aux) * r, Math.sin(aux) * r * 0.85, 0.02 * SCALE + breathe]
  }

  if (role === STAKING_ROLE.SPARKLE) {
    const inward = aux >= 0.5
    const cycle = (t * speed * 0.06 + param) % 1
    const h = inward ? cycle : cycle * 0.55
    const [x, y, z] = lockStreamPoint(slot, h, inward)
    return [x, y, z]
  }

  if (role === STAKING_ROLE.MICRO_ORBIT) {
    const angle = param + t * speed * slow * 0.18
    const rx = aux
    const ry = (0.48 + slot * 0.05) * SCALE
    return [CX + Math.cos(angle) * rx, Math.sin(angle) * ry * 0.55, 0.05 * SCALE + breathe]
  }

  const [x, y, z] = shieldContourPoint(param)
  const expand = aux + Math.sin(t * 0.1 + phase) * 0.015 * slow
  return [x * expand, y * expand, z]
}

export function stakingShackleActivation(formT: number): number {
  return Math.min(1, Math.max(0, formT / 0.35))
}

export function stakingBodyActivation(formT: number): number {
  return Math.min(1, Math.max(0, (formT - 0.2) / 0.35))
}

export function stakingCoreActivation(formT: number): number {
  return Math.min(1, Math.max(0, (formT - 0.45) / 0.3))
}

export function stakingFinisherActivation(formT: number): number {
  return Math.min(1, Math.max(0, (formT - 0.65) / 0.35))
}

export function stakingCoreGlow(t: number, phase: number): number {
  return 0.42 + Math.sin((t / STAKING_VAULT_PULSE_S) * Math.PI * 2 + phase) * 0.38
}

export function stakingCorePulse(t: number, phase: number): number {
  const local = ((t + phase * 0.2) % STAKING_VAULT_PULSE_S) / STAKING_VAULT_PULSE_S
  return Math.max(0, 1 - Math.abs(local - 0.12) * 5) ** 2.2
}

function colorForRole(role: number, slot: number): Rgb {
  if (role === STAKING_ROLE.CORE) {
    return Math.random() < 0.62 ? FUCHSIA : PURPLE
  }
  if (role === STAKING_ROLE.SHACKLE || role === STAKING_ROLE.SHACKLE_INNER) {
    return PURPLE
  }
  if (role === STAKING_ROLE.BODY_SHELL || role === STAKING_ROLE.AURA) {
    return Math.random() < 0.75 ? BLUE : PURPLE
  }
  if (role === STAKING_ROLE.MICRO_ORBIT || role === STAKING_ROLE.SPARKLE) {
    return Math.random() < 0.55 ? CYAN : BLUE
  }
  if (role === STAKING_ROLE.BODY_FILL) {
    return Math.random() < 0.4 ? FUCHSIA : PURPLE
  }
  return CYAN
}

export function buildStakingShieldColors(count: number, meta: Float32Array): Float32Array {
  const colors = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const mi = i * META_STRIDE
    const role = meta[mi]!
    const slot = meta[mi + 1]!
    const c = colorForRole(role, slot)
    const dim =
      role === STAKING_ROLE.CORE ? 1.05 + Math.random() * 0.12 : 0.86 + Math.random() * 0.14
    colors[i * 3] = Math.min(0.95, c[0] * dim)
    colors[i * 3 + 1] = Math.min(0.95, c[1] * dim)
    colors[i * 3 + 2] = Math.min(0.95, c[2] * dim)
  }
  return colors
}

export const STAKING_META_STRIDE = META_STRIDE

export const stakingShieldActivation = stakingBodyActivation
export const stakingLockActivation = stakingBodyActivation
export const stakingOrbitActivation = stakingFinisherActivation
