/**
 * Genesis Quantum Trust Shield — Particle Generator (Phase 1).
 * Posiciones + meta desde TrustShieldLayout blueprint.
 * Sin animación · sin color · sin integración Morph.
 */
import { PARTICLE_COUNT } from '@/lib/particleConstants'
import {
  TRUST_AURA_SLOT,
  TRUST_CORE_SLOT,
  sampleGenesisEnergyFog,
  sampleGenesisLogoHalo,
  sampleGenesisSecondaryHalo,
  sampleGenesisVolumetricShell,
} from './GenesisLogoLayout'
import {
  sampleGenesisLogoParticle,
} from './GenesisLogoMaskSampler'
import {
  computeGenesisNucleusPosition,
  computeShieldFromLogoBias,
  computeStardustLogoPosition,
} from './GenesisStardustEntity'
import { computeTrustMorphBudget } from './TrustShieldBudgetRecovery'
import {
  TRUST_LAYER,
  TRUST_META_STRIDE,
  TRUST_PATH_KIND,
  TRUST_SECTION_INDEX,
  TRUST_OUTER_RING_MULT,
  TRUST_SHIELD_VISUAL_SCALE,
  getTrustEdgesByLayer,
  getTrustPathsByKind,
  getTrustShieldBlueprint,
  sampleCoreVolume,
  sampleHexRingLayer,
  sampleTrustEdge,
  sampleTrustPath,
  type Vec3,
} from './TrustShieldLayout'
import { TRUST_ROLE, type TrustRoleId } from './trustShieldRoles'
import {
  TRUST_BRIDGE_SPOKE_COUNT,
  TRUST_META_SLOT,
  TRUST_VALIDATION_LOOP,
  sampleTrustEnergyCircuit,
  sampleTrustLogoBridge,
  sampleTrustLatticeNode,
  sampleTrustNodeHotspot,
  sampleTrustQuantumValidation,
  sampleTrustVolumetricDeep,
} from './TrustShieldQuantumArchitecture'

export { TRUST_SECTION_INDEX, TRUST_META_STRIDE, TRUST_SHIELD_VISUAL_SCALE }
export {
  TRUST_CORE_RADIUS_MULT,
  TRUST_DEPTH_Z_SCALE,
  TRUST_OUTER_RING_MULT,
} from './TrustShieldLayout'
export { TRUST_ROLE, type TrustRoleId } from './trustShieldRoles'

export interface TrustRoleStats {
  total: number
  byRole: Record<keyof typeof TRUST_ROLE, number>
}

export interface TrustParticleBounds {
  minX: number
  maxX: number
  minY: number
  maxY: number
  minZ: number
  maxZ: number
}

function fillLogoMask(
  out: Float32Array,
  meta: Float32Array,
  idx: number,
  n: number
): number {
  for (let i = 0; i < n; i++) {
    const p = sampleGenesisLogoParticle(i, n)
    writeExact(out, idx, p.x, p.y, p.z)
    writeMeta(
      meta,
      idx,
      TRUST_ROLE.CORE,
      TRUST_CORE_SLOT.LOGO_MASK,
      i / Math.max(1, n),
      p.poolIndex,
      (i / n) * Math.PI * 2,
      roleSpeed(TRUST_ROLE.CORE, i)
    )
    idx++
  }
  return idx
}

function fillLogoNucleus(
  out: Float32Array,
  meta: Float32Array,
  idx: number,
  n: number
): number {
  for (let i = 0; i < n; i++) {
    const u = (i + 0.5) / n
    const [x, y, z] = computeGenesisNucleusPosition(u, 0, i * 0.37, 0)
    writeExact(out, idx, x, y, z)
    writeMeta(
      meta,
      idx,
      TRUST_ROLE.CORE,
      TRUST_CORE_SLOT.LOGO_NUCLEUS,
      u,
      i,
      u * Math.PI * 2 + i * 0.19,
      roleSpeed(TRUST_ROLE.CORE, i)
    )
    idx++
  }
  return idx
}

