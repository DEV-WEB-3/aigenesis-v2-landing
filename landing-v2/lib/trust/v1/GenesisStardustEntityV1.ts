/**
 * Phase 6.5 — Genesis Stardust Logo Entity V1 (frozen backup).
 * Restore via USE_GENESIS_LOGO_V1=true
 */
import { resolveGenesisLogoMaskPosition, getGenesisLogoPoolColor, getGenesisLogoMaskBounds } from '../GenesisLogoMaskSampler'
import { TRUST_CORE_RADIUS_MULT, TRUST_SHIELD_VISUAL_SCALE } from '../trustShieldConstants'
import {
  LOGO_LUMINANCE_BOOST,
  LOGO_SATURATION_BOOST,
  CYAN_SPECTRAL_LIFT,
  MAGENTA_FUCHSIA_LUMINANCE_BOOST,
  MAGENTA_SPECTRAL_WEIGHT,
  NEON_ELECTRIC_BLUE,
  NEON_ELECTRIC_CYAN,
  NEON_GENESIS_PINK,
  NEON_GENESIS_PINK_NUCLEUS,
  NEON_PURPLE,
  TRUST_LAYER_CONTRAST,
  applyBlueNeonBoost,
  applyCyanNeonBoost,
  applyPurpleNeonBoost,
  amplifyLuminance,
  amplifySaturation,
  snapPastelCyanToNeon,
} from '../trustShieldColorAmplification'

const S = TRUST_SHIELD_VISUAL_SCALE

type Vec3 = readonly [number, number, number]

/** Relative visual density targets (particle budget + luminance). */
export const STARDUST_DENSITY_RATIO = {
  LOGO_BODY: 3,
  SHIELD: 1,
  BACKGROUND: 0.3,
} as const

/** Logo slice split inside 65% cap — mask-heavy for 3× perceived density. */
export const STARDUST_LOGO_SLICE = {
  MASK: 0.88,
  HALO: 0.06,
  FOG: 0.04,
  NUCLEUS_SHARE: 0.022,
} as const

export const STARDUST_ORBIT_CYCLE = 4.8
export const STARDUST_SPECTRAL_CYCLE = 5.2
export const STARDUST_NUCLEUS_CYCLE = 3.2

/** Logo glow — hue-preserving neon floors (Phase 6.5 intense restore). */
export const LOGO_PERMANENT_GLOW = {
  BRIGHTNESS_MIN: 0.65,
  OPACITY_MIN: 0.82,
  SATURATION_MIN: 1.35,
  LUMINANCE_MIN: 2.85,
  RGB_MIN: 0,
  PULSE_CYCLE: 3.6,
  PULSE_MIN: 0.85,
  PULSE_MAX: 1.22,
  NUCLEUS_BRIGHTNESS_MIN: 0.98,
  NUCLEUS_BRIGHTNESS_MAX: 2.4,
  SPECTRAL_MIX_BASE: 0.44,
  SPECTRAL_MIX_SWING: 0.11,
} as const

/** Flag wind — small surface wave; silhouette clamp prevents dispersion. */
export const GENESIS_FLAG_WIND = {
  WIND_AMPLITUDE: 0.052,
  WIND_SPEED: 1.85,
  WIND_FREQUENCY_Y: 5.8,
  WIND_FREQUENCY_X: 1.55,
  WIND_Z_DEPTH: 0.022,
  WAVE_PX_FACTOR: 0.32,
  WAVE_PY_FACTOR: 0.88,
  Z_FREQUENCY_X: 4.2,
  Z_TIME_SPEED: 1.45,
  NUCLEUS_STRENGTH: 0.28,
  SILHOUETTE_CAP_MULT: 1.12,
  RAY_STRENGTH: 0.38,
} as const

/** Phase 6.4 — spatial plasma drift (quantum energy, no rigid lines). */
export const GENESIS_PLASMA_DRIFT = {
  AMPLITUDE: 0.038,
  RAY_AMPLITUDE: 0.022,
  SPEED: 1.12,
  DEPTH: 0.018,
} as const

/** @deprecated V1 — alias for V2 router compat */
export const GENESIS_QUANTUM_FIELD = GENESIS_PLASMA_DRIFT

/** @deprecated aliases */
export const STARDUST_SPREAD = 1
export const STARDUST_SPREAD_MULT = STARDUST_SPREAD

