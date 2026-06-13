/**
 * Phase 14.0 — Genesis Technology Stack (WebGL star dust, sección 11).
 */
import {
  TECH_STACK_FLOWS,
  TECH_STACK_LAYERS,
  TECH_STACK_PULSE_S,
  techLayerPlatePoint,
  techLayerPosition,
} from '@/lib/technology/techStackLayout'

type Rgb = readonly [number, number, number]

export const TECHNOLOGY_SECTION_INDEX = 11
export const TECHNOLOGY_FORM_DURATION = 1.1

export const TECHNOLOGY_ROLE = {
  LAYER: 0,
  FLOW: 1,
  PULSE: 2,
  SPINE: 3,
  FIELD: 4,
} as const

const META_STRIDE = 6
const SCALE = 1.55
const CX = 0

const CYAN: Rgb = [0, 0.961, 1]
const PURPLE: Rgb = [0.616, 0.302, 1]
const FUCHSIA: Rgb = [1, 0, 0.784]
const ION: Rgb = [0.239, 0.545, 1]

let cachedTechnologyMeta: Float32Array | null = null

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
  const z = (layer - 2) * 0.03 * SCALE + Math.sin(nx * 0.06) * 0.01 * SCALE
  return [CX + x, y, z]
}

function layerWorld(layerIndex: number, t: number): [number, number, number] {
  const { x, y } = techLayerPlatePoint(layerIndex, t)
  return toWorld(x, y, layerIndex)
}

function flowPoint(flowIndex: number, h: number): [number, number, number] {
  const flow = TECH_STACK_FLOWS[flowIndex % TECH_STACK_FLOWS.length]
  if (!flow) return [CX, 0, 0]
  const a = techLayerPosition(flow.fromLayer)
  const b = techLayerPosition(flow.toLayer)
  const startY = a.y + 2.2
  const endY = b.y - 2.2
  const t = Math.max(0, Math.min(1, h))
  const mx = a.x + 3
  const my = (startY + endY) / 2
  const x = (1 - t) ** 2 * a.x + 2 * (1 - t) * t * mx + t ** 2 * b.x
  const y = (1 - t) ** 2 * startY + 2 * (1 - t) * t * my + t ** 2 * endY
  return toWorld(x, y, 1 + Math.sin(t * Math.PI) * 0.25)
}

function spinePoint(h: number): [number, number, number] {
  const top = techLayerPosition(0)
  const bottom = techLayerPosition(TECH_STACK_LAYERS.length - 1)
  const y = top.y + 2 + (bottom.y - top.y - 4) * h
  return toWorld(50, y, 0.5 + Math.sin(h * Math.PI * 2) * 0.08)
}

function fieldPoint(): [number, number, number] {
  const angle = Math.random() * Math.PI * 2
  const r = (0.1 + Math.random() * 0.35) * SCALE
  return [CX + Math.cos(angle) * r, Math.sin(angle) * r * 0.75, (Math.random() - 0.5) * 0.04 * SCALE]
}

function fillLayers(out: Float32Array, meta: Float32Array, idx: number, n: number): number {
  const perLayer = Math.max(4, Math.floor(n / TECH_STACK_LAYERS.length))
  for (let l = 0; l < TECH_STACK_LAYERS.length && idx < out.length / 3; l++) {
    for (let j = 0; j < perLayer; j++) {
      const t = j / perLayer
      const [x, y, z] = layerWorld(l, t)
      write(out, idx, x, y, z, 0.009)
      writeMeta(meta, idx, TECHNOLOGY_ROLE.LAYER, l, t, j / perLayer, Math.random() * Math.PI * 2, 0.12 + l * 0.02)
      idx++
    }
  }
  return idx
}

function fillFlows(out: Float32Array, meta: Float32Array, idx: number, n: number): number {
  for (let i = 0; i < n; i++) {
    const flow = i % TECH_STACK_FLOWS.length
    const h = Math.random()
    const [x, y, z] = flowPoint(flow, h)
    write(out, idx, x, y, z, 0.006)
    writeMeta(meta, idx, TECHNOLOGY_ROLE.FLOW, flow, h, 0, Math.random() * Math.PI * 2, 0.28 + (i % 4) * 0.04)
    idx++
  }
  return idx
}

function fillPulses(out: Float32Array, meta: Float32Array, idx: number, n: number): number {
  for (let i = 0; i < n; i++) {
    const flow = i % TECH_STACK_FLOWS.length
    const h = Math.random()
    const [x, y, z] = flowPoint(flow, h)
    write(out, idx, x, y, z, 0.005)
    writeMeta(meta, idx, TECHNOLOGY_ROLE.PULSE, flow, h, i % 3, Math.random() * Math.PI * 2, 0.36 + (i % 3) * 0.05)
    idx++
  }
  return idx
}

function fillSpine(out: Float32Array, meta: Float32Array, idx: number, n: number): number {
  for (let i = 0; i < n; i++) {
    const h = i / n
    const [x, y, z] = spinePoint(h)
    write(out, idx, x, y, z, 0.007)
    writeMeta(meta, idx, TECHNOLOGY_ROLE.SPINE, 0, h, 0, Math.random() * Math.PI * 2, 0.08)
    idx++
  }
  return idx
}

function fillField(out: Float32Array, meta: Float32Array, idx: number, n: number): number {
  for (let i = 0; i < n; i++) {
    const [x, y, z] = fieldPoint()
    write(out, idx, x, y, z, 0.014)
    writeMeta(meta, idx, TECHNOLOGY_ROLE.FIELD, i % 3, Math.random(), 0, Math.random() * Math.PI * 2, 0.05)
    idx++
  }
  return idx
}

