/**
 * Genesis Quantum Trust Shield — Geometry Blueprint (Phase 0).
 * Capas hexagonales · red neural · rutas de flujo y validación.
 * Sin animación · sin color · sin morph.
 */
import { PARTICLE_COUNT } from '@/lib/particleConstants'

export const TRUST_SECTION_INDEX = 1

/** Escala visual en espacio local WebGL (pre-bias / pre-section scale). */
export const TRUST_SHIELD_VISUAL_SCALE = 2.2

/** Multiplicador adicional del núcleo Genesis (~250% vs escala previa). */
export const TRUST_CORE_RADIUS_MULT = 2.5

/** Exageración de profundidad Z — capas hex con separación frontal. */
export const TRUST_DEPTH_Z_SCALE = 1.92

/** Definición del anillo exterior — radio relativo al hex OUTER base. */
export const TRUST_OUTER_RING_MULT = 1.12

/** Meta stride reservado para fases posteriores (Generator / Morph). */
export const TRUST_META_STRIDE = 6

/** Capas geométricas del escudo cuántico. */
export const TRUST_LAYER = {
  CORE: 0,
  HEX_INNER: 1,
  HEX_MID: 2,
  HEX_OUTER: 3,
  RADIAL: 4,
  NEURAL: 5,
  VALIDATION: 6,
  FLOW: 7,
} as const

export type TrustLayerId = (typeof TRUST_LAYER)[keyof typeof TRUST_LAYER]

export const TRUST_PATH_KIND = {
  HEX_PERIMETER: 0,
  RADIAL: 1,
  NEURAL_EDGE: 2,
  VALIDATION_LOOP: 3,
  FLOW_EDGE: 4,
} as const

export type TrustPathKind = (typeof TRUST_PATH_KIND)[keyof typeof TRUST_PATH_KIND]

export type Vec3 = readonly [number, number, number]

export interface TrustNode {
  id: number
  layer: TrustLayerId
  slot: number
  position: Vec3
}

export interface TrustEdge {
  id: number
  kind: TrustPathKind
  layer: TrustLayerId
  fromNode: number
  toNode: number
  /** Índice estable para meta.slot en fases futuras. */
  slot: number
}

export interface TrustPath {
  id: number
  kind: TrustPathKind
  layer: TrustLayerId
  /** Nodos ordenados — t ∈ [0,1] recorre waypoints con interpolación lineal por segmento. */
  nodeIds: readonly number[]
  closed: boolean
  slot: number
}

export interface HexRingSpec {
  layer: TrustLayerId
  radius: number
  /** Desfase angular relativo al hex principal (rad). */
  phase: number
  zBias: number
}

export interface TrustParticleBudget {
  total: number
  core: number
  hexInner: number
  hexMid: number
  hexOuter: number
  radial: number
  neural: number
  validation: number
  flow: number
  auraReserve: number
}

export interface TrustShieldBlueprint {
  scale: number
  nodes: readonly TrustNode[]
  edges: readonly TrustEdge[]
  paths: readonly TrustPath[]
  hexRings: readonly HexRingSpec[]
  budgets: TrustParticleBudget
  nodeById: ReadonlyMap<number, TrustNode>
  edgesByLayer: ReadonlyMap<TrustLayerId, readonly TrustEdge[]>
  pathsByKind: ReadonlyMap<TrustPathKind, readonly TrustPath[]>
}

/** Radios normalizados — origen en centro del escudo. */
const HEX_RINGS: readonly HexRingSpec[] = [
  { layer: TRUST_LAYER.CORE, radius: 0.13, phase: 0, zBias: 0.042 },
  { layer: TRUST_LAYER.HEX_INNER, radius: 0.36, phase: 0, zBias: 0.032 },
  { layer: TRUST_LAYER.HEX_MID, radius: 0.68, phase: Math.PI / 6, zBias: 0.022 },
  { layer: TRUST_LAYER.HEX_OUTER, radius: 1.06 * TRUST_OUTER_RING_MULT, phase: 0, zBias: 0.016 },
] as const