function fillLogoHalo(
  out: Float32Array,
  meta: Float32Array,
  idx: number,
  n: number
): number {
  const bands = 3
  for (let i = 0; i < n; i++) {
    const u = (i + 0.5) / n
    const v = (i % 13) / 13
    const band = i % bands
    const [x, y, z] = sampleGenesisLogoHalo(u, v, band)
    write(out, idx, x, y, z, 0.0035)
    writeMeta(
      meta,
      idx,
      TRUST_ROLE.CORE,
      TRUST_CORE_SLOT.LOGO_HALO,
      u,
      v,
      u * Math.PI * 2 + band * 0.35,
      roleSpeed(TRUST_ROLE.CORE, i)
    )
    idx++
  }
  return idx
}

function fillLogoFog(
  out: Float32Array,
  meta: Float32Array,
  idx: number,
  n: number
): number {
  for (let i = 0; i < n; i++) {
    const u = (i + 0.5) / n
    const v = (i % 11) / 11
    const [x, y, z] = sampleGenesisEnergyFog(u, v)
    write(out, idx, x, y, z, 0.005)
    writeMeta(
      meta,
      idx,
      TRUST_ROLE.CORE,
      TRUST_CORE_SLOT.ENERGY_FOG,
      u,
      v,
      u * Math.PI * 2 + i * 0.11,
      roleSpeed(TRUST_ROLE.CORE, i)
    )
    idx++
  }
  return idx
}

function fillEnergyFog(
  out: Float32Array,
  meta: Float32Array,
  idx: number,
  n: number,
  auraSlot: number
): number {
  for (let i = 0; i < n; i++) {
    const u = (i + 0.5) / n
    const v = (i % 11) / 11
    const [x, y, z] = sampleGenesisEnergyFog(u, v)
    write(out, idx, x, y, z, 0.006)
    writeMeta(
      meta,
      idx,
      auraSlot >= 0 ? TRUST_ROLE.AURA : TRUST_ROLE.CORE,
      auraSlot >= 0 ? auraSlot : TRUST_CORE_SLOT.ENERGY_FOG,
      u,
      v,
      u * Math.PI * 2 + i * 0.11,
      roleSpeed(TRUST_ROLE.AURA, i)
    )
    idx++
  }
  return idx
}

function fillVolumetricAura(
  out: Float32Array,
  meta: Float32Array,
  idx: number,
  n: number
): number {
  const genesisN = Math.floor(n * 0.42)
  const deepN = n - genesisN
  const bands = 4

  for (let i = 0; i < genesisN; i++) {
    const band = i % bands
    const u = (i + 0.5) / genesisN
    const v = ((i * 5) % 13) / 13
    const theta = u * Math.PI * 2
    const phi = Math.acos(2 * v - 1) * 0.55 + 0.22
    const [x, y, z] = sampleGenesisVolumetricShell(theta, phi, band)
    write(out, idx, x, y, z, 0.005)
    writeMeta(
      meta,
      idx,
      TRUST_ROLE.AURA,
      band,
      u,
      v,
      u * Math.PI * 2 + band * 0.5,
      roleSpeed(TRUST_ROLE.AURA, i)
    )
    idx++
  }

  for (let i = 0; i < deepN; i++) {
    const band = i % 4
    const u = (i + 0.5) / deepN
    const v = ((i * 7) % 11) / 11
    const theta = u * Math.PI * 2
    const phi = Math.acos(2 * v - 1) * 0.52 + 0.24
    const [x, y, z] = sampleTrustVolumetricDeep(theta, phi, band)
    write(out, idx, x, y, z, 0.004)
    writeMeta(
      meta,
      idx,
      TRUST_ROLE.AURA,
      TRUST_META_SLOT.AURA_DEEP_SHELL + band,
      u,
      v,
      u * Math.PI * 2 + band * 0.42,
      roleSpeed(TRUST_ROLE.AURA, i + genesisN)
    )
    idx++
  }

  return idx
}

function fillSecondaryLayer(
  out: Float32Array,
  meta: Float32Array,
  idx: number,
  n: number
): number {
  for (let i = 0; i < n; i++) {
    const u = (i + 0.5) / n
    const v = (i % 7) / 7
    const [x, y, z] = sampleGenesisSecondaryHalo(u, v)
    write(out, idx, x, y, z, 0.004)
    writeMeta(
      meta,
      idx,
      TRUST_ROLE.CORE,
      TRUST_CORE_SLOT.SECONDARY,
      u,
      v,
      u * Math.PI * 2 + i * 0.14,
      roleSpeed(TRUST_ROLE.CORE, i)
    )
    idx++
  }
  return idx
}

