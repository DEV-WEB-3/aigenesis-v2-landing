import { EMISSION } from '@/lib/design/tokens'
import { pulsoDe, llegadaDe, PARALAJE, desfase } from '@/lib/design/motion'
import type { TechStackLayerId } from '@/lib/technology/techStackLayout'

/**
 * LA ARQUITECTURA DE GENESIS — cinco estratos, no cinco elipses.
 *
 * QUE TIENE QUE CONTAR, sin leer una palabra: que hay una maquina debajo. Las
 * aplicaciones existen SOBRE una infraestructura real, y por eso el arranque va
 * de abajo arriba: backend despierta, la corriente sube, y solo al final aparece
 * lo que el usuario toca.
 *
 * EL LIENZO ES 160 x 100, no cuadrado, y por la misma razon que en roadmap: con
 * `viewBox 0 0 100 100` y `meet` el dibujo se encierra en un cuadrado del lado
 * MENOR y deja muerta media anchura.
 *
 * 160 Y NO 120, MEDIDO. Con 120 y el eje descentrado en 47, las lecturas del
 * lado izquierdo —«Infraestructura distribuida», «Inmutable y
 * descentralizado»— salian 32 y 17 px por fuera del lienzo e INVADIAN la
 * columna de texto 73 y 59 px. No era un ajuste fino: no cabian, porque a la
 * izquierda del eje solo quedaban 16 unidades para un rotulo que pide 28.
 *
 * Ademas 120 desperdiciaba anchura. El hueco del visual mide 490 x 309 —relacion
 * 1,59—; con un lienzo de relacion 1,2 y `meet` el dibujo queda limitado por el
 * ALTO y solo ocupa 371 px, dejando 119 de margen muerto. A 160 la relacion es
 * 1,6, el limite pasa a ser el ancho, y ese margen se convierte en el sitio
 * donde viven las lecturas — sin encoger la maquina.
 *
 * Todo —anillos, columna, nucleo, rotulos, telemetria— vive dentro del MISMO
 * SVG. No hay dos sistemas de coordenadas que puedan desalinearse, que es lo que
 * separaba capas en el resto del portal.
 */
export const ARQ_VIEWBOX = { w: 160, h: 100 } as const

/** Eje de la maquina. Todo se apila sobre el, y va CENTRADO: las lecturas salen
 *  a los dos lados y ninguno puede quedarse sin sitio. */
export const ARQ_EJE_X = 80

export const ARQ_PULSO_S = pulsoDe('technology')
export const ARQ_LLEGADA_S = llegadaDe('technology')

/** Recorrido de un dato por la columna de energia. */
export const ARQ_DATO_S = PARALAJE.frente
/** Giro de los anillos. El mas lento del conjunto: la infraestructura no corre. */
export const ARQ_ANILLO_S = PARALAJE.fondo
/** Cada cuanto la maquina se autocomprueba de abajo arriba. */
export const ARQ_ESCANEO_S = PARALAJE.frente

export interface ArqEstrato {
  id: TechStackLayerId
  /** Rotulo de la plataforma. */
  label: string
  /** Titulo de la lectura que aparece al posarse encima. */
  lectura: string
  /** Cuerpo de la lectura, en dos lineas cortas. */
  detalle: readonly string[]
  /** 0 = el de mas abajo. El arranque sigue este orden. */
  orden: number
  y: number
  /** Semieje mayor. Crece hacia abajo: la base sostiene mas de lo que muestra. */
  rx: number
  color: string
}

/*
 * LAS LECTURAS VAN TODAS A LA DERECHA, y no es una preferencia estetica.
 *
 * Alternando lados quedaba mas vivo, pero medido: «Infraestructura distribuida»
 * e «Inmutable y descentralizado» se metian 16 y 2 px DENTRO del texto pintado
 * de la columna izquierda. Es la misma clase de defecto que ya se reporto en
 * roadmap —el visual encima del marco teorico— y ajustar longitudes de rotulo o
 * la separacion del guion solo lo arregla para la ventana en la que estoy
 * midiendo: en cuanto cambia el ancho, la cuenta cambia con el.
 *
 * A la derecha el choque no es improbable, es IMPOSIBLE: entre el texto y el
 * eje queda el ancho entero de la maquina. Un limite estructural no hay que
 * volver a verificarlo en cada tamano.
 */

