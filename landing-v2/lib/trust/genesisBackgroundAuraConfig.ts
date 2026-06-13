/**
 * Phase 6.8 — Genesis light aura (Trust, behind particles).
 *
 * Disable: USE_GENESIS_BACKGROUND_AURA=false
 *          (or NEXT_PUBLIC_USE_GENESIS_BACKGROUND_AURA=false)
 */

function readEnvDisabled(name: string): boolean {
  const v = process.env[name] ?? process.env[`NEXT_PUBLIC_${name}`]
  return v === 'false' || v === '0'
}

/** Default ON when env unset. */
export const USE_GENESIS_BACKGROUND_AURA = !readEnvDisabled('USE_GENESIS_BACKGROUND_AURA')

/** Approximate logo visual footprint — aura scales as % of this. */
export const GENESIS_AURA_LOGO_REF_PX = {
  DESKTOP: 400,
  TABLET: 360,
  MOBILE: 320,
} as const

export const GENESIS_AURA_SIZE_RATIO = {
  DESKTOP: 0.88,
  TABLET: 0.76,
  MOBILE: 0.68,
} as const

export const GENESIS_BACKGROUND_AURA_STYLE = {
  BREATH_DURATION_S: 6.4,
  OPACITY_MIN: 0.38,
  OPACITY_MAX: 0.52,
  SCALE_MIN: 1,
  SCALE_MAX: 1.1,
  BLUR_DESKTOP_PX: 88,
  BLUR_TABLET_PX: 80,
  BLUR_MOBILE_PX: 72,
} as const
