/**
 * Genesis Quantum Trust Shield — Morph & Formation (Phase 2).
 * Origin Orb scatter · activación por rol · helpers de pulso futuros.
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
import { resolveGenesisLogoMaskPosition } from './GenesisLogoMaskSampler'
import { applyGenesisLogoOrientation } from './GenesisLogoOrientation'
import {
  computeGenesisNucleusPosition,
  computeShieldFromLogoBias,
  computeLockedLogoMaskPosition,
  isGenesisLogoOuterRay,
} from './GenesisStardustEntity'
import {
  TRUST_LAYER,
  TRUST_META_STRIDE,
  TRUST_OUTER_RING_MULT,
  TRUST_SHIELD_VISUAL_SCALE,
  sampleCoreVolume,
  sampleHexRingLayer,
  sampleTrustEdge,
  sampleTrustPath,
  getTrustShieldBlueprint,
  type Vec3,
} from './TrustShieldLayout'
import { TRUST_ROLE, type TrustRoleId } from './trustShieldRoles'
import {
  TRUST_META_SLOT,
  decodeFlowCircuitSlot,
  decodeNeuralLatticeSlot,
  decodeRadialBridgeSlot,
  decodeValidationQuantumSlot,
  sampleTrustEnergyCircuit,
  sampleTrustLogoBridge,
  sampleTrustLatticeNode,
  sampleTrustNodeHotspot,
  sampleTrustQuantumValidation,
  sampleTrustVolumetricDeep,
} from './TrustShieldQuantumArchitecture'
import { armonico, LLEGADA_ESTABLECIMIENTO_S } from '@/lib/design/motion'

/**
 * Los seis tempos de Trust, ahora en acorde.
 *
 * Valian 4 · 3,5 · 2,4 · 3,6 · 4,8 · 2,2 — seis ritmos y ninguno multiplo de
 * otro, en la seccion que establece el tono del portal entero. Ahora son
 * divisiones exactas del pulso de Trust, asi que las capas vuelven a coincidir
 * en cada ciclo. Los desplazamientos son minimos (3,5→4 · 2,4→2 · 3,6→4 ·
 * 2,2→2); el unico apreciable es la respiracion del aura, y un fondo mas
 * calmado que su contenido es lo correcto.
 */
export const TRUST_FORM_DURATION = LLEGADA_ESTABLECIMIENTO_S
export const TRUST_CORE_PULSE_CYCLE = armonico('trust', 2)
export const TRUST_VALIDATION_LOOP = armonico('trust', 4)
export const TRUST_FLOW_LOOP = armonico('trust', 2)
export const TRUST_AURA_BREATH_CYCLE = armonico('trust', 1)
export const TRUST_NEURAL_PULSE_CYCLE = armonico('trust', 4)

/** Phase 5.2 — logo → shield morph timeline (morphT 0→1). */
export const TRUST_FORM_BEATS = {
  LOGO: 0,
  HEX_INNER: 0.25,
  BRIDGES: 0.5,
  HEX_OUTER: 0.75,
  SHIELD_COMPLETE: 1,
} as const

/** Ventanas de formación — logo excluido (entidad permanente). */
const ROLE_FORM_WINDOW: Record<
  TrustRoleId,
  { start: number; end: number }
> = {
  [TRUST_ROLE.CORE]: { start: 0, end: 0.08 },
  [TRUST_ROLE.HEX_INNER]: { start: TRUST_FORM_BEATS.HEX_INNER, end: 0.42 },
  [TRUST_ROLE.HEX_MID]: { start: 0.3, end: 0.58 },
  [TRUST_ROLE.HEX_OUTER]: { start: TRUST_FORM_BEATS.HEX_OUTER, end: 0.92 },
  [TRUST_ROLE.RADIAL]: { start: TRUST_FORM_BEATS.BRIDGES, end: 0.88 },
  [TRUST_ROLE.NEURAL]: { start: 1.05, end: 1.05 },
  [TRUST_ROLE.VALIDATION]: { start: 0.62, end: 0.88 },
  [TRUST_ROLE.FLOW]: { start: 0.68, end: 0.92 },
  [TRUST_ROLE.AURA]: { start: 0.72, end: TRUST_FORM_BEATS.SHIELD_COMPLETE },
}

