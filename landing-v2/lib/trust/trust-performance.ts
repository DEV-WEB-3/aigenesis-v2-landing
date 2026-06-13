/**
 * Trust / Stardust Logo — adaptive particle tiers (Phase 6.0).
 * Desktop 2500 · Tablet 1500 · Mobile 900 — 95% PNG mask budget.
 */
export type TrustPerfTier = 'high' | 'medium' | 'low'

export const TRUST_PARTICLE_COUNTS: Record<TrustPerfTier, number> = {
  high: 2500,
  medium: 1200,
  low: 600,
}

/** Buffer máximo del morph system — igual al tier desktop. */
export const MORPH_MAX_PARTICLE_COUNT = TRUST_PARTICLE_COUNTS.high

export function detectTrustPerfTier(width: number): TrustPerfTier {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return 'low'
  }
  if (width >= 1024) return 'high'
  if (width >= 768) return 'medium'
  return 'low'
}

export function trustParticleCountForTier(tier: TrustPerfTier): number {
  return TRUST_PARTICLE_COUNTS[tier]
}

export function trustParticleCountForWidth(width: number): number {
  return trustParticleCountForTier(detectTrustPerfTier(width))
}

/** Oculta partículas de relleno fuera del conteo activo. */
export function padParticleBuffer(buf: Float32Array, maxCount: number): Float32Array {
  const n = buf.length / 3
  if (n === maxCount) return buf
  const out = new Float32Array(maxCount * 3)
  const copyLen = Math.min(n, maxCount) * 3
  out.set(buf.subarray(0, copyLen))
  for (let i = Math.min(n, maxCount); i < maxCount; i++) {
    const bi = i * 3
    out[bi] = 0
    out[bi + 1] = -120
    out[bi + 2] = 0
  }
  return out
}
