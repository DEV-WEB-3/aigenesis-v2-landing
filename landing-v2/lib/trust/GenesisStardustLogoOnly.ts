/**
 * Phase 6.0 — Official Genesis logo stardust (PNG mask only).
 * 95% LOGO_MASK · 5% nucleus · 0% extra rays — logo-genesis-mark.png is source of truth.
 */
import { TRUST_CORE_SLOT } from './GenesisLogoLayout'
import { resolveGenesisLogoMaskPosition } from './GenesisLogoMaskSampler'
import { applyGenesisLogoOrientation } from './GenesisLogoOrientation'
import { GENESIS_LOGO_MASK_POOL_COUNT } from './genesisLogoMaskPool.generated'
import { computeGenesisNucleusPosition } from './GenesisStardustEntity'
import { USE_GENESIS_LOGO_V1 } from './genesisLogoVersion'
import { pickGHeroLogoMaskPoolIndex } from './v2/GenesisLogoMaskSamplingV2'
import { TRUST_META_STRIDE } from './trustShieldConstants'
import { TRUST_ROLE } from './trustShieldRoles'

export { TRUST_SECTION_INDEX } from './trustShieldConstants'

/** Particle budget — entire official mark from PNG; no synthetic ray layer. */
export const STARDUST_IDENTITY_BUDGET = {
  LOGO_MASK: 0.95,
  NUCLEUS: 0.05,
  NUCLEUS_MIN: 8,
} as const

/** @deprecated — all mask particles use full PNG pool; no inner/outer split. */
export const GENESIS_G_RADIUS_NORM = 1

export interface StardustLogoBudget {
  logoMask: number
  logoNucleus: number
  total: number
}

export function computeStardustLogoBudget(total: number): StardustLogoBudget {
  const logoNucleus = Math.max(
    STARDUST_IDENTITY_BUDGET.NUCLEUS_MIN,
    Math.floor(total * STARDUST_IDENTITY_BUDGET.NUCLEUS)
  )
  const logoMask = Math.max(0, total - logoNucleus)
  return { logoMask, logoNucleus, total }
}

let cachedMeta: Float32Array | null = null
let maskPoolCache: number[] | null = null

/** Every visible pixel index from logo-genesis-mark.png pool. */
function getMaskPool(): readonly number[] {
  if (maskPoolCache) return maskPoolCache
  maskPoolCache = Array.from({ length: GENESIS_LOGO_MASK_POOL_COUNT }, (_, i) => i)
  return maskPoolCache
}

function writeExact(
  out: Float32Array,
  idx: number,
  x: number,
  y: number,
  z: number
): void {
  const bi = idx * 3
  out[bi] = x
  out[bi + 1] = y
  out[bi + 2] = z
}

function writeMeta(
  meta: Float32Array,
  idx: number,
  slot: number,
  param: number,
  poolIndex: number,
  phase: number,
  speed: number
): void {
  const bi = idx * TRUST_META_STRIDE
  meta[bi] = TRUST_ROLE.CORE
  meta[bi + 1] = slot
  meta[bi + 2] = param
  meta[bi + 3] = poolIndex
  meta[bi + 4] = phase
  meta[bi + 5] = speed
}

/**
 * Dense stardust — evenly covers the full PNG mask (no cluster stacking, no extra rays).
 */
function fillLogoMask(
  out: Float32Array,
  meta: Float32Array,
  idx: number,
  n: number
): number {
  const pool = getMaskPool()
  const poolLen = pool.length
  for (let i = 0; i < n; i++) {
    const poolIndex = USE_GENESIS_LOGO_V1
      ? pool[Math.floor((i * poolLen) / n) % poolLen]!
      : pickGHeroLogoMaskPoolIndex(i, n)
    const [x, y, z] = applyGenesisLogoOrientation(...resolveGenesisLogoMaskPosition(poolIndex))
    writeExact(out, idx, x, y, z)
    writeMeta(
      meta,
      idx,
      TRUST_CORE_SLOT.LOGO_MASK,
      0,
      poolIndex,
      (i / Math.max(1, n)) * Math.PI * 2,
      0.85 + (i % 5) * 0.03
    )
    idx++
  }
  return idx
}

function fillLogoNucleus(
  out: Float32Array,
  meta: Float32Array,
  idx: number,
  n: number
): number {
  for (let i = 0; i < n; i++) {
    const u = (i + 0.5) / n
    const [x, y, z] = applyGenesisLogoOrientation(...computeGenesisNucleusPosition(u, 0, i * 0.37, 0))
    writeExact(out, idx, x, y, z)
    writeMeta(
      meta,
      idx,
      TRUST_CORE_SLOT.LOGO_NUCLEUS,
      u,
      i,
      u * Math.PI * 2 + i * 0.19,
      0.9
    )
    idx++
  }
  return idx
}

export function buildGenesisStardustLogoOnly(count: number): {
  positions: Float32Array
  meta: Float32Array
} {
  const budget = computeStardustLogoBudget(count)
  const out = new Float32Array(count * 3)
  const meta = new Float32Array(count * TRUST_META_STRIDE)
  let idx = 0

  idx = fillLogoMask(out, meta, idx, budget.logoMask)
  idx = fillLogoNucleus(out, meta, idx, budget.logoNucleus)

  return { positions: out, meta }
}

export function genGenesisStardustLogoOnly(count: number): Float32Array {
  const { positions, meta } = buildGenesisStardustLogoOnly(count)
  cachedMeta = meta
  return positions
}

/** @deprecated Phase 5 alias — section registry still references this name. */
export const genTrustQuantumShield = genGenesisStardustLogoOnly

export function getGenesisStardustLogoMeta(): Float32Array | null {
  return cachedMeta
}

/** @deprecated alias */
export const getTrustShieldMeta = getGenesisStardustLogoMeta