function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v))
}

function easeOutCubic(t: number): number {
  return 1 - (1 - clamp01(t)) ** 3
}

function lerpVec(a: Vec3, b: Vec3, t: number): Vec3 {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
}

/**
 * Esfera compacta Genesis Origin Orb — Hero → Trust (prevSection < 1).
 */
export function scatterTrustFromOriginOrb(count: number): Float32Array {
  const scatter = new Float32Array(count * 3)
  const rMax = 0.28 * TRUST_SHIELD_VISUAL_SCALE

  for (let i = 0; i < count; i++) {
    const bi = i * 3
    const u = (i + 0.5) / count
    const v = ((i * 7) % 11) / 11
    const theta = u * Math.PI * 2
    const phi = Math.acos(2 * v - 1)
    const r = rMax * Math.cbrt((i % 13) / 13) * (0.72 + (i % 4) * 0.06)
    scatter[bi] = r * Math.sin(phi) * Math.cos(theta)
    scatter[bi + 1] = r * Math.sin(phi) * Math.sin(theta)
    scatter[bi + 2] = r * Math.cos(phi) * 0.52
  }

  return scatter
}

/** Compact centered seed — direct #trust load or re-entry reset. */
export function scatterTrustFromLogoSeed(count: number): Float32Array {
  const scatter = new Float32Array(count * 3)
  const rMax = 0.07 * TRUST_SHIELD_VISUAL_SCALE

  for (let i = 0; i < count; i++) {
    const bi = i * 3
    const u = (i + 0.5) / count
    const a = u * Math.PI * 2
    const r = rMax * (0.35 + ((i * 5) % 7) / 7 * 0.65)
    scatter[bi] = Math.cos(a) * r
    scatter[bi + 1] = Math.sin(a) * r
    scatter[bi + 2] = 0
  }

  return scatter
}

/** Neural spread from below — Mining/lower sections → Trust (prevSection > 1). */
export function scatterTrustFromNeuralSpread(count: number): Float32Array {
  const scatter = new Float32Array(count * 3)
  const s = TRUST_SHIELD_VISUAL_SCALE

  for (let i = 0; i < count; i++) {
    const bi = i * 3
    const ring = (i % 19) / 19
    const a = ring * Math.PI * 2 + ((i * 11) % 360) * (Math.PI / 180)
    const r = (0.95 + (i % 8) * 0.11) * s
    scatter[bi] = Math.cos(a) * r * 0.62
    scatter[bi + 1] = (-0.55 - (i % 11) * 0.045) * s
    scatter[bi + 2] = Math.sin(a * 0.5) * 0.1 * s
  }

  return scatter
}

export type TrustScatterMode = 'origin' | 'seed' | 'neural'

export function scatterTrustForEntry(count: number, mode: TrustScatterMode): Float32Array {
  switch (mode) {
    case 'seed':
      return scatterTrustFromLogoSeed(count)
    case 'neural':
      return scatterTrustFromNeuralSpread(count)
    default:
      return scatterTrustFromOriginOrb(count)
  }
}

/** Phase 4.7.1 — locked logo particles start at PNG target, never at orb scatter. */
export function isTrustLogoLockedSlot(role: TrustRoleId, slot: number): boolean {
  return (
    role === TRUST_ROLE.CORE &&
    (slot === TRUST_CORE_SLOT.LOGO_MASK || slot === TRUST_CORE_SLOT.LOGO_NUCLEUS)
  )
}

/**
 * Scatter buffer for Trust entry — logo mask/nucleus seeded at final PNG geometry.
 */
