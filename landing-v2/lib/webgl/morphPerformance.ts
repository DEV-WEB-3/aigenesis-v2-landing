/** Adaptive WebGL morph particle budget — production mobile tuning. */
export type MorphPerfTier = 'high' | 'medium' | 'low'

export const MORPH_PARTICLE_COUNTS: Record<MorphPerfTier, number> = {
  high: 600,
  medium: 480,
  low: 320,
}

export function detectMorphPerfTier(width: number): MorphPerfTier {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return 'low'
  }
  if (width >= 1024) return 'high'
  if (width >= 768) return 'medium'
  return 'low'
}

export function morphParticleCountForWidth(width: number): number {
  return MORPH_PARTICLE_COUNTS[detectMorphPerfTier(width)]
}
