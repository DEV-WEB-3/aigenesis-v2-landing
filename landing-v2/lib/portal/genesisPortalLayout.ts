import { EMISSION } from '@/lib/design/tokens'
import { pulsoDe, llegadaDe } from '@/lib/design/motion'
/** Phase 16.0 — Genesis Final Portal layout (viewBox 0–100). */

export const PORTAL_CORE_COLOR = EMISSION.magenta
export const PORTAL_CYAN = EMISSION.cyan
export const PORTAL_PURPLE = EMISSION.violetHi

export const PORTAL_CORE_PULSE_S = pulsoDe('cta')
export const PORTAL_ABSORB_S = 6
export const PORTAL_FORM_S = llegadaDe('cta')

export const PORTAL_CENTER = { x: 50, y: 50 } as const

export const PORTAL_RING = {
  outer: { radius: 46, rx: 1, ry: 0.9, duration: 48, direction: 1 },
  middle: { radius: 33, rx: 1, ry: 0.88, duration: 36, direction: -1 },
  core: { radius: 21, rx: 1, ry: 0.86, duration: 28, direction: 1 },
} as const

export const PORTAL_STREAM_COUNT = 8
export const PORTAL_STARDUST_COUNT = 7

export function portalStreamPath(index: number): string {
  const angle = (index / PORTAL_STREAM_COUNT) * Math.PI * 2 - Math.PI / 2
  const outerR = 47
  const cx = PORTAL_CENTER.x
  const cy = PORTAL_CENTER.y
  const sx = cx + Math.cos(angle) * outerR
  const sy = cy + Math.sin(angle) * outerR * 0.9
  const mx = cx + Math.cos(angle) * 26
  const my = cy + Math.sin(angle) * 22
  return `M ${sx} ${sy} Q ${mx} ${my} ${cx} ${cy}`
}

export function portalStardustStart(index: number): { x: number; y: number; delay: number } {
  const t = index / PORTAL_STARDUST_COUNT
  const angle = t * Math.PI * 2 + (index % 3) * 0.4
  const r = 42 + (index % 5) * 2.2
  return {
    x: PORTAL_CENTER.x + Math.cos(angle) * r,
    y: PORTAL_CENTER.y + Math.sin(angle) * r * 0.92,
    delay: (index % 7) * 0.38 + t * 1.6,
  }
}
