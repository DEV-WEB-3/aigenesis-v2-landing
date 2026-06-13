/**
 * Ecosistema — polvo difuso sin figuras (sin rutas, halos ni órbitas visibles).
 */
import { GENESIS_RGB_NORM } from '@/lib/genesis-brand'

type Rgb = readonly [number, number, number]
type Vec3 = readonly [number, number, number]

export const ECOSYSTEM_VISUAL_SCALE = 1.35
export const ECOSYSTEM_INTENSITY = 0.3

export const ECOSYSTEM_TOKEN_PULSE_PERIOD = 3.5
export const ECOSYSTEM_TRAVEL_CYCLE = 3.6
export const ECOSYSTEM_META_STRIDE = 8

export const ECOSYSTEM_FLOW_ROLE = {
  EDGE_STREAM: 0,
  TOKEN_CORE: 1,
  NODE_HALO: 2,
  TRAVELER: 3,
  MICRO_ORBIT: 4,
  DIFFUSE: 5,
} as const

export type EcosystemFlowRole =
  (typeof ECOSYSTEM_FLOW_ROLE)[keyof typeof ECOSYSTEM_FLOW_ROLE]

const S = ECOSYSTEM_VISUAL_SCALE

export const ECOSYSTEM_SPREAD_X = 2.2
export const ECOSYSTEM_SPREAD_Y = 1.4
export const ECOSYSTEM_CENTER_DENSITY = 0.45
export const ECOSYSTEM_MARKETPLACE_DUST = 1.15
export const ECOSYSTEM_COMMUNITY_DUST = 1.12
export const ECOSYSTEM_MARKETPLACE_FACTOR = ECOSYSTEM_MARKETPLACE_DUST
export const ECOSYSTEM_COMUNIDAD_PERSISTENCE = ECOSYSTEM_COMMUNITY_DUST

const N = {
  token: [0, 1.28 * S, 0] as Vec3,
  mining: [-0.98 * S, 0.48 * S, 0] as Vec3,
  booster: [0, 0.48 * S, 0] as Vec3,
  staking: [0.98 * S, 0.48 * S, 0] as Vec3,
  gpulse: [-0.52 * S, -0.18 * S, 0] as Vec3,
  goracle: [0.52 * S, -0.18 * S, 0] as Vec3,
  marketplace: [0, -0.78 * S, 0] as Vec3,
  comunidad: [0, -1.32 * S, 0] as Vec3,
} as const

type NodeKey = keyof typeof N

const NODE_INDEX: Record<NodeKey, number> = {
  token: 0,
  mining: 1,
  booster: 2,
  staking: 3,
  gpulse: 4,
  goracle: 5,
  marketplace: 6,
  comunidad: 7,
}

/** Presupuesto difuso por zona — sin rutas ni figuras. */
const ZONE_SHARE: Record<NodeKey, number> = {
  token: 0.2,
  mining: 0.05,
  booster: 0.05,
  staking: 0.05,
  gpulse: 0.075,
  goracle: 0.075,
  marketplace: 0.25,
  comunidad: 0.15,
}

export const ECOSYSTEM_NODE_INDEX = NODE_INDEX

let cachedFlowMeta: Float32Array | null = null

function centerColumnAttenuation(x: number, nodeKey: number): number {
  if (nodeKey === 2) return ECOSYSTEM_CENTER_DENSITY
  if (Math.abs(x) / (0.98 * S) < 0.2) return ECOSYSTEM_CENTER_DENSITY
  return 1
}

/** Jitter caja — no elipses ni arcos (evita figuras). */
function diffuseOffset(nodeKey: number): [number, number, number] {
  const dustMul =
    nodeKey === 6
      ? ECOSYSTEM_MARKETPLACE_DUST
      : nodeKey === 7
        ? ECOSYSTEM_COMMUNITY_DUST
        : 1
  const wx = 0.38 * S * ECOSYSTEM_SPREAD_X * 0.14 * dustMul
  const wy = 0.32 * S * ECOSYSTEM_SPREAD_Y * 0.14 * dustMul
  const tri = () => Math.random() + Math.random() + Math.random() - 1.5
  return [tri() * wx, tri() * wy, (Math.random() - 0.5) * 0.04]
}

