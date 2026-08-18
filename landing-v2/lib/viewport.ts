/**
 * Umbrales de viewport — definición ÚNICA para todo el proyecto.
 *
 * Antes existían tres copias del mismo par de números: `SCROLL_BREAKPOINTS`
 * (767 / 1023 / 1024) y luego `768` y `1024` escritos a mano en
 * `webgl/morphPerformance.ts` y `trust/trust-performance.ts`. Tres sitios que
 * tenían que moverse juntos y nada que lo garantizara.
 *
 * Los consumidores son deliberadamente distintos entre sí —el modo de scroll, el
 * presupuesto de partículas y el perfil del contexto WebGL— pero todos responden
 * a la MISMA pregunta: en qué clase de dispositivo estamos. Por eso el umbral
 * vive aquí y no en ninguno de ellos.
 */

export const VIEWPORT = {
  /** Ancho máximo que se considera móvil. */
  MOBILE_MAX: 767,
  /** Ancho máximo que se considera tablet. */
  TABLET_MAX: 1023,
  /** Ancho mínimo que se considera escritorio. */
  DESKTOP_MIN: 1024,
} as const

export type DeviceClass = 'mobile' | 'tablet' | 'desktop'

export function deviceClassForWidth(width: number): DeviceClass {
  if (width >= VIEWPORT.DESKTOP_MIN) return 'desktop'
  if (width > VIEWPORT.MOBILE_MAX) return 'tablet'
  return 'mobile'
}

export function isMobileWidth(width: number): boolean {
  return width <= VIEWPORT.MOBILE_MAX
}
