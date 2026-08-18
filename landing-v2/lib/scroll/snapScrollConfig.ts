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
  /**
   * Lo que tapa la barra fija, en pixeles.
   *
   * Tiene que coincidir con `--enganche-alto` de `globals.css`. Se repite aqui
   * porque JavaScript no lee variables CSS sin un `getComputedStyle` por evento
   * de rueda, y eso es un reflujo forzado en el peor sitio posible. Si se mueve
   * una, hay que mover la otra — por eso el nombre es el mismo.
   */
  ENGANCHE_ALTO: 76,
} as const

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export function easeOutExpo(t: number): number {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)
}