const S = TRUST_SHIELD_VISUAL_SCALE
const HEX_SIDES = 6
const ORIGIN: Vec3 = [0, 0, 0]

function scaleVec([x, y, z]: Vec3): Vec3 {
  return [x * S, y * S, z * S * TRUST_DEPTH_Z_SCALE]
}

function hexVertex(
  radius: number,
  cornerIndex: number,
  phase: number,
  zBias: number
): Vec3 {
  const angle = (cornerIndex / HEX_SIDES) * Math.PI * 2 - Math.PI / 2 + phase
  const ripple = Math.sin(angle * 2.4) * zBias * 0.48
  return scaleVec([
    Math.cos(angle) * radius,
    Math.sin(angle) * radius,
    ripple + zBias * 0.38,
  ])
}

function lerpVec(a: Vec3, b: Vec3, t: number): Vec3 {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
}

function edgePoint(a: Vec3, b: Vec3, t: number): Vec3 {
  return lerpVec(a, b, t)
}

/** Presupuesto legacy — guía para referencia. */
export function computeTrustParticleBudget(total = PARTICLE_COUNT): TrustParticleBudget {
  const core = Math.floor(total * 0.11)
  const hexInner = Math.floor(total * 0.1)
  const hexMid = Math.floor(total * 0.12)
  const hexOuter = Math.floor(total * 0.14)
  const radial = Math.floor(total * 0.1)
  const neural = Math.floor(total * 0.2)
  const validation = Math.floor(total * 0.08)
  const flow = Math.floor(total * 0.17)
  const allocated = core + hexInner + hexMid + hexOuter + radial + neural + validation + flow
  const auraReserve = Math.max(0, total - allocated)
  return {
    total,
    core,
    hexInner,
    hexMid,
    hexOuter,
    radial,
    neural,
    validation,
    flow,
    auraReserve,
  }
}

function buildHexRingNodes(
  spec: HexRingSpec,
  idStart: number,
  slotOffset: number
): TrustNode[] {
  const nodes: TrustNode[] = []
  for (let i = 0; i < HEX_SIDES; i++) {
    nodes.push({
      id: idStart + i,
      layer: spec.layer,
      slot: slotOffset + i,
      position: hexVertex(spec.radius, i, spec.phase, spec.zBias),
    })
  }
  return nodes
}

function addEdge(
  edges: TrustEdge[],
  id: number,
  kind: TrustPathKind,
  layer: TrustLayerId,
  fromNode: number,
  toNode: number,
  slot: number
): void {
  edges.push({ id, kind, layer, fromNode, toNode, slot })
}

function buildHexPerimeterPath(
  ringNodes: readonly TrustNode[],
  pathId: number,
  layer: TrustLayerId,
  slot: number
): TrustPath {
  return {
    id: pathId,
    kind: TRUST_PATH_KIND.HEX_PERIMETER,
    layer,
    nodeIds: ringNodes.map((n) => n.id),
    closed: true,
    slot,
  }
}

function buildValidationLoop(
  ringNodes: readonly TrustNode[],
  pathId: number,
  layer: TrustLayerId,
  slot: number
): TrustPath {
  return {
    id: pathId,
    kind: TRUST_PATH_KIND.VALIDATION_LOOP,
    layer,
    nodeIds: ringNodes.map((n) => n.id),
    closed: true,
    slot,
  }
}

/**
 * Construye el blueprint completo: nodos, aristas y rutas paramétricas.
 * Idempotente — sin estado global.
 */
