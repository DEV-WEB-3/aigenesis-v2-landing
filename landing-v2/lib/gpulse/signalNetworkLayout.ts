import { EMISSION } from '@/lib/design/tokens'
import { pulsoDe, llegadaDe } from '@/lib/design/motion'
/**
 * Phase 10.0 — G-Pulse Live Signal Network layout (viewBox 0–100).
 */

export const GPULSE_SIGNAL_PULSE_S = pulsoDe('gpulse')
export const GPULSE_SIGNAL_FORM_S = llegadaDe('gpulse')
export const GPULSE_NODE_COUNT = 16
export const GPULSE_SIGNAL_CENTER = { x: 50, y: 50 } as const

export type GpulseRingId = 'capture' | 'analysis' | 'signal'

export interface GpulseRingDef {
  id: GpulseRingId
  r: number
  ry: number
  color: string
  glow: string
  pulseOffset: number
}

export const GPULSE_SIGNAL_RINGS: readonly GpulseRingDef[] = [
  { id: 'capture', r: 11, ry: 4.2, color: EMISSION.cyan, glow: 'rgba(0, 245, 255, 0.45)', pulseOffset: 0.08 },
  { id: 'analysis', r: 16, ry: 5.8, color: EMISSION.violetHi, glow: 'rgba(157, 77, 255, 0.48)', pulseOffset: 0.22 },
  { id: 'signal', r: 22, ry: 7.2, color: EMISSION.magenta, glow: 'rgba(255, 0, 200, 0.42)', pulseOffset: 0.38 },
] as const

export function gpulseNodeAngleDeg(index: number, total = GPULSE_NODE_COUNT): number {
  return -90 + (360 / total) * index
}

export function gpulseNodePosition(index: number, total = GPULSE_NODE_COUNT): { x: number; y: number } {
  const rad = (gpulseNodeAngleDeg(index, total) * Math.PI) / 180
  const r = 36 + (index % 4) * 1.4
  return {
    x: GPULSE_SIGNAL_CENTER.x + r * Math.cos(rad),
    y: GPULSE_SIGNAL_CENTER.y + r * Math.sin(rad) * 0.86,
  }
}

export function gpulseStreamPath(nodeIndex: number, total = GPULSE_NODE_COUNT): string {
  const { x: nx, y: ny } = gpulseNodePosition(nodeIndex, total)
  const cx = GPULSE_SIGNAL_CENTER.x
  const cy = GPULSE_SIGNAL_CENTER.y
  const mx = (cx + nx) / 2 + Math.cos((gpulseNodeAngleDeg(nodeIndex) * Math.PI) / 180) * 4
  const my = (cy + ny) / 2 + Math.sin((gpulseNodeAngleDeg(nodeIndex) * Math.PI) / 180) * 3
  return `M${nx},${ny} Q${mx},${my} ${cx},${cy}`
}

export function gpulseOutflowPath(index: number): string {
  const cx = GPULSE_SIGNAL_CENTER.x
  const cy = GPULSE_SIGNAL_CENTER.y
  const angle = ((index * 47) % 360) * (Math.PI / 180)
  const ex = cx + Math.cos(angle) * 28
  const ey = cy + Math.sin(angle) * 24
  return `M${cx},${cy} Q${(cx + ex) / 2},${(cy + ey) / 2 - 3} ${ex},${ey}`
}
