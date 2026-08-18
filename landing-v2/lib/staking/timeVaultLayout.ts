import { EMISSION } from '@/lib/design/tokens'
import { pulsoDe, llegadaDe, PARALAJE } from '@/lib/design/motion'
/**
 * Phase 9.0 — Genesis Time Vault layout (viewBox 0–100).
 */

export const STAKING_VAULT_PULSE_S = pulsoDe('staking')
export const STAKING_VAULT_FORM_S = llegadaDe('staking')
export const STAKING_VAULT_CENTER = { x: 50, y: 52 } as const

/**
 * Los tres anillos de tiempo de la boveda.
 *
 * La geometria ya era correcta: suben (y 68 -> 50 -> 32, repartidos parejo) y
 * crecen (rx 18 -> 21 -> 24), que es lo que dice la seccion — a mas permanencia,
 * mas alcance. No se toca.
 *
 * Lo unico que sobraba era el `pulseOffset`: 0,12 / 0,28 / 0,44, tres numeros
 * sin relacion entre si para algo cuyo unico trabajo es que los tres no laten
 * a la vez. Se deriva del indice, igual que en las demas secciones.
 */
const ANILLOS = [
  { id: 'period-6', y: 68, rx: 18, ry: 6.8, label: '6+' },
  { id: 'permanence', y: 50, rx: 21, ry: 7.6, label: 'On-chain' },
  { id: 'stability', y: 32, rx: 24, ry: 8.4, label: 'Deflacionario' },
] as const

export const STAKING_TIME_RINGS = ANILLOS.map((a, i) => ({
  ...a,
  color: EMISSION.violetHi,
  pulseOffset: i / ANILLOS.length,
}))

/* ─────────────────────────────────────────────────────────────────────────
   ANILLO DE REGISTRO — la trazabilidad on-chain, dibujada.

   QUE FALTABA. La seccion afirma «trazabilidad on-chain» y en la imagen no
   habia NADA que registrara nada: tres elipses girando y un candado. La
   afirmacion mas verificable de la seccion era la unica sin forma.

   QUE HACE. Cada evento del ciclo —entra AIG, se libera AIG— graba una marca
   en un anillo exterior. Las marcas SE ACUMULAN Y NO SE BORRAN: eso es lo que
   significa un registro inmutable cuando se dibuja. El anillo se completa en
   una vuelta del anillo mas lento (32 s) y se queda lleno; no hay reinicio,
   porque un libro mayor que se vacia no es un libro mayor.

   POR QUE PUNTOS Y NO MARCAS RADIALES. Una marca radial necesita saber el
   angulo TANGENTE en pixeles pintados, y ese angulo depende de lo aplanada que
   quede la elipse — que a su vez depende del tamano real del escenario, no de
   estos numeros. Un punto no tiene orientacion, asi que el problema desaparece
   en vez de resolverse mal. Es la misma trampa que separa las capas SVG/DOM en
   el resto del portal: mezclar dos sistemas de coordenadas.

   POR QUE `left`/`top` EN PORCENTAJE Y NO `rotate()`. Rotar un elemento hijo
   alrededor del centro traza una CIRCUNFERENCIA de radio igual a media anchura,
   no la elipse — sale bien solo si la caja es cuadrada, y esta no lo es. Un
   porcentaje de la caja cae sobre la elipse exacta sea cual sea su proporcion,
   sin JavaScript y sin medir nada.
   ───────────────────────────────────────────────────────────────────────── */

/** Vuelta completa del registro. Es la del anillo mas lento: se llena en una. */
export const STAKING_LEDGER_LAP_S = PARALAJE.fondo

/**
 * Geometria del anillo, por fuera de los tres de tiempo (el mayor va a rx 24).
 *
 * Va centrado en el nucleo, no encima ni debajo: es alrededor del candado donde
 * ocurren los eventos que registra. Los anillos de tiempo lo cruzan, y eso es
 * correcto — son planos distintos.
 */
export const STAKING_LEDGER_RING = {
  y: STAKING_VAULT_CENTER.y,
  rx: 30,
  ry: 10.5,
} as const

