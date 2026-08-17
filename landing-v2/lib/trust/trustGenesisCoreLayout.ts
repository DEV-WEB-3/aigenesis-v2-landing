import { EMISSION } from '@/lib/design/tokens'
import { pulsoDe, PARALAJE } from '@/lib/design/motion'
/** Phase 17.0 — Trust Genesis Core timing + DOM layout. */

export const TRUST_CORE_PULSE_S = pulsoDe('trust')
/**
 * La onda del nucleo late al pulso de la seccion. Valia 6, un valor suelto
 * entre medias del pulso (8) y de nada en particular.
 */
export const TRUST_GENESIS_WAVE_S = pulsoDe('trust')
/** La orbita del flujo es fondo lento: la capa mas profunda del paralaje. */
export const TRUST_FLOW_ORBIT_S = PARALAJE.fondo

export const TRUST_CORE_COLOR = EMISSION.magenta

export const TRUST_CORE_SPHERE = {
  SIZE_PERCENT: 72,
  SIZE_MAX_PX: 170,
  OFFSET_X_PX: -28,
  OFFSET_Y_PX: -217,
} as const

/**
 * Los tres anillos cuanticos, en la escalera de profundidad.
 *
 * Giraban a 52 · 40 · 32: proporcion 1,63 : 1,25 : 1. Igual que en mining, en
 * G-Oracle y en el portal — tres capas tan juntas en velocidad que se leen como
 * una sola algo borrosa, y el paralaje no cumple su unica funcion.
 *
 * Con 32 · 16 · 8 hay 1 : 2 : 4 y cada anillo ocupa su plano. El de fuera es el
 * mas lento, que es lo que hace que se perciba como el mas lejano.
 */
export const TRUST_QUANTUM_RING = {
  outer: { radius: 46, duration: PARALAJE.fondo, opacity: 0.12 },
  middle: { radius: 36, duration: PARALAJE.medio, opacity: 0.07 },
  inner: { radius: 26, duration: PARALAJE.frente, opacity: 0.04 },
} as const

export const TRUST_DEPTH_TIER = {
  SMALL: 0,
  MEDIUM: 1,
  BRIGHT: 2,
  SMALL_SHARE: 0.7,
  MEDIUM_SHARE: 0.2,
  BRIGHT_SHARE: 0.1,
} as const
