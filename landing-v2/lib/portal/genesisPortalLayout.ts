import { EMISSION } from '@/lib/design/tokens'
import { pulsoDe, llegadaDe, PARALAJE } from '@/lib/design/motion'
/** Phase 16.0 — Genesis Final Portal layout (viewBox 0–100). */

export const PORTAL_CORE_COLOR = EMISSION.magenta
export const PORTAL_CYAN = EMISSION.cyan
export const PORTAL_PURPLE = EMISSION.violetHi

export const PORTAL_CORE_PULSE_S = pulsoDe('cta')
/**
 * La absorcion ES el gesto de la seccion.
 *
 * El portal condensa: la materia vuelve al centro. Ese ciclo no puede ir a un
 * ritmo distinto del pulso de la seccion, porque son la misma cosa vista desde
 * dos capas. Valia 6 — un numero suelto que ademas se multiplicaba por 1,4 en
 * el CSS para los flujos, dando 8,4.
 */
export const PORTAL_ABSORB_S = pulsoDe('cta')
export const PORTAL_FORM_S = llegadaDe('cta')

export const PORTAL_CENTER = { x: 50, y: 50 } as const

/**
 * Los tres anillos, en la escalera de profundidad del portal.
 *
 * Giraban a 48 · 36 · 28 segundos: proporcion 1,71 : 1,29 : 1. A esa distancia
 * tres anillos concentricos no se leen como profundidad — se leen como tres
 * cosas girando a velocidades parecidas. Con 32 · 16 · 8 la separacion es
 * 1 : 2 : 4 y cada anillo ocupa su plano.
 *
 * El sentido alternado se queda: es lo que impide que los tres se lean como un
 * solo disco.
 */
export const PORTAL_RING = {
  outer: { radius: 46, rx: 1, ry: 0.9, duration: PARALAJE.fondo, direction: 1 },
  middle: { radius: 33, rx: 1, ry: 0.88, duration: PARALAJE.medio, direction: -1 },
  core: { radius: 21, rx: 1, ry: 0.86, duration: PARALAJE.frente, direction: 1 },
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
