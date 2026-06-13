/**
 * Genesis Quantum Trust Shield — identity palette (Phase 4.5A amplified).
 * PNG-sampled logo · layer-separated color hierarchy.
 */
import { TRUST_CORE_SLOT } from './GenesisLogoLayout'
import {
  computeNucleusStardustColor,
  computeStardustLogoLiveColor,
  computeNeonLogoPulse,
  GENESIS_LAYER_INTENSITY,
} from './GenesisStardustEntity'
import { TRUST_META_SLOT } from './TrustShieldQuantumArchitecture'
import { TRUST_META_STRIDE } from './trustShieldConstants'
import { TRUST_ROLE } from './trustShieldRoles'
import {
  AURA_BRIGHTNESS_REDUCE,
  ELECTRIC_BLUE_INTENSE,
  GENESIS_CYAN_INTENSE,
  GENESIS_PINK_PURE,
  NEON_CYAN,
  NEON_GENESIS_PINK,
  NEURAL_INTENSITY_BOOST,
  QUANTUM_WHITE,
  SHIELD_BRIGHTNESS_BOOST,
  SHIELD_SATURATION_BOOST,
  TRUST_LAYER_CONTRAST,
  amplifyLuminance,
  amplifySaturation,
} from './trustShieldColorAmplification'

type Rgb = readonly [number, number, number]

const ELECTRIC_BLUE: Rgb = ELECTRIC_BLUE_INTENSE
const GENESIS_CYAN: Rgb = GENESIS_CYAN_INTENSE
const HOT_WHITE: Rgb = QUANTUM_WHITE
const NODE_HOTSPOT: Rgb = NEON_CYAN

function shieldHexColor(): Rgb {
  let [r, g, b] = amplifySaturation(
    ELECTRIC_BLUE[0],
    ELECTRIC_BLUE[1],
    ELECTRIC_BLUE[2],
    SHIELD_SATURATION_BOOST
  )
  ;[r, g, b] = amplifyLuminance(r, g, b, SHIELD_BRIGHTNESS_BOOST)
  return [r, g, b]
}

function neuralColor(): Rgb {
  let [r, g, b] = amplifySaturation(
    GENESIS_CYAN[0],
    GENESIS_CYAN[1],
    GENESIS_CYAN[2],
    1.45
  )
  return amplifyLuminance(r, g, b, NEURAL_INTENSITY_BOOST)
}

function flowColor(): Rgb {
  return amplifyLuminance(
    ELECTRIC_BLUE[0],
    ELECTRIC_BLUE[1],
    ELECTRIC_BLUE[2],
    1.45
  )
}

function colorForLogoSlot(slot: number, poolIndex: number, maskParam: number): Rgb {
  const midPulse = computeNeonLogoPulse(0, poolIndex * 0.01)
  if (slot === TRUST_CORE_SLOT.LOGO_MASK) {
    return computeStardustLogoLiveColor(poolIndex, 0, poolIndex * 0.01, midPulse)
  }
  if (slot === TRUST_CORE_SLOT.LOGO_NUCLEUS) {
    return computeNucleusStardustColor(0, poolIndex * 0.1, midPulse)
  }
  if (slot === TRUST_CORE_SLOT.LOGO_HALO) {
    return NEON_GENESIS_PINK
  }
  if (slot === TRUST_CORE_SLOT.ENERGY_FOG) {
    return NEON_GENESIS_PINK
  }
  return GENESIS_PINK_PURE
}

