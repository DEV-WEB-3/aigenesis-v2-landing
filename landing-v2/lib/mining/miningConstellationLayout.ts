/**
 * Phase 7.5 — Mining Constellation V2 layout (viewBox 0–100).
 */

export const MINING_CONSTELLATION_PULSE_S = 4
export const MINING_CONSTELLATION_NODE_COUNT = 8

export type MiningConstellationNodeId =
  | 'media'
  | 'entrepreneurs'
  | 'investors'
  | 'education'
  | 'government'
  | 'mentors'
  | 'tech'
  | 'culture'

export interface MiningConstellationNodeDef {
  id: MiningConstellationNodeId
  color: string
  glow: string
  mobilePrimary?: boolean
  /** Pulse arrival offset within 4s cycle (0–1) */
  pulseOffset: number
}

export const MINING_CONSTELLATION_CENTER = { x: 50, y: 50 } as const
export const MINING_CONSTELLATION_RING_R = 38

export const MINING_CONSTELLATION_NODES: readonly MiningConstellationNodeDef[] = [
  { id: 'media', color: '#FF2EDB', glow: 'rgba(255, 46, 219, 0.5)', pulseOffset: 0.22 },
  { id: 'entrepreneurs', color: '#9D4DFF', glow: 'rgba(157, 77, 255, 0.5)', mobilePrimary: true, pulseOffset: 0.24 },
  { id: 'investors', color: '#2962FF', glow: 'rgba(41, 98, 255, 0.48)', mobilePrimary: true, pulseOffset: 0.26 },
  { id: 'education', color: '#00F5FF', glow: 'rgba(0, 245, 255, 0.45)', mobilePrimary: true, pulseOffset: 0.28 },
  { id: 'government', color: '#5CE1A0', glow: 'rgba(92, 225, 160, 0.4)', pulseOffset: 0.3 },
  { id: 'mentors', color: '#FFB347', glow: 'rgba(255, 179, 71, 0.4)', pulseOffset: 0.32 },
  { id: 'tech', color: '#7B9CFF', glow: 'rgba(123, 156, 255, 0.45)', pulseOffset: 0.34 },
  { id: 'culture', color: '#E8C547', glow: 'rgba(232, 197, 71, 0.4)', mobilePrimary: true, pulseOffset: 0.36 },
] as const

export function constellationNodeAngleDeg(index: number, total = 8): number {
  return -90 + (360 / total) * index
}

export function constellationNodePosition(index: number, total = 8): { x: number; y: number } {
  const rad = (constellationNodeAngleDeg(index, total) * Math.PI) / 180
  return {
    x: MINING_CONSTELLATION_CENTER.x + MINING_CONSTELLATION_RING_R * Math.cos(rad),
    y: MINING_CONSTELLATION_CENTER.y + MINING_CONSTELLATION_RING_R * Math.sin(rad),
  }
}

/** Organic energy stream — core → node. */
export function constellationStreamPath(index: number, total = 8): string {
  const { x: nx, y: ny } = constellationNodePosition(index, total)
  const cx = MINING_CONSTELLATION_CENTER.x
  const cy = MINING_CONSTELLATION_CENTER.y
  const mx = (cx + nx) / 2
  const my = (cy + ny) / 2
  const rad = (constellationNodeAngleDeg(index, total) * Math.PI) / 180
  const bulge = 5.5 + (index % 3) * 1.8
  const qx = mx + Math.cos(rad + Math.PI / 2) * bulge
  const qy = my + Math.sin(rad + Math.PI / 2) * bulge
  return `M${cx},${cy} Q${qx},${qy} ${nx},${ny}`
}

export function constellationMobileIndices(): number[] {
  return MINING_CONSTELLATION_NODES.map((n, i) => (n.mobilePrimary ? i : -1)).filter((i) => i >= 0)
}