export function scatterTrustFormationStart(
  meta: Float32Array,
  count: number,
  mode: TrustScatterMode
): Float32Array {
  const scatter = scatterTrustForEntry(count, mode)
  for (let i = 0; i < count; i++) {
    const mi = i * TRUST_META_STRIDE
    const role = meta[mi] as TrustRoleId
    const slot = meta[mi + 1]
    if (!isTrustLogoLockedSlot(role, slot)) continue
    const [x, y, z] = resolveTrustShieldTargetPosition(meta, i)
    const bi = i * 3
    scatter[bi] = x
    scatter[bi + 1] = y
    scatter[bi + 2] = z
  }
  return scatter
}

/**
 * Phase 4.7.1 — permanent logo entity.
 * Position from PNG sampler + allowed micro-orbit only (no formation morph).
 */
export function computeTrustLockedLogoPosition(
  meta: Float32Array,
  i: number,
  t: number,
  motion: number
): Vec3 {
  const mi = i * TRUST_META_STRIDE
  const slot = meta[mi + 1]
  const param = meta[mi + 2]
  const aux = meta[mi + 3]
  const phase = meta[mi + 4]
  const speed = meta[mi + 5]

  if (slot === TRUST_CORE_SLOT.LOGO_MASK) {
    const isRay = isGenesisLogoOuterRay(aux)
    return applyGenesisLogoOrientation(...computeLockedLogoMaskPosition(aux, t, phase, motion, isRay))
  }
  if (slot === TRUST_CORE_SLOT.LOGO_NUCLEUS) {
    return applyGenesisLogoOrientation(...computeGenesisNucleusPosition(param, t, phase, motion))
  }
  return applyGenesisLogoOrientation(...resolveGenesisLogoMaskPosition(aux))
}

function getTrustFormationBlend(
  role: TrustRoleId,
  slot: number,
  formT: number
): number {
  if (isTrustLogoLockedSlot(role, slot)) {
    return 1
  }
  if (role === TRUST_ROLE.CORE && slot === TRUST_CORE_SLOT.LOGO_HALO) {
    return easeOutCubic(clamp01(formT / TRUST_FORM_BEATS.HEX_INNER))
  }
  if (role === TRUST_ROLE.CORE && slot === TRUST_CORE_SLOT.ENERGY_FOG) {
    return easeOutCubic(clamp01((formT - TRUST_FORM_BEATS.HEX_INNER * 0.5) / 0.2))
  }
  return getTrustRoleActivation(role, formT)
}

/** Progreso lineal 0–1 de formación para un rol dado. */
export function roleActivation(role: TrustRoleId, formT: number): number {
  const window = ROLE_FORM_WINDOW[role] ?? { start: 0, end: 1 }
  if (formT <= window.start) return 0
  if (formT >= window.end) return 1
  return (formT - window.start) / (window.end - window.start)
}

/** Alias export — curva de activación con ease out. */
export function getTrustRoleActivation(role: TrustRoleId, formT: number): number {
  return easeOutCubic(roleActivation(role, formT))
}

