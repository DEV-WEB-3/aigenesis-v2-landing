import { llegadaDe } from '@/lib/design/motion'

/**
 * Phase 10.0 — G-Pulse Live Signal Network (WebGL star dust, sección 7).
 */
import {
  GPULSE_NODE_COUNT,
  GPULSE_SIGNAL_PULSE_S,
  GPULSE_SIGNAL_RINGS,
} from '@/lib/gpulse/signalNetworkLayout'

type Rgb = readonly [number, number, number]

export const GPULSE_SECTION_INDEX = 7
export const GPULSE_FORM_DURATION = llegadaDe('gpulse')
export const GPULSE_LOOP_DURATION = 12

export const GPULSE_ROLE = {
  CORE: 0,
  RING: 1,
  NODE: 2,
  STREAM_IN: 3,
  STREAM_OUT: 4,
  RADAR: 5,
  FIELD: 6,
} as const

const META_STRIDE = 6
const SCALE = 1.55
const CX = 0

const CYAN: Rgb = [0, 0.961, 1]
const PURPLE: Rgb = [0.616, 0.302, 1]
const FUCHSIA: Rgb = [1, 0, 0.784]

let cachedGpulseMeta: Float32Array | null = null

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

function ringRadius(ring: number): number {
  const def = GPULSE_SIGNAL_RINGS[Math.min(2, Math.max(0, ring))]
  return (def?.r ?? 16) * 0.018 * SCALE
}

function organicWobble(ring: number, angle: number, t: number): number {
  return (
    Math.sin(angle * 3 + ring * 1.7 + t * 0.35) * 0.012 * SCALE +
    Math.cos(angle * 5 - ring * 0.9) * 0.008 * SCALE
  )
}

function ringPoint(ring: number, angle: number, radiusT: number): [number, number, number] {
  const r = ringRadius(ring) * radiusT + organicWobble(ring, angle, 0)
  const squash = 0.82 + ring * 0.04
  return [CX + Math.cos(angle) * r, Math.sin(angle) * r * squash, Math.sin(angle * 2 + ring) * 0.015 * SCALE]
}

function nodeOrbit(node: number): [number, number, number] {
  const angle = (-Math.PI / 2 + (Math.PI * 2 * node) / GPULSE_NODE_COUNT) + (node % 3) * 0.04
  const r = (0.36 + (node % 4) * 0.014) * SCALE
  const squash = 0.86
  return [CX + Math.cos(angle) * r, Math.sin(angle) * r * squash, Math.sin(angle * 3) * 0.02 * SCALE]
}

function streamInPoint(node: number, h: number): [number, number, number] {
  const [nx, ny, nz] = nodeOrbit(node)
  const t = Math.max(0, Math.min(1, h))
  const mx = (CX + nx) / 2 + Math.cos((node / GPULSE_NODE_COUNT) * Math.PI * 2) * 0.04 * SCALE
  const my = (ny + 0) / 2 + Math.sin((node / GPULSE_NODE_COUNT) * Math.PI * 2) * 0.03 * SCALE
  const x = (1 - t) ** 2 * nx + 2 * (1 - t) * t * mx + t ** 2 * CX
  const y = (1 - t) ** 2 * ny + 2 * (1 - t) * t * my + t ** 2 * 0
  const z = nz * (1 - t) + 0.02 * t
  return [x, y, z]
}

function streamOutPoint(stream: number, h: number): [number, number, number] {
  const angle = ((stream * 47) % 360) * (Math.PI / 180)
  const ex = CX + Math.cos(angle) * 0.28 * SCALE
  const ey = Math.sin(angle) * 0.24 * SCALE
  const t = Math.max(0, Math.min(1, h))
  const mx = (CX + ex) / 2
  const my = (ey) / 2 - 0.03 * SCALE
  const x = (1 - t) ** 2 * CX + 2 * (1 - t) * t * mx + t ** 2 * ex
  const y = (1 - t) ** 2 * 0 + 2 * (1 - t) * t * my + t ** 2 * ey
  return [x, y, Math.sin(angle * 2) * 0.018 * SCALE * t]
}

