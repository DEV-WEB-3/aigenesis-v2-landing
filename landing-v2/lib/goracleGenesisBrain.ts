import { llegadaDe } from '@/lib/design/motion'

/**
 * Phase 11.0 — G-Oracle Quantum Brain (WebGL star dust, sección 8).
 */
import {
  ORACLE_ECOSYSTEM_SATELLITES,
  ORACLE_INFERENCE_PULSE_S,
  ORACLE_NEURAL_NODE_COUNT,
  neuralNodePosition,
} from '@/lib/goracle/quantumBrainLayout'

type Rgb = readonly [number, number, number]

export const GORACLE_SECTION_INDEX = 8
export const GORACLE_FORM_DURATION = llegadaDe('goracle')
export const GORACLE_CORE_PULSE_CYCLE = ORACLE_INFERENCE_PULSE_S

export const GORACLE_ROLE = {
  CORE: 0,
  NEURAL: 1,
  SYNAPSE: 2,
  STREAM_IN: 3,
  STREAM_OUT: 4,
  LAYER: 5,
  FIELD: 6,
} as const

const META_STRIDE = 6
const SCALE = 1.62
const CX = 0

const CYAN: Rgb = [0, 0.961, 1]
const PURPLE: Rgb = [0.616, 0.302, 1]
const FUCHSIA: Rgb = [1, 0, 0.784]

let cachedGoracleMeta: Float32Array | null = null

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

function toWorld(nx: number, ny: number, layer: number): [number, number, number] {
  const x = (nx - 50) * 0.018 * SCALE
  const y = -(ny - 50) * 0.018 * SCALE
  const z = (layer - 1) * 0.035 * SCALE + Math.sin(nx * 0.08 + ny * 0.06) * 0.012 * SCALE
  return [CX + x, y, z]
}

function neuralWorld(node: number): [number, number, number] {
  const { x, y, layer } = neuralNodePosition(node % ORACLE_NEURAL_NODE_COUNT)
  return toWorld(x, y, layer)
}

function satelliteWorld(satellite: number): [number, number, number] {
  const sat = ORACLE_ECOSYSTEM_SATELLITES[satellite % ORACLE_ECOSYSTEM_SATELLITES.length]
  if (!sat) return [0, 0, 0]
  return toWorld(sat.x, sat.y, 0)
}

function streamInPoint(satellite: number, h: number): [number, number, number] {
  const [sx, sy, sz] = satelliteWorld(satellite)
  const t = Math.max(0, Math.min(1, h))
  const mx = sx * (1 - t) * 0.45
  const my = sy * (1 - t) * 0.45 + Math.sin(t * Math.PI) * 0.04 * SCALE
  const x = sx + (CX - sx) * t * 0.92 + mx * t * 0.08
  const y = sy + (0 - sy) * t * 0.92 + my * 0.06
  const z = sz * (1 - t) + 0.015 * SCALE * t
  return [x, y, z]
}

function streamOutPoint(stream: number, h: number): [number, number, number] {
  const angle = ((stream * 53 + 17) % 360) * (Math.PI / 180)
  const ex = CX + Math.cos(angle) * 0.32 * SCALE
  const ey = Math.sin(angle) * 0.26 * SCALE
  const t = Math.max(0, Math.min(1, h))
  const mx = (CX + ex) / 2 + Math.sin(angle) * 0.04 * SCALE
  const my = (ey) / 2 - Math.cos(angle) * 0.03 * SCALE
  const x = (1 - t) ** 2 * CX + 2 * (1 - t) * t * mx + t ** 2 * ex
  const y = (1 - t) ** 2 * 0 + 2 * (1 - t) * t * my + t ** 2 * ey
  return [x, y, Math.sin(angle * 2) * 0.02 * SCALE * t]
}

function synapsePoint(from: number, to: number, h: number): [number, number, number] {
  const [ax, ay, az] = neuralWorld(from)
  const [bx, by, bz] = neuralWorld(to)
  const t = Math.max(0, Math.min(1, h))
  const mx = (ax + bx) / 2 + (by - ay) * 0.04 * SCALE
  const my = (ay + by) / 2 + (ax - bx) * 0.03 * SCALE
  const x = (1 - t) ** 2 * ax + 2 * (1 - t) * t * mx + t ** 2 * bx
  const y = (1 - t) ** 2 * ay + 2 * (1 - t) * t * my + t ** 2 * by
  const z = az + (bz - az) * t
  return [x, y, z]
}

