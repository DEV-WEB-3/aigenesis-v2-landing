/**
 * Paletas WebGL por sección — Genesis Brand Sync
 */
import { GENESIS_RGB_NORM } from '@/lib/genesis-brand'

export type Rgb = readonly [number, number, number]

export const BRAND_RGB = GENESIS_RGB_NORM

export interface SectionPalette {
  name: string
  primary: Rgb
  secondary: Rgb
  accent?: Rgb
  secondaryWeight: number
  accentWeight?: number
}

/** 14 secciones — alineado con buildAllTargets() */
export const SECTION_PALETTES: readonly SectionPalette[] = [
  { name: 'Hero',        primary: BRAND_RGB.cyan,        secondary: BRAND_RGB.core,    accent: BRAND_RGB.fuchsia,     secondaryWeight: 0.55, accentWeight: 0.22 },
  { name: 'Trust',       primary: BRAND_RGB.ion,         secondary: BRAND_RGB.cyan,  accent: BRAND_RGB.core,        secondaryWeight: 0.42, accentWeight: 0.2 },
  { name: 'Ecosistema',  primary: BRAND_RGB.core,        secondary: BRAND_RGB.ion,     accent: BRAND_RGB.cyan,        secondaryWeight: 0.4,  accentWeight: 0.22 },
  { name: 'Token',       primary: BRAND_RGB.core,        secondary: BRAND_RGB.ion,     accent: BRAND_RGB.cyan,        secondaryWeight: 0.38, accentWeight: 0.18 },
  { name: 'Mining',      primary: BRAND_RGB.ion,         secondary: BRAND_RGB.cyan,    accent: BRAND_RGB.core,        secondaryWeight: 0.4,  accentWeight: 0.18 },
  { name: 'Booster',     primary: BRAND_RGB.fuchsia,     secondary: BRAND_RGB.core,    accent: BRAND_RGB.fuchsiaSoft, secondaryWeight: 0.38, accentWeight: 0.15 },
  { name: 'Staking',     primary: BRAND_RGB.core,        secondary: BRAND_RGB.ion,     accent: BRAND_RGB.cyan,        secondaryWeight: 0.36, accentWeight: 0.16 },
  { name: 'G-Pulse',     primary: BRAND_RGB.fuchsia,     secondary: BRAND_RGB.cyan,    accent: BRAND_RGB.pulse,       secondaryWeight: 0.4,  accentWeight: 0.2 },
  { name: 'G-Oracle',    primary: BRAND_RGB.fuchsia,     secondary: BRAND_RGB.core,    accent: BRAND_RGB.cyan,        secondaryWeight: 0.36, accentWeight: 0.3 },
  { name: 'Marketplace', primary: BRAND_RGB.ion,         secondary: BRAND_RGB.cyan,    accent: BRAND_RGB.core,        secondaryWeight: 0.4,  accentWeight: 0.18 },
  { name: 'Comunidad',   primary: BRAND_RGB.fuchsia,     secondary: BRAND_RGB.core,    accent: BRAND_RGB.fuchsiaSoft, secondaryWeight: 0.42, accentWeight: 0.18 },
  { name: 'Tech',        primary: BRAND_RGB.cyan,        secondary: BRAND_RGB.ion,     accent: BRAND_RGB.core,        secondaryWeight: 0.4,  accentWeight: 0.18 },
  { name: 'Roadmap',     primary: BRAND_RGB.core,        secondary: BRAND_RGB.cyan,    accent: BRAND_RGB.ion,         secondaryWeight: 0.4,  accentWeight: 0.2 },
  { name: 'CTA',         primary: BRAND_RGB.fuchsia,     secondary: BRAND_RGB.core,    accent: BRAND_RGB.ion,         secondaryWeight: 0.42, accentWeight: 0.28 },
] as const

export const CTA_SECTION_INDEX = 13
export const COLOR_LERP_SPEED = 0.038

export function buildSectionParticleColors(
  sectionIndex: number,
  count: number
): Float32Array {
  const palette = SECTION_PALETTES[Math.min(sectionIndex, SECTION_PALETTES.length - 1)]
  const colors = new Float32Array(count * 3)
  const accentW = palette.accentWeight ?? 0
  const secW = palette.secondaryWeight

  for (let i = 0; i < count; i++) {
    const r = Math.random()
    let c: Rgb = palette.primary
    if (palette.accent && r < accentW) {
      c = palette.accent
    } else if (r < accentW + secW) {
      c = palette.secondary
    }
    colors[i * 3] = c[0]
    colors[i * 3 + 1] = c[1]
    colors[i * 3 + 2] = c[2]
  }
  return colors
}

export function getOrbFuchsiaMix(sectionIndex: number): number {
  switch (sectionIndex) {
    case 0:  return 0.24
    case 7:  return 0.18
    case 8:  return 0.22
    case 13: return 0.25
    case 5:  return 0.14
    case 10: return 0.12
    default: return 0.08
  }
}

export function getOrbGlowOpacity(sectionIndex: number): number {
  const mix = getOrbFuchsiaMix(sectionIndex)
  return 0.04 + mix * 0.28
}
