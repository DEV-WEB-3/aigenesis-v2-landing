import { GENESIS_COLORS, GENESIS_RGB } from '@/lib/genesis-brand'

export type LogoVariant = 'full' | 'mark' | 'wordmark'
export type LogoSize = 'sm' | 'md' | 'lg' | 'xl'
export type LogoTone = 'color' | 'mono' | 'light'

export interface LogoBaseProps {
  variant?: LogoVariant
  size?: LogoSize
  tone?: LogoTone
  animated?: boolean
  className?: string
}

/** Paleta oficial GENESIS — sincronizada en toda la web */
export const BRAND_COLORS = {
  fuchsia: GENESIS_COLORS.fuchsia,
  core: GENESIS_COLORS.core,
  ion: GENESIS_COLORS.ion,
  text: GENESIS_COLORS.text,
  void: GENESIS_COLORS.void,
} as const

export const BRAND_RGB = {
  fuchsia: GENESIS_RGB.fuchsia,
  core: GENESIS_RGB.core,
  ion: GENESIS_RGB.ion,
} as const

export const MARK_PX: Record<LogoSize, number> = {
  sm: 28,
  md: 36,
  lg: 52,
  xl: 72,
}
