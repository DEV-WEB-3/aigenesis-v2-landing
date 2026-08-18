import { EMISSION } from '@/lib/design/tokens'
import { pulsoDe } from '@/lib/design/motion'
/**
 * Phase 8.0 — Booster Quantum Accelerator layout (viewBox 0–100).
 */

export const BOOSTER_ACCELERATOR_PULSE_S = pulsoDe('booster')
export const BOOSTER_STREAM_COUNT = 5
export const BOOSTER_COLUMN_X = 50

export type BoosterTierId = 'activation' | 'multiplier' | 'progression'

export interface BoosterTierDef {
  id: BoosterTierId
  y: number
  color: string
  glow: string
  pulseOffset: number
  ringR: number
  ringCount: 1 | 2
}

/**
 * LOS TRES NIVELES DEL ACELERADOR.
 *
 * La estructura ya era correcta y no se toca: suben (y decreciente), el color
 * recorre la rampa de marca hacia arriba —magenta, violeta, cian— y el segundo
 * nivel lleva anillo doble. Todo eso dice «progresion» y lo dice bien.
 *
 * Lo que no funcionaba era LA MAGNITUD. El radio iba 13,5 -> 15 -> 17: un 26 %
 * de crecimiento repartido en tres niveles, o sea un 12 % entre uno y el
 * siguiente. Doce por ciento no se percibe como amplificacion; se percibe como
 * tres anillos del mismo tamano dibujados con poca precision.
 *
 * Y la amplificacion es LO QUE VENDE LA SECCION: se llama Multiplicador y
 * habla de «factores de amplificacion progresivos». Que la figura no lo
 * muestre deja el argumento entero apoyado en el texto.
 *
 * Ahora 12 -> 16 -> 21: un 75 % de crecimiento, en proporcion 1 : 1,33 : 1,75.
 * Cada nivel es visiblemente mayor que el anterior, y el ultimo cierra a y=22
 * con radio 21, dejando 1 unidad de margen dentro del lienzo.
 */
const NIVELES = [
  { id: 'activation', color: EMISSION.magenta, glow: 'rgba(255, 0, 200, 0.52)', ringR: 12, ringCount: 1 },
  { id: 'multiplier', color: EMISSION.violetHi, glow: 'rgba(157, 77, 255, 0.5)', ringR: 16, ringCount: 2 },
  { id: 'progression', color: EMISSION.cyan, glow: 'rgba(0, 245, 255, 0.48)', ringR: 21, ringCount: 1 },
] as const

/** Base abajo, cima arriba: el acelerador SUBE. */
const NIVEL_BASE_Y = 80
const NIVEL_SALTO_Y = 29

export const BOOSTER_TIERS: readonly BoosterTierDef[] = NIVELES.map((n, i) => ({
  ...n,
  y: NIVEL_BASE_Y - i * NIVEL_SALTO_Y,
  // Era 0,08 / 0,32 / 0,58 — tres numeros sin relacion. Reparto parejo dentro
  // de un ciclo, que es lo unico que ese valor tiene que hacer.
  pulseOffset: i / NIVELES.length,
}))

/** Organic energy stream — double-helix strand bottom → top. */
export function boosterHelixStreamPath(strandIndex: number, total = BOOSTER_STREAM_COUNT): string {
  const cx = BOOSTER_COLUMN_X
  const y0 = 88
  const y1 = 10
  const amp = 9.5 + (strandIndex % 3) * 1.8
  const phase = (strandIndex / total) * Math.PI * 2
  const segments = 6
  const parts: string[] = []

  for (let s = 0; s <= segments; s++) {
    const t = s / segments
    const y = y0 + (y1 - y0) * t
    const x = cx + Math.sin(t * Math.PI * 3.2 + phase) * amp * (0.55 + t * 0.45)
    parts.push(s === 0 ? `M${x},${y}` : `L${x},${y}`)
  }

  return parts.join(' ')
}

/** Genesis pulse wave path — activation → progression. */
export function boosterPulseColumnPath(): string {
  const cx = BOOSTER_COLUMN_X
  return `M${cx},${BOOSTER_TIERS[0]!.y} Q${cx + 2},${BOOSTER_TIERS[1]!.y} ${cx},${BOOSTER_TIERS[2]!.y}`
}