function layerCloudPoint(layer: number, angle: number, radiusT: number): [number, number, number] {
  const layerScales = [0.52, 0.68, 0.84]
  const r = (0.14 + radiusT * 0.22) * (layerScales[layer] ?? 0.68) * SCALE
  const wobble = Math.sin(angle * 3 + layer) * 0.015 * SCALE
  const squash = 0.78 + layer * 0.06
  return [CX + Math.cos(angle) * (r + wobble), Math.sin(angle) * r * squash, (layer - 1) * 0.04 * SCALE]
}

function corePoint(angle: number, radiusT: number): [number, number, number] {
  const r = (0.05 + radiusT * 0.09) * SCALE
  return [CX + Math.cos(angle) * r, Math.sin(angle) * r * 0.88, Math.sin(angle * 2.2) * 0.014 * SCALE]
}

function fieldPoint(): [number, number, number] {
  const angle = Math.random() * Math.PI * 2
  const r = (0.1 + Math.random() * 0.42) * SCALE
  return [CX + Math.cos(angle) * r, Math.sin(angle) * r * 0.82, (Math.random() - 0.5) * 0.05 * SCALE]
}

function fillCore(out: Float32Array, meta: Float32Array, idx: number, n: number): number {
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * Math.PI * 2 + Math.random() * 0.12
    const r = 0.25 + Math.random() * 0.7
    const [x, y, z] = corePoint(angle, r)
    write(out, idx, x, y, z, 0.007)
    writeMeta(meta, idx, GORACLE_ROLE.CORE, 0, r, angle, Math.random() * Math.PI * 2, 0.1)
    idx++
  }
  return idx
}

function fillNeural(out: Float32Array, meta: Float32Array, idx: number, n: number): number {
  const perNode = Math.max(1, Math.floor(n / ORACLE_NEURAL_NODE_COUNT))
  for (let node = 0; node < ORACLE_NEURAL_NODE_COUNT && idx < out.length / 3; node++) {
    for (let j = 0; j < perNode; j++) {
      const [x, y, z] = neuralWorld(node)
      write(out, idx, x, y, z, 0.011)
      writeMeta(meta, idx, GORACLE_ROLE.NEURAL, node, j / perNode, node % 3, Math.random() * Math.PI * 2, 0.14 + (node % 7) * 0.012)
      idx++
    }
  }
  return idx
}

function fillSynapses(out: Float32Array, meta: Float32Array, idx: number, n: number): number {
  for (let i = 0; i < n; i++) {
    const from = i % ORACLE_NEURAL_NODE_COUNT
    const to = (from + 3 + (i % 11)) % ORACLE_NEURAL_NODE_COUNT
    const h = Math.random()
    const [x, y, z] = synapsePoint(from, to, h)
    write(out, idx, x, y, z, 0.006)
    writeMeta(meta, idx, GORACLE_ROLE.SYNAPSE, from, to, h, Math.random() * Math.PI * 2, 0.28 + (i % 6) * 0.04)
    idx++
  }
  return idx
}

function fillStreamIn(out: Float32Array, meta: Float32Array, idx: number, n: number): number {
  for (let i = 0; i < n; i++) {
    const sat = i % ORACLE_ECOSYSTEM_SATELLITES.length
    const h = Math.random()
    const [x, y, z] = streamInPoint(sat, h)
    write(out, idx, x, y, z, 0.006)
    writeMeta(meta, idx, GORACLE_ROLE.STREAM_IN, sat, h, 0, Math.random() * Math.PI * 2, 0.32 + (i % 4) * 0.05)
    idx++
  }
  return idx
}

function fillStreamOut(out: Float32Array, meta: Float32Array, idx: number, n: number): number {
  for (let i = 0; i < n; i++) {
    const stream = i % 10
    const h = Math.random()
    const [x, y, z] = streamOutPoint(stream, h)
    write(out, idx, x, y, z, 0.006)
    writeMeta(meta, idx, GORACLE_ROLE.STREAM_OUT, stream, h, 0, Math.random() * Math.PI * 2, 0.38 + (i % 5) * 0.04)
    idx++
  }
  return idx
}

function fillLayers(out: Float32Array, meta: Float32Array, idx: number, n: number): number {
  const perLayer = Math.floor(n / 3)
  for (let layer = 0; layer < 3; layer++) {
    const count = layer === 2 ? n - perLayer * 2 : perLayer
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.05
      const r = 0.65 + Math.random() * 0.3
      const [x, y, z] = layerCloudPoint(layer, angle, r)
      write(out, idx, x, y, z, 0.009)
      writeMeta(meta, idx, GORACLE_ROLE.LAYER, layer, angle, r, Math.random() * Math.PI * 2, 0.06 + layer * 0.01)
      idx++
    }
  }
  return idx
}

