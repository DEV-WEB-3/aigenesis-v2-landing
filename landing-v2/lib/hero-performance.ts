export type HeroPerfTier = 'high' | 'medium' | 'low'

export const HERO_LOGO_FOCUS = { x: 0.5, y: 0.44 } as const
export const HERO_ORB_FOCUS = HERO_LOGO_FOCUS

/** Parallax desactivado — canvas y UI estáticos respecto al cursor */
export const HERO_PARALLAX_IDLE = { x: 0, y: 0, nx: 0.5, ny: 0.5 } as const

/** Escala única canvas + núcleo — evita desincronización logo/fondo */
export const HERO_CANVAS_PARALLAX_SCALE = 0.28
export const HERO_ATMOSPHERE_FOCUS_SCALE = 0.35
export const HERO_UI_PARALLAX_PX = 40

export interface HeroParallaxInput {
  x: number
  y: number
  nx: number
  ny: number
}

export function dampenHeroParallax(
  px: HeroParallaxInput,
  scale = HERO_CANVAS_PARALLAX_SCALE
): HeroParallaxInput {
  return { x: px.x * scale, y: px.y * scale, nx: px.nx, ny: px.ny }
}

/** Desplazamiento en px del foco atmosférico / núcleo (misma fórmula que el canvas) */
export function heroFocusOffsetPx(px: HeroParallaxInput, w: number, h: number) {
  const cp = dampenHeroParallax(px)
  return {
    x: cp.x * w * HERO_ATMOSPHERE_FOCUS_SCALE,
    y: cp.y * h * HERO_ATMOSPHERE_FOCUS_SCALE,
  }
}

export function heroUiOffsetPx(px: HeroParallaxInput) {
  return { x: px.x * HERO_UI_PARALLAX_PX, y: px.y * HERO_UI_PARALLAX_PX }
}

export function detectHeroPerfTier(): HeroPerfTier {
  if (typeof window === 'undefined') return 'medium'
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'low'

  const w = window.innerWidth
  const cores = navigator.hardwareConcurrency ?? 4
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4

  if (w < 480 || cores <= 2) return 'low'
  if (w < 768 || cores <= 4 || memory <= 4) return 'medium'
  return 'high'
}

export const RING_PARTICLE_COUNTS: Record<HeroPerfTier, { inner: number; middle: number; outer: number }> = {
  high: { inner: 24, middle: 36, outer: 28 },
  medium: { inner: 14, middle: 20, outer: 14 },
  low: { inner: 8, middle: 10, outer: 6 },
}

export const PARTICLE_COUNTS = RING_PARTICLE_COUNTS

export const FIELD_PARTICLE_COUNTS: Record<HeroPerfTier, number> = {
  high: 3200,
  medium: 1200,
  low: 380,
}

export const NETWORK_NODE_COUNTS: Record<HeroPerfTier, number> = {
  high: 72,
  medium: 40,
  low: 16,
}

export const BURST_PARTICLE_COUNTS: Record<HeroPerfTier, number> = {
  high: 260,
  medium: 140,
  low: 56,
}

export const ORB_RING_PARTICLE_COUNTS: Record<HeroPerfTier, number> = {
  high: 320,
  medium: 180,
  low: 80,
}

export const HERO_TIER_FLAGS: Record<
  HeroPerfTier,
  { parallax: boolean; cursorRepel: boolean; oceanCanvas: boolean }
> = {
  high: { parallax: true, cursorRepel: false, oceanCanvas: true },
  medium: { parallax: true, cursorRepel: false, oceanCanvas: true },
  low: { parallax: false, cursorRepel: false, oceanCanvas: true },
}