/** Orbit/jitter disabled — flag wave only. */
export const LOGO_SHAPE_LOCK = {
  ORBIT_RADIUS_MAX: 0,
  BREATH_AMPLITUDE_MAX: 0,
  JITTER_MAX: 0,
} as const

/** Visual identity scale — +35% presence, anchored at logo centroid. */
export const GENESIS_G_IDENTITY_SCALE = 1.35

/** LOGO_MASK layer — body full presence; outer rays feathered. */
export const GENESIS_LAYER_INTENSITY = {
  G_BODY: 1,
  NUCLEUS: 1.18,
  RAYS: 0.078,
} as const

export const GENESIS_G_BODY_POINT_SIZE_MULT = 1.12

/** @deprecated use GENESIS_LAYER_INTENSITY.RAYS */
export const GENESIS_RAY_VISIBILITY = GENESIS_LAYER_INTENSITY.RAYS

/** Living stardust breath — dual-wave pulse per particle phase. */
export const GENESIS_NEON_PULSE = {
  SPEED: 1.08,
  AMPLITUDE: 0.085,
  NUCLEUS_AMPLITUDE: 0.11,
  NUCLEUS_BRIGHTNESS_MULT: 2.05,
} as const

const G_BODY_SPECTRAL_MIX_BASE = 0.52
const RAY_SPECTRAL_MIX_BASE = 0.74

const NEON_GLOW_SATURATION = 1.72
const NEON_GLOW_LUMINANCE = 1.95
const NEON_RAY_GLOW_SATURATION = 1.48
const NEON_RAY_GLOW_LUMINANCE = 1.42
const NEON_CHANNEL_CAP = 0.94

/**
 * Hue-preserving visibility floor — scales RGB uniformly by peak channel,
 * never redistributes via (r+g+b)/3 (which washed fuchsia/cyan into white).
 */
function preserveHueBrightnessFloor(
  r: number,
  g: number,
  b: number,
  minPeak: number,
  channelMax: number
): [number, number, number] {
  const rgbMin = LOGO_PERMANENT_GLOW.RGB_MIN
  let outR = Math.max(rgbMin, Math.min(channelMax, Math.max(0, r)))
  let outG = Math.max(rgbMin, Math.min(channelMax, Math.max(0, g)))
  let outB = Math.max(rgbMin, Math.min(channelMax, Math.max(0, b)))

  const peak = Math.max(outR, outG, outB)
  if (peak < minPeak && peak > 1e-6) {
    const scale = minPeak / peak
    outR = Math.min(channelMax, outR * scale)
    outG = Math.min(channelMax, outG * scale)
    outB = Math.min(channelMax, outB * scale)
  }

  const clippedPeak = Math.max(outR, outG, outB)
  if (clippedPeak > channelMax) {
    const clip = channelMax / clippedPeak
    outR *= clip
    outG *= clip
    outB *= clip
  }

  return [
    Math.max(rgbMin, outR),
    Math.max(rgbMin, outG),
    Math.max(rgbMin, outB),
  ]
}

/** Dual-wave neon breath — staggered per particle phase. */
export function computeNeonLogoPulse(t: number, phase: number): number {
  const w1 =
    Math.sin((t + phase * 0.35) * GENESIS_NEON_PULSE.SPEED) * GENESIS_NEON_PULSE.AMPLITUDE
  const w2 =
    Math.sin((t * 1.65 + phase * 0.85) * GENESIS_NEON_PULSE.SPEED * 0.55) *
    GENESIS_NEON_PULSE.AMPLITUDE *
    0.42
  return 1 + w1 + w2
}

/** Nucleus — stronger dual-wave pulse. */
export function computeNeonNucleusPulse(t: number, phase: number): number {
  const w1 =
    Math.sin((t + phase * 0.35) * GENESIS_NEON_PULSE.SPEED) *
    GENESIS_NEON_PULSE.NUCLEUS_AMPLITUDE
  const w2 =
    Math.sin((t * 1.4 + phase) * GENESIS_NEON_PULSE.SPEED * 0.7) *
    GENESIS_NEON_PULSE.NUCLEUS_AMPLITUDE *
    0.38
  return 1 + w1 + w2
}