/**
 * `width / height` del anillo, para `aspect-ratio`.
 *
 * La altura se deriva de la ANCHURA, no de un `%` propio, y ese detalle es el
 * que hace posible todo lo demas. Un `height` en `%` se resuelve contra la
 * altura del escenario mientras el `width` se resuelve contra su anchura: la
 * proporcion pintada acaba dependiendo del tamano de la ventana y no coincide
 * con la declarada aqui. Los anillos de tiempo tienen hoy ese problema —dicen
 * ry/rx = 0,378 y en pantalla miden 0,213—, y por eso ningun calculo de CSS
 * puede colocar nada sobre su elipse.
 *
 * Con `aspect-ratio` la proporcion pintada ES este numero, siempre. Eso permite
 * poner el cabezal sobre la elipse exacta con dos escalas y sin JavaScript.
 */
export const STAKING_LEDGER_ASPECTO = STAKING_LEDGER_RING.rx / STAKING_LEDGER_RING.ry

/** Lo aplanado que queda el circulo al convertirse en la elipse. */
export const STAKING_LEDGER_APLANADO = 1 / STAKING_LEDGER_ASPECTO

const LEDGER_MARCAS = 24

export type StakingLedgerMark = {
  /** Posicion sobre la elipse, en % de la caja del anillo. */
  left: number
  top: number
  /** Que evento grabo la marca. Dos entradas por cada liberacion. */
  tipo: 'entrada' | 'liberacion'
  color: string
  /** Cuando se graba, en segundos desde que entra la seccion. */
  retardo: number
}

/**
 * Las marcas del registro, repartidas parejo sobre la elipse.
 *
 * Se empieza arriba (-90 grados) para que la primera marca caiga en el punto
 * mas alto y la lectura del anillo tenga un origen visible.
 */
export const STAKING_LEDGER_MARKS: StakingLedgerMark[] = Array.from(
  { length: LEDGER_MARCAS },
  (_, i) => {
    const angulo = -Math.PI / 2 + (i / LEDGER_MARCAS) * Math.PI * 2
    const liberacion = i % 3 === 2
    return {
      left: 50 + 50 * Math.cos(angulo),
      top: 50 + 50 * Math.sin(angulo),
      tipo: liberacion ? 'liberacion' : 'entrada',
      color: liberacion ? EMISSION.cyan : EMISSION.magentaHi,
      retardo: (i / LEDGER_MARCAS) * STAKING_LEDGER_LAP_S,
    }
  },
)

export function stakingLockStreamPath(index: number, total = 5): string {
  const cx = STAKING_VAULT_CENTER.x
  const spread = 11
  const x = cx + (index - (total - 1) / 2) * (spread / (total - 1))
  const yTop = 8
  const yCore = STAKING_VAULT_CENTER.y
  const bulge = (index % 2 === 0 ? 1 : -1) * 2.5
  const mx = (x + cx) / 2 + bulge
  const my = (yTop + yCore) / 2
  return `M${x},${yTop} Q${mx},${my} ${cx},${yCore}`
}

export function stakingOutflowPath(index: number): string {
  const cx = STAKING_VAULT_CENTER.x
  const x = cx + (index - 1) * 4.5
  return `M${cx},${STAKING_VAULT_CENTER.y + 6} Q${x},${78} ${x},${92}`
}

/** Shield contour — subtle protection outline. */
export function stakingShieldContourPath(): string {
  const cx = STAKING_VAULT_CENTER.x
  const cy = STAKING_VAULT_CENTER.y - 2
  return [
    `M${cx},${cy - 22}`,
    `Q${cx + 26},${cy - 18} ${cx + 24},${cy + 4}`,
    `Q${cx + 20},${cy + 26} ${cx},${cy + 32}`,
    `Q${cx - 20},${cy + 26} ${cx - 24},${cy + 4}`,
    `Q${cx - 26},${cy - 18} ${cx},${cy - 22}`,
    'Z',
  ].join(' ')
}
