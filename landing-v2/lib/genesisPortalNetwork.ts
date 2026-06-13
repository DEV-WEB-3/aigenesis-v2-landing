/**
 * Phase 16.0 — Genesis Final Portal (WebGL, sección 13).
 */
import { PORTAL_ABSORB_S, PORTAL_CORE_PULSE_S } from '@/lib/portal/genesisPortalLayout'

type Rgb = readonly [number, number, number]

export const CTA_SECTION_INDEX = 13
export const PORTAL_FORM_DURATION = 1.1
export const PORTAL_LOOP_DURATION = PORTAL_ABSORB_S

export const PORTAL_ROLE = {
  OUTER_RING: 0,
  MIDDLE_RING: 1,
  CORE_RING: 2,
  STARDUST: 3,
  STREAM: 4,
  CORE: 5,
} as const

const META_STRIDE = 6
const CY = 0.08
const CYAN: Rgb = [0, 0.961, 1]
const PURPLE: Rgb = [0.608, 0.302, 1]
const FUCHSIA: Rgb = [1, 0, 0.784]

const RING_RADIUS = {
  outer: 1.14,
  middle: 0.8,
  core: 0.5,
} as const

let cachedPortalMeta: Float32Array | null = null

function write(
  out: Float32Array,
  idx: number,
  x: number,
  y: number,
  z: number,
  jitter = 0.01
): void {
  out[idx * 3] = x + (Math.random() - 0.5) * jitter
  out[idx * 3 + 1] = y + CY + (Math.random() - 0.5) * jitter
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

function fillRing(
  out: Float32Array,
  meta: Float32Array,
  idx: number,
  role: number,
  radius: number,
  n: number,
  tilt: number
): number {
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2
    const wobble = Math.sin(a * 3 + tilt) * 0.012
    const r = radius + wobble
    write(out, idx, Math.cos(a) * r, Math.sin(a) * r * 0.88, Math.sin(a * 2) * 0.018, 0.006)
    writeMeta(meta, idx, role, i % 8, i / n, a, Math.random() * Math.PI * 2, 0.28 + (i % 5) * 0.03)
    idx++
  }
  return idx
}

function fillStardust(out: Float32Array, meta: Float32Array, idx: number, n: number): number {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2
    const startR = 1.05 + Math.random() * 0.45
    write(out, idx, Math.cos(a) * startR, Math.sin(a) * startR * 0.9, (Math.random() - 0.5) * 0.12, 0.008)
    writeMeta(meta, idx, PORTAL_ROLE.STARDUST, i % 6, startR, a, Math.random() * Math.PI * 2, 0.06 + (i % 4) * 0.015)
    idx++
  }
  return idx
}

function fillStream(out: Float32Array, meta: Float32Array, idx: number, n: number): number {
  const lanes = 8
  const perLane = Math.ceil(n / lanes)
  for (let lane = 0; lane < lanes && idx < out.length / 3; lane++) {
    const baseA = (lane / lanes) * Math.PI * 2
    for (let j = 0; j < perLane && idx < out.length / 3; j++) {
      const along = j / Math.max(1, perLane - 1)
      const r = 1.12 * (1 - along * 0.92)
      const spread = (j % 3 - 1) * 0.014
      const a = baseA + spread
      write(out, idx, Math.cos(a) * r, Math.sin(a) * r * 0.88, along * 0.04 - 0.02, 0.005)
      writeMeta(meta, idx, PORTAL_ROLE.STREAM, lane, along, a, Math.random() * Math.PI * 2, 0.22 + lane * 0.02)
      idx++
    }
  }
  return idx
}

function fillCore(out: Float32Array, meta: Float32Array, idx: number, n: number): number {
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2
    const r = 0.04 + (i % 4) * 0.012
    write(out, idx, Math.cos(a) * r, Math.sin(a) * r * 0.85, Math.sin(a) * 0.008, 0.004)
    writeMeta(meta, idx, PORTAL_ROLE.CORE, i % 5, i / n, a, Math.random() * Math.PI * 2, 0.5)
    idx++
  }
  return idx
}

export function buildGenesisPortalNetwork(count: number): { positions: Float32Array; meta: Float32Array } {
  const out = new Float32Array(count * 3)
  const meta = new Float32Array(count * META_STRIDE)
  let idx = 0

  const nOuter = Math.floor(count * 0.28)
  const nMiddle = Math.floor(count * 0.22)
  const nCoreRing = Math.floor(count * 0.16)
  const nStardust = Math.floor(count * 0.2)
  const nStream = Math.floor(count * 0.1)
  const nCore = count - nOuter - nMiddle - nCoreRing - nStardust - nStream

  idx = fillRing(out, meta, idx, PORTAL_ROLE.OUTER_RING, RING_RADIUS.outer, nOuter, 0)
  idx = fillRing(out, meta, idx, PORTAL_ROLE.MIDDLE_RING, RING_RADIUS.middle, nMiddle, 1.2)
  idx = fillRing(out, meta, idx, PORTAL_ROLE.CORE_RING, RING_RADIUS.core, nCoreRing, 2.1)
  idx = fillStardust(out, meta, idx, nStardust)
  idx = fillStream(out, meta, idx, nStream)
  idx = fillCore(out, meta, idx, Math.max(8, nCore))

  while (idx < count) {
    idx = fillStardust(out, meta, idx, 1)
  }

  return { positions: out, meta }
}

export function genGenesisPortalNetwork(count: number): Float32Array {
  const { positions, meta } = buildGenesisPortalNetwork(count)
  cachedPortalMeta = meta
  return positions
}

/** @deprecated — use genGenesisPortalNetwork */
export function genPortalOrb(count: number): Float32Array {
  return genGenesisPortalNetwork(count)
}

