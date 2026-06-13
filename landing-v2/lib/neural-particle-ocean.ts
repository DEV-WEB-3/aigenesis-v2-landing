import { genesisColorAtX } from '@/lib/genesis-brand'
import type { HeroPerfTier } from '@/lib/hero-performance'
import {
  HERO_RGB,
  NEURAL_PRESENCE_SCALE,
  PARTICLE_PRESENCE_SCALE,
  WAVE_OPACITY_SCALE,
  type HeroColorKey,
} from '@/lib/hero-palette'

/** Paleta Hero — premium dark (no afecta logo PNG). */
export const OCEAN_RGB = HERO_RGB

export type OceanDepthLayer = 1 | 2 | 3 | 4 | 5

export interface WaveBand {
  id: number
  depth: 1 | 3 | 4
  baseY: number
  amplitude: number
  frequency: number
  speed: number
  direction: 1 | -1
  particleCount: number
  colorKey: HeroColorKey
  alpha: number
}

export interface WaveParticle {
  bandId: number
  depth: 1 | 3 | 4
  u: number
  phase: number
  size: number
  drift: number
  colorKey: HeroColorKey
  alpha: number
}

export interface NeuralNode {
  bx: number
  by: number
  phase: number
  phase2: number
  glow: number
  colorKey: HeroColorKey
}

export interface OceanMeshPoint {
  col: number
  row: number
  phase: number
}

export interface LogoEnergyParticle {
  angle: number
  radius: number
  speed: number
  direction: 1 | -1
  phase: number
  size: number
  colorKey: HeroColorKey
  opacity: number
  repelX: number
  repelY: number
}

export interface OceanWaveLayer {
  baseY: number
  amp: number
  freq: number
  speed: number
  dir: 1 | -1
  colorKey: HeroColorKey
  alpha: number
  depth: 1 | 3 | 4
}

/** Capas: lejanas 20% · medias 50% · cercanas 80% */
export const OCEAN_LAYER_OPACITY: Record<1 | 3 | 4, number> = {
  1: 0.2,
  3: 0.5,
  4: 0.8,
}

/** Capas de ola — textura de fondo, apenas perceptibles */
export const OCEAN_WAVE_FILLS: OceanWaveLayer[] = [
  { baseY: 0.1, amp: 0.12, freq: 2.1, speed: 0.00007, dir: 1, colorKey: 'fuchsia', alpha: 0.038, depth: 1 },
  { baseY: 0.38, amp: 0.11, freq: 2.2, speed: 0.000062, dir: -1, colorKey: 'core', alpha: 0.028, depth: 3 },
  { baseY: 0.64, amp: 0.1, freq: 1.9, speed: 0.000074, dir: 1, colorKey: 'ion', alpha: 0.032, depth: 3 },
  { baseY: 0.86, amp: 0.09, freq: 2.0, speed: 0.000066, dir: -1, colorKey: 'ion', alpha: 0.034, depth: 4 },
]

export interface AmbientParticle {
  x: number
  y: number
  drift: number
  rise: number
  size: number
  baseOpacity: number
  colorKey: HeroColorKey
  phase: number
}

const TIER_OCEAN = {
  high: { nodes: 360, logoEnergy: 92, bands: 9, meshCols: 40, meshRows: 24, ambient: 5400 },
  medium: { nodes: 205, logoEnergy: 52, bands: 6, meshCols: 28, meshRows: 17, ambient: 2500 },
  low: { nodes: 78, logoEnergy: 24, bands: 4, meshCols: 18, meshRows: 12, ambient: 820 },
} as const

const PARALLAX_BY_DEPTH: Record<OceanDepthLayer, number> = {
  1: 0.029,
  2: 0.051,
  3: 0.067,
  4: 0.08,
  5: 0.08,
}

const MOTION_SCALE = 1.5

export function layerOpacity(depth: 1 | 3 | 4): number {
  return OCEAN_LAYER_OPACITY[depth]
}

