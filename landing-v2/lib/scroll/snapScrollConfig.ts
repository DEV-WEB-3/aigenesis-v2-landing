/** Phase 18.1 — Smooth snap scroll tuning */

export const SNAP_SCROLL = {
  /** Wheel / trackpad delta to trigger one section (~40% lower vs ~90 baseline) */
  SCROLL_THRESHOLD: 55,
  /** Post-navigation wheel lock */
  WHEEL_LOCK_MS: 750,
  /** Premium slide duration */
  SCROLL_DURATION_MS: 950,
  /** Trackpad delta accumulation window */
  TRACKPAD_ACCUM_WINDOW_MS: 140,
  /** Max sections per gesture */
  MAX_STEP: 1,
} as const

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export function easeOutExpo(t: number): number {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)
}