/**
 * LOS CINCO ESTRATOS.
 *
 * `rx` decrece hacia arriba a proposito: el conjunto se lee como un cono
 * escalonado y no como cinco aros iguales. Lo ancho abajo dice «esto sostiene»;
 * lo estrecho arriba dice «esto es lo que se ve».
 *
 * El color sigue la paleta EMISSION de abajo arriba —violeta, azul, magenta,
 * violeta claro, cian— para que la corriente que sube por la columna atraviese
 * un degradado real y no un cambio arbitrario.
 */
export const ARQ_ESTRATOS: readonly ArqEstrato[] = [
  {
    id: 'backend',
    label: 'BACKEND',
    lectura: 'Servicios y APIs',
    detalle: ['APIs robustas, eventos en', 'tiempo real y microservicios.'],
    orden: 0, y: 84, rx: 30, color: EMISSION.violet,
  },
  {
    id: 'infraestructura',
    label: 'INFRAESTRUCTURA',
    lectura: 'Infraestructura distribuida',
    detalle: ['Escalable, redundante y lista', 'para millones de interacciones.'],
    orden: 1, y: 68, rx: 27, color: EMISSION.blueHi,
  },
  {
    id: 'ia',
    label: 'IA',
    lectura: 'Inteligencia artificial',
    detalle: ['Motor propietario que aprende,', 'predice y optimiza en vivo.'],
    orden: 2, y: 52, rx: 24, color: EMISSION.magenta,
  },
  {
    id: 'blockchain',
    label: 'BLOCKCHAIN',
    lectura: 'Inmutable y descentralizado',
    detalle: ['Transacciones verificables, sin', 'puntos unicos de falla.'],
    orden: 3, y: 36, rx: 21, color: EMISSION.violetHi,
  },
  {
    id: 'aplicaciones',
    label: 'APLICACIONES',
    lectura: 'Aplicaciones inteligentes',
    detalle: ['Interfaces descentralizadas,', 'experiencias fluidas y seguras.'],
    orden: 4, y: 20, rx: 18, color: EMISSION.cyan,
  },
] as const

export const ARQ_TOTAL = ARQ_ESTRATOS.length

/** Aplanamiento de los anillos. Fijo: los cinco se ven desde la misma altura. */
export const ARQ_APLANADO = 0.3

/**
 * Retardo de arranque de un estrato.
 *
 * La cascada va de ABAJO ARRIBA —`orden` 0 primero— porque esa direccion es el
 * argumento: las aplicaciones existen sobre una infraestructura real. Al reves
 * seria un adorno; asi es una afirmacion.
 */
export function arqRetardo(orden: number): number {
  return desfase(orden, ARQ_TOTAL, ARQ_LLEGADA_S * 2)
}

/** Altura del nucleo Genesis, flotando sobre el ultimo estrato. */
export const ARQ_NUCLEO_Y = 6

/**
 * Los datos que suben por la columna. Uno por tramo entre estratos.
 *
 * Misma duracion en todos y distinto arranque: es como se separan las cosas en
 * este portal, y ademas los mantiene en fase con el resto de la seccion.
 */
export const ARQ_DATOS = Array.from({ length: ARQ_TOTAL - 1 }, (_, i) => ({
  desde: ARQ_ESTRATOS[i]!.y,
  hasta: ARQ_ESTRATOS[i + 1]!.y,
  retardo: desfase(i, ARQ_TOTAL - 1, ARQ_DATO_S),
  color: ARQ_ESTRATOS[i + 1]!.color,
}))

/**
 * MICROTELEMETRIA — las marcas del canto de cada anillo.
 *
 * No son adorno: son lo que hace que un anillo se lea como un modulo con
 * puertos y no como una elipse. Se generan con SEMILLA y no con `Math.random()`,
 * porque el azar rompe la hidratacion — el servidor pintaria unas y el cliente
 * otras.
 */
function semilla(i: number, sal: number): number {
  const x = Math.sin(i * 91.7 + sal * 47.3) * 43758.5453
  return x - Math.floor(x)
}

export function arqPuertos(estrato: number, cuantos = 22): readonly { a: number; alto: number; vivo: boolean }[] {
  return Array.from({ length: cuantos }, (_, i) => ({
    a: (i / cuantos) * Math.PI * 2,
    alto: 0.9 + semilla(i, estrato) * 1.8,
    // uno de cada cuatro queda encendido: un modulo con TODOS los indicadores
    // activos no se lee como un sistema, se lee como una guirnalda
    vivo: semilla(i, estrato + 11) > 0.74,
  }))
}
