/**
 * Phase 5.9–5.11 — Genesis stardust logo formation on Trust section enter.
 * Hero cinematic drop · bidirectional left/right convergence.
 */
import { getGenesisLogoMaskBounds } from './GenesisLogoMaskSampler'
import {
  NEON_BLUE,
  NEON_CYAN,
  NEON_MAGENTA,
  NEON_PURPLE,
} from './trustShieldColorAmplification'

export type GenesisFormationMode =
  | 'fromHeroLogoDrop'
  | 'bidirectional'
  | 'fromTop'
  | 'fromBottom'
  | 'direct'

/** Cinematic Hero → Trust — total runtime ~2.0s. */
export const GENESIS_LOGO_FORM_DURATION = 2.0

/** Trust bidirectional streams — left magenta · right cyan, meet at G center. */
export const BIDIRECTIONAL_FORM_DURATION = 1.7

const BIDIRECTIONAL_EXTREME_MULT = 3.5

export function bidirectionalExtremeMult(viewportWidth: number): number {
  if (viewportWidth < 768) return 2.15
  if (viewportWidth < 1024) return 2.85
  return BIDIRECTIONAL_EXTREME_MULT
}

export const FORMATION_SCATTER_RADIUS = {
  desktop: 1.25,
  tablet: 0.95,
  mobile: 0.65,
} as const

/** Phase 5.11 — Hero logo descends, breaks, reforms, lands. */
export const HERO_CINEMATIC = {
  HERO_START_X: 0,
  Y_OFFSET: 2.0,
  Z_OFFSET: 0.15,
  SOLID_END: 0.25,
  BREAK_END: 0.4,
  REFORM_END: 0.85,
  MAX_SCATTER: 0.08,
  LANDING_OVERSHOOT: 0.025,
  LANDING_COMPRESS: 0.012,
  SPIRAL_STRENGTH: 0.012,
  TRAIL_SECONDS: 0.4,
  BRIGHTNESS_MIN: 0.95,
  BRIGHTNESS_MAX: 1.2,
  SATURATION_MIN: 1.25,
  OPACITY_MIN: 0.95,
} as const

/** @deprecated alias */
export const HERO_LOGO_DROP = HERO_CINEMATIC

let heroDropLogoCenter: [number, number, number] = [0, 0, 0]
let heroDropGroupOffset: [number, number, number] = [0, 0, 0]
let heroDropLogLastAt = 0

export function formationHash01(index: number, salt: number): number {
  const x = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453
  return x - Math.floor(x)
}

function hashSigned(index: number, salt: number): number {
  return (formationHash01(index, salt) - 0.5) * 2
}

export function computeHeroDropLogoCenter(
  finalPositions: Float32Array,
  count: number
): [number, number, number] {
  if (count <= 0) return [0, 0, 0]
  let sx = 0
  let sy = 0
  let sz = 0
  for (let i = 0; i < count; i++) {
    const bi = i * 3
    sx += finalPositions[bi]!
    sy += finalPositions[bi + 1]!
    sz += finalPositions[bi + 2]!
  }
  const inv = 1 / count
  return [sx * inv, sy * inv, sz * inv]
}

export function setHeroDropLogoCenter(center: [number, number, number] | null) {
  heroDropLogoCenter = center ?? [0, 0, 0]
}

export function setHeroDropGroupOffset(offset: [number, number, number]) {
  heroDropGroupOffset = offset
}

export function scatterRadiusForViewport(width: number): number {
  if (width >= 1024) return FORMATION_SCATTER_RADIUS.desktop
  if (width >= 768) return FORMATION_SCATTER_RADIUS.tablet
  return FORMATION_SCATTER_RADIUS.mobile
}

export function resolveGenesisFormationMode(
  _fromSection: number,
  _directEntry = false
): GenesisFormationMode {
  return 'bidirectional'
}

export function genesisFormationDuration(mode: GenesisFormationMode): number {
  if (mode === 'fromHeroLogoDrop') return GENESIS_LOGO_FORM_DURATION
  if (mode === 'bidirectional') return BIDIRECTIONAL_FORM_DURATION
  return BIDIRECTIONAL_FORM_DURATION
}

export function genesisLogoFormationProgress(
  elapsed: number,
  mode: GenesisFormationMode = 'bidirectional'
): number {
  if (elapsed <= 0) return 0
  return Math.min(1, elapsed / genesisFormationDuration(mode))
}

export function easeOutCubic(t: number): number {
  const u = Math.max(0, Math.min(1, t))
  return 1 - (1 - u) ** 3
}