export function buildTrustShieldBlueprint(
  particleTotal = PARTICLE_COUNT
): TrustShieldBlueprint {
  const nodes: TrustNode[] = []
  const edges: TrustEdge[] = []
  const paths: TrustPath[] = []

  nodes.push({
    id: 0,
    layer: TRUST_LAYER.CORE,
    slot: 0,
    position: scaleVec([0, 0, 0.028]),
  })

  let nextNodeId = 1
  const ringNodeGroups: TrustNode[][] = []

  for (let r = 0; r < HEX_RINGS.length; r++) {
    const spec = HEX_RINGS[r]
    if (spec.layer === TRUST_LAYER.CORE) {
      const coreVerts = buildHexRingNodes(spec, nextNodeId, 1)
      nodes.push(...coreVerts)
      ringNodeGroups.push(coreVerts)
      nextNodeId += HEX_SIDES
      continue
    }
    const ringNodes = buildHexRingNodes(spec, nextNodeId, r * 10)
    nodes.push(...ringNodes)
    ringNodeGroups.push(ringNodes)
    nextNodeId += HEX_SIDES
  }

  const [coreVerts, innerVerts, midVerts, outerVerts] = ringNodeGroups as [
    TrustNode[],
    TrustNode[],
    TrustNode[],
    TrustNode[],
  ]

  let edgeId = 0
  let pathId = 0

  const ringLayers = [
    { verts: coreVerts, layer: TRUST_LAYER.CORE, pathLayer: TRUST_LAYER.CORE },
    { verts: innerVerts, layer: TRUST_LAYER.HEX_INNER, pathLayer: TRUST_LAYER.HEX_INNER },
    { verts: midVerts, layer: TRUST_LAYER.HEX_MID, pathLayer: TRUST_LAYER.HEX_MID },
    { verts: outerVerts, layer: TRUST_LAYER.HEX_OUTER, pathLayer: TRUST_LAYER.HEX_OUTER },
  ] as const

  for (const ring of ringLayers) {
    for (let i = 0; i < HEX_SIDES; i++) {
      const a = ring.verts[i]
      const b = ring.verts[(i + 1) % HEX_SIDES]
      addEdge(edges, edgeId++, TRUST_PATH_KIND.HEX_PERIMETER, ring.layer, a.id, b.id, i)
    }
    paths.push(buildHexPerimeterPath(ring.verts, pathId++, ring.pathLayer, ring.pathLayer))
  }

  for (let i = 0; i < HEX_SIDES; i++) {
    addEdge(edges, edgeId++, TRUST_PATH_KIND.RADIAL, TRUST_LAYER.RADIAL, 0, innerVerts[i].id, i)
    addEdge(edges, edgeId++, TRUST_PATH_KIND.RADIAL, TRUST_LAYER.RADIAL, 0, midVerts[i].id, i + 6)
    addEdge(edges, edgeId++, TRUST_PATH_KIND.RADIAL, TRUST_LAYER.RADIAL, 0, outerVerts[i].id, i + 12)
    paths.push({
      id: pathId++,
      kind: TRUST_PATH_KIND.RADIAL,
      layer: TRUST_LAYER.RADIAL,
      nodeIds: [0, outerVerts[i].id],
      closed: false,
      slot: i,
    })
  }

  for (let i = 0; i < HEX_SIDES; i++) {
    const j = (i + 1) % HEX_SIDES
    addEdge(
      edges,
      edgeId++,
      TRUST_PATH_KIND.NEURAL_EDGE,
      TRUST_LAYER.NEURAL,
      innerVerts[i].id,
      midVerts[i].id,
      i
    )
    addEdge(
      edges,
      edgeId++,
      TRUST_PATH_KIND.NEURAL_EDGE,
      TRUST_LAYER.NEURAL,
      midVerts[i].id,
      outerVerts[i].id,
      i + 6
    )
    addEdge(
      edges,
      edgeId++,
      TRUST_PATH_KIND.NEURAL_EDGE,
      TRUST_LAYER.NEURAL,
      innerVerts[i].id,
      innerVerts[j].id,
      i + 12
    )
    addEdge(
      edges,
      edgeId++,
      TRUST_PATH_KIND.NEURAL_EDGE,
      TRUST_LAYER.NEURAL,
      midVerts[i].id,
      midVerts[j].id,
      i + 18
    )
    addEdge(
      edges,
      edgeId++,
      TRUST_PATH_KIND.NEURAL_EDGE,
      TRUST_LAYER.NEURAL,
      innerVerts[i].id,
      midVerts[j].id,
      i + 24
    )
    addEdge(
      edges,
      edgeId++,
      TRUST_PATH_KIND.NEURAL_EDGE,
      TRUST_LAYER.NEURAL,
      midVerts[i].id,
      outerVerts[j].id,
      i + 30
    )
  }

  paths.push(buildValidationLoop(outerVerts, pathId++, TRUST_LAYER.VALIDATION, 0))
  paths.push(buildValidationLoop(midVerts, pathId++, TRUST_LAYER.VALIDATION, 1))
  paths.push({
    id: pathId++,
    kind: TRUST_PATH_KIND.VALIDATION_LOOP,
    layer: TRUST_LAYER.VALIDATION,
    nodeIds: outerVerts.map((_, i) => outerVerts[i].id).concat([outerVerts[0].id]),
    closed: true,
    slot: 2,
  })

  const flowEdgeCandidates = edges.filter(
    (e) =>
      e.kind === TRUST_PATH_KIND.NEURAL_EDGE ||
      e.kind === TRUST_PATH_KIND.RADIAL ||
      (e.kind === TRUST_PATH_KIND.HEX_PERIMETER && e.layer !== TRUST_LAYER.CORE)
  )

  for (const edge of flowEdgeCandidates) {
    paths.push({
      id: pathId++,
      kind: TRUST_PATH_KIND.FLOW_EDGE,
      layer: TRUST_LAYER.FLOW,
      nodeIds: [edge.fromNode, edge.toNode],
      closed: false,
      slot: edge.slot,
    })
  }

  const nodeById = new Map<number, TrustNode>(nodes.map((n) => [n.id, n]))

  const edgesByLayer = new Map<TrustLayerId, TrustEdge[]>()
  for (const edge of edges) {
    const list = edgesByLayer.get(edge.layer) ?? []
    list.push(edge)
    edgesByLayer.set(edge.layer, list)
  }

  const pathsByKind = new Map<TrustPathKind, TrustPath[]>()
  for (const path of paths) {
    const list = pathsByKind.get(path.kind) ?? []
    list.push(path)
    pathsByKind.set(path.kind, list)
  }

  return {
    scale: S,
    nodes,
    edges,
    paths,
    hexRings: HEX_RINGS,
    budgets: computeTrustParticleBudget(particleTotal),
    nodeById,
    edgesByLayer,
    pathsByKind,
  }
}

