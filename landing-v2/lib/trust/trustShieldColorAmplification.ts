/**
 * Phase 4.5A — Stardust color amplification (color/luminance only).
 * Neon palette for Trust stardust — independent of pastel CSS brand tokens.
 */

/** Phase 5.2 — intensified tornasol + institutional shield hierarchy. */
export const TRUST_LAYER_CONTRAST = {
  LOGO: 1.2,
  NUCLEUS: 1.35,
  SHIELD: 1.05,
  NEURAL: 0.75,
  VALIDATION: 0.95,
  FLOW: 0.9,
  AURA: 0.28,
} as const

/** Logo tornasol — Phase 5.5 baseline. */
const LOGO_SATURATION_BASE = 1.82
const LOGO_LUMINANCE_BASE = 1.69

/** Phase 6.4 — harmony refinement (less white, smoother spectral flow). */
export const NEON_SATURATION_MULT = 1.52
export const NEON_LUMINANCE_MULT = 3.15
export const LOGO_SATURATION_BOOST = LOGO_SATURATION_BASE * NEON_SATURATION_MULT
export const LOGO_LUMINANCE_BOOST = LOGO_LUMINANCE_BASE * NEON_LUMINANCE_MULT

/** Stardust neon palette — intense WebGL anchors (not pastel brand CSS). */
export const NEON_FUCHSIA: readonly [number, number, number] = [1, 0, 200 / 255]
export const NEON_MAGENTA: readonly [number, number, number] = [1, 46 / 255, 219 / 255]
export const NEON_CYAN: readonly [number, number, number] = [0, 245 / 255, 1]
export const NEON_BLUE: readonly [number, number, number] = [41 / 255, 98 / 255, 1]
export const NEON_PURPLE: readonly [number, number, number] = [157 / 255, 77 / 255, 1]

/** Official Genesis gradient anchors — fuchsia · purple · blue · cyan (neon) */
export const NEON_GENESIS_PINK: readonly [number, number, number] = NEON_FUCHSIA
export const NEON_ELECTRIC_BLUE: readonly [number, number, number] = NEON_BLUE
export const NEON_ELECTRIC_CYAN: readonly [number, number, number] = NEON_CYAN

/** Nucleus — magenta neón accent */
export const NEON_GENESIS_PINK_NUCLEUS: readonly [number, number, number] = NEON_MAGENTA

/** Fuchsia-dominant tornasol — Phase 6.5 neon restore */
export const MAGENTA_SPECTRAL_WEIGHT = 1.55

/** Luminance lift without washing hue to single magenta */
export const MAGENTA_FUCHSIA_LUMINANCE_BOOST = 1.22

/** Cyan electric path — reject pastel aqua / sky cyan */
export const CYAN_SATURATION_BOOST = 1.45
export const CYAN_LUMINANCE_BOOST = 1.35
/** @deprecated use CYAN_SATURATION_BOOST */
export const CYAN_SPECTRAL_LIFT = 1

/** Blue / purple neon intensity */
export const BLUE_SATURATION_BOOST = 1.35
export const BLUE_LUMINANCE_BOOST = 1.25
export const PURPLE_SATURATION_BOOST = 1.35
export const PURPLE_LUMINANCE_BOOST = 1.25

/** Reject washed sky-cyan, aqua, turquoise — force #00F5FF */
export function snapPastelCyanToNeon(
  r: number,
  g: number,
  b: number
): [number, number, number] {
  const washedCyan = g > 0.85 && b > 0.85
  const aquaTurquoise =
    (g > 0.68 && b > 0.68 && r < 0.55 && Math.abs(g - b) < 0.22) ||
    (g > 0.78 && b > 0.78 && r < g * 0.42)
  if (washedCyan || aquaTurquoise) {
    return [NEON_CYAN[0], NEON_CYAN[1], NEON_CYAN[2]]
  }
  return [r, g, b]
}

export function applyCyanNeonBoost(
  r: number,
  g: number,
  b: number
): [number, number, number] {
  const cyanLean = (g + b) * 0.5 - r
  if (cyanLean <= 0.06) return snapPastelCyanToNeon(r, g, b)
  let [outR, outG, outB] = amplifySaturation(r, g, b, CYAN_SATURATION_BOOST)
  ;[outR, outG, outB] = amplifyLuminance(outR, outG, outB, CYAN_LUMINANCE_BOOST)
  return snapPastelCyanToNeon(outR, outG, outB)
}

export function applyBlueNeonBoost(
  r: number,
  g: number,
  b: number
): [number, number, number] {
  const blueLean = b - Math.max(r, g)
  if (blueLean <= 0.06) return snapPastelCyanToNeon(r, g, b)
  let [outR, outG, outB] = amplifySaturation(r, g, b, BLUE_SATURATION_BOOST)
  ;[outR, outG, outB] = amplifyLuminance(outR, outG, outB, BLUE_LUMINANCE_BOOST)
  outG = Math.min(outG, NEON_BLUE[1] * 1.15)
  return snapPastelCyanToNeon(outR, outG, outB)
}

export function applyPurpleNeonBoost(
  r: number,
  g: number,
  b: number
): [number, number, number] {
  const purpleLean = (r + b) * 0.5 - g
  if (purpleLean <= 0.04 || purpleLean >= 0.38) return [r, g, b]
  let [outR, outG, outB] = amplifySaturation(r, g, b, PURPLE_SATURATION_BOOST)
  ;[outR, outG, outB] = amplifyLuminance(outR, outG, outB, PURPLE_LUMINANCE_BOOST)
  return [outR, outG, outB]
}

/** Hex shield — Electric Blue stronger (+30% blue path). */
export const SHIELD_BRIGHTNESS_BOOST = 1.82
export const SHIELD_SATURATION_BOOST = 1.5

/** Neural lattice — Genesis Cyan (+35%). */
export const NEURAL_INTENSITY_BOOST = 1.96

/** Aura — recede further from foreground. */
export const AURA_BRIGHTNESS_REDUCE = 0.62

export const GENESIS_PINK_PURE: readonly [number, number, number] = NEON_FUCHSIA

/** Premium warm white — nucleus core, not blown-out bloom. */
export const NUCLEUS_WARM_WHITE: readonly [number, number, number] = [1, 0.96, 0.93]

export const ELECTRIC_BLUE_INTENSE: readonly [number, number, number] = NEON_BLUE

export const GENESIS_CYAN_INTENSE: readonly [number, number, number] = NEON_CYAN

export const QUANTUM_WHITE: readonly [number, number, number] = [0.98, 0.99, 1]

/** Push chroma away from gray — preserves hue. */
export function amplifySaturation(
  r: number,
  g: number,
  b: number,
  factor: number
): [number, number, number] {
  const lum = (r + g + b) / 3
  return [
    Math.max(0, Math.min(1, lum + (r - lum) * factor)),
    Math.max(0, Math.min(1, lum + (g - lum) * factor)),
    Math.max(0, Math.min(1, lum + (b - lum) * factor)),
  ]
}

export function amplifyLuminance(
  r: number,
  g: number,
  b: number,
  factor: number
): [number, number, number] {
  return [
    Math.min(1, r * factor),
    Math.min(1, g * factor),
    Math.min(1, b * factor),
  ]
}

export function applyLayerContrast(
  r: number,
  g: number,
  b: number,
  layer: keyof typeof TRUST_LAYER_CONTRAST,
  base = 1.45
): [number, number, number] {
  const scale = base * TRUST_LAYER_CONTRAST[layer]
  return amplifyLuminance(r, g, b, scale)
}
