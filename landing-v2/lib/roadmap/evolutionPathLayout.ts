import { EMISSION } from '@/lib/design/tokens'
import { pulsoDe, llegadaDe } from '@/lib/design/motion'
/**
 * Phase 15.0 — Genesis Evolution Path (viewBox 0–100).
 * Ascending curve · 2019 → 2027 · not a vertical timeline.
 */

export const ROADMAP_EVOLUTION_PULSE_S = pulsoDe('roadmap')
export const ROADMAP_EVOLUTION_FORM_S = llegadaDe('roadmap')
export const ROADMAP_MILESTONE_COUNT = 5

export interface RoadmapMilestoneDef {
  year: string
  index: number
  x: number
  y: number
  isFuture?: boolean
  nodeScale: number
}

export const ROADMAP_EVOLUTION_MILESTONES: readonly RoadmapMilestoneDef[] = [
  { year: '2019', index: 0, x: 14, y: 76, nodeScale: 1 },
  { year: '2023', index: 1, x: 30, y: 60, nodeScale: 1.08 },
  { year: '2025', index: 2, x: 48, y: 44, nodeScale: 1.12 },
  { year: '2026', index: 3, x: 66, y: 28, nodeScale: 1.18 },
  { year: '2027', index: 4, x: 86, y: 12, isFuture: true, nodeScale: 1.42 },
] as const

export function roadmapMilestonePosition(index: number): { x: number; y: number } {
  const m = ROADMAP_EVOLUTION_MILESTONES[index % ROADMAP_MILESTONE_COUNT]
  if (!m) return { x: 50, y: 50 }
  return { x: m.x, y: m.y }
}

/** Smooth ascending path — quadratic segments, never vertical. */
export function evolutionPathPoint(t: number): { x: number; y: number } {
  const clamped = Math.max(0, Math.min(1, t))
  const segCount = ROADMAP_MILESTONE_COUNT - 1
  const segT = clamped * segCount
  const seg = Math.min(Math.floor(segT), segCount - 1)
  const f = segT - seg
  const a = ROADMAP_EVOLUTION_MILESTONES[seg]!
  const b = ROADMAP_EVOLUTION_MILESTONES[seg + 1]!
  const cpx = (a.x + b.x) / 2 + (b.y - a.y) * 0.06
  const cpy = (a.y + b.y) / 2 - (b.x - a.x) * 0.05 - 3.5
  const x = (1 - f) ** 2 * a.x + 2 * (1 - f) * f * cpx + f ** 2 * b.x
  const y = (1 - f) ** 2 * a.y + 2 * (1 - f) * f * cpy + f ** 2 * b.y
  return { x, y }
}

export function evolutionCurvePath(): string {
  let d = ''
  for (let i = 0; i < ROADMAP_MILESTONE_COUNT - 1; i++) {
    const a = ROADMAP_EVOLUTION_MILESTONES[i]!
    const b = ROADMAP_EVOLUTION_MILESTONES[i + 1]!
    const cpx = (a.x + b.x) / 2 + (b.y - a.y) * 0.06
    const cpy = (a.y + b.y) / 2 - (b.x - a.x) * 0.05 - 3.5
    d += i === 0 ? `M${a.x},${a.y} ` : ''
    d += `Q${cpx},${cpy} ${b.x},${b.y} `
  }
  return d.trim()
}

export function evolutionPathColor(t: number): string {
  if (t < 0.35) return EMISSION.violetHi
  if (t < 0.72) return EMISSION.magenta
  return EMISSION.cyan
}

export function milestoneColor(index: number): string {
  const t = index / (ROADMAP_MILESTONE_COUNT - 1)
  return evolutionPathColor(t)
}