export function meshRowDepth(v: number): 1 | 3 | 4 {
  if (v < 0.34) return 1
  if (v < 0.68) return 3
  return 4
}

export function oceanParallax(depth: OceanDepthLayer, px: { x: number; y: number }, w: number, h: number) {
  const s = PARALLAX_BY_DEPTH[depth]
  return { x: px.x * w * s, y: px.y * h * s }
}

/** Horizontal color: fuchsia ← core → ion/cyan */
export function colorAtX(nx: number): HeroColorKey {
  return genesisColorAtX(nx)
}

export function waveOpacityScale(tier: HeroPerfTier): number {
  return WAVE_OPACITY_SCALE[tier]
}

export function particleOpacityScale(tier: HeroPerfTier): number {
  return PARTICLE_PRESENCE_SCALE[tier]
}

export function neuralOpacityScale(tier: HeroPerfTier): number {
  return NEURAL_PRESENCE_SCALE[tier]
}

export function rgba(key: HeroColorKey, alpha: number): string {
  const c = key === 'ion' ? OCEAN_RGB.cyan : OCEAN_RGB[key]
  return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${alpha})`
}

export function buildWaveBands(tier: HeroPerfTier): WaveBand[] {
  const bandCount = TIER_OCEAN[tier].bands
  const bands: WaveBand[] = []
  const colorCycle: HeroColorKey[] = ['fuchsia', 'core', 'ion', 'ion', 'fuchsia', 'ion']

  for (let i = 0; i < bandCount; i++) {
    const depth: 1 | 3 | 4 = i % 5 === 0 ? 1 : i % 3 === 0 ? 4 : 3
    const particles =
      tier === 'high'
        ? 12 + (i % 3) * 4
        : tier === 'medium'
          ? 8 + (i % 2) * 3
          : 5 + (i % 2) * 2

    bands.push({
      id: i,
      depth,
      baseY: 0.1 + (i / bandCount) * 0.8,
      amplitude: 0.04 + (i % 3) * 0.016,
      frequency: 1.4 + (i % 5) * 0.35,
      speed: (0.000035 + (i % 4) * 0.000012) * MOTION_SCALE,
      direction: i % 2 === 0 ? 1 : -1,
      particleCount: particles,
      colorKey: colorCycle[i % colorCycle.length],
      alpha: OCEAN_LAYER_OPACITY[depth] * 0.14,
    })
  }
  return bands
}

export function createWaveParticles(tier: HeroPerfTier): { particles: WaveParticle[]; bands: WaveBand[] } {
  const bands = buildWaveBands(tier)
  const particles: WaveParticle[] = []

  for (const band of bands) {
    for (let i = 0; i < band.particleCount; i++) {
      particles.push({
        bandId: band.id,
        depth: band.depth,
        u: i / band.particleCount,
        phase: (i / band.particleCount) * Math.PI * 2,
        size: band.depth === 1 ? 0.4 + (i % 2) * 0.2 : band.depth === 4 ? 0.9 + (i % 3) * 0.35 : 0.55 + (i % 2) * 0.25,
        drift: (Math.random() - 0.5) * 0.015,
        colorKey: band.colorKey,
        alpha: band.alpha,
      })
    }
  }
  return { particles, bands }
}

export function createNeuralNodes(tier: HeroPerfTier): NeuralNode[] {
  const count = TIER_OCEAN[tier].nodes
  const cols = Math.ceil(Math.sqrt(count * (16 / 9)))
  const rows = Math.ceil(count / cols)
  const nodes: NeuralNode[] = []

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (nodes.length >= count) break
      const roll = Math.random()
      let bx: number
      let by: number
      if (roll < 0.3) {
        bx = Math.random() * 0.36
        by = (r + 0.5) / rows + (Math.random() - 0.5) * 0.1
      } else if (roll < 0.7) {
        const angle = Math.random() * Math.PI * 2
        const dist = 0.16 + Math.random() * 0.24
        bx = 0.5 + Math.cos(angle) * dist * 1.02
        by = 0.4 + Math.sin(angle) * dist * 0.88
        bx = Math.max(0.04, Math.min(0.96, bx))
        by = Math.max(0.06, Math.min(0.94, by))
      } else {
        bx = 0.6 + Math.random() * 0.36
        by = (r + 0.5) / rows + (Math.random() - 0.5) * 0.1
      }
      nodes.push({
        bx,
        by,
        phase: Math.random() * Math.PI * 2,
        phase2: Math.random() * Math.PI * 2,
        glow: 0.6 + Math.random() * 0.4,
        colorKey: colorAtX(bx),
      })
    }
  }
  return nodes
}

export function createOceanMesh(tier: HeroPerfTier): { points: OceanMeshPoint[]; cols: number; rows: number } {
  const cols = TIER_OCEAN[tier].meshCols
  const rows = TIER_OCEAN[tier].meshRows
  const points: OceanMeshPoint[] = []

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      points.push({ col, row, phase: Math.random() * Math.PI * 2 })
    }
  }
  return { points, cols, rows }
}

/** Proyección pseudo-3D del mesh ondulante */
export function meshScreenPos(
  col: number,
  row: number,
  cols: number,
  rows: number,
  w: number,
  h: number,
  t: number,
  px: { x: number; y: number }
) {
  const u = col / (cols - 1)
  const v = row / (rows - 1)
  const depth = 0.25 + v * 0.75
  const layer: OceanDepthLayer = depth < 0.5 ? 1 : depth < 0.8 ? 3 : 4
  const pp = oceanParallax(layer, px, w, h)

  const depthBoost = 1 + depth * 0.6
  const wave =
    Math.sin(u * Math.PI * 3.2 + t * 0.00063 + v * 1.8) * h * 0.052 * depthBoost +
    Math.sin(u * Math.PI * 1.6 - t * 0.00042 + v * 2.4) * h * 0.034 * depthBoost +
    Math.cos(v * Math.PI * 2.8 + t * 0.000525) * h * 0.022 * depthBoost

  const x = u * w + pp.x + px.x * w * 0.019 * depth
  const y = h * (0.22 + v * 0.6) + wave + pp.y
  const colorKey = colorAtX(u)
  const rowDepth = meshRowDepth(v)
  const alpha = layerOpacity(rowDepth) * (0.65 + v * 0.4)
  const size = (0.7 + v * 1.65) * (w / 1200)

  return { x, y, u, v, depth, colorKey, alpha, size }
}

export function createAmbientParticles(tier: HeroPerfTier): AmbientParticle[] {
  const count = TIER_OCEAN[tier].ambient
  return Array.from({ length: count }, () => {
    const x = Math.random()
    const colorKey: HeroColorKey =
      x < 0.36 ? 'fuchsia' : x > 0.6 ? 'ion' : Math.random() > 0.45 ? 'core' : 'fuchsia'
    return {
      x,
      y: Math.random(),
      drift: (Math.random() - 0.5) * 0.0001,
      rise: (Math.random() - 0.5) * 0.00005,
      size: 0.3 + Math.random() * 2.1,
      baseOpacity: 0.14 + Math.random() * 0.58,
      colorKey,
      phase: Math.random() * Math.PI * 2,
    }
  })
}

export function createLogoEnergyParticles(tier: HeroPerfTier): LogoEnergyParticle[] {
  const count = TIER_OCEAN[tier].logoEnergy
  return Array.from({ length: count }, (_, i) => ({
    angle: (i / count) * Math.PI * 2,
    radius: 88 + (i % 4) * 8,
    speed: 0.00038 + (i % 5) * 0.00006,
    direction: i % 2 === 0 ? 1 : -1,
    phase: Math.random() * Math.PI * 2,
    size: 0.9 + (i % 2) * 0.35,
    colorKey: (['fuchsia', 'ion', 'ion'] as const)[i % 3],
    opacity: 0.36 + (i % 4) * 0.1,
    repelX: 0,
    repelY: 0,
  }))
}

export { TIER_OCEAN }