function radarPoint(angle: number, radiusT: number): [number, number, number] {
  const r = (0.08 + radiusT * 0.34) * SCALE
  return [CX + Math.cos(angle) * r, Math.sin(angle) * r * 0.88, 0.008 * SCALE]
}

function corePoint(angle: number, radiusT: number): [number, number, number] {
  const r = (0.04 + radiusT * 0.08) * SCALE
  return [CX + Math.cos(angle) * r, Math.sin(angle) * r * 0.9, Math.sin(angle * 2) * 0.012 * SCALE]
}

function fieldPoint(): [number, number, number] {
  const angle = Math.random() * Math.PI * 2
  const r = (0.12 + Math.random() * 0.38) * SCALE
  return [CX + Math.cos(angle) * r, Math.sin(angle) * r * 0.85, (Math.random() - 0.5) * 0.04 * SCALE]
}

function fillRing(
  out: Float32Array,
  meta: Float32Array,
  idx: number,
  ring: number,
  n: number
): number {
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * Math.PI * 2 + Math.random() * 0.04
    const r = 0.78 + Math.random() * 0.2
    const [x, y, z] = ringPoint(ring, angle, r)
    write(out, idx, x, y, z, 0.008)
    writeMeta(meta, idx, GPULSE_ROLE.RING, ring, angle, r, Math.random() * Math.PI * 2, 0.05 + ring * 0.01)
    idx++
  }
  return idx
}

function fillCore(out: Float32Array, meta: Float32Array, idx: number, n: number): number {
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * Math.PI * 2 + Math.random() * 0.1
    const r = 0.3 + Math.random() * 0.65
    const [x, y, z] = corePoint(angle, r)
    write(out, idx, x, y, z, 0.007)
    writeMeta(meta, idx, GPULSE_ROLE.CORE, 0, angle, r, Math.random() * Math.PI * 2, 0.08)
    idx++
  }
  return idx
}

function fillNodes(out: Float32Array, meta: Float32Array, idx: number, n: number): number {
  const perNode = Math.max(1, Math.floor(n / GPULSE_NODE_COUNT))
  for (let node = 0; node < GPULSE_NODE_COUNT && idx < out.length / 3; node++) {
    for (let j = 0; j < perNode; j++) {
      const [x, y, z] = nodeOrbit(node)
      write(out, idx, x, y, z, 0.012)
      writeMeta(meta, idx, GPULSE_ROLE.NODE, node, j / perNode, 0, Math.random() * Math.PI * 2, 0.12 + node * 0.018)
      idx++
    }
  }
  return idx
}

function fillStreamIn(out: Float32Array, meta: Float32Array, idx: number, n: number): number {
  for (let i = 0; i < n; i++) {
    const node = i % GPULSE_NODE_COUNT
    const h = Math.random()
    const [x, y, z] = streamInPoint(node, h)
    write(out, idx, x, y, z, 0.006)
    writeMeta(meta, idx, GPULSE_ROLE.STREAM_IN, node, h, 0, Math.random() * Math.PI * 2, 0.35 + (i % 5) * 0.04)
    idx++
  }
  return idx
}

function fillStreamOut(out: Float32Array, meta: Float32Array, idx: number, n: number): number {
  for (let i = 0; i < n; i++) {
    const stream = i % 8
    const h = Math.random()
    const [x, y, z] = streamOutPoint(stream, h)
    write(out, idx, x, y, z, 0.006)
    writeMeta(meta, idx, GPULSE_ROLE.STREAM_OUT, stream, h, 0, Math.random() * Math.PI * 2, 0.42 + (i % 4) * 0.05)
    idx++
  }
  return idx
}

function fillRadar(out: Float32Array, meta: Float32Array, idx: number, n: number): number {
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * Math.PI * 2
    const r = 0.2 + (i % 7) * 0.1
    const [x, y, z] = radarPoint(angle, r)
    write(out, idx, x, y, z, 0.005)
    writeMeta(meta, idx, GPULSE_ROLE.RADAR, 0, angle, r, Math.random() * Math.PI * 2, 0.18)
    idx++
  }
  return idx
}