function writeMeta(
  meta: Float32Array,
  idx: number,
  pathT: number,
  role: EcosystemFlowRole,
  nodeKey: number
): void {
  const bi = idx * ECOSYSTEM_META_STRIDE
  meta[bi] = (Math.random() - 0.5) * 0.2
  meta[bi + 1] = (Math.random() - 0.5) * 0.2
  meta[bi + 2] = 0
  meta[bi + 3] = pathT
  meta[bi + 4] = Math.random() * Math.PI * 2
  meta[bi + 5] = role
  meta[bi + 6] = -1
  meta[bi + 7] = nodeKey
}

function fillDiffuseZone(
  out: Float32Array,
  meta: Float32Array,
  idx: number,
  nodeKey: number,
  budget: number
): number {
  const key = (Object.keys(NODE_INDEX) as NodeKey[]).find((k) => NODE_INDEX[k] === nodeKey)!
  const [nx, ny, nz] = N[key]
  const count = Math.max(0, Math.floor(budget * centerColumnAttenuation(nx, nodeKey)))

  for (let i = 0; i < count; i++) {
    const [dx, dy, dz] = diffuseOffset(nodeKey)
    const bi = idx * 3
    out[bi] = nx + dx
    out[bi + 1] = ny + dy
    out[bi + 2] = nz + dz
    writeMeta(meta, idx, Math.random(), ECOSYSTEM_FLOW_ROLE.DIFFUSE, nodeKey)
    idx++
  }
  return idx
}

export function buildEcosystemEnergyFlow(count: number): {
  positions: Float32Array
  meta: Float32Array
} {
  const out = new Float32Array(count * 3)
  const meta = new Float32Array(count * ECOSYSTEM_META_STRIDE)
  let idx = 0

  const nodeKeys = Object.keys(N) as NodeKey[]
  for (const key of nodeKeys) {
    const nodeKey = NODE_INDEX[key]
    idx = fillDiffuseZone(out, meta, idx, nodeKey, Math.floor(count * ZONE_SHARE[key]))
  }

  const minX = -1.05 * S
  const maxX = 1.05 * S
  const minY = -1.38 * S
  const maxY = 1.38 * S

  while (idx < count) {
    const bi = idx * 3
    out[bi] = minX + Math.random() * (maxX - minX)
    out[bi + 1] = minY + Math.random() * (maxY - minY)
    out[bi + 2] = (Math.random() - 0.5) * 0.06
    writeMeta(meta, idx, Math.random(), ECOSYSTEM_FLOW_ROLE.DIFFUSE, -1)
    idx++
  }

  return { positions: out, meta }
}

export function genEcosystemEnergyFlow(count: number): Float32Array {
  const { positions, meta } = buildEcosystemEnergyFlow(count)
  cachedFlowMeta = meta
  return positions
}

export function getEcosystemFlowMeta(): Float32Array | null {
  return cachedFlowMeta
}

export function buildEcosystemFlowColors(count: number): Float32Array {
  const colors = new Float32Array(count * 3)
  const dim = ECOSYSTEM_INTENSITY
  const fuchsia = GENESIS_RGB_NORM.fuchsia
  const fuchsiaSoft = GENESIS_RGB_NORM.fuchsiaSoft
  const core = GENESIS_RGB_NORM.core
  const ion = GENESIS_RGB_NORM.ion
  const cyan = GENESIS_RGB_NORM.cyan

  for (let i = 0; i < count; i++) {
    const r = Math.random()
    let c: Rgb
    if (r < 0.12) c = fuchsia
    else if (r < 0.22) c = fuchsiaSoft
    else if (r < 0.42) c = core
    else if (r < 0.72) c = ion
    else c = cyan

    colors[i * 3] = c[0] * dim
    colors[i * 3 + 1] = c[1] * dim
    colors[i * 3 + 2] = c[2] * dim
  }
  return colors
}

export function scatterEcosystemFromTrust(count: number): Float32Array {
  const out = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const bi = i * 3
    out[bi] = (Math.random() - 0.5) * 1.8 * S
    out[bi + 1] = (Math.random() - 0.5) * 1.2 * S
    out[bi + 2] = (Math.random() - 0.5) * 0.15
  }
  return out
}

export const ECOSYSTEM_SECTION_INDEX = 2

export const ECOSYSTEM_NODE_CENTERS: readonly Vec3[] = [
  N.token,
  N.mining,
  N.booster,
  N.staking,
  N.gpulse,
  N.goracle,
  N.marketplace,
  N.comunidad,
] as const
