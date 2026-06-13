/**
 * Phase 4 — Quantum Trust Shield architecture (logo-adjacent layers only).
 * Bridges · lattice · validation circuits · volumetric depth · node hotspots.
 * Does NOT modify GenesisLogoMaskSampler.
 */
import { getGenesisLogoSilhouetteRadius } from './GenesisLogoMaskSampler'
import {
  TRUST_DEPTH_Z_SCALE,
  TRUST_LAYER,
  TRUST_SHIELD_VISUAL_SCALE,
  sampleHexRingLayer,
  type Vec3,
} from './TrustShieldLayout'

const S = TRUST_SHIELD_VISUAL_SCALE

/** Bridge target: inner / mid / outer hex shell. */
export const TRUST_BRIDGE_LAYER = {
  INNER: 0,
  MID: 1,
  OUTER: 2,
} as const

export const TRUST_LATTICE_BAND = {
  LOGO_TO_INNER: 0,
  INNER_TO_MID: 1,
  MID_TO_OUTER: 2,
  OUTER_CROWN: 3,
} as const

export const TRUST_VALIDATION_LOOP = {
  INNER: 0,
  MID: 1,
  OUTER: 2,
  QUANTUM_CROSS: 3,
} as const

const BRIDGE_SPOKES = 12

function logoEdgeRadius(): number {
  return getGenesisLogoSilhouetteRadius()
}

function hexRadius(layer: number): number {
  if (layer === TRUST_BRIDGE_LAYER.INNER) return 0.36 * S
  if (layer === TRUST_BRIDGE_LAYER.MID) return 0.68 * S
  return 1.06 * 1.12 * S
}

function depthZ(base: number, band: number): number {
  return (base + band * 0.006) * S * TRUST_DEPTH_Z_SCALE
}

/** Visible bridge: logo silhouette → inner / mid / outer shield. */
export function sampleTrustLogoBridge(
  spokeIndex: number,
  layer: number,
  t: number
): Vec3 {
  const angle = (spokeIndex / BRIDGE_SPOKES) * Math.PI * 2 - Math.PI * 0.5
  const r0 = logoEdgeRadius()
  const r1 = hexRadius(layer)
  const travel = t * t * (3 - 2 * t)
  const r = r0 + (r1 - r0) * travel
  const wobble = Math.sin(t * Math.PI * 3 + spokeIndex * 0.4) * 0.004 * S
  const nx = Math.cos(angle)
  const ny = Math.sin(angle)
  const z = depthZ(0.022 + layer * 0.008, spokeIndex % 3) + wobble * 0.5
  return [nx * (r + wobble), ny * (r + wobble), z]
}

/** Trust lattice — triangulated nodes between concentric shells. */
export function sampleTrustLatticeNode(band: number, u: number, v: number): Vec3 {
  const rInner =
    band === TRUST_LATTICE_BAND.LOGO_TO_INNER
      ? logoEdgeRadius() * 1.04
      : band === TRUST_LATTICE_BAND.INNER_TO_MID
        ? 0.36 * S
        : band === TRUST_LATTICE_BAND.MID_TO_OUTER
          ? 0.68 * S
          : 1.02 * 1.12 * S

  const rOuter =
    band === TRUST_LATTICE_BAND.LOGO_TO_INNER
      ? 0.36 * S
      : band === TRUST_LATTICE_BAND.INNER_TO_MID
        ? 0.68 * S
        : band === TRUST_LATTICE_BAND.MID_TO_OUTER
          ? 1.06 * 1.12 * S
          : 1.18 * 1.12 * S

  const theta = u * Math.PI * 2
  const radialT = v
  const r = rInner + (rOuter - rInner) * radialT
  const tri = Math.sin(theta * 3 + band * 1.2) * 0.012 * S * (1 - radialT * 0.5)
  return [
    Math.cos(theta) * (r + tri),
    Math.sin(theta) * (r + tri),
    depthZ(0.018 + band * 0.01, Math.floor(u * 5)) + Math.sin(theta * 2) * 0.008 * S,
  ]
}