function fillField(out: Float32Array, meta: Float32Array, idx: number, n: number): number {
  for (let i = 0; i < n; i++) {
    const [x, y, z] = fieldPoint()
    write(out, idx, x, y, z, 0.014)
    writeMeta(meta, idx, GPULSE_ROLE.FIELD, i % 3, Math.random(), 0, Math.random() * Math.PI * 2, 0.06)
    idx++
  }
  return idx
}

export function buildGpulseSignalWaves(count: number): {
  positions: Float32Array
  meta: Float32Array
} {
  const out = new Float32Array(count * 3)
  const meta = new Float32Array(count * META_STRIDE)
  let idx = 0

  const nCore = Math.floor(count * 0.08)
  const nRing = Math.floor(count * 0.28)
  const nNode = Math.floor(count * 0.18)
  const nStreamIn = Math.floor(count * 0.22)
  const nStreamOut = Math.floor(count * 0.12)
  const nRadar = Math.floor(count * 0.08)
  const nField = count - nCore - nRing - nNode - nStreamIn - nStreamOut - nRadar

  idx = fillCore(out, meta, idx, nCore)
  const perRing = Math.floor(nRing / 3)
  idx = fillRing(out, meta, idx, 0, perRing)
  idx = fillRing(out, meta, idx, 1, perRing)
  idx = fillRing(out, meta, idx, 2, nRing - perRing * 2)
  idx = fillNodes(out, meta, idx, nNode)
  idx = fillStreamIn(out, meta, idx, nStreamIn)
  idx = fillStreamOut(out, meta, idx, nStreamOut)
  idx = fillRadar(out, meta, idx, nRadar)
  idx = fillField(out, meta, idx, nField)

  while (idx < count) {
    idx = fillField(out, meta, idx, 1)
  }

  return { positions: out, meta }
}

export function genGpulseSignalWaves(count: number): Float32Array {
  const { positions, meta } = buildGpulseSignalWaves(count)
  cachedGpulseMeta = meta
  return positions
}

export function getGpulseWaveMeta(): Float32Array | null {
  return cachedGpulseMeta
}

export function scatterGpulseFromLeft(count: number): Float32Array {
  const scatter = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const bi = i * 3
    const angle = Math.random() * Math.PI * 2
    const r = 0.55 + Math.random() * 0.65
    scatter[bi] = Math.cos(angle) * r
    scatter[bi + 1] = Math.sin(angle) * r * 0.88
    scatter[bi + 2] = (Math.random() - 0.5) * 0.35
  }
  return scatter
}

export function gpulseNodeActivation(t: number, node: number): number {
  const cycle = GPULSE_SIGNAL_PULSE_S * 2.4
  const offset = (node / GPULSE_NODE_COUNT) * cycle
  const local = ((t + offset) % cycle) / cycle
  return Math.max(0, 1 - Math.abs(local - 0.12) * 6) ** 2
}

export function gpulseBurstStrength(t: number, phase: number): number {
  const cycle = GPULSE_SIGNAL_PULSE_S
  const local = ((t + phase * 0.28) % cycle) / cycle
  return Math.max(0, 1 - Math.abs(local - 0.22) * 4.2) ** 2.4
}

export function gpulseSparkFlash(t: number, phase: number): number {
  return Math.max(0, Math.sin(t * 4.2 + phase * 2.4) ** 3.2)
}

export function gpulseTravelPhase(t: number, phase: number, speed: number): number {
  return ((t / GPULSE_LOOP_DURATION) * (0.75 + speed * 0.2) + phase * 0.018) % 1
}