/** Posición objetivo en reposo reconstruida desde meta (sin jitter del generator). */
export function resolveTrustShieldTargetPosition(
  meta: Float32Array,
  i: number
): Vec3 {
  const mi = i * TRUST_META_STRIDE
  const role = meta[mi] as TrustRoleId
  const slot = meta[mi + 1]
  const param = meta[mi + 2]
  const aux = meta[mi + 3]

  if (role === TRUST_ROLE.CORE) {
    if (slot === TRUST_CORE_SLOT.VOLUME) {
      const u = aux / (Math.PI * 2)
      return sampleCoreVolume(u, param)
    }
    if (slot === TRUST_CORE_SLOT.RING) {
      return sampleHexRingLayer(TRUST_LAYER.CORE, param, aux * 0.35)
    }
    if (slot === TRUST_CORE_SLOT.LOGO_MASK) {
      return applyGenesisLogoOrientation(...resolveGenesisLogoMaskPosition(aux))
    }
    if (slot === TRUST_CORE_SLOT.LOGO_NUCLEUS) {
      return applyGenesisLogoOrientation(...computeGenesisNucleusPosition(param, 0, aux, 0))
    }
    if (slot === TRUST_CORE_SLOT.LOGO_HALO) {
      return sampleGenesisLogoHalo(param, aux, Math.floor(param * 3) % 3)
    }
    if (slot === TRUST_CORE_SLOT.ENERGY_FOG) {
      return sampleGenesisEnergyFog(param, aux)
    }
    if (slot === TRUST_CORE_SLOT.SECONDARY) {
      return sampleGenesisSecondaryHalo(param, aux)
    }
    return sampleCoreVolume(aux / (Math.PI * 2), param)
  }

  if (role === TRUST_ROLE.HEX_INNER) {
    return sampleHexRingLayer(TRUST_LAYER.HEX_INNER, param, aux)
  }

  if (role === TRUST_ROLE.HEX_MID) {
    return sampleHexRingLayer(TRUST_LAYER.HEX_MID, param, aux)
  }

  if (role === TRUST_ROLE.HEX_OUTER) {
    return sampleHexRingLayer(TRUST_LAYER.HEX_OUTER, param, aux)
  }

  if (role === TRUST_ROLE.RADIAL) {
    const bridge = decodeRadialBridgeSlot(slot)
    if (bridge) {
      return sampleTrustLogoBridge(bridge.spoke, bridge.layer, param)
    }
    return sampleTrustEdge(aux, param)
  }

  if (role === TRUST_ROLE.NEURAL) {
    const band = decodeNeuralLatticeSlot(slot)
    if (band !== null) {
      return sampleTrustLatticeNode(band, param, aux)
    }
    if (slot >= TRUST_META_SLOT.NEURAL_HOTSPOT) {
      return sampleTrustNodeHotspot(aux, param)
    }
    return sampleTrustEdge(aux, param)
  }

  if (role === TRUST_ROLE.VALIDATION) {
    const loopId = decodeValidationQuantumSlot(slot)
    if (loopId !== null) {
      return sampleTrustQuantumValidation(loopId, param, aux)
    }
    return sampleTrustPath(aux, param)
  }

  if (role === TRUST_ROLE.FLOW) {
    const circuitId = decodeFlowCircuitSlot(slot)
    if (circuitId !== null) {
      return sampleTrustEnergyCircuit(circuitId, param)
    }
    return sampleTrustPath(aux, param)
  }

  if (role === TRUST_ROLE.AURA) {
    if (slot >= TRUST_META_SLOT.AURA_DEEP_SHELL && slot < TRUST_META_SLOT.AURA_DEEP_SHELL + 4) {
      const band = slot - TRUST_META_SLOT.AURA_DEEP_SHELL
      const theta = param * Math.PI * 2
      const phi = Math.acos(2 * aux - 1) * 0.52 + 0.24
      return sampleTrustVolumetricDeep(theta, phi, band)
    }
    if (slot <= TRUST_AURA_SLOT.VOLUMETRIC_CROWN) {
      const theta = param * Math.PI * 2
      const phi = Math.acos(2 * aux - 1) * 0.55 + 0.22
      return sampleGenesisVolumetricShell(theta, phi, slot)
    }
    if (slot === TRUST_AURA_SLOT.FOG_NEAR || slot === TRUST_AURA_SLOT.FOG_FAR) {
      return sampleGenesisEnergyFog(param, aux)
    }

    const outerR = 1.06 * TRUST_OUTER_RING_MULT * TRUST_SHIELD_VISUAL_SCALE
    const blueprint = getTrustShieldBlueprint()
    const t = param
    const shellBand = aux
    const lane = ((slot % 6) - 2.5) * 0.22
    const [bx, by, bz] = sampleHexRingLayer(TRUST_LAYER.HEX_OUTER, t, lane)
    const cx = blueprint.nodeById.get(0)?.position[0] ?? 0
    const cy = blueprint.nodeById.get(0)?.position[1] ?? 0
    const dx = bx - cx
    const dy = by - cy
    const len = Math.hypot(dx, dy) || 1
    const nx = dx / len
    const ny = dy / len
    const r = outerR + shellBand
    return [cx + nx * r, cy + ny * r, bz * 0.65 + Math.sin(t * Math.PI * 2 * 3) * 0.012]
  }

  return [0, 0, 0]
}

