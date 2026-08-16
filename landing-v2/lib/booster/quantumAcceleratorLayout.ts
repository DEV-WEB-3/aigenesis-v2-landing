import { EMISSION } from '@/lib/design/tokens'
/**
 * Phase 8.0 — Booster Quantum Accelerator layout (viewBox 0–100).
 */

export const BOOSTER_ACCELERATOR_PULSE_S = 4
export const BOOSTER_STREAM_COUNT = 5
export const BOOSTER_COLUMN_X = 50

export type BoosterTierId = 'activation' | 'multiplier' | 'progression'

export interface BoosterTierDef {
  id: BoosterTierId
  y: number
  color: string
  glow: string
  pulseOffset: number
  ringR: number
  ringCount: 1 | 2
}

export const BOOSTER_TIERS: readonly BoosterTierDef[] = [
  {
    id: 'activation',
    y: 78,
    color: EMISSION.magenta,
    glow: 'rgba(255, 0, 200, 0.52)',
    pulseOffset: 0.08,
    ringR: 13.5,
    ringCount: 1,
  },
  {
    id: 'multiplier',
    y: 48,
    color: EMISSION.violetHi,
    glow: 'rgba(157, 77, 255, 0.5)',
    pulseOffset: 0.32,
    ringR: 15,
    ringCount: 2,
  },
  {
    id: 'progression',
    y: 18,
    color: EMISSION.cyan,
    glow: 'rgba(0, 245, 255, 0.48)',
    pulseOffset: 0.58,
    ringR: 17,
    ringCount: 1,
  },
] as const

/** Organic energy stream — double-helix strand bottom → top. */
export function boosterHelixStreamPath(strandIndex: number, total = BOOSTER_STREAM_COUNT): string {
  const cx = BOOSTER_COLUMN_X
  const y0 = 88
  const y1 = 10
  const amp = 9.5 + (strandIndex % 3) * 1.8
  const phase = (strandIndex / total) * Math.PI * 2
  const segments = 6
  const parts: string[] = []

  for (let s = 0; s <= segments; s++) {
    const t = s / segments
    const y = y0 + (y1 - y0) * t
    const x = cx + Math.sin(t * Math.PI * 3.2 + phase) * amp * (0.55 + t * 0.45)
    parts.push(s === 0 ? `M${x},${y}` : `L${x},${y}`)
  }

  return parts.join(' ')
}

/** Genesis pulse wave path — activation → progression. */
export function boosterPulseColumnPath(): string {
  const cx = BOOSTER_COLUMN_X
  return `M${cx},${BOOSTER_TIERS[0]!.y} Q${cx + 2},${BOOSTER_TIERS[1]!.y} ${cx},${BOOSTER_TIERS[2]!.y}`
}