let cachedTrustMeta: Float32Array | null = null
let cachedTrustCount = 0

function writeExact(
  out: Float32Array,
  idx: number,
  x: number,
  y: number,
  z: number
): void {
  out[idx * 3] = x
  out[idx * 3 + 1] = y
  out[idx * 3 + 2] = z
}

function write(
  out: Float32Array,
  idx: number,
  x: number,
  y: number,
  z: number,
  jitter = 0.008
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
  const bi = idx * TRUST_META_STRIDE
  meta[bi] = role
  meta[bi + 1] = slot
  meta[bi + 2] = param
  meta[bi + 3] = aux
  meta[bi + 4] = phase
  meta[bi + 5] = speed
}

function roleSpeed(role: TrustRoleId, i: number): number {
  const base =
    role === TRUST_ROLE.CORE
      ? 0.32
      : role === TRUST_ROLE.FLOW
        ? 0.52
        : role === TRUST_ROLE.VALIDATION
          ? 0.48
          : role === TRUST_ROLE.AURA
            ? 0.26
            : 0.4
  return base + (i % 9) * 0.028
}

function fillCoreEnergy(
  out: Float32Array,
  meta: Float32Array,
  idx: number,
  volumeN: number,
  ringN: number
): number {
  for (let i = 0; i < volumeN; i++) {
    const u = i / Math.max(1, volumeN)
    const v = (i % 7) / 7
    const vCenter = 0.38 + v * 0.62
    const [x, y, z] = sampleCoreVolume(u, vCenter)
    write(out, idx, x, y, z, 0.003)
    writeMeta(
      meta,
      idx,
      TRUST_ROLE.CORE,
      TRUST_CORE_SLOT.VOLUME,
      vCenter,
      u * Math.PI * 2,
      u * Math.PI * 2,
      roleSpeed(TRUST_ROLE.CORE, i)
    )
    idx++
  }

  for (let i = 0; i < ringN; i++) {
    const t = (i + 0.5) / ringN
    const lane = (i % 3) - 1
    const [x, y, z] = sampleHexRingLayer(TRUST_LAYER.CORE, t, lane * 0.35)
    write(out, idx, x, y, z, 0.0025)
    writeMeta(
      meta,
      idx,
      TRUST_ROLE.CORE,
      TRUST_CORE_SLOT.RING,
      t,
      lane,
      t * Math.PI * 2,
      roleSpeed(TRUST_ROLE.CORE, i + volumeN)
    )
    idx++
  }

  return idx
}

function fillHexRing(
  out: Float32Array,
  meta: Float32Array,
  idx: number,
  n: number,
  layer: typeof TRUST_LAYER.HEX_INNER | typeof TRUST_LAYER.HEX_MID | typeof TRUST_LAYER.HEX_OUTER,
  role: typeof TRUST_ROLE.HEX_INNER | typeof TRUST_ROLE.HEX_MID | typeof TRUST_ROLE.HEX_OUTER
): number {
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n
    const lane = ((i % 7) - 3) * 0.2
    const [x, y, z] = sampleHexRingLayer(layer, t, lane)
    write(out, idx, x, y, z, 0.0035)
    writeMeta(
      meta,
      idx,
      role,
      layer,
      t,
      lane,
      t * Math.PI * 2 + i * 0.11,
      roleSpeed(role, i)
    )
    idx++
  }
  return idx
}