/** Pulso lento del núcleo Genesis — para brillo futuro. */
export function computeTrustCorePulse(t: number, phase: number): number {
  const cycle = TRUST_CORE_PULSE_CYCLE
  return 0.5 + 0.5 * Math.sin((t + phase * 0.38) * ((Math.PI * 2) / cycle))
}

/** Pulso de validación blanca a lo largo de rutas de validación. */
export function computeTrustValidationPulse(
  t: number,
  phase: number,
  speed: number,
  slot: number,
  param: number
): number {
  const travel = ((t / TRUST_VALIDATION_LOOP) * (0.92 + speed * 0.14) + phase * 0.1 + slot * 0.05) % 1
  const d = Math.abs(travel - param)
  const wrap = Math.min(d, 1 - d)
  return Math.max(0, 1 - wrap * 11) ** 2.4
}

/** Fase de viaje para flujo eléctrico azul — t ∈ [0,1] sobre path. */
export function computeTrustFlowTravel(
  t: number,
  phase: number,
  speed: number,
  param: number
): number {
  return ((t / TRUST_FLOW_LOOP) * (0.95 + speed * 0.16) + phase * 0.08 + param * 0.03) % 1
}

/** Intelligent node hotspot pulse — hex junctions and lattice nodes. */
export function computeTrustNeuralHotspot(
  t: number,
  phase: number,
  slot: number,
  param: number
): number {
  const cycle = TRUST_NEURAL_PULSE_CYCLE
  const wave = Math.sin((t + phase * 0.52 + slot * 0.18) * ((Math.PI * 2) / cycle))
  const local = Math.sin(param * Math.PI * 8 + t * 1.6)
  return Math.max(0, wave * 0.5 + 0.5) * Math.max(0, local * 0.35 + 0.65)
}

/** Energy circulation along logo bridges. */
export function computeTrustBridgeEnergy(
  t: number,
  phase: number,
  speed: number,
  param: number,
  layer: number
): number {
  const travel = ((t * (0.38 + layer * 0.08 + speed * 0.06) + phase * 0.12) % 1)
  const d = Math.abs(travel - param)
  const wrap = Math.min(d, 1 - d)
  return Math.max(0, 1 - wrap * 10) ** 2.6
}

/** Respiración suave de la corona AURA. */
export function computeTrustAuraBreath(t: number, phase: number, motion: number): number {
  const cycle = TRUST_AURA_BREATH_CYCLE
  return Math.sin((t + phase * 0.45) * ((Math.PI * 2) / cycle)) * 0.5 * motion
}

/**
 * Posición durante formación: scatter Origin Orb → escudo final.
 * `formT` ∈ [0,1] — tiempo normalizado de formación de sección.
 * `t` — tiempo absoluto del clock (pulsos sutiles post-formación).
 */
