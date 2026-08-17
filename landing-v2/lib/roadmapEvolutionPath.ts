import { llegadaDe } from '@/lib/design/motion'

/**
 * Phase 15.0 — Genesis Evolution Path (WebGL star dust, sección 12).
 */
import {
  ROADMAP_EVOLUTION_MILESTONES,
  ROADMAP_EVOLUTION_PULSE_S,
  ROADMAP_MILESTONE_COUNT,
  evolutionPathPoint,
  roadmapMilestonePosition,
} from '@/lib/roadmap/evolutionPathLayout'

type Rgb = readonly [number, number, number]

export const ROADMAP_SECTION_INDEX = 12
export const ROADMAP_LOOP_DURATION = ROADMAP_EVOLUTION_PULSE_S
export const ROADMAP_FORM_DURATION = llegadaDe('roadmap')

export const ROADMAP_ROLE = {
  PATH: 0,
  NODE: 1,
  HALO: 2,
  PULSE: 3,
  STARDUST: 4,
} as const

const META_STRIDE = 6
const SCALE = 1.52
const CX = 0

const PURPLE: Rgb = [0.616, 0.302, 1]
const FUCHSIA: Rgb = [1, 0, 0.784]
const CYAN: Rgb = [0, 0.961, 1]

let cachedRoadmapMeta: Float32Array | null = null

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
  const z = layer * 0.025 * SCALE + Math.sin(nx * 0.05 + ny * 0.04) * 0.012 * SCALE
  return [CX + x, y, z]
}

function pathWorld(t: number): [number, number, number] {
  const { x, y } = evolutionPathPoint(t)
  const lift = Math.sin(t * Math.PI) * 0.8
  return toWorld(x, y - lift * 0.02, 0.5 + t * 0.4)
}

function milestoneWorld(m: number): [number, number, number] {
  const { x, y } = roadmapMilestonePosition(m)
  return toWorld(x, y, 0.8 + m * 0.15)
}

function segmentIndex(t: number): number {
  return Math.min(Math.floor(t * (ROADMAP_MILESTONE_COUNT - 1)), ROADMAP_MILESTONE_COUNT - 1)
}

function fillPath(out: Float32Array, meta: Float32Array, idx: number, n: number): number {
  for (let i = 0; i < n; i++) {
    const along = i / Math.max(1, n - 1)
    const lane = ((i % 5) - 2) * 0.012
    const [x, y, z] = pathWorld(along)
    write(out, idx, x + lane, y, z, 0.007)
    writeMeta(meta, idx, ROADMAP_ROLE.PATH, segmentIndex(along), along, lane, Math.random() * Math.PI * 2, 0.35 + (i % 6) * 0.03)
    idx++
  }
  return idx
}

function fillMilestoneRing(
  out: Float32Array,
  meta: Float32Array,
  idx: number,
  m: number,
  n: number,
  role: number
): number {
  const [cx, cy, cz] = milestoneWorld(m)
  const scale = ROADMAP_EVOLUTION_MILESTONES[m]?.nodeScale ?? 1
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2
    const r = (role === ROADMAP_ROLE.HALO ? 0.048 : 0.024) * scale
    write(out, idx, cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.72, cz + Math.sin(a) * 0.01, 0.006)
    writeMeta(meta, idx, role, m, i / n, a, Math.random() * Math.PI * 2, 0.42 + m * 0.04)
    idx++
  }
  return idx
}

function fillPulse(out: Float32Array, meta: Float32Array, idx: number, n: number): number {
  for (let i = 0; i < n; i++) {
    const along = Math.random()
    const [x, y, z] = pathWorld(along)
    write(out, idx, x, y, z, 0.005)
    writeMeta(meta, idx, ROADMAP_ROLE.PULSE, segmentIndex(along), along, i % 3, Math.random() * Math.PI * 2, 0.5 + (i % 4) * 0.04)
    idx++
  }
  return idx
}