/** @deprecated alias — use computeNeonLogoPulse / computeNeonNucleusPulse */
export function computeLogoPermanentPulse(t: number, phase: number): number {
  return computeNeonLogoPulse(t, phase)
}

/** Enforce tornasol visibility floors — RGB never below RGB_MIN. */
export function applyLogoPermanentGlow(
  r: number,
  g: number,
  b: number,
  pulse: number,
  channelMax: number = 1,
  brightnessMin: number = LOGO_PERMANENT_GLOW.BRIGHTNESS_MIN
): [number, number, number] {
  let [outR, outG, outB] = amplifySaturation(
    r,
    g,
    b,
    Math.max(LOGO_PERMANENT_GLOW.SATURATION_MIN, LOGO_SATURATION_BOOST)
  )
  ;[outR, outG, outB] = amplifyLuminance(
    outR,
    outG,
    outB,
    Math.max(LOGO_PERMANENT_GLOW.LUMINANCE_MIN, LOGO_LUMINANCE_BOOST)
  )

  outR *= pulse
  outG *= pulse
  outB *= pulse

  return preserveHueBrightnessFloor(outR, outG, outB, brightnessMin, channelMax)
}

/**
 * Phase 5.6 — neon stardust glow.
 * Pulse modulates brightness floor (visible breath) and keeps chroma below white clamp.
 */
export function applyNeonStardustGlow(
  r: number,
  g: number,
  b: number,
  pulse: number,
  brightnessMin: number,
  channelMax: number = NEON_CHANNEL_CAP,
  isRay = false
): [number, number, number] {
  const sat = isRay ? NEON_RAY_GLOW_SATURATION : NEON_GLOW_SATURATION
  const lum = (isRay ? NEON_RAY_GLOW_LUMINANCE : NEON_GLOW_LUMINANCE) * pulse
  let [outR, outG, outB] = amplifySaturation(r, g, b, sat)
  ;[outR, outG, outB] = amplifyLuminance(outR, outG, outB, lum)

  const breathingFloor = brightnessMin * pulse
  return preserveHueBrightnessFloor(outR, outG, outB, breathingFloor, channelMax)
}

/** G counter opening — normalized logo space (PNG source geometry). */
const NUCLEUS_NX = -0.17
const NUCLEUS_NY = -0.03

function worldFromNorm(nx: number, ny: number, z = 0.034 * S): Vec3 {
  const scale = 0.46 * TRUST_CORE_RADIUS_MULT * S
  return [nx * scale, ny * scale, z]
}

/**
 * Raised-flag wind offset from PNG anchor (baseX, baseY).
 * wave = sin(baseY * fY + time * speed + baseX * fX) * amplitude
 */
export function computeGenesisFlagWindOffset(
  baseX: number,
  baseY: number,
  time: number,
  _phase: number,
  strength = 1
): Vec3 {
  const w = GENESIS_FLAG_WIND
  const amp = w.WIND_AMPLITUDE * strength
  const wave =
    Math.sin(baseY * w.WIND_FREQUENCY_Y + time * w.WIND_SPEED + baseX * w.WIND_FREQUENCY_X) *
    amp
  const px = wave * w.WAVE_PX_FACTOR
  const py = wave * w.WAVE_PY_FACTOR
  const pz =
    Math.sin(baseX * w.Z_FREQUENCY_X + time * w.Z_TIME_SPEED) * w.WIND_Z_DEPTH * strength
  return [px, py, pz]
}

function flagSilhouetteCap(strength = 1): number {
  const w = GENESIS_FLAG_WIND
  return (
    w.WIND_AMPLITUDE *
    Math.hypot(w.WAVE_PX_FACTOR, w.WAVE_PY_FACTOR) *
    w.SILHOUETTE_CAP_MULT *
    strength
  )
}

function clampToSilhouette(
  tx: number,
  ty: number,
  x: number,
  y: number,
  maxR: number
): [number, number] {
  const dx = x - tx
  const dy = y - ty
  const d = Math.hypot(dx, dy)
  const cap = maxR * 0.985
  if (d <= cap || d < 1e-6) return [x, y]
  const pull = cap / d
  return [tx + dx * pull, ty + dy * pull]
}