export function computeTrustFormationPosition(
  meta: Float32Array,
  i: number,
  scatter: Float32Array,
  formT: number,
  t: number,
  motion: number
): Vec3 {
  const mi = i * TRUST_META_STRIDE
  const role = meta[mi] as TrustRoleId
  const slot = meta[mi + 1]
  const param = meta[mi + 2]
  const aux = meta[mi + 3]
  const phase = meta[mi + 4]
  const speed = meta[mi + 5]

  if (isTrustLogoLockedSlot(role, slot)) {
    return computeTrustLockedLogoPosition(meta, i, t, motion)
  }

  const bi = i * 3
  const origin: Vec3 = [scatter[bi], scatter[bi + 1], scatter[bi + 2]]
  const target = resolveTrustShieldTargetPosition(meta, i)
  const blend = getTrustFormationBlend(role, slot, formT)

  let [x, y, z] = lerpVec(origin, target, blend)

  if (blend >= 0.94) {
    if (role === TRUST_ROLE.CORE) {
      const isLogoHalo = slot === TRUST_CORE_SLOT.LOGO_HALO
      const pulse = computeTrustCorePulse(t, phase)
      if (isLogoHalo) {
        z += (pulse - 0.5) * 0.004 * TRUST_SHIELD_VISUAL_SCALE * motion
      } else if (slot === TRUST_CORE_SLOT.ENERGY_FOG) {
        const expand = 1 + (pulse - 0.5) * 0.02 * motion
        x *= expand
        y *= expand
        z += (pulse - 0.5) * 0.003 * TRUST_SHIELD_VISUAL_SCALE * motion
      } else if (slot !== TRUST_CORE_SLOT.RING) {
        const expand = 1 + (pulse - 0.5) * 0.035 * motion
        x *= expand
        y *= expand
        z += (pulse - 0.5) * 0.005 * TRUST_SHIELD_VISUAL_SCALE * motion
      }
    }

    if (role === TRUST_ROLE.FLOW) {
      const travel = computeTrustFlowTravel(t, phase, speed, param)
      const pathPos = sampleTrustPath(aux, travel)
      const follow = 0.035 * motion * blend
      x += (pathPos[0] - x) * follow
      y += (pathPos[1] - y) * follow
      z += (pathPos[2] - z) * follow
    }

    if (role === TRUST_ROLE.VALIDATION) {
      const pulse = computeTrustValidationPulse(t, phase, speed, slot, param)
      if (pulse > 0.05) {
        const push = pulse * 0.01 * TRUST_SHIELD_VISUAL_SCALE * motion
        x += push * Math.cos(phase)
        y += push * Math.sin(phase)
      }
    }

    if (
      role === TRUST_ROLE.HEX_INNER ||
      role === TRUST_ROLE.HEX_MID ||
      role === TRUST_ROLE.HEX_OUTER ||
      role === TRUST_ROLE.RADIAL ||
      role === TRUST_ROLE.NEURAL
    ) {
      const weight =
        role === TRUST_ROLE.HEX_INNER
          ? 0.35
          : role === TRUST_ROLE.HEX_MID
            ? 0.55
            : role === TRUST_ROLE.HEX_OUTER
              ? 0.75
              : 0.65
      ;[x, y, z] = computeShieldFromLogoBias(x, y, z, t, phase, motion, weight)
    }

    if (role === TRUST_ROLE.RADIAL && slot >= TRUST_META_SLOT.RADIAL_BRIDGE) {
      const bridge = computeTrustBridgeEnergy(t, phase, speed, param, aux)
      if (bridge > 0.04) {
        const push = bridge * 0.008 * TRUST_SHIELD_VISUAL_SCALE * motion
        x += push * Math.cos(phase + aux)
        y += push * Math.sin(phase + aux)
      }
    }

    if (role === TRUST_ROLE.FLOW && slot >= TRUST_META_SLOT.FLOW_CIRCUIT) {
      const travel = computeTrustFlowTravel(t, phase, speed, param)
      const circuitPos = sampleTrustEnergyCircuit(aux, travel)
      const follow = 0.048 * motion * blend
      x += (circuitPos[0] - x) * follow
      y += (circuitPos[1] - y) * follow
      z += (circuitPos[2] - z) * follow
    }

    if (role === TRUST_ROLE.VALIDATION && slot >= TRUST_META_SLOT.VALIDATION_QUANTUM) {
      const pulse = computeTrustValidationPulse(t, phase, speed, slot, param)
      if (pulse > 0.06) {
        const push = pulse * 0.012 * TRUST_SHIELD_VISUAL_SCALE * motion
        x += push * Math.cos(phase * 1.2)
        y += push * Math.sin(phase * 1.2)
      }
    }

    if (role === TRUST_ROLE.AURA) {
      const breath = computeTrustAuraBreath(t, phase, motion)
      const outerR = 1.06 * TRUST_SHIELD_VISUAL_SCALE + aux
      const cx = target[0] - Math.cos(param * Math.PI * 2) * outerR * 0.02
      const cy = target[1] - Math.sin(param * Math.PI * 2) * outerR * 0.02
      const dx = x - cx
      const dy = y - cy
      const len = Math.hypot(dx, dy) || 1
      const expand = 1 + breath * 0.04
      x = cx + (dx / len) * outerR * expand * (len / outerR)
      y = cy + (dy / len) * outerR * expand * (len / outerR)
      z += breath * 0.006 * TRUST_SHIELD_VISUAL_SCALE
    }

    const isLogoBody =
      role === TRUST_ROLE.CORE &&
      (slot === TRUST_CORE_SLOT.LOGO_MASK || slot === TRUST_CORE_SLOT.LOGO_NUCLEUS)
    if (!isLogoBody) {
      const drift = Math.sin(t * 0.22 + phase) * 0.0018 * motion * blend
      x += drift
      y += Math.cos(t * 0.19 + phase * 1.1) * 0.0014 * motion * blend
    }
  }

  return [x, y, z]
}