function fillStardust(out: Float32Array, meta: Float32Array, idx: number, n: number): number {
  for (let i = 0; i < n; i++) {
    const along = Math.random()
    const { x, y } = evolutionPathPoint(along)
    const spread = (Math.random() - 0.5) * 8
    const [wx, wy, wz] = toWorld(x + spread, y + spread * 0.4, Math.random() * 0.3)
    write(out, idx, wx, wy, wz, 0.012)
    writeMeta(meta, idx, ROADMAP_ROLE.STARDUST, segmentIndex(along), along, spread, Math.random() * Math.PI * 2, 0.04)
    idx++
  }
  return idx
}

export function buildRoadmapEvolutionPath(count: number): { positions: Float32Array; meta: Float32Array } {
  const out = new Float32Array(count * 3)
  const meta = new Float32Array(count * META_STRIDE)
  let idx = 0

  const nPath = Math.floor(count * 0.34)
  const nHalo = Math.floor(count * 0.2)
  const nNode = Math.floor(count * 0.14)
  const nPulse = Math.floor(count * 0.14)
  const nStardust = count - nPath - nHalo - nNode - nPulse

  idx = fillPath(out, meta, idx, nPath)

  const perHalo = Math.max(3, Math.floor(nHalo / ROADMAP_MILESTONE_COUNT))
  for (let m = 0; m < ROADMAP_MILESTONE_COUNT && idx < count; m++) {
    idx = fillMilestoneRing(out, meta, idx, m, perHalo, ROADMAP_ROLE.HALO)
  }

  const perNode = Math.max(2, Math.floor(nNode / ROADMAP_MILESTONE_COUNT))
  for (let m = 0; m < ROADMAP_MILESTONE_COUNT && idx < count; m++) {
    idx = fillMilestoneRing(out, meta, idx, m, perNode, ROADMAP_ROLE.NODE)
  }

  idx = fillPulse(out, meta, idx, nPulse)
  idx = fillStardust(out, meta, idx, nStardust)

  while (idx < count) {
    idx = fillStardust(out, meta, idx, 1)
  }

  return { positions: out, meta }
}

export function genRoadmapEvolutionPath(count: number): Float32Array {
  const { positions, meta } = buildRoadmapEvolutionPath(count)
  cachedRoadmapMeta = meta
  return positions
}

export function getRoadmapTimelineMeta(): Float32Array | null {
  return cachedRoadmapMeta
}

export function scatterRoadmapFromTop(count: number): Float32Array {
  const scatter = new Float32Array(count * 3)
  const start = roadmapMilestonePosition(0)
  for (let i = 0; i < count; i++) {
    const bi = i * 3
    scatter[bi] = (start.x - 50) * 0.018 * SCALE + (Math.random() - 0.5) * 0.4
    scatter[bi + 1] = -(start.y - 50) * 0.018 * SCALE - 0.35 - Math.random() * 0.5
    scatter[bi + 2] = (Math.random() - 0.5) * 0.25
  }
  return scatter
}

export function roadmapFlowPhase(t: number, speed: number): number {
  return ((t / ROADMAP_LOOP_DURATION) * (0.92 + speed * 0.08)) % 1
}

export function roadmapMilestonePulse(t: number, milestone: number, speed: number): number {
  const flow = roadmapFlowPhase(t, speed)
  const target = milestone / (ROADMAP_MILESTONE_COUNT - 1)
  let d = Math.abs(flow - target)
  d = Math.min(d, 1 - d)
  const wave = Math.max(0, 1 - d * 14) ** 2.2
  if (milestone === ROADMAP_MILESTONE_COUNT - 1) {
    return Math.min(1, wave * 1.35 + 0.25 * (0.5 + 0.5 * Math.sin(t * 0.9)))
  }
  return wave
}

export function roadmapSparkFlash(t: number, phase: number): number {
  const cycle = ROADMAP_LOOP_DURATION
  const local = ((t + phase * 0.2) % cycle) / cycle
  return Math.max(0, 1 - Math.abs(local - 0.5) * 3.8) ** 2.5
}

