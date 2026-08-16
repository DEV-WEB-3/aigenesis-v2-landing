import { EMISSION, VOID } from '@/lib/design/tokens'
import { GENESIS_RGB, genesisColorAtX, type GenesisColorKey } from '@/lib/genesis-brand'

/** Paleta Hero — alineada al logo Genesis oficial */
export const HERO_VOID = VOID.black
export const HERO_VOID_MID = VOID.black
export const HERO_VOID_EDGE = VOID.black
export const HERO_CENTER = VOID.black
export const HERO_SHADOW = 'rgba(2, 4, 10, 0.88)'
export const HERO_SHADOW_SOFT = 'rgba(3, 7, 17, 0.55)'
export const HERO_NEON = EMISSION.magenta
export const HERO_NEON_GLOW = 'rgba(233, 30, 139, 0.55)'

/** RGB canvas Hero — mismos tokens que genesis-brand */
export const HERO_RGB = {
  fuchsia: GENESIS_RGB.fuchsia,
  fuchsiaSoft: GENESIS_RGB.fuchsiaSoft,
  core: GENESIS_RGB.core,
  ion: GENESIS_RGB.ion,
  cyan: GENESIS_RGB.cyan,
} as const

export type HeroColorKey = GenesisColorKey

export function heroRgba(key: HeroColorKey, alpha: number): string {
  const c = key === 'ion' ? HERO_RGB.cyan : HERO_RGB[key]
  return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${alpha})`
}

export function heroColorAtX(nx: number): HeroColorKey {
  return genesisColorAtX(nx)
}

/** Olas: textura atmosférica al 20% */
export const WAVE_ATMOSPHERE_SCALE = 0.2

export const WAVE_OPACITY_SCALE = {
  high: 0.49,
  medium: 0.33,
  low: 0.22,
} as const

export const PARTICLE_PRESENCE_SCALE = {
  high: 1.28,
  medium: 1.16,
  low: 1.06,
} as const

export const NEURAL_PRESENCE_SCALE = {
  high: 1.2,
  medium: 1.12,
  low: 1.06,
} as const
