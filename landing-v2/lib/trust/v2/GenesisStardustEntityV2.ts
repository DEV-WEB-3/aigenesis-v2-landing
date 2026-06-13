/**
 * Phase 6.5 — Genesis Signature Rebrand V2.
 * Premium energy signature: quantum field + raised-flag wind (right → left tilt).
 */
import { resolveGenesisLogoMaskPosition, getGenesisLogoPoolColor, getGenesisLogoMaskBounds } from '../GenesisLogoMaskSampler'
import {
  applyGenesisFlowField,
  trustDepthZOffset,
  computeTrustParticleDepthTier,
} from '../trustGenesisCoreMotion'
import { TRUST_CORE_RADIUS_MULT, TRUST_SHIELD_VISUAL_SCALE } from '../trustShieldConstants'
import {
  TRUST_LAYER_CONTRAST,
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

/** Logo glow — controlled institutional presence (no white blowout). */
export const LOGO_PERMANENT_GLOW = {
  BRIGHTNESS_MIN: 0.58,
  OPACITY_MIN: 0.82,
  SATURATION_MIN: 1.28,
  LUMINANCE_MIN: 1.65,
  RGB_MIN: 0,
  PULSE_CYCLE: 4.8,
  PULSE_MIN: 0.92,
  PULSE_MAX: 1.08,
  NUCLEUS_BRIGHTNESS_MIN: 0.72,
  NUCLEUS_BRIGHTNESS_MAX: 1.35,
  SPECTRAL_MIX_BASE: 0.62,
  SPECTRAL_MIX_SWING: 0.06,
} as const

/** Phase 6.6 — G is the hero: rays recede, G body dominates. Phase 17 — premium sparks. */
export const GENESIS_G_HERO = {
  RAY_LENGTH_FACTOR: 0.9,
  RAY_BRIGHTNESS_FACTOR: 1,
  G_BODY_DENSITY_SHARE_BOOST: 1.25,
  RAY_TAIL_FADE_FROM: 0.52,
  RAY_RADIAL_EXTEND: 0.24,
  INNER_HALO_RADIUS_MIN: 1.08,
  INNER_HALO_RADIUS_MAX: 1.12,
  INNER_HALO_STRENGTH: 0.11,
  NUCLEUS_CONTAIN_PULSE: 0.035,
  NUCLEUS_CORE_RADIUS: 0.44,
  NUCLEUS_SHELL_RADIUS: 0.92,
} as const

/** Phase 6.5 — quantum energy field (max 3% amplitude, no flag wind). */
export const GENESIS_QUANTUM_FIELD = {
  MAX_AMPLITUDE: 0.03,
  OUTER_AMPLITUDE: 0.012,
  BREATH_CYCLE: 4.8,
  BREATH_SPEED: 0.55,
  FIELD_SPEED: 0.62,
  DEPTH: 0.012,
  NUCLEUS_STRENGTH: 0.42,
  OUTER_RADIAL: 0.68,
} as const

/** Flag wind — surface wave; right-to-left raised-flag tilt on stardust G. */
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

/** @deprecated V1 compat alias */
export const GENESIS_PLASMA_DRIFT = GENESIS_QUANTUM_FIELD

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

/** LOGO_MASK — G ring institutional; outer field feathered. */
export const GENESIS_LAYER_INTENSITY = {
  G_BODY: 0.94,
  NUCLEUS: 1.05,
  RAYS: 0.088,
} as const

export const GENESIS_G_BODY_POINT_SIZE_MULT = 1.12

/** @deprecated use GENESIS_LAYER_INTENSITY.RAYS */
export const GENESIS_RAY_VISIBILITY = GENESIS_LAYER_INTENSITY.RAYS

/** Slow signature breath — quantum energy, not fireworks. */
export const GENESIS_NEON_PULSE = {
  SPEED: 0.55,
  AMPLITUDE: 0.045,
  NUCLEUS_AMPLITUDE: 0.055,
  NUCLEUS_BRIGHTNESS_MULT: 1.38,
} as const

const G_BODY_SPECTRAL_MIX_BASE = 0.68
const RAY_SPECTRAL_MIX_BASE = 0.82

const NEON_GLOW_SATURATION = 1.58
const NEON_GLOW_LUMINANCE = 1.52
const NEON_RAY_GLOW_SATURATION = 1.38
const NEON_RAY_GLOW_LUMINANCE = 1.18
const NEON_CHANNEL_CAP = 0.9

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
    Math.max(LOGO_PERMANENT_GLOW.SATURATION_MIN, 1.28)
  )
  ;[outR, outG, outB] = amplifyLuminance(
    outR,
    outG,
    outB,
    Math.max(LOGO_PERMANENT_GLOW.LUMINANCE_MIN, 1.65)
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

/** User-tuned anchor — left + high on mark (aligned with cyan hotspot area). */
const NUCLEUS_NX = 0.22
const NUCLEUS_NY = 5.68

function worldFromNorm(nx: number, ny: number, z = 0.034 * S): Vec3 {
  const scale = 0.46 * TRUST_CORE_RADIUS_MULT * S
  return [nx * scale, ny * scale, z]
}

/**
 * Raised-flag wind — wave bias right → left on the G silhouette.
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

function quantumSilhouetteCap(motion: number): number {
  return GENESIS_QUANTUM_FIELD.MAX_AMPLITUDE * motion * 1.05
}

/** Phase 6.5 — intelligent plasma / quantum field motion. */
export function computeGenesisPlasmaDrift(
  baseX: number,
  baseY: number,
  t: number,
  phase: number,
  strength: number,
  isRay: boolean
): Vec3 {
  const q = GENESIS_QUANTUM_FIELD
  const bounds = getGenesisLogoMaskBounds()
  const span = Math.max(bounds.halfExtent, 1e-6)
  const amp = (isRay ? q.OUTER_AMPLITUDE : q.MAX_AMPLITUDE) * strength
  const breath = Math.sin(t * q.BREATH_SPEED + phase * 0.4) * amp * 0.35
  const fieldX =
    Math.sin(baseY * 2.4 + t * q.FIELD_SPEED + phase * 0.55) * amp * 0.55 + breath
  const fieldY =
    Math.cos(baseX * 2.1 - t * q.FIELD_SPEED * 0.82 + phase * 0.38) * amp * 0.55 +
    breath * 0.7
  const fieldZ = Math.sin(baseX * 3.2 + t * q.FIELD_SPEED * 0.65 + phase) * q.DEPTH * strength
  const px = (fieldX / span) * span
  const py = (fieldY / span) * span
  return [px, py, fieldZ]
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

function logoCentroid(): [number, number] {
  const bounds = getGenesisLogoMaskBounds()
  return [(bounds.minX + bounds.maxX) * 0.5, (bounds.minY + bounds.maxY) * 0.5]
}

/** Normalized radial distance 0 = center, 1 = logo edge. */
export function getLogoParticleRadialNorm(poolIndex: number): number {
  const [wx, wy] = resolveGenesisLogoMaskPosition(poolIndex)
  const [cx, cy] = logoCentroid()
  const bounds = getGenesisLogoMaskBounds()
  return Math.hypot(wx - cx, wy - cy) / Math.max(bounds.halfExtent, 1e-6)
}

function nucleusWorldCenter(): [number, number] {
  const [cx, cy] = worldFromNorm(NUCLEUS_NX, NUCLEUS_NY, 0.038 * S)
  return [cx, cy]
}

function nucleusReferenceRadius(): number {
  return 0.003 * S * GENESIS_G_IDENTITY_SCALE
}

/** Pull ray anchors toward centroid then extend — finer, longer premium sparks. */
function contractRayAnchor(tx: number, ty: number): [number, number] {
  const [cx, cy] = logoCentroid()
  const f = GENESIS_G_HERO.RAY_LENGTH_FACTOR
  let nx = cx + (tx - cx) * f
  let ny = cy + (ty - cy) * f
  const dx = nx - cx
  const dy = ny - cy
  const r = Math.hypot(dx, dy)
  if (r > 1e-6) {
    const extend = 1 + GENESIS_G_HERO.RAY_RADIAL_EXTEND
    nx = cx + (dx / r) * r * extend
    ny = cy + (dy / r) * r * extend
  }
  return [nx, ny]
}

/** Gradual dissipation at ray tips — no hard cutoffs. */
export function computeRayTailDissipation(radial: number): number {
  if (radial <= GENESIS_QUANTUM_FIELD.OUTER_RADIAL) return 1
  const tipSpan = 1 - GENESIS_QUANTUM_FIELD.OUTER_RADIAL
  const u = (radial - GENESIS_QUANTUM_FIELD.OUTER_RADIAL) / Math.max(tipSpan, 1e-6)
  if (u <= GENESIS_G_HERO.RAY_TAIL_FADE_FROM) return 1
  return smoothstep(1, GENESIS_G_HERO.RAY_TAIL_FADE_FROM, u)
}

/** Internal energy halo — 8–12% beyond nucleus radius, very low presence. */
export function computeInnerEnergyHaloFactor(poolIndex: number, t: number): number {
  const [nx, ny] = resolveGenesisLogoMaskPosition(poolIndex)
  const [ncx, ncy] = nucleusWorldCenter()
  const dist = Math.hypot(nx - ncx, ny - ncy)
  const r0 = nucleusReferenceRadius()
  const rMin = r0 * GENESIS_G_HERO.INNER_HALO_RADIUS_MIN
  const rMax = r0 * GENESIS_G_HERO.INNER_HALO_RADIUS_MAX
  if (dist < rMin || dist > rMax) return 0
  const mid = (rMin + rMax) * 0.5
  const half = (rMax - rMin) * 0.5
  const ring = Math.max(0, 1 - Math.abs(dist - mid) / half)
  const breathe = 0.85 + Math.sin(t * GENESIS_NEON_PULSE.SPEED * 0.42) * 0.15
  return ring * GENESIS_G_HERO.INNER_HALO_STRENGTH * breathe
}

function applyGHeroPresenceMultiplier(
  r: number,
  g: number,
  b: number,
  poolIndex: number,
  isRay: boolean,
  t: number,
  pulse: number
): [number, number, number] {
  let mul = 1
  if (isRay) {
    mul *= computeRayTailDissipation(getLogoParticleRadialNorm(poolIndex))
  } else {
    mul *= 1 + computeInnerEnergyHaloFactor(poolIndex, t)
  }
  return [r * mul, g * mul, b * mul]
}

/** Outer ray spikes — radial distance from logo centroid (PNG pool index). */
export function isGenesisLogoOuterRay(poolIndex: number): boolean {
  const bounds = getGenesisLogoMaskBounds()
  const [wx, wy] = resolveGenesisLogoMaskPosition(poolIndex)
  const cx = (bounds.minX + bounds.maxX) * 0.5
  const cy = (bounds.minY + bounds.maxY) * 0.5
  const radial = Math.hypot(wx - cx, wy - cy) / Math.max(bounds.halfExtent, 1e-6)
  return radial > GENESIS_QUANTUM_FIELD.OUTER_RADIAL
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

/** PNG anchor + quantum field — rays contracted, G silhouette locked. */
export function computeLockedLogoMaskPosition(
  poolIndex: number,
  t: number,
  phase: number,
  motion: number,
  isRay = false
): Vec3 {
  let [tx, ty, tz] = resolveGenesisLogoMaskPosition(poolIndex)
  if (isRay) {
    ;[tx, ty] = contractRayAnchor(tx, ty)
  }
  const windStrength = motion * (isRay ? GENESIS_FLAG_WIND.RAY_STRENGTH : 1)
  const [windX, windY, windZ] = computeGenesisFlagWindOffset(tx, ty, t, phase, windStrength)
  const [qx, qy, qz] = computeGenesisPlasmaDrift(tx, ty, t, phase, motion, isRay)

  let x = tx + windX + qx
  let y = ty + windY + qy
  let z = tz + windZ + qz

  ;[x, y] = applyGenesisFlowField(x, y, t, phase, 0.85, motion)
  ;[x, y] = clampToSilhouette(
    tx,
    ty,
    x,
    y,
    Math.max(quantumSilhouetteCap(motion), flagSilhouetteCap(motion))
  )

  const tier = computeTrustParticleDepthTier(poolIndex)
  z += trustDepthZOffset(tier)

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

/** Nucleus — contained energy layers (core + shell), not a solid sphere. */
export function computeGenesisNucleusPosition(
  u: number,
  t: number,
  phase: number,
  motion: number
): Vec3 {
  const [cx, cy, cz] = worldFromNorm(NUCLEUS_NX, NUCLEUS_NY, 0.038 * S)
  const baseR = 0.003 * S
  const a = u * Math.PI * 2
  const contain =
    1 +
    Math.sin(t * GENESIS_NEON_PULSE.SPEED * 0.38 + phase * 0.5) *
      GENESIS_G_HERO.NUCLEUS_CONTAIN_PULSE
  const isCore = u < 0.5
  const rMul = isCore ? GENESIS_G_HERO.NUCLEUS_CORE_RADIUS : GENESIS_G_HERO.NUCLEUS_SHELL_RADIUS
  const shellWobble = isCore ? 0 : Math.sin(u * Math.PI * 4 + t * 0.28) * 0.06
  const rr = baseR * rMul * contain * (1 + shellWobble)
  const windStrength = motion * GENESIS_FLAG_WIND.NUCLEUS_STRENGTH
  const [windX, windY, windZ] = computeGenesisFlagWindOffset(cx, cy, t, phase, windStrength)
  const [qx, qy, qz] = computeGenesisPlasmaDrift(
    cx,
    cy,
    t,
    phase,
    motion * GENESIS_QUANTUM_FIELD.NUCLEUS_STRENGTH,
    false
  )
  return scaleLogoIdentityPosition(
    cx + Math.cos(a) * rr + windX + qx,
    cy + Math.sin(a) * rr * 0.92 + windY + qy,
    cz + windZ + qz
  )
}

type Rgb = readonly [number, number, number]

/** Official Genesis signature palette (Phase 6.5). */
const SIG_FUCHSIA: Rgb = [1, 0, 200 / 255]
const SIG_MAGENTA: Rgb = [1, 46 / 255, 219 / 255]
const SIG_PURPLE: Rgb = [157 / 255, 77 / 255, 1]
const SIG_BLUE: Rgb = [41 / 255, 98 / 255, 1]
const SIG_CYAN: Rgb = [0, 245 / 255, 1]

const GRADIENT_FUCHSIA: Rgb = SIG_FUCHSIA
const GRADIENT_CORE: Rgb = SIG_PURPLE
const GRADIENT_ION: Rgb = SIG_BLUE
const GRADIENT_CYAN: Rgb = SIG_CYAN

const SPECTRAL_CYAN: Rgb = SIG_CYAN
const SPECTRAL_BLUE: Rgb = SIG_BLUE
const SPECTRAL_PURPLE: Rgb = SIG_PURPLE
const SPECTRAL_MAGENTA: Rgb = SIG_MAGENTA

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

function blendSignatureZones(
  r: number,
  g: number,
  b: number,
  u: number
): [number, number, number] {
  const wFuchsia = 1 - smoothstep(0.15, 0.38, u)
  const wMagenta = smoothstep(0.12, 0.28, u) * (1 - smoothstep(0.38, 0.52, u))
  const wPurple = smoothstep(0.28, 0.42, u) * (1 - smoothstep(0.52, 0.66, u))
  const wBlue = smoothstep(0.48, 0.62, u) * (1 - smoothstep(0.68, 0.82, u))
  const wCyan = smoothstep(0.62, 0.92, u)

  let outR = r * 0.35
  let outG = g * 0.35
  let outB = b * 0.35
  outR += SIG_FUCHSIA[0] * wFuchsia + SIG_MAGENTA[0] * wMagenta
  outG += SIG_FUCHSIA[1] * wFuchsia + SIG_MAGENTA[1] * wMagenta
  outB += SIG_FUCHSIA[2] * wFuchsia + SIG_MAGENTA[2] * wMagenta
  outR += SIG_PURPLE[0] * wPurple
  outG += SIG_PURPLE[1] * wPurple
  outB += SIG_PURPLE[2] * wPurple
  outR += SIG_BLUE[0] * wBlue
  outG += SIG_BLUE[1] * wBlue
  outB += SIG_BLUE[2] * wBlue
  outR += SIG_CYAN[0] * wCyan
  outG += SIG_CYAN[1] * wCyan
  outB += SIG_CYAN[2] * wCyan

  const wSum = wFuchsia + wMagenta + wPurple + wBlue + wCyan
  if (wSum > 0.01) {
    const blend = Math.min(0.88, wSum * 0.72)
    outR = r * (1 - blend) + outR * blend
    outG = g * (1 - blend) + outG * blend
    outB = b * (1 - blend) + outB * blend
  }
  return [outR, outG, outB]
}

/** Signature spectral path — continuous Genesis gradient, no white dominance. */
export function computeStardustColorBeforeGlow(
  baseR: number,
  baseG: number,
  baseB: number,
  t: number,
  phase: number,
  poolIndex: number,
  options: { isRay?: boolean } = {}
): [number, number, number] {
  const travel = (t / STARDUST_SPECTRAL_CYCLE) * 0.22 + phase * 0.1 + poolIndex * 0.0004
  const temporal = sampleGenesisBrandGradient(travel)
  const spatial = sampleGenesisBrandGradient(logoMaskGradientU(poolIndex))
  const spectral = lerpRgb(spatial, temporal, options.isRay ? 0.72 : 0.55)
  const mixBase = options.isRay ? RAY_SPECTRAL_MIX_BASE : G_BODY_SPECTRAL_MIX_BASE
  const mix =
    mixBase + Math.sin(t * 0.18 + phase * 0.42) * LOGO_PERMANENT_GLOW.SPECTRAL_MIX_SWING
  let r = baseR * (1 - mix) + spectral[0] * mix
  let g = baseG * (1 - mix) + spectral[1] * mix
  let b = baseB * (1 - mix) + spectral[2] * mix
  ;[r, g, b] = snapPastelCyanToNeon(r, g, b)
  ;[r, g, b] = suppressNeutralWhite(r, g, b, t + phase)
  ;[r, g, b] = blendSignatureZones(r, g, b, logoMaskGradientU(poolIndex))
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

  let [gr, gg, gb] = applyNeonStardustGlow(
    r,
    g,
    b,
    pulse,
    brightnessMin,
    NEON_CHANNEL_CAP,
    options.isRay
  )
  ;[gr, gg, gb] = applyGHeroPresenceMultiplier(gr, gg, gb, poolIndex, !!options.isRay, t, pulse)
  return [gr, gg, gb]
}

function pureZoneDebugColor(poolIndex: number): [number, number, number] {
  const u = logoMaskGradientU(poolIndex)
  if (u >= 0.72) return [SIG_CYAN[0], SIG_CYAN[1], SIG_CYAN[2]]
  if (u >= 0.52) return [SIG_BLUE[0], SIG_BLUE[1], SIG_BLUE[2]]
  if (u >= 0.32) return [SIG_PURPLE[0], SIG_PURPLE[1], SIG_PURPLE[2]]
  return [SIG_FUCHSIA[0], SIG_FUCHSIA[1], SIG_FUCHSIA[2]]
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
  const coreBlend = 0.22
  const r = SIG_MAGENTA[0] * (1 - coreBlend) + SIG_CYAN[0] * coreBlend
  const g = SIG_MAGENTA[1] * (1 - coreBlend) + SIG_CYAN[1] * coreBlend
  const b = SIG_MAGENTA[2] * (1 - coreBlend) + SIG_CYAN[2] * coreBlend
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
  const containWave =
    Math.sin(t * GENESIS_NEON_PULSE.SPEED * 0.38 + phase * 0.55) *
    GENESIS_G_HERO.NUCLEUS_CONTAIN_PULSE
  const ring = 0.5 + 0.5 * Math.sin(nucleusU * Math.PI * 2 + phase * 0.35)
  const innerDepth = 1 - ring
  const starWave = Math.sin(t * GENESIS_NEON_PULSE.SPEED + phase * 0.6)
  const coreBlend = 0.12 + innerDepth * 0.26 + starWave * 0.05 + containWave * 0.4

  const innerCore = SIG_MAGENTA
  const midLayer = SIG_PURPLE
  const outerPlasma = SIG_CYAN

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