/** Blueprint singleton lazy — Generator Phase 1 puede importar esto. */
let cachedBlueprint: TrustShieldBlueprint | null = null

export function getTrustShieldBlueprint(particleTotal = PARTICLE_COUNT): TrustShieldBlueprint {
  if (!cachedBlueprint || cachedBlueprint.budgets.total !== particleTotal) {
    cachedBlueprint = buildTrustShieldBlueprint(particleTotal)
  }
  return cachedBlueprint
}

export function getTrustNode(nodeId: number): TrustNode | undefined {
  return getTrustShieldBlueprint().nodeById.get(nodeId)
}

export function getTrustEdge(edgeId: number): TrustEdge | undefined {
  return getTrustShieldBlueprint().edges[edgeId]
}

export function getTrustPath(pathId: number): TrustPath | undefined {
  return getTrustShieldBlueprint().paths[pathId]
}

/** Posición en anillo hexagonal — t ∈ [0,1] recorre el perímetro completo. */
export function sampleHexRingLayer(
  layer: TrustLayerId,
  t: number,
  lane = 0
): Vec3 {
  const spec = HEX_RINGS.find((r) => r.layer === layer)
  if (!spec) return ORIGIN

  const radius =
    layer === TRUST_LAYER.CORE ? spec.radius * TRUST_CORE_RADIUS_MULT : spec.radius
  const cornerF = ((t % 1) + 1) % 1 * HEX_SIDES
  const corner = Math.floor(cornerF) % HEX_SIDES
  const localT = cornerF - corner
  const a = hexVertex(radius, corner, spec.phase, spec.zBias)
  const b = hexVertex(radius, (corner + 1) % HEX_SIDES, spec.phase, spec.zBias)
  const base = edgePoint(a, b, localT)
  if (lane === 0) return base

  const angle = (corner / HEX_SIDES) * Math.PI * 2 - Math.PI / 2 + spec.phase
  const nx = -Math.sin(angle)
  const ny = Math.cos(angle)
  const laneScale =
    layer === TRUST_LAYER.HEX_OUTER ? 0.018 : layer === TRUST_LAYER.HEX_MID ? 0.015 : 0.013
  const offset = lane * laneScale * S
  return [base[0] + nx * offset, base[1] + ny * offset, base[2]]
}

