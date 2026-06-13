/**
 * Phase 17.0 — Trust Genesis Core motion (WebGL).
 */
import { getGenesisLogoMaskBounds } from './GenesisLogoMaskSampler'
import { resolveGenesisLogoMaskPosition } from './GenesisLogoMaskSampler'
import {
  TRUST_DEPTH_TIER,
  TRUST_FLOW_ORBIT_S,
  TRUST_GENESIS_WAVE_S,
} from './trustGenesisCoreLayout'

function hashPool(poolIndex: number): number {
  const x = Math.sin(poolIndex * 12.9898 + 78.233) * 43758.5453
  return x - Math.floor(x)
}

export function computeTrustParticleDepthTier(poolIndex: number): 0 | 1 | 2 {
  const h = hashPool(poolIndex)
  if (h < TRUST_DEPTH_TIER.SMALL_SHARE) return TRUST_DEPTH_TIER.SMALL
  if (h < TRUST_DEPTH_TIER.SMALL_SHARE + TRUST_DEPTH_TIER.MEDIUM_SHARE) return TRUST_DEPTH_TIER.MEDIUM
  return TRUST_DEPTH_TIER.BRIGHT
}

export function trustDepthColorMultiplier(tier: 0 | 1 | 2): number {
  if (tier === TRUST_DEPTH_TIER.SMALL) return 0.78
  if (tier === TRUST_DEPTH_TIER.MEDIUM) return 1
  return 1.32
}

export function trustDepthZOffset(tier: 0 | 1 | 2): number {
  if (tier === TRUST_DEPTH_TIER.SMALL) return -0.009
  if (tier === TRUST_DEPTH_TIER.MEDIUM) return 0
  return 0.014
}

export function trustDepthPointSizeMul(tier: 0 | 1 | 2): number {
  if (tier === TRUST_DEPTH_TIER.SMALL) return 0.72
  if (tier === TRUST_DEPTH_TIER.MEDIUM) return 1
  return 1.22
}

function logoCentroid(): [number, number] {
  const bounds = getGenesisLogoMaskBounds()
  return [(bounds.minX + bounds.maxX) * 0.5, (bounds.minY + bounds.maxY) * 0.5]
}

/** Clockwise orbital drift — very subtle flow field. */
export function applyGenesisFlowField(
  x: number,
  y: number,
  t: number,
  phase: number,
  speed: number,
  motion: number
): [number, number] {
  const [cx, cy] = logoCentroid()
  const dx = x - cx
  const dy = y - cy
  const r = Math.hypot(dx, dy)
  if (r < 1e-6) return [x, y]

  const omega = ((Math.PI * 2) / TRUST_FLOW_ORBIT_S) * (0.82 + speed * 0.12)
  const angle = Math.atan2(dy, dx) - t * omega * motion * 0.55
  const breathe = 1 + Math.sin(t * 0.42 + phase) * 0.006 * motion
  return [cx + Math.cos(angle) * r * breathe, cy + Math.sin(angle) * r * breathe]
}

export function getLogoParticleRadialNorm(poolIndex: number): number {
  const [wx, wy] = resolveGenesisLogoMaskPosition(poolIndex)
  const [cx, cy] = logoCentroid()
  const bounds = getGenesisLogoMaskBounds()
  return Math.hypot(wx - cx, wy - cy) / Math.max(bounds.halfExtent, 1e-6)
}

/** Wave front 0→1 radiating from nucleus every 6s. */
export function trustGenesisWaveFront(t: number): number {
  const phase = (t % TRUST_GENESIS_WAVE_S) / TRUST_GENESIS_WAVE_S
  return Math.min(1.08, phase * 1.12)
}

export function trustGenesisWaveHighlight(radialNorm: number, t: number): number {
  const front = trustGenesisWaveFront(t)
  const band = 0.09
  const dist = Math.abs(radialNorm - front)
  if (dist > band) return 0
  return (1 - dist / band) ** 2.2
}