export function roadmapPathActivation(formT: number): number {
  return Math.min(1, Math.max(0, formT / 0.42))
}

export function roadmapMilestoneActivation(formT: number, m: number): number {
  return Math.min(1, Math.max(0, (formT - m * 0.08) / 0.28))
}

export function computeRoadmapTimelinePosition(
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

  const flow = roadmapFlowPhase(t, speed)
  const drift = Math.sin(t * 0.22 + phase) * 0.003 * SCALE * motion

  if (role === ROADMAP_ROLE.PATH || role === ROADMAP_ROLE.PULSE) {
    const along = role === ROADMAP_ROLE.PULSE ? flow : (param + flow * 0.15) % 1
    const [x, y, z] = pathWorld(along)
    const lane = aux * 0.014
    return [x + lane + drift, y + drift * 0.5, z + Math.sin(t * 0.4 + phase) * 0.004 * motion]
  }

  if (role === ROADMAP_ROLE.STARDUST) {
    const { x, y } = evolutionPathPoint(param)
    const [wx, wy, wz] = toWorld(x + aux, y + aux * 0.35, Math.sin(t * 0.12 + phase) * 0.08)
    return [wx + drift * 0.3, wy + drift * 0.2, wz]
  }

  const [cx, cy, cz] = milestoneWorld(slot)
  const pulse = roadmapMilestonePulse(t, slot, speed)
  const scale = ROADMAP_EVOLUTION_MILESTONES[slot]?.nodeScale ?? 1

  if (role === ROADMAP_ROLE.NODE) {
    const glow = 1 + pulse * 0.12 * scale
    const r = 0.022 * glow * scale
    return [cx + Math.cos(aux) * r, cy + Math.sin(aux) * r * 0.72, cz + Math.sin(aux) * 0.008]
  }

  if (role === ROADMAP_ROLE.HALO) {
    const expand = 1 + pulse * 0.42 * scale
    const r = (0.046 + param * 0.012) * expand * scale
    return [cx + Math.cos(aux) * r, cy + Math.sin(aux) * r * 0.72, cz + Math.sin(aux + t * 0.18) * 0.01]
  }

  return [cx, cy, cz]
}

function colorForProgress(t: number): Rgb {
  if (t < 0.35) return PURPLE
  if (t < 0.72) return FUCHSIA
  return CYAN
}

export function buildRoadmapTimelineColors(count: number, meta: Float32Array): Float32Array {
  const colors = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const mi = i * META_STRIDE
    const role = meta[mi]
    const slot = meta[mi + 1]
    const param = meta[mi + 2]

    const progress =
      role === ROADMAP_ROLE.PATH || role === ROADMAP_ROLE.PULSE || role === ROADMAP_ROLE.STARDUST
        ? param
        : slot / (ROADMAP_MILESTONE_COUNT - 1)

    const c = colorForProgress(progress)
    const isFuture = slot === ROADMAP_MILESTONE_COUNT - 1
    const dim =
      role === ROADMAP_ROLE.NODE
        ? (isFuture ? 1.18 : 1.06) + Math.random() * 0.1
        : role === ROADMAP_ROLE.HALO
          ? (isFuture ? 1.08 : 0.92) + Math.random() * 0.12
          : role === ROADMAP_ROLE.PULSE
            ? 1.1 + Math.random() * 0.1
            : role === ROADMAP_ROLE.STARDUST
              ? 0.42 + Math.random() * 0.1
              : 0.84 + Math.random() * 0.12

    colors[i * 3] = Math.min(1, c[0] * dim)
    colors[i * 3 + 1] = Math.min(1, c[1] * dim)
    colors[i * 3 + 2] = Math.min(1, c[2] * dim)
  }
  return colors
}

export const ROADMAP_META_STRIDE = META_STRIDE