function suppressNeutralWhite(r: number, g: number, b: number, t: number): [number, number, number] {
  const peak = Math.max(r, g, b)
  const avg = (r + g + b) / 3
  const chroma = peak - Math.min(r, g, b)
  let outR = r
  let outG = g
  let outB = b

  if (avg > 0.42 && chroma < 0.26) {
    const spectral = sampleGenesisBrandGradient(t * 0.07)
    const blend = 0.92
    outR = r * (1 - blend) + spectral[0] * blend
    outG = g * (1 - blend) + spectral[1] * blend
    outB = b * (1 - blend) + spectral[2] * blend
  }

  if (peak > 0.88 && chroma < 0.34) {
    const crush = 0.86 + chroma * 0.28
    outR *= crush
    outG *= crush
    outB *= crush
  }

  return [outR, outG, outB]
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / Math.max(edge1 - edge0, 1e-6)))
  return t * t * (3 - 2 * t)
}

/** Outer ray spikes — radial distance from logo centroid (PNG pool index). */
export function isGenesisLogoOuterRay(poolIndex: number): boolean {
  const bounds = getGenesisLogoMaskBounds()
  const [wx, wy] = resolveGenesisLogoMaskPosition(poolIndex)
  const cx = (bounds.minX + bounds.maxX) * 0.5
  const cy = (bounds.minY + bounds.maxY) * 0.5
  const radial = Math.hypot(wx - cx, wy - cy) / Math.max(bounds.halfExtent, 1e-6)
  return radial > 0.66
}

/** Scale logo positions about PNG centroid — layout anchor unchanged. */
export function scaleLogoIdentityPosition(x: number, y: number, z: number): Vec3 {
  const s = GENESIS_G_IDENTITY_SCALE
  if (Math.abs(s - 1) < 1e-6) return [x, y, z]
  const b = getGenesisLogoMaskBounds()
  const cx = (b.minX + b.maxX) * 0.5
  const cy = (b.minY + b.maxY) * 0.5
  return [cx + (x - cx) * s, cy + (y - cy) * s, z + (z - 0) * Math.min(s, 1.08)]
}

/** PNG base + soft flag wave + plasma drift — shape locked to silhouette. */
export function computeLockedLogoMaskPosition(
  poolIndex: number,
  t: number,
  phase: number,
  motion: number,
  isRay = false
): Vec3 {
  const [tx, ty, tz] = resolveGenesisLogoMaskPosition(poolIndex)
  const windStrength = motion * (isRay ? GENESIS_FLAG_WIND.RAY_STRENGTH : 1)
  const [windX, windY, windZ] = computeGenesisFlagWindOffset(tx, ty, t, phase, windStrength)
  const [plasmaX, plasmaY, plasmaZ] = computeGenesisPlasmaDrift(tx, ty, t, phase, motion, isRay)

  let x = tx + windX + plasmaX
  let y = ty + windY + plasmaY
  const z = tz + windZ + plasmaZ

  ;[x, y] = clampToSilhouette(tx, ty, x, y, flagSilhouetteCap(motion))

  return scaleLogoIdentityPosition(x, y, z)
}

/** @deprecated use computeLockedLogoMaskPosition — kept for morph compat. */
export function computeStardustLogoPosition(
  poolIndex: number,
  t: number,
  phase: number,
  _speed: number,
  motion: number,
  formed: boolean
): Vec3 {
  if (!formed) return resolveGenesisLogoMaskPosition(poolIndex)
  return computeLockedLogoMaskPosition(poolIndex, t, phase, motion)
}

/** Nucleus — follows flag wave + plasma core at reduced strength inside G opening. */
export function computeGenesisNucleusPosition(
  u: number,
  t: number,
  phase: number,
  motion: number
): Vec3 {
  const [cx, cy, cz] = worldFromNorm(NUCLEUS_NX, NUCLEUS_NY, 0.038 * S)
  const r = 0.003 * S
  const a = u * Math.PI * 2
  const windStrength = motion * GENESIS_FLAG_WIND.NUCLEUS_STRENGTH
  const [windX, windY, windZ] = computeGenesisFlagWindOffset(cx, cy, t, phase, windStrength)
  const [plasmaX, plasmaY, plasmaZ] = computeGenesisPlasmaDrift(cx, cy, t, phase, motion * 0.72, false)
  return scaleLogoIdentityPosition(
    cx + Math.cos(a) * r + windX + plasmaX,
    cy + Math.sin(a) * r * 0.92 + windY + plasmaY,
    cz + windZ + plasmaZ
  )
}