function fillRadial(
  out: Float32Array,
  meta: Float32Array,
  idx: number,
  n: number
): number {
  const radialEdges = getTrustEdgesByLayer(TRUST_LAYER.RADIAL)
  const bridgeN = Math.floor(n * 0.58)
  const classicN = n - bridgeN
  const layers = 3
  const spokes = TRUST_BRIDGE_SPOKE_COUNT

  for (let i = 0; i < bridgeN; i++) {
    const spoke = i % spokes
    const layer = Math.floor((i % (spokes * layers)) / spokes)
    const band = Math.floor(i / (spokes * layers))
    const along =
      ((Math.floor(i / (spokes * layers)) + 0.5) /
        Math.max(1, Math.ceil(bridgeN / (spokes * layers))) +
        band * 0.03) %
      1
    const [x, y, z] = sampleTrustLogoBridge(spoke, layer, along)
    write(out, idx, x, y, z, 0.0025)
    writeMeta(
      meta,
      idx,
      TRUST_ROLE.RADIAL,
      TRUST_META_SLOT.RADIAL_BRIDGE + layer * 20 + spoke,
      along,
      layer,
      along * Math.PI * 2 + spoke * 0.31,
      roleSpeed(TRUST_ROLE.RADIAL, i)
    )
    idx++
  }

  if (radialEdges.length === 0) return idx

  for (let i = 0; i < classicN; i++) {
    const edge = radialEdges[i % radialEdges.length]
    const band = Math.floor(i / radialEdges.length)
    const t = ((i % radialEdges.length) + 0.5) / radialEdges.length + band * 0.04
    const along = (t + (i % 3) * 0.06) % 1
    const [x, y, z] = sampleTrustEdge(edge.id, along)
    write(out, idx, x, y, z, 0.004)
    writeMeta(
      meta,
      idx,
      TRUST_ROLE.RADIAL,
      edge.slot,
      along,
      edge.id,
      along * Math.PI * 2,
      roleSpeed(TRUST_ROLE.RADIAL, i + bridgeN)
    )
    idx++
  }
  return idx
}

function fillNeural(
  out: Float32Array,
  meta: Float32Array,
  idx: number,
  n: number
): number {
  const neuralEdges = getTrustEdgesByLayer(TRUST_LAYER.NEURAL)
  const latticeN = Math.floor(n * 0.48)
  const hotspotN = Math.floor(n * 0.14)
  const edgeN = n - latticeN - hotspotN
  const bands = 4

  for (let i = 0; i < latticeN; i++) {
    const band = i % bands
    const u = (i + 0.5) / latticeN
    const v = ((i * 3) % 17) / 17
    const [x, y, z] = sampleTrustLatticeNode(band, u, v)
    write(out, idx, x, y, z, 0.003)
    writeMeta(
      meta,
      idx,
      TRUST_ROLE.NEURAL,
      TRUST_META_SLOT.NEURAL_LATTICE + band,
      u,
      v,
      u * Math.PI * 2 + band * 0.55,
      roleSpeed(TRUST_ROLE.NEURAL, i)
    )
    idx++
  }

  for (let i = 0; i < hotspotN; i++) {
    const nodeIndex = i % 18
    const jitter = (i % 5) * 0.001
    const [x, y, z] = sampleTrustNodeHotspot(nodeIndex, jitter)
    write(out, idx, x, y, z, 0.002)
    writeMeta(
      meta,
      idx,
      TRUST_ROLE.NEURAL,
      TRUST_META_SLOT.NEURAL_HOTSPOT + (nodeIndex % 18),
      jitter,
      nodeIndex,
      nodeIndex * 0.42,
      roleSpeed(TRUST_ROLE.NEURAL, i + latticeN)
    )
    idx++
  }

  if (neuralEdges.length === 0) return idx

  for (let i = 0; i < edgeN; i++) {
    const edge = neuralEdges[i % neuralEdges.length]
    const along = ((i + 0.5) / edgeN + edge.slot * 0.011) % 1
    const [x, y, z] = sampleTrustEdge(edge.id, along)
    write(out, idx, x, y, z, 0.004)
    writeMeta(
      meta,
      idx,
      TRUST_ROLE.NEURAL,
      edge.slot,
      along,
      edge.id,
      along * Math.PI * 4 + i * 0.07,
      roleSpeed(TRUST_ROLE.NEURAL, i + latticeN + hotspotN)
    )
    idx++
  }
  return idx
}

