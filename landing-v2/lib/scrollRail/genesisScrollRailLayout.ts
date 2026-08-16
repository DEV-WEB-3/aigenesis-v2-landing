import { EMISSION } from '@/lib/design/tokens'
/** Phase 18.0 — Genesis Scroll Rail */

export const SCROLL_RAIL_WAVE_MS = 700
export const SCROLL_RAIL_PARALLAX_MAX_PX = 3

export const SCROLL_RAIL_NODE = {
  INACTIVE_SIZE_PX: 6,
  INACTIVE_OPACITY: 0.35,
  INACTIVE_COLOR: 'rgba(255, 255, 255, 0.25)',
  NEARBY_SIZE_PX: 8,
  NEARBY_OPACITY: 0.7,
  ACTIVE_SIZE_PX: 12,
  ACTIVE_COLOR: EMISSION.magenta,
  ACTIVE_GLOW: '0 0 16px rgba(255, 0, 200, 0.8)',
  ACTIVE_SCALE: 1.25,
  HOVER_SCALE: 1.45,
  HOVER_GLOW: '0 0 18px rgba(255, 0, 200, 0.75)',
  TOOLTIP_DURATION_MS: 180,
} as const
