/**
 * Phase 3.9 — Exact Genesis logo particle sampling from PNG alpha mask.
 * Source of truth: public/brand/logo-genesis-mark.png
 */
import { snapPastelCyanToNeon } from './trustShieldColorAmplification'
import {
  GENESIS_LOGO_MASK_BOUNDS,
  GENESIS_LOGO_MASK_IMAGE_SIZE,
  GENESIS_LOGO_MASK_POOL_B64,
  GENESIS_LOGO_MASK_POOL_COUNT,
  GENESIS_LOGO_MASK_SOURCE,
  GENESIS_LOGO_MASK_STATS,
} from './genesisLogoMaskPool.generated'
import {
  TRUST_CORE_RADIUS_MULT,
  TRUST_DEPTH_Z_SCALE,
  TRUST_SHIELD_VISUAL_SCALE,
} from './trustShieldConstants'

/** World-space radius — logo centered at shield origin (0,0). */
export const GENESIS_LOGO_WORLD_RADIUS = 0.46 * TRUST_CORE_RADIUS_MULT

/** Fixed Z plane for logo body — no per-particle wobble. */
const LOGO_MASK_Z =
  0.032 * TRUST_SHIELD_VISUAL_SCALE * TRUST_DEPTH_Z_SCALE

export interface GenesisLogoMaskPoint {
  x: number
  y: number
  z: number
  r: number
  g: number
  b: number
  poolIndex: number
}

export interface GenesisLogoMaskBounds {
  minX: number
  maxX: number
  minY: number
  maxY: number
  halfExtent: number
  worldRadius: number
}

export interface GenesisLogoMaskStats {
  visiblePixels: number
  poolCount: number
  source: string
  imageSize: { width: number; height: number }
  contentBounds: GenesisLogoMaskBounds
  aspectRatio: number
  alphaThreshold: number
}

let poolCache: Float32Array | null = null

function decodePool(): Float32Array {
  if (poolCache) return poolCache

  if (typeof Buffer !== 'undefined') {
    const buf = Buffer.from(GENESIS_LOGO_MASK_POOL_B64, 'base64')
    poolCache = new Float32Array(buf.buffer, buf.byteOffset, buf.byteLength / 4)
    return poolCache
  }

  const binary = atob(GENESIS_LOGO_MASK_POOL_B64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  poolCache = new Float32Array(bytes.buffer)
  return poolCache
}

function worldScale(): number {
  return GENESIS_LOGO_WORLD_RADIUS * TRUST_SHIELD_VISUAL_SCALE
}

function poolToWorld(nx: number, ny: number): [number, number, number] {
  const s = worldScale()
  return [nx * s, ny * s, LOGO_MASK_Z]
}

/**
 * Deterministic structured index — radial-band pool, contiguous angular slices.
 * Preserves arcs, rays, dotted blocks, G bar ordering from PNG.
 */
export function structuredPoolIndex(particleIndex: number, count: number): number {
  const poolCount = GENESIS_LOGO_MASK_POOL_COUNT
  if (count <= 0) return 0
  if (count >= poolCount) return particleIndex % poolCount
  return Math.min(poolCount - 1, Math.floor((particleIndex * poolCount) / count))
}

export function getGenesisLogoMaskBounds(): GenesisLogoMaskBounds {
  const s = worldScale()
  return {
    minX: GENESIS_LOGO_MASK_BOUNDS.minX * s,
    maxX: GENESIS_LOGO_MASK_BOUNDS.maxX * s,
    minY: GENESIS_LOGO_MASK_BOUNDS.minY * s,
    maxY: GENESIS_LOGO_MASK_BOUNDS.maxY * s,
    halfExtent: GENESIS_LOGO_MASK_BOUNDS.halfExtent * s,
    worldRadius: s,
  }
}

export function getGenesisLogoMaskStats(): GenesisLogoMaskStats {
  return {
    visiblePixels: GENESIS_LOGO_MASK_STATS.visiblePixels,
    poolCount: GENESIS_LOGO_MASK_POOL_COUNT,
    source: GENESIS_LOGO_MASK_SOURCE,
    imageSize: { ...GENESIS_LOGO_MASK_IMAGE_SIZE },
    contentBounds: getGenesisLogoMaskBounds(),
    aspectRatio: GENESIS_LOGO_MASK_STATS.aspectRatio,
    alphaThreshold: GENESIS_LOGO_MASK_STATS.alphaThreshold,
  }
}

export function sampleGenesisLogoParticle(index: number, count: number): GenesisLogoMaskPoint {
  const pool = decodePool()
  const pi = structuredPoolIndex(index, count)
  const bi = pi * 5
  const nx = pool[bi]!
  const ny = pool[bi + 1]!
  const r = pool[bi + 2]!
  const g = pool[bi + 3]!
  const b = pool[bi + 4]!
  const [x, y, z] = poolToWorld(nx, ny)
  return { x, y, z, r, g, b, poolIndex: pi }
}

export function buildGenesisLogoMaskPoints(count: number): Float32Array {
  const out = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const p = sampleGenesisLogoParticle(i, count)
    const bi = i * 3
    out[bi] = p.x
    out[bi + 1] = p.y
    out[bi + 2] = p.z
  }
  return out
}

/** PNG tornasol — snap pastel aqua/cyan to electric #00F5FF */
export function getGenesisLogoPoolColor(poolIndex: number): [number, number, number] {
  const pool = decodePool()
  const bi = poolIndex * 5
  const r = pool[bi + 2]!
  const g = pool[bi + 3]!
  const b = pool[bi + 4]!
  const gain = 1.12
  return snapPastelCyanToNeon(
    Math.min(1, r * gain),
    Math.min(1, g * gain),
    Math.min(1, b * gain)
  )
}

/** @deprecated Phase 3.9 — colors are PNG-faithful; no remap. */
export function remapGenesisLogoPngColor(r: number, g: number, b: number): [number, number, number] {
  const gain = 1.12
  return [Math.min(1, r * gain), Math.min(1, g * gain), Math.min(1, b * gain)]
}

/** Exact world position for a PNG pool index (formation lock target). */
export function resolveGenesisLogoMaskPosition(poolIndex: number): [number, number, number] {
  const pool = decodePool()
  const pi = Math.min(GENESIS_LOGO_MASK_POOL_COUNT - 1, Math.max(0, poolIndex))
  const bi = pi * 5
  return poolToWorld(pool[bi]!, pool[bi + 1]!)
}

/** Logo silhouette radius — halo/fog must stay outside this. */
export function getGenesisLogoSilhouetteRadius(): number {
  return getGenesisLogoMaskBounds().halfExtent * 1.02
}