function fillValidation(
  out: Float32Array,
  meta: Float32Array,
  idx: number,
  n: number
): number {
  const paths = getTrustPathsByKind(TRUST_PATH_KIND.VALIDATION_LOOP)
  const quantumN = Math.floor(n * 0.42)
  const classicN = n - quantumN
  const loopIds = [
    TRUST_VALIDATION_LOOP.INNER,
    TRUST_VALIDATION_LOOP.MID,
    TRUST_VALIDATION_LOOP.OUTER,
    TRUST_VALIDATION_LOOP.QUANTUM_CROSS,
  ]

  for (let i = 0; i < quantumN; i++) {
    const loopId = loopIds[i % loopIds.length]
    const lane = Math.floor(i / loopIds.length) % 3
    const t = ((i + 0.5) / quantumN + loopId * 0.017) % 1
    const [x, y, z] = sampleTrustQuantumValidation(loopId, t, lane)
    write(out, idx, x, y, z, 0.0025)
    writeMeta(
      meta,
      idx,
      TRUST_ROLE.VALIDATION,
      TRUST_META_SLOT.VALIDATION_QUANTUM + loopId,
      t,
      lane,
      t * Math.PI * 2 + loopId * 0.22,
      roleSpeed(TRUST_ROLE.VALIDATION, i)
    )
    idx++
  }

  if (paths.length === 0) return idx

  for (let i = 0; i < classicN; i++) {
    const path = paths[i % paths.length]
    const t = ((i + 0.5) / classicN + path.slot * 0.019) % 1
    const [x, y, z] = sampleTrustPath(path.id, t)
    write(out, idx, x, y, z, 0.003)
    writeMeta(
      meta,
      idx,
      TRUST_ROLE.VALIDATION,
      path.slot,
      t,
      path.id,
      t * Math.PI * 2 + i * 0.13,
      roleSpeed(TRUST_ROLE.VALIDATION, i + quantumN)
    )
    idx++
  }
  return idx
}

function fillFlow(
  out: Float32Array,
  meta: Float32Array,
  idx: number,
  n: number
): number {
  const paths = getTrustPathsByKind(TRUST_PATH_KIND.FLOW_EDGE)
  const circuitN = Math.floor(n * 0.44)
  const classicN = n - circuitN
  const circuits = 8

  for (let i = 0; i < circuitN; i++) {
    const circuitId = i % circuits
    const t = ((i + 0.5) / circuitN + circuitId * 0.011) % 1
    const [x, y, z] = sampleTrustEnergyCircuit(circuitId, t)
    write(out, idx, x, y, z, 0.003)
    writeMeta(
      meta,
      idx,
      TRUST_ROLE.FLOW,
      TRUST_META_SLOT.FLOW_CIRCUIT + circuitId,
      t,
      circuitId,
      t * Math.PI * 2 + circuitId * 0.18,
      roleSpeed(TRUST_ROLE.FLOW, i)
    )
    idx++
  }

  if (paths.length === 0) return idx

  for (let i = 0; i < classicN; i++) {
    const path = paths[i % paths.length]
    const t = ((i + 0.5) / classicN + path.slot * 0.008) % 1
    const [x, y, z] = sampleTrustPath(path.id, t)
    write(out, idx, x, y, z, 0.003)
    writeMeta(
      meta,
      idx,
      TRUST_ROLE.FLOW,
      path.slot,
      t,
      path.id,
      t * Math.PI * 2 + i * 0.09,
      roleSpeed(TRUST_ROLE.FLOW, i + circuitN)
    )
    idx++
  }
  return idx
}

/** Neblina estructurada — corona hex alrededor del perímetro exterior. */
function fillAura(
  out: Float32Array,
  meta: Float32Array,
  idx: number,
  n: number
): number {
  const outerR = 1.06 * TRUST_OUTER_RING_MULT * TRUST_SHIELD_VISUAL_SCALE
  const blueprint = getTrustShieldBlueprint()

  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n
    const shellBand = (i % 4) * 0.028 + 0.06
    const lane = ((i % 6) - 2.5) * 0.22
    const [bx, by, bz] = sampleHexRingLayer(TRUST_LAYER.HEX_OUTER, t, lane)

    const cx = blueprint.nodeById.get(0)?.position[0] ?? 0
    const cy = blueprint.nodeById.get(0)?.position[1] ?? 0
    const dx = bx - cx
    const dy = by - cy
    const len = Math.hypot(dx, dy) || 1
    const nx = dx / len
    const ny = dy / len
    const r = outerR + shellBand
    const x = cx + nx * r
    const y = cy + ny * r
    const z = bz * 0.65 + Math.sin(t * Math.PI * 2 * 3) * 0.012

    write(out, idx, x, y, z, 0.009)
    writeMeta(
      meta,
      idx,
      TRUST_ROLE.AURA,
      TRUST_AURA_SLOT.OUTER_SHELL,
      t,
      shellBand,
      t * Math.PI * 2 + i * 0.17,
      roleSpeed(TRUST_ROLE.AURA, i)
    )
    idx++
  }
  return idx
}

