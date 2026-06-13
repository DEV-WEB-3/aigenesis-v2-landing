/**
 * Phase 6.6 — G-hero particle budget: +25% density on G body vs outer rays.
 */
import { GENESIS_LOGO_MASK_POOL_COUNT } from '../genesisLogoMaskPool.generated'
import { isGenesisLogoOuterRay } from './GenesisStardustEntityV2'

let innerPoolCache: number[] | null = null
let outerPoolCache: number[] | null = null

function ensurePools(): { inner: number[]; outer: number[] } {
  if (innerPoolCache && outerPoolCache) {
    return { inner: innerPoolCache, outer: outerPoolCache }
  }
  innerPoolCache = []
  outerPoolCache = []
  for (let pi = 0; pi < GENESIS_LOGO_MASK_POOL_COUNT; pi++) {
    if (isGenesisLogoOuterRay(pi)) outerPoolCache.push(pi)
    else innerPoolCache.push(pi)
  }
  if (innerPoolCache.length === 0) innerPoolCache.push(0)
  if (outerPoolCache.length === 0) outerPoolCache.push(0)
  return { inner: innerPoolCache, outer: outerPoolCache }
}

/** Deterministic weighted pick — inner G body gets 1.25× slot share. */
export function pickGHeroLogoMaskPoolIndex(particleIndex: number, count: number): number {
  const { inner, outer } = ensurePools()
  const innerWeight = 1.25
  const outerWeight = 1
  const totalWeight = inner.length * innerWeight + outer.length * outerWeight
  const innerSlots = Math.min(
    count - 1,
    Math.max(1, Math.round((count * inner.length * innerWeight) / totalWeight))
  )
  const pickInner = particleIndex < innerSlots
  const list = pickInner ? inner : outer
  const local = pickInner ? particleIndex : particleIndex - innerSlots
  const denom = pickInner ? Math.max(1, innerSlots) : Math.max(1, count - innerSlots)
  return list[Math.floor((local * list.length) / denom) % list.length]!
}

export function gHeroInnerParticleShare(count: number): number {
  const { inner, outer } = ensurePools()
  const innerWeight = 1.25
  const totalWeight = inner.length * innerWeight + outer.length
  return (inner.length * innerWeight) / totalWeight
}

/** Audit helper */
export function isGHeroInnerPoolIndex(poolIndex: number): boolean {
  return !isGenesisLogoOuterRay(poolIndex)
}