export function getPortalNetworkMeta(): Float32Array | null {
  return cachedPortalMeta
}

export function scatterPortalFromExterior(count: number): Float32Array {
  const scatter = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const bi = i * 3
    const a = Math.random() * Math.PI * 2
    const r = 1.35 + Math.random() * 0.55
    scatter[bi] = Math.cos(a) * r
    scatter[bi + 1] = CY + Math.sin(a) * r * 0.9
    scatter[bi + 2] = (Math.random() - 0.5) * 0.2
  }
  return scatter
}

export function portalFlowPhase(t: number, speed: number): number {
  return ((t / PORTAL_LOOP_DURATION) * (0.88 + speed * 0.12)) % 1
}

export function portalCorePulse(t: number): number {
  const phase = (t % PORTAL_CORE_PULSE_S) / PORTAL_CORE_PULSE_S
  return 0.5 + 0.5 * Math.sin(phase * Math.PI * 2)
}

export function portalAbsorbEnergy(t: number): number {
  const phase = (t % PORTAL_ABSORB_S) / PORTAL_ABSORB_S
  if (phase < 0.12) return easeInOut(phase / 0.12)
  if (phase < 0.28) return 1
  return 1 - easeInOut((phase - 0.28) / 0.72)
}

function easeInOut(x: number): number {
  return x * x * (3 - 2 * x)
}

export function portalRingActivation(formT: number, ring: number): number {
  return Math.min(1, Math.max(0, (formT - ring * 0.12) / 0.32))
}

export function portalStardustInward(t: number, startR: number, speed: number, phase: number): number {
  const flow = portalFlowPhase(t + phase * 0.15, speed)
  return Math.max(0.04, startR * (1 - flow * 0.94))
}

export function computePortalNetworkPosition(
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

  const absorb = portalAbsorbEnergy(t)
  const drift = Math.sin(t * 0.2 + phase) * 0.0025 * motion

  if (role === PORTAL_ROLE.STARDUST) {
    const r = portalStardustInward(t, param, speed, phase)
    const spin = t * 0.08 + phase
    const a = aux + spin * 0.04
    return [Math.cos(a) * r + drift, CY + Math.sin(a) * r * 0.9 + drift * 0.5, Math.sin(a * 2) * 0.02]
  }

  if (role === PORTAL_ROLE.STREAM) {
    const flow = portalFlowPhase(t, speed)
    const along = (param + flow * 0.85) % 1
    const r = 1.1 * (1 - along * 0.95) * (1 + absorb * 0.06)
    const a = aux + Math.sin(t * 0.15 + phase) * 0.02
    return [Math.cos(a) * r, CY + Math.sin(a) * r * 0.88, along * 0.05 - 0.02]
  }

  if (role === PORTAL_ROLE.CORE) {
    const pulse = portalCorePulse(t)
    const r = (0.035 + param * 0.025) * (1 + pulse * 0.35 + absorb * 0.22)
    const a = aux + t * 0.12
    return [Math.cos(a) * r, CY + Math.sin(a) * r * 0.85, Math.sin(a) * 0.01]
  }

  const ringRadius =
    role === PORTAL_ROLE.OUTER_RING
      ? RING_RADIUS.outer
      : role === PORTAL_ROLE.MIDDLE_RING
        ? RING_RADIUS.middle
        : RING_RADIUS.core

  const dir = role === PORTAL_ROLE.MIDDLE_RING ? -1 : 1
  const rot = t * 0.06 * dir * (1 + slot * 0.04)
  const a = aux + rot
  const depth = Math.sin(a * 2 + t * 0.25) * 0.022 * motion
  const expand = 1 + absorb * 0.04 + (role === PORTAL_ROLE.CORE_RING ? portalCorePulse(t) * 0.05 : 0)
  const r = ringRadius * expand + depth
  const yScale = role === PORTAL_ROLE.OUTER_RING ? 0.88 : role === PORTAL_ROLE.MIDDLE_RING ? 0.86 : 0.84

  return [Math.cos(a) * r + drift, CY + Math.sin(a) * r * yScale + drift * 0.4, Math.sin(a * 2 + phase) * 0.018]
}

function colorForRole(role: number, param: number): Rgb {
  if (role === PORTAL_ROLE.OUTER_RING) return CYAN
  if (role === PORTAL_ROLE.MIDDLE_RING) return mixRgb(CYAN, PURPLE, 0.55)
  if (role === PORTAL_ROLE.CORE_RING) return mixRgb(PURPLE, FUCHSIA, 0.62)
  if (role === PORTAL_ROLE.STARDUST) return mixRgb(PURPLE, FUCHSIA, param * 0.4)
  if (role === PORTAL_ROLE.STREAM) return mixRgb(CYAN, PURPLE, param)
  return FUCHSIA
}

function mixRgb(a: Rgb, b: Rgb, t: number): Rgb {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
}

export function buildPortalNetworkColors(count: number, meta: Float32Array): Float32Array {
  const colors = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const mi = i * META_STRIDE
    const role = meta[mi]
    const param = meta[mi + 2]
    const c = colorForRole(role, param)
    const dim =
      role === PORTAL_ROLE.CORE
        ? 1.15 + Math.random() * 0.12
        : role === PORTAL_ROLE.STARDUST
          ? 0.52 + Math.random() * 0.14
          : role === PORTAL_ROLE.STREAM
            ? 0.68 + Math.random() * 0.12
            : 0.88 + Math.random() * 0.14

    colors[i * 3] = Math.min(1, c[0] * dim)
    colors[i * 3 + 1] = Math.min(1, c[1] * dim)
    colors[i * 3 + 2] = Math.min(1, c[2] * dim)
  }
  return colors
}

export const PORTAL_META_STRIDE = META_STRIDE