type Rgb = readonly [number, number, number]

/** Neon tornasol gradient — fuchsia · purple · blue · cyan */
const GRADIENT_FUCHSIA: Rgb = NEON_GENESIS_PINK
const GRADIENT_CORE: Rgb = NEON_PURPLE
const GRADIENT_ION: Rgb = NEON_ELECTRIC_BLUE
const GRADIENT_CYAN: Rgb = NEON_ELECTRIC_CYAN

const SPECTRAL_CYAN: Rgb = [
  NEON_ELECTRIC_CYAN[0],
  NEON_ELECTRIC_CYAN[1] * CYAN_SPECTRAL_LIFT,
  NEON_ELECTRIC_CYAN[2] * CYAN_SPECTRAL_LIFT,
]
const SPECTRAL_BLUE: Rgb = [NEON_ELECTRIC_BLUE[0], NEON_ELECTRIC_BLUE[1], NEON_ELECTRIC_BLUE[2]]
const SPECTRAL_PURPLE: Rgb = [NEON_PURPLE[0], NEON_PURPLE[1], NEON_PURPLE[2]]
const SPECTRAL_MAGENTA: Rgb = [NEON_GENESIS_PINK[0], NEON_GENESIS_PINK[1], NEON_GENESIS_PINK[2]]

function lerpRgb(a: Rgb, b: Rgb, t: number): Rgb {
  const u = Math.max(0, Math.min(1, t))
  return [
    a[0] + (b[0] - a[0]) * u,
    a[1] + (b[1] - a[1]) * u,
    a[2] + (b[2] - a[2]) * u,
  ]
}

/** Phase 6.4 — multi-stop smooth gradient (Vision Pro / luxury tech). */
export function sampleGenesisBrandGradient(t: number): Rgb {
  const x = ((t % 1) + 1) % 1
  const stops: readonly [number, Rgb][] = [
    [0, GRADIENT_FUCHSIA],
    [0.22, GRADIENT_FUCHSIA],
    [0.38, GRADIENT_CORE],
    [0.52, GRADIENT_CORE],
    [0.62, GRADIENT_ION],
    [0.78, GRADIENT_ION],
    [0.9, GRADIENT_CYAN],
    [1, GRADIENT_CYAN],
  ]
  for (let i = 0; i < stops.length - 1; i++) {
    const [a, ca] = stops[i]!
    const [b, cb] = stops[i + 1]!
    if (x >= a && x <= b) {
      const u = smoothstep(a, b, x)
      return lerpRgb(ca, cb, u)
    }
  }
  return GRADIENT_CYAN
}

/** Phase 6.4 — spatial plasma drift layered on flag wind. */
export function computeGenesisPlasmaDrift(
  baseX: number,
  baseY: number,
  t: number,
  phase: number,
  strength: number,
  isRay: boolean
): Vec3 {
  const p = GENESIS_PLASMA_DRIFT
  const amp = (isRay ? p.RAY_AMPLITUDE : p.AMPLITUDE) * strength
  const px =
    (Math.sin(baseY * 4.1 + t * p.SPEED + phase * 0.65) +
      Math.cos(baseX * 3.4 - t * p.SPEED * 0.72 + phase * 1.05) * 0.62) *
    amp *
    0.5
  const py =
    (Math.cos(baseX * 3.8 + t * p.SPEED * 0.88 + phase * 0.48) +
      Math.sin((baseX + baseY) * 2.6 + t * p.SPEED * 1.18 + phase * 0.82) * 0.48) *
    amp *
    0.5
  const pz = Math.sin(baseX * 5.2 + t * p.SPEED * 0.95 + phase) * p.DEPTH * strength
  return [px, py, pz]
}

function logoMaskGradientU(poolIndex: number): number {
  const [wx] = resolveGenesisLogoMaskPosition(poolIndex)
  const bounds = getGenesisLogoMaskBounds()
  const spanX = Math.max(bounds.maxX - bounds.minX, 1e-6)
  return Math.max(0, Math.min(1, (wx - bounds.minX) / spanX))
}

/** Audit export — spatial U along logo X (0=fuchsia left, 1=cyan right). */
export function logoMaskGradientUForAudit(poolIndex: number): number {
  return logoMaskGradientU(poolIndex)
}