export function easeInOutCubic(t: number): number {
  const u = Math.max(0, Math.min(1, t))
  return u < 0.5 ? 4 * u * u * u : 1 - (-2 * u + 2) ** 3 / 2
}

export function easeOutExpo(t: number): number {
  const u = Math.max(0, Math.min(1, t))
  return u >= 1 ? 1 : 1 - 2 ** (-10 * u)
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function particleFormationLocalT(
  formT: number,
  particleIndex: number,
  mode: GenesisFormationMode = 'bidirectional',
  finalX = 0,
  centerX = 0,
  halfW = 1
): number {
  if (mode === 'fromHeroLogoDrop') return formT
  if (mode === 'bidirectional') {
    const distNorm = Math.min(1, Math.abs(finalX - centerX) / Math.max(halfW, 1e-6))
    const centerDelay = (1 - distNorm) * 0.28
    const stagger = centerDelay + formationHash01(particleIndex, 11.3) * 0.07
    if (formT <= stagger) return 0
    return Math.min(1, (formT - stagger) / Math.max(1e-6, 1 - stagger))
  }
  const stagger = formationHash01(particleIndex, 11.3) * 0.22
  if (formT <= stagger) return 0
  return Math.min(1, (formT - stagger) / Math.max(1e-6, 1 - stagger))
}

function formationEase(localT: number, mode: GenesisFormationMode): number {
  if (mode === 'fromHeroLogoDrop') return easeOutCubic(localT)
  if (mode === 'bidirectional') return easeInOutCubic(localT)
  return easeOutExpo(localT)
}

export type BidirectionalSide = 'left' | 'right'

export function formationBidirectionalSide(
  finalX: number,
  particleIndex: number,
  centerX: number
): BidirectionalSide {
  if (Math.abs(finalX - centerX) < 0.012) {
    return formationHash01(particleIndex, 17.3) < 0.5 ? 'left' : 'right'
  }
  return finalX < centerX ? 'left' : 'right'
}

function bidirectionalStreamTint(side: BidirectionalSide, salt: number): [number, number, number] {
  const h = formationHash01(salt, 23.7)
  if (side === 'left') {
    return [
      NEON_MAGENTA[0]! + (NEON_PURPLE[0]! - NEON_MAGENTA[0]!) * h,
      NEON_MAGENTA[1]! + (NEON_PURPLE[1]! - NEON_MAGENTA[1]!) * h,
      NEON_MAGENTA[2]! + (NEON_PURPLE[2]! - NEON_MAGENTA[2]!) * h,
    ]
  }
  return [
    NEON_CYAN[0]! + (NEON_BLUE[0]! - NEON_CYAN[0]!) * h,
    NEON_CYAN[1]! + (NEON_BLUE[1]! - NEON_CYAN[1]!) * h,
    NEON_CYAN[2]! + (NEON_BLUE[2]! - NEON_CYAN[2]!) * h,
  ]
}

/** Stream color → final Genesis blend as particles converge. */
export function formationBidirectionalColorBlend(
  formT: number,
  particleIndex: number,
  side: BidirectionalSide,
  finalR: number,
  finalG: number,
  finalB: number,
  poolIndex: number,
  finalX: number,
  centerX: number,
  halfW: number
): [number, number, number] {
  const boundsHalfW = Math.max(halfW, 1e-6)
  const localT = particleFormationLocalT(
    formT,
    particleIndex,
    'bidirectional',
    finalX,
    centerX,
    boundsHalfW
  )
  const eased = easeInOutCubic(localT)
  const [tr, tg, tb] = bidirectionalStreamTint(side, poolIndex)
  const tintWeight = (1 - eased) * (0.78 + formationHash01(particleIndex, 31.1) * 0.22)
  return [
    Math.min(1, finalR + (tr - finalR) * tintWeight),
    Math.min(1, finalG + (tg - finalG) * tintWeight),
    Math.min(1, finalB + (tb - finalB) * tintWeight),
  ]
}

/** Hero cinematic: 0.95 → 1.20. */
export function formationBrightnessMul(
  formT: number,
  particleIndex: number,
  mode: GenesisFormationMode = 'direct'
): number {
  if (mode === 'fromHeroLogoDrop') {
    return (
      HERO_CINEMATIC.BRIGHTNESS_MIN +
      easeOutCubic(formT) * (HERO_CINEMATIC.BRIGHTNESS_MAX - HERO_CINEMATIC.BRIGHTNESS_MIN)
    )
  }
  if (mode === 'bidirectional') {
    const localT = particleFormationLocalT(formT, particleIndex, mode)
    return 0.42 + easeOutCubic(localT) * 0.58
  }
  const localT = particleFormationLocalT(formT, particleIndex, mode)
  return 0.35 + formationEase(localT, mode) * 0.65
}

/** Hero cinematic: saturation floor 1.25 for entire transition. */
export function formationSaturationMul(
  formT: number,
  particleIndex: number,
  mode: GenesisFormationMode = 'direct'
): number {
  if (mode !== 'fromHeroLogoDrop') return 1
  if (formT >= 1) return 1
  return HERO_CINEMATIC.SATURATION_MIN
}

/** Light trail boost during first 0.4s of descent. */
export function formationTrailBoost(elapsed: number, formT: number, mode: GenesisFormationMode): number {
  if (mode !== 'fromHeroLogoDrop' || formT >= 1) return 0
  if (elapsed >= HERO_CINEMATIC.TRAIL_SECONDS) return 0
  const u = 1 - elapsed / HERO_CINEMATIC.TRAIL_SECONDS
  return u * u * 0.18
}

/** Zone density — inner edge, left bar, nucleus read instantly. */
export function formationDensityMul(
  slot: number,
  poolIndex: number,
  finalX: number,
  finalY: number,
  mode: GenesisFormationMode,
  logoMaskSlot: number,
  logoNucleusSlot: number
): number {
  if (mode !== 'fromHeroLogoDrop') return 1
  if (slot === logoNucleusSlot) return 1.28
  const bounds = getGenesisLogoMaskBounds()
  const nx = bounds.halfExtent > 1e-6 ? finalX / bounds.halfExtent : 0
  const ny = bounds.halfExtent > 1e-6 ? finalY / bounds.halfExtent : 0
  const dist = Math.sqrt(nx * nx + ny * ny)
  let mul = 1
  if (nx < -0.12) mul = Math.max(mul, 1.14)
  if (dist > 0.42 && dist < 0.78) mul = Math.max(mul, 1.1)
  if (Math.abs(nx) < 0.22 && ny > -0.05 && ny < 0.35) mul = Math.max(mul, 1.12)
  const h = formationHash01(poolIndex, 9.3)
  return mul * (0.98 + h * 0.04)
}

export function applyFormationNeonColor(
  r: number,
  g: number,
  b: number,
  brightnessMul: number,
  saturationMul: number,
  trailBoost = 0,
  densityMul = 1
): [number, number, number] {
  let rr = r * brightnessMul * densityMul
  let gg = g * brightnessMul * densityMul
  let bb = b * brightnessMul * densityMul
  const l = (rr + gg + bb) / 3
  rr = l + (rr - l) * saturationMul
  gg = l + (gg - l) * saturationMul
  bb = l + (bb - l) * saturationMul
  if (trailBoost > 0) {
    rr += trailBoost * 0.85
    gg += trailBoost * 0.35
    bb += trailBoost * 1.0
  }
  return [rr, gg, bb]
}

function scatterEnvelope(formT: number): number {
  const c = HERO_CINEMATIC
  if (formT < c.SOLID_END) return 0
  if (formT < c.BREAK_END) {
    const u = (formT - c.SOLID_END) / (c.BREAK_END - c.SOLID_END)
    return c.MAX_SCATTER * easeOutCubic(u)
  }
  if (formT < c.REFORM_END) {
    const u = (formT - c.BREAK_END) / (c.REFORM_END - c.BREAK_END)
    return c.MAX_SCATTER * (1 - easeOutExpo(u))
  }
  return 0
}

function landingImpact(formT: number): { y: number; scale: number } {
  const c = HERO_CINEMATIC
  if (formT < c.REFORM_END) return { y: 0, scale: 1 }
  const u = (formT - c.REFORM_END) / (1 - c.REFORM_END)
  const bounce = Math.sin(u * Math.PI) * c.LANDING_OVERSHOOT
  const compress = u < 0.35 ? -c.LANDING_COMPRESS * (1 - u / 0.35) : 0
  return { y: bounce + compress, scale: 1 + bounce * 0.15 }
}

function computeHeroCinematicPosition(
  basePosition: readonly [number, number, number],
  formT: number,
  t: number,
  particleIndex: number,
  identityScale: number
): [number, number, number] {
  const [fx, fy, fz] = basePosition
  const [lcx, lcy, lcz] = heroDropLogoCenter
  const [gx, gy, gz] = heroDropGroupOffset
  const c = HERO_CINEMATIC

  const endX = fx + gx
  const endY = fy + gy
  const endZ = fz + gz

  const solidScale = identityScale
  const startX = c.HERO_START_X + (fx - lcx) * solidScale
  const startY = fy + c.Y_OFFSET + (fy - lcy) * solidScale
  const startZ = fz + c.Z_OFFSET + (fz - lcz)

  const motionT = Math.min(1, formT / c.REFORM_END)
  const xEase = easeOutCubic(motionT)
  const yEase = easeOutExpo(motionT)
  const zEase = easeOutCubic(motionT)

  let x = lerp(startX, endX, xEase)
  let y = lerp(startY, endY, yEase)
  let z = lerp(startZ, endZ, zEase)

  const scatter = scatterEnvelope(formT)
  if (scatter > 0) {
    const dx = fx - lcx
    const dy = fy - lcy
    const dz = fz - lcz
    const len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1
    const sx = hashSigned(particleIndex, 1.7)
    const sy = hashSigned(particleIndex, 3.1)
    const sz = hashSigned(particleIndex, 5.9)
    x += (dx / len) * scatter * sx + sx * scatter * 0.35
    y += (dy / len) * scatter * sy + sy * scatter * 0.35
    z += (dz / len) * scatter * sz + sz * scatter * 0.2
  }

  if (formT >= c.BREAK_END && formT < c.REFORM_END) {
    const reformU = (formT - c.BREAK_END) / (c.REFORM_END - c.BREAK_END)
    const pull = easeOutExpo(reformU)
    x = lerp(x, endX, pull * 0.92)
    y = lerp(y, endY, pull * 0.92)
    z = lerp(z, endZ, pull * 0.92)
    const spiral = (1 - pull) * c.SPIRAL_STRENGTH
    const angle = t * 1.35 + particleIndex * 0.19
    x += Math.cos(angle) * spiral
    y += Math.sin(angle) * spiral * 0.85
  }

  if (formT >= c.REFORM_END) {
    x = endX
    y = endY
    z = endZ
  }

  const impact = landingImpact(formT)
  y += impact.y
  const cx = lcx + gx
  const cy = lcy + gy
  x = cx + (x - cx) * impact.scale
  y = cy + (y - cy) * impact.scale

  return [x, y, z]
}

export function scatterGenesisStardustLogo(
  count: number,
  mode: GenesisFormationMode,
  finalPositions: Float32Array,
  viewportWidth: number
): Float32Array {
  const scatter = new Float32Array(count * 3)
  const bounds = getGenesisLogoMaskBounds()
  const cx = (bounds.minX + bounds.maxX) * 0.5
  const cy = (bounds.minY + bounds.maxY) * 0.5
  const halfW = (bounds.maxX - bounds.minX) * 0.5
  const halfH = (bounds.maxY - bounds.minY) * 0.5
  const scatterScale = scatterRadiusForViewport(viewportWidth)

  if (mode === 'fromHeroLogoDrop') {
    const [lcx, lcy, lcz] = computeHeroDropLogoCenter(finalPositions, count)
    setHeroDropLogoCenter([lcx, lcy, lcz])
    const c = HERO_CINEMATIC
    for (let i = 0; i < count; i++) {
      const bi = i * 3
      const fx = finalPositions[bi]!
      const fy = finalPositions[bi + 1]!
      const fz = finalPositions[bi + 2]!
      scatter[bi] = c.HERO_START_X + (fx - lcx)
      scatter[bi + 1] = fy + c.Y_OFFSET + (fy - lcy)
      scatter[bi + 2] = fz + c.Z_OFFSET + (fz - lcz)
    }
    return scatter
  }

  setHeroDropLogoCenter(null)

  if (mode === 'bidirectional') {
    const extreme = halfW * scatterScale * bidirectionalExtremeMult(viewportWidth)
    for (let i = 0; i < count; i++) {
      const bi = i * 3
      const fx = finalPositions[bi]!
      const fy = finalPositions[bi + 1]!
      const fz = finalPositions[bi + 2]!
      const h2 = formationHash01(i, 3.1)
      const side = formationBidirectionalSide(fx, i, cx)
      scatter[bi] =
        side === 'left'
          ? bounds.minX - extreme - formationHash01(i, 1.7) * halfW * 0.06
          : bounds.maxX + extreme + formationHash01(i, 1.7) * halfW * 0.06
      scatter[bi + 1] = fy + (h2 - 0.5) * halfH * 0.05
      scatter[bi + 2] = fz + (formationHash01(i, 5.9) - 0.5) * 0.035
    }
    return scatter
  }

  for (let i = 0; i < count; i++) {
    const bi = i * 3
    const fx = finalPositions[bi]!
    const fy = finalPositions[bi + 1]!
    const fz = finalPositions[bi + 2]!

    const h1 = formationHash01(i, 1.7)
    const h2 = formationHash01(i, 3.1)
    const h3 = formationHash01(i, 5.9)

    let sx: number
    let sy: number
    let sz: number

    if (mode === 'direct') {
      const angle = h1 * Math.PI * 2 + h2 * 0.4
      const r = halfW * scatterScale * (0.42 + h2 * 0.58)
      sx = cx + Math.cos(angle) * r * 0.92
      sy = cy + Math.sin(angle) * r * 0.88
      sz = fz + (h3 - 0.5) * halfW * 0.08
    } else if (mode === 'fromTop') {
      sx = fx + halfW * scatterScale * (0.18 + h1 * 0.72)
      sy = fy + halfH * scatterScale * (0.42 + h2 * 0.82)
      sz = fz + (h3 - 0.5) * 0.05
    } else {
      sx = fx + halfW * scatterScale * (0.15 + h1 * 0.68)
      sy = fy - halfH * scatterScale * (0.38 + h2 * 0.78)
      sz = fz + (h3 - 0.5) * 0.05
    }

    scatter[bi] = sx
    scatter[bi + 1] = sy
    scatter[bi + 2] = sz
  }

  return scatter
}

export function computeGenesisLogoFormationPosition(
  basePosition: readonly [number, number, number],
  scatterPosition: readonly [number, number, number],
  formT: number,
  t: number,
  particleIndex: number,
  mode: GenesisFormationMode = 'direct',
  identityScale = 1
): [number, number, number] {
  if (mode === 'fromHeroLogoDrop') {
    const pos = computeHeroCinematicPosition(
      basePosition,
      formT,
      t,
      particleIndex,
      identityScale
    )

    if (particleIndex === 0) {
      const now = typeof performance !== 'undefined' ? performance.now() : Date.now()
      if (now - heroDropLogLastAt > 500) {
        heroDropLogLastAt = now
        console.log('[GenesisCinematic]', {
          formT,
          scatter: scatterEnvelope(formT),
          phase:
            formT < HERO_CINEMATIC.SOLID_END
              ? 'descent'
              : formT < HERO_CINEMATIC.BREAK_END
                ? 'break'
                : formT < HERO_CINEMATIC.REFORM_END
                  ? 'reform'
                  : 'impact',
        })
      }
    }

    return pos
  }

  const [bx, by, bz] = basePosition
  const [sx, sy, sz] = scatterPosition

  if (mode === 'bidirectional') {
    const bounds = getGenesisLogoMaskBounds()
    const cx = (bounds.minX + bounds.maxX) * 0.5
    const halfW = bounds.halfExtent
    const localT = particleFormationLocalT(formT, particleIndex, mode, bx, cx, halfW)
    const eased = easeInOutCubic(localT)
    let x = sx + (bx - sx) * eased
    let y = sy + (by - sy) * eased
    let z = sz + (bz - sz) * eased
    if (localT < 1) {
      const pull = (1 - eased) ** 1.35 * 0.07
      x += (bx - x) * pull
      y += (by - y) * pull * 0.88
      z += (bz - z) * pull * 0.45
    }
    return [x, y, z]
  }

  const localT = particleFormationLocalT(formT, particleIndex, mode)
  const eased = formationEase(localT, mode)

  let x = sx + (bx - sx) * eased
  let y = sy + (by - sy) * eased
  let z = sz + (bz - sz) * eased

  if (localT < 1) {
    const spiral = (1 - eased) * 0.014
    const angle = t * 1.35 + particleIndex * 0.19
    x += Math.cos(angle) * spiral
    y += Math.sin(angle) * spiral * 0.85
  }

  return [x, y, z]
}

export function buildTrustFormationScatter(
  count: number,
  mode: GenesisFormationMode,
  viewportWidth: number,
  resolveFinal: (i: number) => [number, number, number]
): Float32Array {
  const finals = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const [x, y, z] = resolveFinal(i)
    const bi = i * 3
    finals[bi] = x
    finals[bi + 1] = y
    finals[bi + 2] = z
  }
  return scatterGenesisStardustLogo(count, mode, finals, viewportWidth)
}
