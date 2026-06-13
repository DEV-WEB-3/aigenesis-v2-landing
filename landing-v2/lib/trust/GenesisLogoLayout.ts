/**
 * Genesis Trust Shield — procedural halo / fog / volumetric layers only.
 * Logo body: GenesisLogoMaskSampler.ts (PNG alpha mask).
 */
import {
  GENESIS_LOGO_WORLD_RADIUS,
  getGenesisLogoSilhouetteRadius,
} from './GenesisLogoMaskSampler'
import { TRUST_DEPTH_Z_SCALE, TRUST_SHIELD_VISUAL_SCALE } from './trustShieldConstants'
import type { Vec3 } from './TrustShieldLayout'

const S = TRUST_SHIELD_VISUAL_SCALE

/** @deprecated use GENESIS_LOGO_WORLD_RADIUS — kept for barrel exports */
export const GENESIS_LOGO_RADIUS = GENESIS_LOGO_WORLD_RADIUS

/** Slots meta CORE — identidad Genesis. */
export const TRUST_CORE_SLOT = {
  VOLUME: 0,
  RING: 1,
  LOGO_MASK: 2,
  LOGO_HALO: 3,
  /** @deprecated Phase 3.8 — use LOGO_MASK */
  LOGO_ARC: 2,
  /** @deprecated Phase 3.8 — use LOGO_MASK */
  LOGO_BAR: 2,
  /** @deprecated Phase 3.8 — use LOGO_MASK */
  LOGO_BURST: 2,
  /** @deprecated Phase 3.8 — use LOGO_MASK */
  LOGO_CLUSTER: 2,
  ENERGY_FOG: 6,
  SECONDARY: 7,
  LOGO_NUCLEUS: 8,
} as const

/** Slots meta AURA — capas volumétricas. */
export const TRUST_AURA_SLOT = {
  VOLUMETRIC_INNER: 0,
  VOLUMETRIC_MID: 1,
  VOLUMETRIC_OUTER: 2,
  VOLUMETRIC_CROWN: 3,
  FOG_NEAR: 4,
  FOG_FAR: 5,
  OUTER_SHELL: 6,
} as const

/** Glow halo — strictly outside PNG silhouette. */
export function sampleGenesisLogoHalo(u: number, v: number, band = 0): Vec3 {
  const outer = getGenesisLogoSilhouetteRadius()
  const theta = u * Math.PI * 2
  const r = outer * (1.06 + band * 0.04 + v * 0.09)
  const ripple = Math.sin(theta * 5 + v * 7) * outer * 0.008
  const z = (v - 0.5) * 0.028 * S * TRUST_DEPTH_Z_SCALE + band * 0.003 * S
  return [
    Math.cos(theta) * (r + ripple),
    Math.sin(theta) * (r + ripple),
    z,
  ]
}

/** Energy fog — outside logo body only (never inside silhouette). */
export function sampleGenesisEnergyFog(u: number, v: number): Vec3 {
  const outer = getGenesisLogoSilhouetteRadius()
  const theta = u * Math.PI * 2
  const r = outer * (1.12 + v * 0.42)
  const z = (v - 0.5) * 0.04 * S * TRUST_DEPTH_Z_SCALE + Math.sin(theta * 2) * 0.004 * S
  return [Math.cos(theta) * r, Math.sin(theta) * r, z]
}

/** Capas volumétricas — outside logo silhouette. */
export function sampleGenesisVolumetricShell(
  theta: number,
  phi: number,
  band: number
): Vec3 {
  const outer = getGenesisLogoSilhouetteRadius()
  const shellR = outer * (1.14 + band * 0.12)
  const x = shellR * Math.sin(phi) * Math.cos(theta)
  const y = shellR * Math.sin(phi) * Math.sin(theta)
  const z = shellR * Math.cos(phi) * 0.32 * TRUST_DEPTH_Z_SCALE + band * 0.006 * S
  return [x, y, z]
}

/** Halo secundario — between logo and hex, outside silhouette. */
export function sampleGenesisSecondaryHalo(u: number, v: number): Vec3 {
  const outer = getGenesisLogoSilhouetteRadius()
  const theta = u * Math.PI * 2
  const r = outer * (1.1 + v * 0.18)
  const ripple = Math.sin(theta * 4 + v * 6) * outer * 0.01
  return [
    Math.cos(theta) * (r + ripple),
    Math.sin(theta) * (r + ripple),
    (v - 0.4) * 0.032 * S * TRUST_DEPTH_Z_SCALE,
  ]
}