/** Quantum validation route — hex loop + cross-field lemniscate. */
export function sampleTrustQuantumValidation(
  loopId: number,
  t: number,
  lane = 0
): Vec3 {
  if (loopId === TRUST_VALIDATION_LOOP.QUANTUM_CROSS) {
    const a = t * Math.PI * 2
    const scale = 0.52 * S
    const x = Math.sin(a) * scale * (1 + lane * 0.04)
    const y = Math.sin(a * 2) * scale * 0.48 * (1 + lane * 0.03)
    return [x, y, depthZ(0.028, lane) + Math.cos(a) * 0.012 * S]
  }

  const layer =
    loopId === TRUST_VALIDATION_LOOP.INNER
      ? TRUST_LAYER.HEX_INNER
      : loopId === TRUST_VALIDATION_LOOP.MID
        ? TRUST_LAYER.HEX_MID
        : TRUST_LAYER.HEX_OUTER

  const [bx, by, bz] = sampleHexRingLayer(layer, t, lane * 0.28)
  return [bx, by, bz + depthZ(0.012, loopId)]
}

/** Energy circulation — orbital flow between mid and outer shells. */
export function sampleTrustEnergyCircuit(circuitId: number, t: number): Vec3 {
  const circuits = 8
  const cid = circuitId % circuits
  const baseAngle = (cid / circuits) * Math.PI * 2
  const orbitT = t * Math.PI * 2 + baseAngle
  const rMid = 0.68 * S
  const rOuter = 1.02 * 1.12 * S
  const r = rMid + (rOuter - rMid) * (0.35 + 0.5 * Math.sin(t * Math.PI * 2))
  const x = Math.cos(orbitT) * r
  const y = Math.sin(orbitT) * r
  const z = depthZ(0.02, cid % 4) + Math.sin(orbitT * 2) * 0.014 * S
  return [x, y, z]
}

/** Deep volumetric shell — institutional depth field. */
export function sampleTrustVolumetricDeep(
  theta: number,
  phi: number,
  band: number
): Vec3 {
  const outer = logoEdgeRadius()
  const shellR = outer * (1.22 + band * 0.16)
  const x = shellR * Math.sin(phi) * Math.cos(theta)
  const y = shellR * Math.sin(phi) * Math.sin(theta)
  const z =
    shellR * Math.cos(phi) * 0.48 * TRUST_DEPTH_Z_SCALE +
    band * 0.012 * S +
    Math.sin(theta * 4) * 0.008 * S
  return [x, y, z]
}

/** Intelligent node hotspot — hex vertices + ring junctions. */
export function sampleTrustNodeHotspot(nodeIndex: number, jitter = 0): Vec3 {
  const layerPick = nodeIndex % 3
  const layer =
    layerPick === 0
      ? TRUST_LAYER.HEX_INNER
      : layerPick === 1
        ? TRUST_LAYER.HEX_MID
        : TRUST_LAYER.HEX_OUTER
  const corner = Math.floor(nodeIndex / 3) % 6
  const t = corner / 6 + 0.001 * jitter
  const [x, y, z] = sampleHexRingLayer(layer, t, 0)
  return [x, y, z + depthZ(0.014, corner)]
}

export const TRUST_BRIDGE_SPOKE_COUNT = BRIDGE_SPOKES

/** Meta slot bands — decode in Generator / Morph (logo slots untouched). */
export const TRUST_META_SLOT = {
  RADIAL_BRIDGE: 100,
  NEURAL_LATTICE: 50,
  NEURAL_HOTSPOT: 80,
  VALIDATION_QUANTUM: 10,
  FLOW_CIRCUIT: 1000,
  AURA_DEEP_SHELL: 8,
} as const

export function decodeRadialBridgeSlot(slot: number): {
  layer: number
  spoke: number
} | null {
  if (slot < TRUST_META_SLOT.RADIAL_BRIDGE) return null
  const local = slot - TRUST_META_SLOT.RADIAL_BRIDGE
  return { layer: Math.floor(local / 20), spoke: local % 20 }
}

export function decodeNeuralLatticeSlot(slot: number): number | null {
  if (slot < TRUST_META_SLOT.NEURAL_LATTICE || slot >= TRUST_META_SLOT.NEURAL_HOTSPOT) {
    return null
  }
  return slot - TRUST_META_SLOT.NEURAL_LATTICE
}

export function decodeValidationQuantumSlot(slot: number): number | null {
  if (slot < TRUST_META_SLOT.VALIDATION_QUANTUM) return null
  return slot - TRUST_META_SLOT.VALIDATION_QUANTUM
}

export function decodeFlowCircuitSlot(slot: number): number | null {
  if (slot < TRUST_META_SLOT.FLOW_CIRCUIT) return null
  return slot - TRUST_META_SLOT.FLOW_CIRCUIT
}
