/**
 * Phase 7.5 — Mining Genesis Stardust background (diffuse field, no shapes).
 */
import { GENESIS_RGB_NORM } from '@/lib/genesis-brand'

type Rgb = readonly [number, number, number]

export const MINING_STARDUST_INTENSITY = 0.26
export const MINING_STARDUST_META_STRIDE = 6
export const MINING_STARDUST_SPECTRAL_CYCLE = 5.8
export const MINING_STARDUST_SWAY_AMP = 0.028
export const MINING_STARDUST_SWAY_S = 11

const PALETTE: readonly Rgb[] = [
  GENESIS_RGB_NORM.fuchsia,
  GENESIS_RGB_NORM.fuchsiaSoft,
  GENESIS_RGB_NORM.core,
  GENESIS_RGB_NORM.ion,
  GENESIS_RGB_NORM.cyan,
]

const MINING_STARDUST_X_OFFSET = 0

let cachedMeta: Float32Array | null = null

function writeMeta(meta: Float32Array, idx: number, spectralU: number, slot: number, phase: number): void {
  const bi = idx * MINING_STARDUST_META_STRIDE
  meta[bi] = 0
  meta[bi + 1] = 0
  meta[bi + 2] = spectralU
  meta[bi + 3] = slot
  meta[bi + 4] = phase
  meta[bi + 5] = 0.25 + Math.random() * 0.55
}

export function buildMiningStardustField(count: number): {
  positions: Float32Array
  meta: Float32Array
} {
  const out = new Float32Array(count * 3)
  const meta = new Float32Array(count * MINING_STARDUST_META_STRIDE)

  for (let i = 0; i < count; i++) {
    const bi = i * 3
    const theta = Math.random() * Math.PI * 2
    const r = 0.22 + Math.random() ** 0.85 * 1.05
    out[bi] = Math.cos(theta) * r * 1.15 + MINING_STARDUST_X_OFFSET
    out[bi + 1] = Math.sin(theta) * r * 0.92
    out[bi + 2] = (Math.random() - 0.5) * 0.32
    writeMeta(meta, i, Math.random(), Math.floor(Math.random() * PALETTE.length), Math.random() * Math.PI * 2)
  }

  return { positions: out, meta }
}

export function genMiningStardustField(count: number): Float32Array {
  const { positions, meta } = buildMiningStardustField(count)
  cachedMeta = meta
  return positions
}

export function getMiningStardustMeta(): Float32Array | null {
  return cachedMeta
}

function lerpRgb(a: Rgb, b: Rgb, t: number): Rgb {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
}

export function miningStardustSpectralColor(
  t: number,
  phase: number,
  spectralU: number,
  slot: number,
  speed: number
): [number, number, number] {
  const travel = (t * speed) / MINING_STARDUST_SPECTRAL_CYCLE + phase * 0.12 + spectralU * 0.35
  const wave = (Math.sin(travel * Math.PI * 2) + 1) * 0.5
  const base = PALETTE[slot % PALETTE.length] ?? GENESIS_RGB_NORM.core
  const next = PALETTE[(slot + 1) % PALETTE.length] ?? GENESIS_RGB_NORM.ion
  const [r, g, b] = lerpRgb(base, next, wave)
  const pulse = 0.88 + Math.sin(t * 0.45 + phase) * 0.12
  const dim = MINING_STARDUST_INTENSITY * pulse
  return [Math.min(0.92, r * dim), Math.min(0.92, g * dim), Math.min(0.92, b * dim)]
}

export function buildMiningStardustColors(count: number, meta: Float32Array): Float32Array {
  const colors = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const mi = i * MINING_STARDUST_META_STRIDE
    const [r, g, b] = miningStardustSpectralColor(
      0,
      meta[mi + 4]!,
      meta[mi + 2]!,
      meta[mi + 3]!,
      meta[mi + 5]!
    )
    colors[i * 3] = r
    colors[i * 3 + 1] = g
    colors[i * 3 + 2] = b
  }
  return colors
}

export interface MiningStardustFrame {
  px: number
  py: number
  pz: number
  cr: number
  cg: number
  cb: number
}

export function computeMiningStardustFrame(
  morphX: number,
  morphY: number,
  morphZ: number,
  meta: Float32Array,
  particleIndex: number,
  t: number,
  motion: number,
  organicOx: number,
  organicOy: number,
  organicOz: number,
  baseR: number,
  baseG: number,
  baseB: number
): MiningStardustFrame {
  const mi = particleIndex * MINING_STARDUST_META_STRIDE
  const phase = meta[mi + 4]!
  const spectralU = meta[mi + 2]!
  const slot = meta[mi + 3]!
  const speed = meta[mi + 5]!

  const swayX = Math.sin((t / MINING_STARDUST_SWAY_S) * Math.PI * 2 + phase) * MINING_STARDUST_SWAY_AMP * motion

  const px = morphX + swayX
  const py = morphY
  const pz = morphZ

  const [cr, cg, cb] = miningStardustSpectralColor(t, phase, spectralU, slot, speed)
  const mix = 0.72

  return {
    px,
    py,
    pz,
    cr: baseR * (1 - mix) + cr * mix,
    cg: baseG * (1 - mix) + cg * mix,
    cb: baseB * (1 - mix) + cb * mix,
  }
}

export function scatterMiningStardust(count: number): Float32Array {
  const out = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const bi = i * 3
    out[bi] = (Math.random() - 0.2) * 2.2
    out[bi + 1] = (Math.random() - 0.5) * 1.8
    out[bi + 2] = (Math.random() - 0.5) * 0.4
  }
  return out
}