function applyFuchsiaLuminanceBoost(r: number, g: number, b: number): [number, number, number] {
  const magentaLean = (r + b) * 0.5 - g
  if (magentaLean <= 0.12) return [r, g, b]
  const t = Math.min(1, (magentaLean - 0.12) / 0.35)
  const boost = 1 + (MAGENTA_FUCHSIA_LUMINANCE_BOOST - 1) * t
  return amplifyLuminance(r, g, b, boost)
}

/** Spectral tornasol path — PNG base + gradient, before neon glow. */
export function computeStardustColorBeforeGlow(
  baseR: number,
  baseG: number,
  baseB: number,
  t: number,
  phase: number,
  poolIndex: number,
  options: { isRay?: boolean } = {}
): [number, number, number] {
  const travel =
    (t / STARDUST_SPECTRAL_CYCLE) * 0.32 + phase * 0.14 + poolIndex * 0.00055
  const temporal = sampleGenesisBrandGradient(travel)
  const spatial = sampleGenesisBrandGradient(logoMaskGradientU(poolIndex))
  const spectral = lerpRgb(spatial, temporal, options.isRay ? 0.58 : 0.48)
  const mixBase = options.isRay ? RAY_SPECTRAL_MIX_BASE : G_BODY_SPECTRAL_MIX_BASE
  const mix =
    mixBase + Math.sin(t * 0.28 + phase * 0.55) * LOGO_PERMANENT_GLOW.SPECTRAL_MIX_SWING
  let r = baseR * (1 - mix) + spectral[0] * mix
  let g = baseG * (1 - mix) + spectral[1] * mix
  let b = baseB * (1 - mix) + spectral[2] * mix
  const magentaBias = (MAGENTA_SPECTRAL_WEIGHT - 1) * (options.isRay ? 0.06 : 0.1)
  r = r * (1 - magentaBias) + SPECTRAL_MAGENTA[0] * magentaBias
  g = g * (1 - magentaBias) + SPECTRAL_MAGENTA[1] * magentaBias
  b = b * (1 - magentaBias) + SPECTRAL_MAGENTA[2] * magentaBias
  ;[r, g, b] = snapPastelCyanToNeon(r, g, b)
  ;[r, g, b] = suppressNeutralWhite(r, g, b, t + phase)

  const u = logoMaskGradientU(poolIndex)
  const wFuchsia = 1 - smoothstep(0.18, 0.42, u)
  const wPurple = smoothstep(0.22, 0.38, u) * (1 - smoothstep(0.48, 0.62, u))
  const wBlue = smoothstep(0.44, 0.58, u) * (1 - smoothstep(0.66, 0.8, u))
  const wCyan = smoothstep(0.62, 0.88, u)

  let zoneR = r * wFuchsia + SPECTRAL_MAGENTA[0] * wFuchsia * 0.35
  let zoneG = g * wFuchsia + SPECTRAL_MAGENTA[1] * wFuchsia * 0.35
  let zoneB = b * wFuchsia + SPECTRAL_MAGENTA[2] * wFuchsia * 0.35

  if (wPurple > 0.01) {
    const [pr, pg, pb] = applyPurpleNeonBoost(r, g, b)
    zoneR = zoneR * (1 - wPurple) + pr * wPurple
    zoneG = zoneG * (1 - wPurple) + pg * wPurple
    zoneB = zoneB * (1 - wPurple) + pb * wPurple
  }
  if (wBlue > 0.01) {
    const [br, bg, bb] = applyBlueNeonBoost(r, g, b)
    zoneR = zoneR * (1 - wBlue) + br * wBlue
    zoneG = zoneG * (1 - wBlue) + bg * wBlue
    zoneB = zoneB * (1 - wBlue) + bb * wBlue
  }
  if (wCyan > 0.01) {
    const [cr, cg, cb] = applyCyanNeonBoost(r, g, b)
    zoneR = zoneR * (1 - wCyan) + cr * wCyan
    zoneG = zoneG * (1 - wCyan) + cg * wCyan
    zoneB = zoneB * (1 - wCyan) + cb * wCyan
  }

  r = zoneR
  g = zoneG
  b = zoneB

  if (!options.isRay && u < 0.38) {
    return applyFuchsiaLuminanceBoost(r, g, b)
  }
  return [r, g, b]
}