function fillField(out: Float32Array, meta: Float32Array, idx: number, n: number): number {
  for (let i = 0; i < n; i++) {
    const [x, y, z] = fieldPoint()
    write(out, idx, x, y, z, 0.014)
    writeMeta(meta, idx, GORACLE_ROLE.FIELD, i % 3, Math.random(), 0, Math.random() * Math.PI * 2, 0.05)
    idx++
  }
  return idx
}

export function buildGoracleGenesisBrain(count: number): {
  positions: Float32Array
  meta: Float32Array
} {
  const out = new Float32Array(count * 3)
  const meta = new Float32Array(count * META_STRIDE)
  let idx = 0

  const nCore = Math.floor(count * 0.08)
  const nNeural = Math.floor(count * 0.32)
  const nSynapse = Math.floor(count * 0.18)
  const nStreamIn = Math.floor(count * 0.14)
  const nStreamOut = Math.floor(count * 0.1)
  const nLayer = Math.floor(count * 0.12)
  const nField = count - nCore - nNeural - nSynapse - nStreamIn - nStreamOut - nLayer

  idx = fillCore(out, meta, idx, nCore)
  idx = fillNeural(out, meta, idx, nNeural)
  idx = fillSynapses(out, meta, idx, nSynapse)
  idx = fillStreamIn(out, meta, idx, nStreamIn)
  idx = fillStreamOut(out, meta, idx, nStreamOut)
  idx = fillLayers(out, meta, idx, nLayer)
  idx = fillField(out, meta, idx, nField)

  while (idx < count) {
    idx = fillField(out, meta, idx, 1)
  }

  return { positions: out, meta }
}

export function genGoracleGenesisBrain(count: number): Float32Array {
  const { positions, meta } = buildGoracleGenesisBrain(count)
  cachedGoracleMeta = meta
  return positions
}

export function getGoracleBrainMeta(): Float32Array | null {
  return cachedGoracleMeta
}

export function scatterGoracleDispersed(count: number): Float32Array {
  const scatter = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const bi = i * 3
    const angle = Math.random() * Math.PI * 2
    const r = 0.75 + Math.random() * 0.85
    scatter[bi] = Math.cos(angle) * r
    scatter[bi + 1] = Math.sin(angle) * r * 0.88
    scatter[bi + 2] = (Math.random() - 0.5) * 0.45
  }
  return scatter
}

export function goracleInferencePhase(t: number, phase: number): number {
  const cycle = GORACLE_CORE_PULSE_CYCLE
  return ((t + phase * 0.35) % cycle) / cycle
}

export function goracleInferenceStrength(t: number, phase: number): number {
  const local = goracleInferencePhase(t, phase)
  if (local < 0.15) return local / 0.15
  if (local < 0.45) return 1
  if (local < 0.65) return 1 - (local - 0.45) / 0.2 * 0.35
  if (local < 0.85) return 0.65 + ((local - 0.65) / 0.2) * 0.35
  return 1 - (local - 0.85) / 0.15
}

export function goracleNeuralPulse(t: number, phase: number, speed: number): number {
  const wave = (t * (0.22 + speed * 0.08) + phase * 0.12) % 1
  return Math.max(0, 1 - Math.abs(wave - 0.42) * 3.8) ** 2.2
}

export function goracleCorePulse(t: number, phase: number): number {
  return goracleInferenceStrength(t, phase)
}

export function goracleLayerActivation(formT: number, layer: number): number {
  const start = layer * 0.12
  return Math.min(1, Math.max(0, (formT - start) / 0.38))
}

export function goracleNeuralActivation(formT: number): number {
  return Math.min(1, Math.max(0, (formT - 0.22) / 0.35))
}

export function goracleSynapseActivation(formT: number): number {
  return Math.min(1, Math.max(0, (formT - 0.42) / 0.32))
}

export function goracleCoreActivation(formT: number): number {
  return Math.min(1, Math.max(0, (formT - 0.55) / 0.28))
}

export function goracleStreamActivation(formT: number): number {
  return Math.min(1, Math.max(0, (formT - 0.68) / 0.26))
}

/** @deprecated — maps to layer activation */
export function goracleHemiActivation(formT: number): number {
  return goracleLayerActivation(formT, 0)
}