export function computeGpulseWavePosition(
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

  const burst = gpulseBurstStrength(t, phase)
  const travel = gpulseTravelPhase(t, phase, speed)

  if (role === GPULSE_ROLE.CORE) {
    const pulse = burst * 0.06 * motion
    const [x, y, z] = corePoint(param + t * 0.08, aux + pulse * 0.3)
    return [x, y, z + burst * 0.015 * motion]
  }

  if (role === GPULSE_ROLE.RING) {
    const wobble = organicWobble(slot, param, t)
    const r = ringRadius(slot) * aux + wobble
    const squash = 0.82 + slot * 0.04
    const spin = param + t * (0.015 + slot * 0.004)
    const drift = Math.sin(t * 0.5 + phase) * 0.003 * motion
    return [
      CX + Math.cos(spin) * r + drift,
      Math.sin(spin) * r * squash + drift * 0.5,
      Math.sin(spin * 2 + slot) * 0.015 * SCALE + burst * 0.008,
    ]
  }

  if (role === GPULSE_ROLE.NODE) {
    const [bx, by, bz] = nodeOrbit(slot)
    const active = gpulseNodeActivation(t, slot)
    const pulse = active * 0.022 * motion
    const flash = gpulseSparkFlash(t, phase) * 0.008 * motion
    return [bx + pulse, by + pulse * 0.6, bz + flash + active * 0.012]
  }

  if (role === GPULSE_ROLE.STREAM_IN) {
    const active = gpulseNodeActivation(t, slot)
    const h = (param + travel * active * 0.85) % 1
    const [x, y, z] = streamInPoint(slot, h)
    return [x, y, z + active * 0.01]
  }

  if (role === GPULSE_ROLE.STREAM_OUT) {
    const h = (param + travel * (0.35 + burst * 0.4)) % 1
    const [x, y, z] = streamOutPoint(slot, h)
    return [x, y, z + burst * 0.012]
  }

  if (role === GPULSE_ROLE.RADAR) {
    const sweep = (t * 0.42 + phase * 0.05) % (Math.PI * 2)
    const angle = param + sweep * 0.15
    const [x, y, z] = radarPoint(angle, aux + burst * 0.08)
    return [x, y, z]
  }

  const [fx, fy, fz] = fieldPoint()
  const breathe = Math.sin(t * 0.28 + phase) * 0.006 * motion
  return [fx + breathe, fy + breathe * 0.5, fz]
}

function colorForRole(role: number, slot: number): Rgb {
  const r = Math.random()
  if (role === GPULSE_ROLE.CORE) {
    if (r < 0.55) return FUCHSIA
    return PURPLE
  }
  if (role === GPULSE_ROLE.RING) {
    if (slot === 0) return CYAN
    if (slot === 1) return PURPLE
    return FUCHSIA
  }
  if (role === GPULSE_ROLE.NODE) {
    if (r < 0.5) return CYAN
    if (r < 0.78) return PURPLE
    return FUCHSIA
  }
  if (role === GPULSE_ROLE.STREAM_IN) return CYAN
  if (role === GPULSE_ROLE.STREAM_OUT) return FUCHSIA
  if (role === GPULSE_ROLE.RADAR) {
    if (r < 0.4) return PURPLE
    if (r < 0.72) return FUCHSIA
    return CYAN
  }
  if (r < 0.4) return PURPLE
  if (r < 0.7) return CYAN
  return FUCHSIA
}

export function buildGpulseWaveColors(count: number, meta: Float32Array): Float32Array {
  const colors = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const role = meta[i * META_STRIDE]
    const slot = meta[i * META_STRIDE + 1]
    const c = colorForRole(role, slot)
    const dim =
      role === GPULSE_ROLE.CORE
        ? 1.08 + Math.random() * 0.1
        : role === GPULSE_ROLE.NODE
          ? 1.02 + Math.random() * 0.12
          : role === GPULSE_ROLE.STREAM_IN || role === GPULSE_ROLE.STREAM_OUT
            ? 0.95 + Math.random() * 0.1
            : role === GPULSE_ROLE.FIELD
              ? 0.62 + Math.random() * 0.12
              : 0.82 + Math.random() * 0.14
    colors[i * 3] = Math.min(1, c[0] * dim)
    colors[i * 3 + 1] = Math.min(1, c[1] * dim)
    colors[i * 3 + 2] = Math.min(1, c[2] * dim)
  }
  return colors
}

export const GPULSE_META_STRIDE = META_STRIDE