/** Slow tornasol spectral flow — PNG base, never feedback from faded frame buffer. */
export function computeStardustSpectralColor(
  baseR: number,
  baseG: number,
  baseB: number,
  t: number,
  phase: number,
  poolIndex: number,
  pulse = 1,
  options: { isRay?: boolean } = {}
): [number, number, number] {
  const [r, g, b] = computeStardustColorBeforeGlow(
    baseR,
    baseG,
    baseB,
    t,
    phase,
    poolIndex,
    options
  )
  const brightnessMin = options.isRay
    ? LOGO_PERMANENT_GLOW.BRIGHTNESS_MIN * GENESIS_LAYER_INTENSITY.RAYS
    : LOGO_PERMANENT_GLOW.BRIGHTNESS_MIN * GENESIS_LAYER_INTENSITY.G_BODY
  return applyNeonStardustGlow(r, g, b, pulse, brightnessMin, NEON_CHANNEL_CAP, options.isRay)
}

function pureZoneDebugColor(poolIndex: number): [number, number, number] {
  const u = logoMaskGradientU(poolIndex)
  if (u >= 0.72) return [NEON_ELECTRIC_CYAN[0], NEON_ELECTRIC_CYAN[1], NEON_ELECTRIC_CYAN[2]]
  if (u >= 0.52) return [NEON_ELECTRIC_BLUE[0], NEON_ELECTRIC_BLUE[1], NEON_ELECTRIC_BLUE[2]]
  if (u >= 0.32) return [NEON_PURPLE[0], NEON_PURPLE[1], NEON_PURPLE[2]]
  return [NEON_GENESIS_PINK[0], NEON_GENESIS_PINK[1], NEON_GENESIS_PINK[2]]
}

/** Approved neon zones — spatial only, no temporal tornasol drift (Hero→Trust lock). */
export function computeStardustLogoApprovedColor(
  poolIndex: number
): [number, number, number] {
  const [r, g, b] = pureZoneDebugColor(poolIndex)
  return applyNeonStardustGlow(
    r,
    g,
    b,
    1,
    LOGO_PERMANENT_GLOW.BRIGHTNESS_MIN * GENESIS_LAYER_INTENSITY.G_BODY,
    NEON_CHANNEL_CAP
  )
}

/** Nucleus approved blend — fixed pink/cyan, no oscillating starWave. */
export function computeNucleusApprovedColor(): [number, number, number] {
  const sparkleCyan = NEON_ELECTRIC_CYAN
  const coreBlend = 0.28
  const r = NEON_GENESIS_PINK_NUCLEUS[0] * (1 - coreBlend) + sparkleCyan[0] * coreBlend
  const g = NEON_GENESIS_PINK_NUCLEUS[1] * (1 - coreBlend) + sparkleCyan[1] * coreBlend
  const b = NEON_GENESIS_PINK_NUCLEUS[2] * (1 - coreBlend) + sparkleCyan[2] * coreBlend
  const [nr, ng, nb] = snapPastelCyanToNeon(r, g, b)
  const brightnessMin =
    LOGO_PERMANENT_GLOW.NUCLEUS_BRIGHTNESS_MIN *
    GENESIS_NEON_PULSE.NUCLEUS_BRIGHTNESS_MULT *
    GENESIS_LAYER_INTENSITY.NUCLEUS
  return applyNeonStardustGlow(nr, ng, nb, 1, brightnessMin, NEON_CHANNEL_CAP)
}

/** Logo G body — full tornasol identity. */
export function computeStardustLogoLiveColor(
  poolIndex: number,
  t: number,
  phase: number,
  pulse: number
): [number, number, number] {
  if (
    typeof window !== 'undefined' &&
    process.env.NODE_ENV !== 'production' &&
    (window as Window & { __GENESIS_PURE_COLOR_DEBUG__?: boolean }).__GENESIS_PURE_COLOR_DEBUG__
  ) {
    return pureZoneDebugColor(poolIndex)
  }
  const [baseR, baseG, baseB] = getGenesisLogoPoolColor(poolIndex)
  return computeStardustSpectralColor(baseR, baseG, baseB, t, phase, poolIndex, pulse, {
    isRay: false,
  })
}