export function buildTechnologyStackNetwork(count: number): { positions: Float32Array; meta: Float32Array } {
  const out = new Float32Array(count * 3)
  const meta = new Float32Array(count * META_STRIDE)
  let idx = 0

  const nLayer = Math.floor(count * 0.38)
  const nFlow = Math.floor(count * 0.18)
  const nPulse = Math.floor(count * 0.16)
  const nSpine = Math.floor(count * 0.1)
  const nField = count - nLayer - nFlow - nPulse - nSpine

  idx = fillLayers(out, meta, idx, nLayer)
  idx = fillFlows(out, meta, idx, nFlow)
  idx = fillPulses(out, meta, idx, nPulse)
  idx = fillSpine(out, meta, idx, nSpine)
  idx = fillField(out, meta, idx, nField)

  while (idx < count) {
    idx = fillField(out, meta, idx, 1)
  }

  return { positions: out, meta }
}

export function genTechnologyStackNetwork(count: number): Float32Array {
  const { positions, meta } = buildTechnologyStackNetwork(count)
  cachedTechnologyMeta = meta
  return positions
}

/** @deprecated — use genTechnologyStackNetwork */
export function genTechCircuit(count: number): Float32Array {
  return genTechnologyStackNetwork(count)
}

export function getTechnologyStackMeta(): Float32Array | null {
  return cachedTechnologyMeta
}

export function scatterTechnologyExterior(count: number): Float32Array {
  const scatter = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const bi = i * 3
    scatter[bi] = 0.2 + Math.random() * 0.75
    scatter[bi + 1] = (Math.random() - 0.5) * 2.2
    scatter[bi + 2] = (Math.random() - 0.5) * 0.35
  }
  return scatter
}

export function technologyStackPulse(t: number, phase: number): number {
  const cycle = TECH_STACK_PULSE_S
  const local = ((t + phase * 0.3) % cycle) / cycle
  return 0.5 + 0.5 * Math.sin(local * Math.PI * 2) ** 1.3
}

export function technologyFlowTravel(t: number, flowIndex: number, speed: number): number {
  const flow = TECH_STACK_FLOWS[flowIndex % TECH_STACK_FLOWS.length]
  if (!flow) return 0
  return ((t / flow.duration) * (0.85 + speed * 0.2) + flow.delay * 0.12) % 1
}

export function technologyLayerActivation(formT: number, layer: number): number {
  return Math.min(1, Math.max(0, (formT - layer * 0.1) / 0.28))
}

export function technologyFlowActivation(formT: number): number {
  return Math.min(1, Math.max(0, (formT - 0.35) / 0.32))
}

export function computeTechnologyStackPosition(
  meta: Float32Array,
  i: number,
  t: number,
  motion: number
): [number, number, number] {
  const mi = i * META_STRIDE
  const role = meta[mi]
  const slot = meta[mi + 1]
  const param = meta[mi + 2]
  const phase = meta[mi + 4]
  const speed = meta[mi + 5]
  const pulse = technologyStackPulse(t, phase)
  const breathe = Math.sin(t * 0.15 + phase) * 0.004 * SCALE * motion

  if (role === TECHNOLOGY_ROLE.LAYER) {
    const [x, y, z] = layerWorld(slot, param)
    const drift = Math.sin(t * 0.24 + slot + param * 4) * 0.003 * SCALE * motion
    return [x + drift, y + breathe, z]
  }

  if (role === TECHNOLOGY_ROLE.SPINE) {
    const [x, y, z] = spinePoint(param + pulse * 0.02 * motion)
    return [x, y + breathe * 0.4, z]
  }

  if (role === TECHNOLOGY_ROLE.FLOW || role === TECHNOLOGY_ROLE.PULSE) {
    const travel = technologyFlowTravel(t, slot, speed)
    const h = role === TECHNOLOGY_ROLE.PULSE ? travel : (param + travel * 0.4) % 1
    const [x, y, z] = flowPoint(slot, h)
    return [x, y, z + pulse * 0.01]
  }

  const [fx, fy, fz] = fieldPoint()
  return [fx + breathe, fy + breathe * 0.5, fz]
}

function colorForRole(role: number, slot: number): Rgb {
  const r = Math.random()
  if (role === TECHNOLOGY_ROLE.LAYER) {
    const mod = slot % 5
    if (mod === 0) return PURPLE
    if (mod === 1) return ION
    if (mod === 2) return FUCHSIA
    if (mod === 3) return PURPLE
    return CYAN
  }
  if (role === TECHNOLOGY_ROLE.PULSE || role === TECHNOLOGY_ROLE.FLOW) {
    if (r < 0.55) return CYAN
    return PURPLE
  }
  if (role === TECHNOLOGY_ROLE.SPINE) return FUCHSIA
  if (r < 0.4) return PURPLE
  if (r < 0.7) return CYAN
  return FUCHSIA
}

export function buildTechnologyStackColors(count: number, meta: Float32Array): Float32Array {
  const colors = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const role = meta[i * META_STRIDE]
    const slot = meta[i * META_STRIDE + 1]
    const c = colorForRole(role, slot)
    const dim =
      role === TECHNOLOGY_ROLE.LAYER
        ? 0.94 + Math.random() * 0.12
        : role === TECHNOLOGY_ROLE.PULSE
          ? 1.04 + Math.random() * 0.1
          : role === TECHNOLOGY_ROLE.FIELD
            ? 0.55 + Math.random() * 0.12
            : 0.86 + Math.random() * 0.12
    colors[i * 3] = Math.min(1, c[0] * dim)
    colors[i * 3 + 1] = Math.min(1, c[1] * dim)
    colors[i * 3 + 2] = Math.min(1, c[2] * dim)
  }
  return colors
}

export const TECHNOLOGY_META_STRIDE = META_STRIDE