export function buildTrustQuantumShield(count: number): {
  positions: Float32Array
  meta: Float32Array
} {
  getTrustShieldBlueprint(count)
  const b = computeTrustMorphBudget(count)
  const out = new Float32Array(count * 3)
  const meta = new Float32Array(count * TRUST_META_STRIDE)
  let idx = 0

  idx = fillLogoMask(out, meta, idx, b.logoMask)
  idx = fillLogoNucleus(out, meta, idx, b.logoNucleus)
  idx = fillLogoHalo(out, meta, idx, b.logoHalo)
  idx = fillLogoFog(out, meta, idx, b.logoFog)
  idx = fillCoreEnergy(out, meta, idx, b.coreVolume, b.coreRing)
  idx = fillSecondaryLayer(out, meta, idx, b.secondary)
  idx = fillHexRing(out, meta, idx, b.hexInner, TRUST_LAYER.HEX_INNER, TRUST_ROLE.HEX_INNER)
  idx = fillHexRing(out, meta, idx, b.hexMid, TRUST_LAYER.HEX_MID, TRUST_ROLE.HEX_MID)
  idx = fillHexRing(out, meta, idx, b.hexOuter, TRUST_LAYER.HEX_OUTER, TRUST_ROLE.HEX_OUTER)
  idx = fillRadial(out, meta, idx, b.radial)
  idx = fillNeural(out, meta, idx, b.neural)
  idx = fillValidation(out, meta, idx, b.validation)
  idx = fillFlow(out, meta, idx, b.flow)
  idx = fillVolumetricAura(out, meta, idx, b.volumetric)

  if (b.outerAura > 0) {
    idx = fillAura(out, meta, idx, b.outerAura)
  }

  return { positions: out, meta }
}

export function genTrustQuantumShield(count: number): Float32Array {
  const { positions, meta } = buildTrustQuantumShield(count)
  cachedTrustMeta = meta
  cachedTrustCount = count
  return positions
}

export function getTrustShieldMeta(): Float32Array | null {
  return cachedTrustMeta
}

export function getTrustShieldRoleStats(
  meta: Float32Array | null = cachedTrustMeta,
  count = cachedTrustCount || PARTICLE_COUNT
): TrustRoleStats {
  const byRole: TrustRoleStats['byRole'] = {
    CORE: 0,
    HEX_INNER: 0,
    HEX_MID: 0,
    HEX_OUTER: 0,
    RADIAL: 0,
    NEURAL: 0,
    VALIDATION: 0,
    FLOW: 0,
    AURA: 0,
  }

  if (!meta) {
    return { total: 0, byRole }
  }

  for (let i = 0; i < count; i++) {
    const role = meta[i * TRUST_META_STRIDE] as TrustRoleId
    switch (role) {
      case TRUST_ROLE.CORE:
        byRole.CORE++
        break
      case TRUST_ROLE.HEX_INNER:
        byRole.HEX_INNER++
        break
      case TRUST_ROLE.HEX_MID:
        byRole.HEX_MID++
        break
      case TRUST_ROLE.HEX_OUTER:
        byRole.HEX_OUTER++
        break
      case TRUST_ROLE.RADIAL:
        byRole.RADIAL++
        break
      case TRUST_ROLE.NEURAL:
        byRole.NEURAL++
        break
      case TRUST_ROLE.VALIDATION:
        byRole.VALIDATION++
        break
      case TRUST_ROLE.FLOW:
        byRole.FLOW++
        break
      case TRUST_ROLE.AURA:
        byRole.AURA++
        break
    }
  }

  return {
    total: count,
    byRole,
  }
}

export function getTrustParticleBounds(
  positions: Float32Array,
  count = positions.length / 3
): TrustParticleBounds {
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  let minZ = Infinity
  let maxZ = -Infinity

  for (let i = 0; i < count; i++) {
    const bi = i * 3
    const x = positions[bi]
    const y = positions[bi + 1]
    const z = positions[bi + 2]
    if (x < minX) minX = x
    if (x > maxX) maxX = x
    if (y < minY) minY = y
    if (y > maxY) maxY = y
    if (z < minZ) minZ = z
    if (z > maxZ) maxZ = z
  }

  return { minX, maxX, minY, maxY, minZ, maxZ }
}
