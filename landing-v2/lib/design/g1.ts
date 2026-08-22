/**
 * G1 — SUB-MARCA DE LA ALIANZA (Génesis × Aitech × TAG).
 *
 * POR QUÉ VIVE APARTE DE `tokens.ts`
 * ----------------------------------
 * `tokens.ts` es el núcleo canónico de Génesis y su regla es dura: no se
 * inventan colores nuevos, cada emisión cae dentro de la banda de tono del
 * logo. G1 hereda esa identidad tal cual —violeta, cian, magenta, el vacío—
 * y NO la toca.
 *
 * G1 suma UNA sola cosa: un acento de «energía» ámbar, que pertenece a la
 * alianza (el gesto de qpaycard/Aitech One), no al núcleo Génesis. Por eso se
 * declara aquí y no allá: mantiene el núcleo intacto y deja explícito que el
 * ámbar es de G1. Si G1 desaparece, el núcleo Génesis queda sin una gota de
 * deuda.
 */
import { EMISSION, VOID, INK } from './tokens'

export { VOID, INK } from './tokens'

export const G1 = {
  // Herencia Génesis (canónica, sin derivas):
  violet: EMISSION.violet,
  violetHi: EMISSION.violetHi,
  cyan: EMISSION.cyan,
  magenta: EMISSION.magenta,
  blue: EMISSION.blue,
  /** El único color propio de G1: la energía de la alianza. */
  amber: '#FF8A3D',
} as const

/** El gradiente firma de G1 — la misma diagonal violeta→cian de Génesis. */
export const G1_GRADIENT = `linear-gradient(100deg, ${EMISSION.violet}, ${EMISSION.cyan})`

/** El gradiente extendido con la energía, solo para el hero WebGL. */
export const G1_GRADIENT_ENERGY = `linear-gradient(100deg, ${EMISSION.violet}, ${EMISSION.cyan} 60%, ${G1.amber})`

export type G1Color = keyof typeof G1