/** @deprecated — maps to neural activation */
export function goracleStructureActivation(formT: number): number {
  return goracleNeuralActivation(formT)
}

export function computeGoracleBrainPosition(
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
  const breathe = Math.sin(t * 0.18 + phase) * 0.004 * SCALE * motion
  const inference = goracleInferenceStrength(t, phase)

  if (role === GORACLE_ROLE.CORE) {
    const pulse = inference * 0.08 * motion
    const [x, y, z] = corePoint(aux, param + pulse * 0.25)
    return [x, y, z + inference * 0.018 * motion]
  }

  if (role === GORACLE_ROLE.NEURAL) {
    const [x, y, z] = neuralWorld(slot)
    const flicker = goracleNeuralPulse(t, phase, speed) * 0.012 * SCALE * motion
    const drift = Math.sin(t * 0.32 + slot * 0.1) * 0.003 * SCALE * motion
    return [x + flicker + drift, y + breathe, z + flicker * 0.5]
  }

  if (role === GORACLE_ROLE.SYNAPSE) {
    const from = slot
    const to = Math.floor(param) % ORACLE_NEURAL_NODE_COUNT
    const pulse = goracleNeuralPulse(t, phase, speed)
    const h = (aux + pulse * 0.35 + t * 0.02 * speed) % 1
    const [x, y, z] = synapsePoint(from, to, h)
    return [x, y + breathe * 0.4, z]
  }

  if (role === GORACLE_ROLE.STREAM_IN) {
    const active = goracleInferencePhase(t, phase) < 0.2 ? 1 : 0.35 + inference * 0.45
    const h = (param + t * 0.015 * speed * active) % 1
    const [x, y, z] = streamInPoint(slot, h)
    return [x, y, z]
  }

  if (role === GORACLE_ROLE.STREAM_OUT) {
    const h = (param + t * 0.012 * speed * (0.4 + inference * 0.5)) % 1
    const [x, y, z] = streamOutPoint(slot, h)
    return [x, y, z + inference * 0.01]
  }

  if (role === GORACLE_ROLE.LAYER) {
    const wobble = Math.sin(param + t * 0.15) * 0.012 * SCALE
    const [x, y, z] = layerCloudPoint(slot, param + t * 0.008, aux)
    return [x + wobble, y + breathe * 0.6, z]
  }

  const [fx, fy, fz] = fieldPoint()
  return [fx + breathe, fy + breathe * 0.5, fz]
}

function colorForRole(role: number, slot: number): Rgb {
  const r = Math.random()
  if (role === GORACLE_ROLE.CORE) {
    if (r < 0.55) return FUCHSIA
    return PURPLE
  }
  if (role === GORACLE_ROLE.STREAM_IN) return CYAN
  if (role === GORACLE_ROLE.STREAM_OUT) return FUCHSIA
  if (role === GORACLE_ROLE.SYNAPSE) {
    if (r < 0.45) return PURPLE
    if (r < 0.75) return CYAN
    return FUCHSIA
  }
  if (role === GORACLE_ROLE.LAYER) {
    if (slot === 0) return CYAN
    if (slot === 1) return PURPLE
    return FUCHSIA
  }
  if (role === GORACLE_ROLE.NEURAL) {
    if (r < 0.38) return PURPLE
    if (r < 0.72) return CYAN
    return FUCHSIA
  }
  if (r < 0.4) return PURPLE
  if (r < 0.7) return CYAN
  return FUCHSIA
}

export function buildGoracleBrainColors(count: number, meta: Float32Array): Float32Array {
  const colors = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const role = meta[i * META_STRIDE]
    const slot = meta[i * META_STRIDE + 1]
    const c = colorForRole(role, slot)
    const dim =
      role === GORACLE_ROLE.CORE
        ? 1.1 + Math.random() * 0.12
        : role === GORACLE_ROLE.NEURAL || role === GORACLE_ROLE.SYNAPSE
          ? 0.9 + Math.random() * 0.12
          : role === GORACLE_ROLE.STREAM_IN || role === GORACLE_ROLE.STREAM_OUT
            ? 0.94 + Math.random() * 0.1
            : role === GORACLE_ROLE.FIELD
              ? 0.58 + Math.random() * 0.12
              : 0.8 + Math.random() * 0.14
    colors[i * 3] = Math.min(1, c[0] * dim)
    colors[i * 3 + 1] = Math.min(1, c[1] * dim)
    colors[i * 3 + 2] = Math.min(1, c[2] * dim)
  }
  return colors
}

export const GORACLE_META_STRIDE = META_STRIDE