function colorForRole(
  role: number,
  slot: number,
  poolIndex: number,
  maskParam: number
): Rgb {
  if (role === TRUST_ROLE.CORE) {
    if (
      slot === TRUST_CORE_SLOT.LOGO_MASK ||
      slot === TRUST_CORE_SLOT.LOGO_HALO ||
      slot === TRUST_CORE_SLOT.ENERGY_FOG ||
      slot === TRUST_CORE_SLOT.LOGO_NUCLEUS
    ) {
      return colorForLogoSlot(slot, poolIndex, maskParam)
    }
    if (slot === TRUST_CORE_SLOT.VOLUME) {
      return GENESIS_PINK_PURE
    }
    return GENESIS_PINK_PURE
  }

  switch (role) {
    case TRUST_ROLE.HEX_INNER:
    case TRUST_ROLE.HEX_MID:
    case TRUST_ROLE.HEX_OUTER:
      return slot % 6 === 0 ? NODE_HOTSPOT : shieldHexColor()
    case TRUST_ROLE.RADIAL:
      return shieldHexColor()
    case TRUST_ROLE.NEURAL:
      return slot >= TRUST_META_SLOT.NEURAL_HOTSPOT ? NODE_HOTSPOT : neuralColor()
    case TRUST_ROLE.FLOW:
      return flowColor()
    case TRUST_ROLE.VALIDATION:
      return HOT_WHITE
    case TRUST_ROLE.AURA:
      return shieldHexColor()
    default:
      return shieldHexColor()
  }
}

function dimForRole(role: number, slot: number, maskParam: number): number {
  if (role === TRUST_ROLE.CORE) {
    if (slot === TRUST_CORE_SLOT.LOGO_MASK) {
      return GENESIS_LAYER_INTENSITY.G_BODY
    }
    if (slot === TRUST_CORE_SLOT.LOGO_NUCLEUS) {
      return 1
    }
    if (slot === TRUST_CORE_SLOT.LOGO_HALO) {
      return 0.72
    }
    if (slot === TRUST_CORE_SLOT.ENERGY_FOG) {
      return 0.55
    }
    return 0.88
  }

  const logoBase = 1.45 * TRUST_LAYER_CONTRAST.LOGO

  switch (role) {
    case TRUST_ROLE.HEX_OUTER:
      return 1.45 * TRUST_LAYER_CONTRAST.SHIELD * (1.08 + Math.random() * 0.1)
    case TRUST_ROLE.HEX_MID:
      return 1.45 * TRUST_LAYER_CONTRAST.SHIELD * (1.04 + Math.random() * 0.08)
    case TRUST_ROLE.HEX_INNER:
      return 1.45 * TRUST_LAYER_CONTRAST.SHIELD * (1 + Math.random() * 0.06)
    case TRUST_ROLE.RADIAL:
      return 1.45 * TRUST_LAYER_CONTRAST.SHIELD * (1.02 + Math.random() * 0.08)
    case TRUST_ROLE.NEURAL:
      return (
        1.45 *
        TRUST_LAYER_CONTRAST.NEURAL *
        (slot >= TRUST_META_SLOT.NEURAL_HOTSPOT ? 1.12 : 1) *
        (1 + Math.random() * 0.06)
      )
    case TRUST_ROLE.FLOW:
      return 1.45 * TRUST_LAYER_CONTRAST.FLOW * (1.04 + Math.random() * 0.08)
    case TRUST_ROLE.VALIDATION:
      return 1.45 * TRUST_LAYER_CONTRAST.VALIDATION * (1.06 + Math.random() * 0.08)
    case TRUST_ROLE.AURA:
      return (
        1.45 *
        TRUST_LAYER_CONTRAST.AURA *
        AURA_BRIGHTNESS_REDUCE *
        (0.88 + Math.random() * 0.08)
      )
    default:
      return logoBase * TRUST_LAYER_CONTRAST.SHIELD
  }
}

export function buildTrustShieldColors(count: number, meta: Float32Array): Float32Array {
  const colors = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const mi = i * TRUST_META_STRIDE
    const role = meta[mi]
    const slot = meta[mi + 1]
    const maskParam = meta[mi + 2]
    const poolIndex = meta[mi + 3]
    const c = colorForRole(role, slot, poolIndex, maskParam)
    const dim = dimForRole(role, slot, maskParam)
    let r = Math.min(1, c[0] * dim)
    let g = Math.min(1, c[1] * dim)
    let b = Math.min(1, c[2] * dim)
    colors[i * 3] = r
    colors[i * 3 + 1] = g
    colors[i * 3 + 2] = b
  }
  return colors
}