/** Outer rays — secondary tornasol, 70% dimmer, no white dominance. */
export function computeStardustRayLiveColor(
  poolIndex: number,
  t: number,
  phase: number,
  pulse: number
): [number, number, number] {
  const [baseR, baseG, baseB] = getGenesisLogoPoolColor(poolIndex)
  return computeStardustSpectralColor(baseR, baseG, baseB, t, phase, poolIndex, pulse, {
    isRay: true,
  })
}

/** Nucleus — layered depth: inner magenta core, outer cyan plasma ring. */
export function computeNucleusStardustColor(
  t: number,
  phase: number,
  pulse = 1,
  nucleusU = 0.5
): [number, number, number] {
  const ring = 0.5 + 0.5 * Math.sin(nucleusU * Math.PI * 2 + phase * 0.35)
  const innerDepth = 1 - ring
  const starWave = Math.sin(t * GENESIS_NEON_PULSE.SPEED + phase * 0.6)
  const coreBlend = 0.14 + innerDepth * 0.28 + starWave * 0.06

  const innerCore = NEON_GENESIS_PINK_NUCLEUS
  const midLayer = SPECTRAL_PURPLE
  const outerPlasma = NEON_ELECTRIC_CYAN

  const midMix = smoothstep(0.25, 0.72, innerDepth)
  const innerMix = smoothstep(0.55, 0.95, innerDepth)
  let r =
    outerPlasma[0] * (1 - coreBlend) +
    innerCore[0] * coreBlend * innerMix +
    midLayer[0] * midMix * (1 - innerMix) * 0.55
  let g =
    outerPlasma[1] * (1 - coreBlend) +
    innerCore[1] * coreBlend * innerMix +
    midLayer[1] * midMix * (1 - innerMix) * 0.55
  let b =
    outerPlasma[2] * (1 - coreBlend) +
    innerCore[2] * coreBlend * innerMix +
    midLayer[2] * midMix * (1 - innerMix) * 0.55

  const depthDim = 0.9 + (1 - innerDepth) * 0.14
  r *= depthDim
  g *= depthDim
  b *= depthDim

  const [nr, ng, nb] = snapPastelCyanToNeon(r, g, b)
  const brightnessMin =
    LOGO_PERMANENT_GLOW.NUCLEUS_BRIGHTNESS_MIN *
    GENESIS_NEON_PULSE.NUCLEUS_BRIGHTNESS_MULT *
    GENESIS_LAYER_INTENSITY.NUCLEUS *
    (0.88 + (1 - innerDepth) * 0.16)

  return applyNeonStardustGlow(nr, ng, nb, pulse, brightnessMin, NEON_CHANNEL_CAP)
}

/** Layer luminance — Phase 4.5A hierarchy (logo = 100%). */
export function stardustLayerLuminance(
  layer: 'logo' | 'nucleus' | 'shield' | 'neural' | 'validation' | 'flow' | 'background'
): number {
  switch (layer) {
    case 'logo':
      return 1.45 * TRUST_LAYER_CONTRAST.LOGO
    case 'nucleus':
      return 1.45 * TRUST_LAYER_CONTRAST.NUCLEUS
    case 'shield':
      return 1.45 * TRUST_LAYER_CONTRAST.SHIELD
    case 'neural':
      return 1.45 * TRUST_LAYER_CONTRAST.NEURAL
    case 'validation':
      return 1.45 * TRUST_LAYER_CONTRAST.VALIDATION
    case 'flow':
      return 1.45 * TRUST_LAYER_CONTRAST.FLOW
    case 'background':
      return 1.45 * TRUST_LAYER_CONTRAST.AURA
    default:
      return 1.45 * TRUST_LAYER_CONTRAST.AURA
  }
}

/** Shield particles breathe outward from logo — organism grows from heart. */
export function computeShieldFromLogoBias(
  x: number,
  y: number,
  z: number,
  t: number,
  phase: number,
  motion: number,
  roleWeight: number
): Vec3 {
  const len = Math.hypot(x, y) || 1
  const nx = x / len
  const ny = y / len
  const breath = Math.sin(t * 0.16 + phase * 0.38) * 0.003 * S * motion * roleWeight
  return [x + nx * breath, y + ny * breath, z + breath * 0.12]
}

export function stardustNucleusCount(total: number): number {
  const logoMax = Math.floor(total * 0.65)
  return Math.max(8, Math.floor(logoMax * STARDUST_LOGO_SLICE.NUCLEUS_SHARE))
}