/** Núcleo Genesis — disco hexagonal suave; u,v ∈ [0,1]. */
export function sampleCoreVolume(u: number, v: number): Vec3 {
  const spec = HEX_RINGS[0]
  const angle = u * Math.PI * 2
  const r = spec.radius * TRUST_CORE_RADIUS_MULT * Math.sqrt(v) * 0.94
  const x = Math.cos(angle) * r
  const y = Math.sin(angle) * r
  const z = spec.zBias * 0.82 + Math.sin(angle * 3) * 0.012 * S
  return scaleVec([x, y, z])
}

/** Punto sobre arista por id — t ∈ [0,1]. */
export function sampleTrustEdge(edgeId: number, t: number): Vec3 {
  const blueprint = getTrustShieldBlueprint()
  const edge = blueprint.edges[edgeId]
  if (!edge) return ORIGIN
  const a = blueprint.nodeById.get(edge.fromNode)?.position ?? ORIGIN
  const b = blueprint.nodeById.get(edge.toNode)?.position ?? ORIGIN
  return edgePoint(a, b, ((t % 1) + 1) % 1)
}

/** Punto sobre ruta (validación / flujo / radial) — t ∈ [0,1] recorre waypoints. */
export function sampleTrustPath(pathId: number, t: number): Vec3 {
  const blueprint = getTrustShieldBlueprint()
  const path = blueprint.paths[pathId]
  if (!path || path.nodeIds.length < 2) return ORIGIN

  const clamped = ((t % 1) + 1) % 1
  const ids = path.nodeIds
  const segmentCount = path.closed ? ids.length : ids.length - 1
  if (segmentCount <= 0) return ORIGIN

  const segT = clamped * segmentCount
  const seg = Math.min(Math.floor(segT), segmentCount - 1)
  const local = segT - seg
  const fromId = ids[seg]
  const toId = ids[(seg + 1) % ids.length]
  const a = blueprint.nodeById.get(fromId)?.position ?? ORIGIN
  const b = blueprint.nodeById.get(toId)?.position ?? ORIGIN
  return edgePoint(a, b, local)
}

/** Aristas de capa filtradas — útil para asignación de partículas FLOW / NEURAL. */
export function getTrustEdgesByLayer(layer: TrustLayerId): readonly TrustEdge[] {
  return getTrustShieldBlueprint().edgesByLayer.get(layer) ?? []
}

/** Rutas por tipo — VALIDATION_LOOP, FLOW_EDGE, etc. */
export function getTrustPathsByKind(kind: TrustPathKind): readonly TrustPath[] {
  return getTrustShieldBlueprint().pathsByKind.get(kind) ?? []
}

/** Nodos perimetrales del anillo exterior — hotspots de validación futuros. */
export function getOuterValidationNodes(): readonly TrustNode[] {
  const blueprint = getTrustShieldBlueprint()
  return blueprint.nodes.filter((n) => n.layer === TRUST_LAYER.HEX_OUTER)
}

/** Resumen de conteos para debug / Generator Phase 1. */
export function getTrustLayoutStats(): {
  nodeCount: number
  edgeCount: number
  pathCount: number
  budgets: TrustParticleBudget
} {
  const bp = getTrustShieldBlueprint()
  return {
    nodeCount: bp.nodes.length,
    edgeCount: bp.edges.length,
    pathCount: bp.paths.length,
    budgets: bp.budgets,
  }
}
