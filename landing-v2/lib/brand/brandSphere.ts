import {
  GPULSE_MASK_POOL_B64,
  GPULSE_MASK_POOL_COUNT,
} from './gpulseMaskPool.generated'
import { GEVY_MASK_POOL_B64, GEVY_MASK_POOL_COUNT } from './gevyMaskPool.generated'
import {
  GENESIS_LOGO_MASK_POOL_B64,
  GENESIS_LOGO_MASK_POOL_COUNT,
} from '@/lib/trust/genesisLogoMaskPool.generated'

/**
 * Las tres marcas de la esfera, en el orden en que se revelan al girar.
 *
 * Genesis al frente porque es la marca madre y lo primero que se ve. Después
 * G-Pulse y Gevy, a 120° cada una: tres caras equidistantes en el ecuador.
 */
export const CARAS_MARCA = ['genesis', 'gpulse', 'gevy'] as const
export type CaraMarca = (typeof CARAS_MARCA)[number]

/** Ángulo de giro, en radianes, en el que cada marca queda de frente. */
export const ANGULO_CARA: Record<CaraMarca, number> = {
  genesis: 0,
  gpulse: (2 * Math.PI) / 3,
  gevy: (4 * Math.PI) / 3,
}

interface FuentePool {
  b64: string
  count: number
}

const FUENTES: Record<CaraMarca, FuentePool> = {
  genesis: { b64: GENESIS_LOGO_MASK_POOL_B64, count: GENESIS_LOGO_MASK_POOL_COUNT },
  gpulse: { b64: GPULSE_MASK_POOL_B64, count: GPULSE_MASK_POOL_COUNT },
  gevy: { b64: GEVY_MASK_POOL_B64, count: GEVY_MASK_POOL_COUNT },
}

const cache = new Map<CaraMarca, Float32Array>()

/**
 * Decodifica el pool de una marca. Mismo formato que usa Trust: float32
 * entrelazado nx, ny, r, g, b.
 *
 * La rama de `Buffer` existe porque este módulo puede evaluarse en el servidor
 * durante el prerenderizado, donde no hay `atob`. Es el mismo patrón que
 * `GenesisLogoMaskSampler`, y por eso se repite en vez de inventar otro.
 */
function decodificar(cara: CaraMarca): Float32Array {
  const cacheado = cache.get(cara)
  if (cacheado) return cacheado

  const { b64 } = FUENTES[cara]
  let out: Float32Array

  if (typeof Buffer !== 'undefined') {
    const buf = Buffer.from(b64, 'base64')
    out = new Float32Array(buf.buffer, buf.byteOffset, buf.byteLength / 4)
  } else {
    const binario = atob(b64)
    const bytes = new Uint8Array(binario.length)
    for (let i = 0; i < binario.length; i++) bytes[i] = binario.charCodeAt(i)
    out = new Float32Array(bytes.buffer)
  }

  cache.set(cara, out)
  return out
}

/**
 * Índice estructurado — el mismo criterio que Trust.
 *
 * El pool está ordenado por bandas radiales y, dentro de cada banda, por
 * ángulo. Recorrerlo a saltos regulares toma puntos repartidos por toda la
 * silueta en vez de un trozo contiguo, que dejaría media forma vacía.
 */
function indiceEstructurado(i: number, cuantas: number, total: number): number {
  if (cuantas <= 0) return 0
  if (cuantas >= total) return i % total
  return Math.min(total - 1, Math.floor((i * total) / cuantas))
}

export interface GeometriaCara {
  /** xyz por partícula, ya proyectado a la superficie de la esfera. */
  posiciones: Float32Array
  /** rgb por partícula, tomado del propio logotipo. */
  colores: Float32Array
}

/**
 * Construye una cara de la esfera.
 *
 * LA DECISION QUE IMPORTA: las partículas se PROYECTAN A LA ESFERA, no se
 * pegan planas sobre ella.
 *
 * Poner el logotipo como textura sobre una bola lo deforma con el mapeado UV y
 * se lee como «impreso en una pelota»: barato, y además cada marca se
 * distorsiona distinto según su forma. Aquí cada punto (nx, ny) del plano del
 * logotipo se convierte en un punto de la superficie esférica mediante una
 * proyección azimutal equidistante — la distancia al centro del logotipo se
 * conserva como distancia ANGULAR sobre la esfera.
 *
 * Consecuencia práctica: la silueta se lee sin deformar cuando la cara está de
 * frente, y al girar se curva como lo haría algo que de verdad está sobre una
 * superficie curva. Que es lo que hace que parezca una esfera y no un cartel.
 *
 * `aperturaRad` controla cuánto del casquete ocupa el logotipo. A 2π/3 las tres
 * caras se tocan sin solaparse; se deja algo por debajo para que quede aire
 * entre marcas.
 */
export function construirCara(
  cara: CaraMarca,
  cuantas: number,
  radio: number,
  aperturaRad = 1.02
): GeometriaCara {
  const pool = decodificar(cara)
  const total = FUENTES[cara].count
  const posiciones = new Float32Array(cuantas * 3)
  const colores = new Float32Array(cuantas * 3)

  const giroCara = ANGULO_CARA[cara]

  for (let i = 0; i < cuantas; i++) {
    const p = indiceEstructurado(i, cuantas, total) * 5
    const nx = pool[p]
    const ny = pool[p + 1]

    // Distancia al centro del logotipo -> distancia angular desde el polo de la
    // cara. `Math.min` evita que un punto en la esquina del cuadrado normalizado
    // (radio hasta √2) se pase de la apertura.
    const radial = Math.min(1, Math.hypot(nx, ny))
    const theta = radial * aperturaRad
    const phi = Math.atan2(ny, nx)

    // Punto sobre la esfera con el polo en +Z, y luego rotado al meridiano de
    // esta cara girando alrededor de Y.
    const sx = Math.sin(theta) * Math.cos(phi)
    const sy = Math.sin(theta) * Math.sin(phi)
    const sz = Math.cos(theta)

    const cos = Math.cos(giroCara)
    const sen = Math.sin(giroCara)

    posiciones[i * 3] = (sx * cos + sz * sen) * radio
    posiciones[i * 3 + 1] = sy * radio
    posiciones[i * 3 + 2] = (-sx * sen + sz * cos) * radio

    colores[i * 3] = pool[p + 2]
    colores[i * 3 + 1] = pool[p + 3]
    colores[i * 3 + 2] = pool[p + 4]
  }

  return { posiciones, colores }
}

/**
 * Une las tres caras en un solo par de buffers.
 *
 * Un unico `Points` con las tres marcas dentro, y no tres objetos: asi hay UNA
 * llamada de dibujo por fotograma en vez de tres, y girar es rotar el objeto
 * padre — sin recalcular nada ni sincronizar tres rotaciones que se irian
 * separando por error de coma flotante.
 */
export function construirEsferaDeMarca(
  porCara: number,
  radio: number
): GeometriaCara & { porCara: number } {
  const posiciones = new Float32Array(porCara * CARAS_MARCA.length * 3)
  const colores = new Float32Array(porCara * CARAS_MARCA.length * 3)

  CARAS_MARCA.forEach((cara, idx) => {
    const { posiciones: p, colores: c } = construirCara(cara, porCara, radio)
    posiciones.set(p, idx * porCara * 3)
    colores.set(c, idx * porCara * 3)
  })

  return { posiciones, colores, porCara }
}