/** Utilidad debug — formT normalizado desde elapsed seconds. */
export function trustFormationProgress(elapsed: number): number {
  return clamp01(elapsed / TRUST_FORM_DURATION)
}

/** Resumen de activación por rol en un formT dado. */
export function getTrustFormationSnapshot(formT: number): Record<keyof typeof TRUST_ROLE, number> {
  return {
    CORE: getTrustRoleActivation(TRUST_ROLE.CORE, formT),
    HEX_INNER: getTrustRoleActivation(TRUST_ROLE.HEX_INNER, formT),
    HEX_MID: getTrustRoleActivation(TRUST_ROLE.HEX_MID, formT),
    HEX_OUTER: getTrustRoleActivation(TRUST_ROLE.HEX_OUTER, formT),
    RADIAL: getTrustRoleActivation(TRUST_ROLE.RADIAL, formT),
    NEURAL: getTrustRoleActivation(TRUST_ROLE.NEURAL, formT),
    VALIDATION: getTrustRoleActivation(TRUST_ROLE.VALIDATION, formT),
    FLOW: getTrustRoleActivation(TRUST_ROLE.FLOW, formT),
    AURA: getTrustRoleActivation(TRUST_ROLE.AURA, formT),
  }
}

/** Validación rápida — mezcla scatter→target para N partículas. */
export function validateTrustFormationBlend(
  meta: Float32Array,
  scatter: Float32Array,
  count = PARTICLE_COUNT
): { atZero: Vec3; atOne: Vec3; midBlend: number } {
  const atZero = computeTrustFormationPosition(meta, 0, scatter, 0, 0, 0)
  const atOne = computeTrustFormationPosition(meta, 0, scatter, 1, 1, 0.26)
  const mid = computeTrustFormationPosition(meta, 0, scatter, 0.5, 0.5, 0.26)
  const bi = 0
  const target = resolveTrustShieldTargetPosition(meta, 0)
  const origin: Vec3 = [scatter[bi], scatter[bi + 1], scatter[bi + 2]]
  const expectedMid = lerpVec(origin, target, getTrustRoleActivation(meta[0] as TrustRoleId, 0.5))
  const midBlend = Math.hypot(mid[0] - expectedMid[0], mid[1] - expectedMid[1])
  return { atZero, atOne, midBlend }
}
