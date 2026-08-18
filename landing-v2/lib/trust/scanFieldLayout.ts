/**
 * EL CAMPO DE ESCANEO — geometria de los seis pilares de Confianza.
 *
 * La seccion se llama «Infraestructura verificable». Hasta ahora su visual era
 * abstracto: no decia QUE se verifica. Seis pilares con nombre convierten la
 * promesa en una lista, y el escaneo convierte «verificable» en algo que el
 * visitante HACE en vez de leer.
 *
 * UN SOLO SISTEMA DE COORDENADAS, 160x90
 * --------------------------------------
 * El resto del portal dibuja en un lienzo CUADRADO de 0–100. Aqui no sirve: los
 * rotulos van FUERA del anillo y necesitan el ancho completo del hueco, que es
 * apaisado (~980x590 en escritorio).
 *
 * Asi que se usa 160x90 —la misma proporcion que el hueco— y TODO vive ahi: las
 * orbitas en SVG y los pilares en DOM. Esa mezcla es exactamente la que produjo
 * el fallo de G-Oracle, donde un satelite acabo pintado en x=1757 con un
 * viewport de 1723 porque el SVG dibujaba en su cuadrado y el DOM medía en
 * porcentaje de la caja entera. La clase `.lienzo-apaisado` existe para que las
 * dos capas ocupen la MISMA caja; sin ella, esto se rompe igual.
 */

import { EMISSION } from '@/lib/design/tokens'

/** El lienzo compartido. Cambiarlo obliga a cambiar `.lienzo-apaisado`. */
export const CAMPO = { ancho: 160, alto: 90, cx: 80, cy: 42 } as const

/** Radios del anillo donde se posan los pilares. */
export const ANILLO = { rx: 44, ry: 26 } as const

export type PilarId =
  | 'red'
  | 'seguridad'
  | 'contratos'
  | 'auditoria'
  | 'nodos'
  | 'trazabilidad'

/** Hacia donde se aparta el rotulo para no cruzar la figura. */
export type LadoRotulo = 'arriba' | 'abajo' | 'derecha' | 'izquierda'

export interface PilarDef {
  id: PilarId
  /** Angulo en grados sobre el anillo. -90 es arriba. */
  angulo: number
  titulo: string
  descripcion: string
  color: string
  lado: LadoRotulo
}

/**
 * Los seis, en el orden en que se recorren con el tabulador.
 *
 * Los angulos NO estan repartidos a 60 exactos: los cuatro laterales se cierran
 * a 32 y 148 para dejar sitio a los rotulos de dos lineas, que en 60 grados se
 * pisarian con el de arriba y el de abajo. La simetria vertical se conserva.
 *
 * El color de cada pilar sale de la rampa de marca y NO es decorativo: recorre
 * cian -> azul -> magenta segun se baja por el anillo, asi que los dos pilares
 * de cada altura comparten tono y el conjunto se lee como una sola pieza.
 */
export const PILARES: readonly PilarDef[] = [
  {
    id: 'red',
    angulo: -90,
    titulo: 'Red distribuida',
    descripcion: 'Conectividad global segura, sin puntos únicos de falla.',
    color: EMISSION.violetHi,
    lado: 'arriba',
  },
  {
    id: 'seguridad',
    angulo: -32,
    titulo: 'Seguridad on-chain',
    descripcion: 'Protección criptográfica avanzada y validación descentralizada.',
    color: EMISSION.blueHi,
    lado: 'derecha',
  },
  {
    id: 'contratos',
    angulo: 32,
    titulo: 'Contratos',
    descripcion: 'Smart Contracts auditados y verificables. Ejecución justa y automática.',
    color: EMISSION.cyan,
    lado: 'derecha',
  },
  {
    id: 'auditoria',
    angulo: 90,
    titulo: 'Auditoría continua',
    descripcion: 'Monitoreo permanente en tiempo real. Detección y respuesta inmediata.',
    color: EMISSION.cyan,
    lado: 'abajo',
  },
  {
    id: 'nodos',
    angulo: 148,
    titulo: 'Nodos globales',
    descripcion: 'Infraestructura distribuida en múltiples regiones para máxima disponibilidad.',
    color: EMISSION.blueHi,
    lado: 'izquierda',
  },
  {
    id: 'trazabilidad',
    angulo: 212,
    titulo: 'Trazabilidad',
    descripcion: 'Registro inmutable de cada evento. Transparencia total en cada movimiento.',
    color: EMISSION.magentaHi,
    lado: 'izquierda',
  },
]

export function posicionPilar(angulo: number): { x: number; y: number } {
  const rad = (angulo * Math.PI) / 180
  return {
    x: CAMPO.cx + Math.cos(rad) * ANILLO.rx,
    y: CAMPO.cy + Math.sin(rad) * ANILLO.ry,
  }
}

/** Porcentaje dentro del lienzo — la unica forma de colocar DOM sobre el SVG. */
export function porcentaje(x: number, y: number): { left: string; top: string } {
  return {
    left: `${((x / CAMPO.ancho) * 100).toFixed(3)}%`,
    top: `${((y / CAMPO.alto) * 100).toFixed(3)}%`,
  }
}

/**
 * La curva que une un pilar con el nucleo.
 *
 * Se comba hacia fuera del centro para que las seis no se solapen en el medio,
 * que es donde vive el nucleo y donde aterriza el logo del hero.
 */
export function enlacePilar(angulo: number): string {
  const { x, y } = posicionPilar(angulo)
  const mx = (x + CAMPO.cx) / 2
  const my = (y + CAMPO.cy) / 2 + (y < CAMPO.cy ? -5 : 5)
  return `M${x.toFixed(2)},${y.toFixed(2)} Q${mx.toFixed(2)},${my.toFixed(2)} ${CAMPO.cx},${CAMPO.cy}`
}

/**
 * El recorrido del barrido automatico, en porcentaje del lienzo.
 *
 * Existe porque el escaneo NO puede depender del raton: en movil no hay puntero
 * y con teclado tampoco. La luz recorre el anillo sola, y al llegar a cada pilar
 * lo alumbra — asi la seccion se ve entera sin tocar nada.
 *
 * @param t fase de 0 a 1 dentro del ciclo
 */
export function barrido(t: number): { mx: number; my: number } {
  const a = t * Math.PI * 2 - Math.PI / 2
  return {
    mx: 50 + (ANILLO.rx / CAMPO.ancho) * 100 * Math.cos(a),
    my: (CAMPO.cy / CAMPO.alto) * 100 + (ANILLO.ry / CAMPO.alto) * 100 * Math.sin(a),
  }
}
