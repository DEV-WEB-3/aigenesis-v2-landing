import { EMISSION } from '@/lib/design/tokens'
import { pulsoDe, llegadaDe, PARALAJE, desfase } from '@/lib/design/motion'
import type { TechStackLayerId } from '@/lib/technology/techStackLayout'

/**
 * LA MAQUINA GENESIS — cinco subsistemas, no cinco elipses.
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

/**
 * Eje de la maquina. Todo se apila sobre el, y va CENTRADO: las lecturas salen
 * a la derecha y los modulos flotantes a la izquierda; ninguno se queda sin
 * sitio y los dos sistemas de anotacion no compiten por el mismo lado.
 */
export const ARQ_EJE_X = 80

/**
 * PASO ENTRE ESTRATOS. Vale 14 y no 16, y el motivo es aritmetico.
 *
 * Con paso 16 los cinco anillos ocupaban de y=20 a y=93 y no quedaba sitio ni
 * para la camara del nucleo —pedia 14 unidades y solo habia 10 sobre el anillo
 * de aplicaciones— ni para la placa base —7 unidades bajo el de backend—. Los
 * dos elementos que el concepto pide como remate estaban fuera del lienzo antes
 * de empezar a dibujarlos.
 *
 * Comprimiendo 2 unidades por escalon se liberan 8 en total: 5 arriba y 3
 * abajo. El hueco interior entre anillos baja de 12,7 a 10,7 unidades, que
 * sigue dando sitio a las estructuras suspendidas.
 */
export const ARQ_PASO_Y = 14

/** Altura de la pared lateral de cada modulo. Es lo que le da GROSOR. */
export const ARQ_CANTO = 4.2

/** Aplanamiento de los anillos. Fijo: los cinco se ven desde la misma altura. */
export const ARQ_APLANADO = 0.3

export const ARQ_PULSO_S = pulsoDe('technology')
export const ARQ_LLEGADA_S = llegadaDe('technology')

/** Recorrido de un dato por la columna de energia. */
export const ARQ_DATO_S = PARALAJE.frente
/** Giro de los anillos. El mas lento del conjunto: la infraestructura no corre. */
export const ARQ_ANILLO_S = PARALAJE.fondo
/**
 * EL LATIDO DEL SISTEMA — el unico momento coreografiado de la maquina.
 *
 * Todo lo demas corre a su propio reloj a proposito (ver `latido`), pero cada
 * 8 s el nucleo emite y la orden recorre los cinco de abajo arriba. Es la
 * diferencia entre un organismo y un reloj: los organos laten cada uno a lo
 * suyo y aun asi hay un pulso que los recorre a todos.
 */
export const ARQ_CICLO_S = PARALAJE.frente
/** Escalon del latido al subir de un estrato al siguiente. Es un RETARDO. */
export const ARQ_CICLO_PASO_S = 0.3
/** Respuesta descendente. Una vez cada dos latidos: la maquina contesta. */
export const ARQ_RESPUESTA_S = PARALAJE.medio

export interface ArqEstrato {
  id: TechStackLayerId
  /** Rotulo de la plataforma. */
  label: string
  /** Titulo de la lectura que aparece al posarse encima. */
  lectura: string
  /** Cuerpo de la lectura, en dos lineas cortas. */
  /** Una frase; el corte de linea lo decide quien pinta. Ver `techMachine3d`. */
  detalle: string
  /** 0 = el de mas abajo. El arranque sigue este orden. */
  orden: number
  y: number
  /** Semieje mayor. Crece hacia abajo: la base sostiene mas de lo que muestra. */
  rx: number
  color: string
  /** Segundo color del subsistema, para los detalles internos. */
  colorAlt: string
  /**
   * SU PROPIO RELOJ. Cinco valores que derivan entre si (ver
   * `LATIDOS_ADMITIDOS` en motion.ts). Si los cinco respiraran a 8 s el
   * conjunto se leeria como una coreografia; con relojes propios se lee como
   * una maquina.
   */
  latido: number
}

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
    detalle: 'APIs robustas, eventos en tiempo real y microservicios.',
    orden: 0, y: 82, rx: 30,
    color: EMISSION.violet, colorAlt: EMISSION.violetHi, latido: 5.6,
  },
  {
    id: 'infraestructura',
    label: 'INFRAESTRUCTURA',
    lectura: 'Infraestructura distribuida',
    detalle: 'Escalable, redundante y lista para millones de interacciones.',
    orden: 1, y: 68, rx: 27,
    color: EMISSION.blueHi, colorAlt: EMISSION.blue, latido: 7.2,
  },
  {
    id: 'ia',
    label: 'IA',
    lectura: 'Inteligencia artificial',
    detalle: 'Motor propietario que aprende, predice y optimiza en vivo.',
    orden: 2, y: 54, rx: 24,
    color: EMISSION.magenta, colorAlt: EMISSION.magentaHi, latido: 4.8,
  },
  {
    id: 'blockchain',
    label: 'BLOCKCHAIN',
    lectura: 'Inmutable y descentralizado',
    detalle: 'Transacciones verificables, sin puntos unicos de falla.',
    orden: 3, y: 40, rx: 21,
    color: EMISSION.violetHi, colorAlt: EMISSION.violet, latido: 6.4,
  },
  {
    id: 'aplicaciones',
    label: 'APLICACIONES',
    lectura: 'Aplicaciones inteligentes',
    detalle: 'Interfaces descentralizadas, experiencias fluidas y seguras.',
    orden: 4, y: 26, rx: 18,
    color: EMISSION.cyan, colorAlt: EMISSION.blueHi, latido: 8,
  },
] as const

export const ARQ_TOTAL = ARQ_ESTRATOS.length

/** El plano superior de un modulo: donde se apoya su maquinaria. */
export function arqTapaY(e: ArqEstrato): number {
  return e.y - ARQ_CANTO
}

/** Semieje menor de un anillo. */
export function arqRy(rx: number): number {
  return rx * ARQ_APLANADO
}

/**
 * Un punto SOBRE la superficie eliptica de un modulo.
 *
 * Se aplana punto a punto en vez de envolver el dibujo en un `scale(1, 0.3)`
 * porque un `scale` no uniforme deforma tambien el GROSOR del trazo: las lineas
 * verticales saldrian tres veces mas finas que las horizontales, y el conjunto
 * se leeria como un dibujo estirado en vez de como una superficie en
 * perspectiva. Generando las coordenadas ya aplanadas, el trazo conserva su
 * grosor real.
 */
export function arqSobre(
  cy: number, rx: number, radio: number, angulo: number
): { x: number; y: number } {
  return {
    x: ARQ_EJE_X + Math.cos(angulo) * rx * radio,
    y: cy + Math.sin(angulo) * arqRy(rx) * radio,
  }
}

/**
 * SECUENCIA DE ARRANQUE — 150 ms de escalon, de abajo arriba.
 *
 * Son RETARDOS, no duraciones, y por eso no van en la rejilla de tempo: es
 * justo el mecanismo que la rejilla recomienda para separar cosas iguales sin
 * que deriven.
 */
export const ARQ_BOOT = {
  suelo: 0,
  primerEstrato: 0.15,
  paso: 0.15,
  nucleo: 0.95,
  huds: 1.1,
  lecturas: 1.3,
} as const

export function arqRetardo(orden: number): number {
  return ARQ_BOOT.primerEstrato + desfase(orden, ARQ_TOTAL, ARQ_BOOT.paso * ARQ_TOTAL)
}

/**
 * NUCLEO GENESIS — altura y radio.
 *
 * Medido: con R=7 la camara ocupaba 60 px de los 430 del dibujo y se leia como
 * un remate, no como la pieza central que el concepto pide. R=8,5 la sube a
 * 73 px sin invadir el anillo de aplicaciones: la camara acaba en y=16 y la
 * arista superior de ese anillo esta en 16,4.
 *
 * El techo no lo pone el gusto sino esa arista. Si hiciera falta mas nucleo,
 * habria que bajar el stack — no agrandar el nucleo y confiar en que no se note.
 */
export const ARQ_NUCLEO_Y = 7.5
/** Radio de la camara de contencion. */
export const ARQ_NUCLEO_R = 8.5
/** Reloj propio del nucleo. El mas lento de los seis: el corazon no corre. */
export const ARQ_NUCLEO_S = 9.6

/**
 * Los datos que suben por la columna. Uno por tramo entre estratos.
 *
 * Misma duracion en todos y distinto arranque: aqui SI aplica `desfase`, porque
 * son elementos iguales —paquetes— y no subsistemas distintos.
 */
export const ARQ_DATOS = Array.from({ length: ARQ_TOTAL - 1 }, (_, i) => ({
  desde: ARQ_ESTRATOS[i]!.y,
  hasta: ARQ_ESTRATOS[i + 1]!.y,
  retardo: desfase(i, ARQ_TOTAL - 1, ARQ_DATO_S),
  color: ARQ_ESTRATOS[i + 1]!.color,
}))

/* ─────────────────────────────────────────────────────────────────────────
   GEOMETRIA GENERADA — con SEMILLA, nunca con `Math.random()`.

   El azar rompe la hidratacion: el servidor pintaria unas posiciones y el
   cliente otras. Todo lo que parece aleatorio aqui es determinista.
   ───────────────────────────────────────────────────────────────────────── */
function semilla(i: number, sal: number): number {
  const x = Math.sin(i * 91.7 + sal * 47.3) * 43758.5453
  return x - Math.floor(x)
}

/**
 * MICROTELEMETRIA — las marcas del canto de cada anillo.
 *
 * No son adorno: son lo que hace que un anillo se lea como un modulo con
 * puertos y no como una elipse.
 */
export function arqPuertos(estrato: number, cuantos = 22): readonly { a: number; alto: number; vivo: boolean }[] {
  return Array.from({ length: cuantos }, (_, i) => ({
    a: (i / cuantos) * Math.PI * 2,
    alto: 0.9 + semilla(i, estrato) * 1.8,
    // uno de cada cuatro queda encendido: un modulo con TODOS los indicadores
    // activos no se lee como un sistema, se lee como una guirnalda
    vivo: semilla(i, estrato + 11) > 0.74,
  }))
}

/**
 * VENTANILLAS DE LA PARED — el hardware que se ve de canto.
 *
 * Solo en el arco FRONTAL. Las de detras quedarian tapadas por la propia pared
 * y el unico efecto de dibujarlas seria pagar nodos que nadie ve.
 */
export function arqVentanillas(estrato: number, cuantas = 9) {
  return Array.from({ length: cuantas }, (_, i) => {
    const a = 0.12 * Math.PI + (i / (cuantas - 1)) * 0.76 * Math.PI
    return {
      a,
      ancho: 0.9 + semilla(i, estrato + 3) * 1.4,
      alto: ARQ_CANTO * (0.26 + semilla(i, estrato + 7) * 0.2),
      encendida: semilla(i, estrato + 19) > 0.55,
    }
  })
}

/**
 * TRAZAS DE LA PLACA BASE — el suelo sobre el que esta montada la maquina.
 *
 * Recorridos con un QUIEBRO, como en una placa real: nunca una diagonal libre.
 * Es exactamente lo que distingue una placa de un grafico de dispersion, y es
 * gratis — el mismo numero de nodos, colocados con una regla en vez de sin
 * ninguna.
 */
export function arqTrazas(cuantas = 18) {
  return Array.from({ length: cuantas }, (_, i) => {
    const a = (i / cuantas) * Math.PI * 2
    return {
      a,
      r0: 0.3 + semilla(i, 31) * 0.16,
      r1: 0.7 + semilla(i, 37) * 0.28,
      quiebro: 0.5 + semilla(i, 41) * 0.26,
      giro: (semilla(i, 47) - 0.5) * 0.5,
      pad: semilla(i, 43) > 0.42,
    }
  })
}

/**
 * ESTRUCTURAS SUSPENDIDAS entre dos modulos.
 *
 * Sin ellas el hueco entre anillos queda vacio y la maquina se lee como cinco
 * piezas sueltas apiladas. Son diminutas a proposito: su funcion es aportar
 * sensacion mecanica, no competir con los subsistemas.
 */
export function arqInterludio(i: number) {
  const a = ARQ_ESTRATOS[i]!
  const b = ARQ_ESTRATOS[i + 1]!
  const y = (arqTapaY(a) + b.y) / 2
  return Array.from({ length: 4 }, (_, k) => {
    const lado = k % 2 === 0 ? -1 : 1
    return {
      x: ARQ_EJE_X + lado * (7 + semilla(k, i + 53) * 7),
      y: y + (semilla(k, i + 59) - 0.5) * 4,
      w: 1.5 + semilla(k, i + 61) * 1.3,
      h: 0.85 + semilla(k, i + 67) * 0.6,
      color: k % 2 === 0 ? a.color : b.color,
      retardo: desfase(k, 4, b.latido),
    }
  })
}

/* ── geometria propia de cada subsistema ─────────────────────────────────── */

/**
 * EL ARCO FRONTAL — donde puede vivir la maquinaria.
 *
 * MEDIDO, no elegido: con la maquinaria repartida por todo el anillo, la placa
 * del rotulo tapaba 11 de las 16 piezas de APLICACIONES y 8 de las 19 de
 * INFRAESTRUCTURA — varias al 100 %, o sea invisibles. En los anillos pequenos
 * la placa ocupa el 80 % del ancho, asi que no era un problema de colocacion
 * fina: la mitad de atras del anillo NO es sitio utilizable.
 *
 * Con este rango el seno nunca baja de 0,685, lo que garantiza que la base de
 * cualquier pieza cae al menos 3,4 unidades por delante del centro y su parte
 * alta queda por debajo del borde inferior de la placa. Es una cota
 * aritmetica, no un «se ve bien»: si manana crece la placa o una pieza, la
 * cuenta se rehace y no hay que volver a mirar cinco capturas.
 */
export const ARQ_ARCO_0 = 0.24 * Math.PI
export const ARQ_ARCO_1 = 0.76 * Math.PI
/** Radio al que se apoya la maquinaria: casi el borde, para dejar libre el centro. */
export const ARQ_RADIO_MAQ = 0.92

/**
 * ESCALA DE LA MAQUINARIA — proporcional al anillo que la sostiene.
 *
 * Una plataforma mas pequena no aloja piezas del mismo tamano; ademas de ser
 * cierto en perspectiva, es lo que impide que las piezas de APLICACIONES
 * —el anillo mas estrecho— desborden su propia superficie.
 */
export function arqEscalaMaq(rx: number): number {
  return arqRy(rx) / arqRy(ARQ_ESTRATOS[0]!.rx)
}

function repartir(i: number, n: number): number {
  return ARQ_ARCO_0 + (i / (n - 1)) * (ARQ_ARCO_1 - ARQ_ARCO_0)
}

/** BACKEND — cubos de servicio sobre un rail, en el arco frontal. */
export function arqServicios(cuantos = 6) {
  return Array.from({ length: cuantos }, (_, i) => ({
    a: repartir(i, cuantos),
    escala: 0.85 + semilla(i, 71) * 0.45,
    retardo: (i / cuantos) * ARQ_ESTRATOS[0]!.latido,
  }))
}

/** INFRAESTRUCTURA — mini racks, y las DOS rutas que prueban la redundancia. */
export function arqRacks(cuantos = 4) {
  return Array.from({ length: cuantos }, (_, i) => ({
    a: repartir(i, cuantos),
    alturas: [0.7, 1, 0.85].map((v, k) => v * (0.8 + semilla(i * 3 + k, 73) * 0.4)),
  }))
}

/** IA — nodos con sus conexiones. No un cerebro: un mapa de inferencia. */
export function arqNodosIa(cuantos = 9) {
  const nodos = Array.from({ length: cuantos }, (_, i) => ({
    a: ARQ_ARCO_0 + semilla(i, 79) * (ARQ_ARCO_1 - ARQ_ARCO_0),
    r: 0.45 + semilla(i, 83) * 0.5,
    vivo: semilla(i, 89) > 0.5,
    retardo: desfase(i, cuantos, ARQ_ESTRATOS[2]!.latido),
  }))
  /*
   * Cada nodo se enlaza con el siguiente y algunos con uno lejano. Un grafo
   * COMPLETO de 9 nodos son 36 aristas y se lee como una mancha; con 12 se lee
   * como una red. La legibilidad aqui no es un recorte, es el objetivo.
   */
  const enlaces: (readonly [number, number])[] = nodos.map((_, i) => [i, (i + 1) % cuantos] as const)
  for (let i = 0; i < cuantos; i += 3) enlaces.push([i, (i + 4) % cuantos] as const)
  return { nodos, enlaces }
}

/** BLOCKCHAIN — bloques encadenados sobre el anillo y sus nodos de consenso. */
export function arqBloques(cuantos = 5) {
  return Array.from({ length: cuantos }, (_, i) => ({
    a: repartir(i, cuantos),
    consenso: i % 2 === 0,
    retardo: desfase(i, cuantos, ARQ_ESTRATOS[3]!.latido),
  }))
}

/** APLICACIONES — paneles de interfaz apoyados en la superficie. */
export function arqPaneles(cuantos = 4) {
  return Array.from({ length: cuantos }, (_, i) => ({
    a: repartir(i, cuantos),
    w: 4.6 + semilla(i, 97) * 1.6,
    h: 3.1 + semilla(i, 101) * 0.9,
    barras: [0.4, 0.75, 0.55].map((v, k) => v * (0.7 + semilla(i * 3 + k, 103) * 0.6)),
    retardo: desfase(i, cuantos, ARQ_ESTRATOS[4]!.latido),
  }))
}

/**
 * MODULOS FLOTANTES — dashboard, movil y wallet, junto a APLICACIONES.
 *
 * VAN A LA IZQUIERDA, y no es indiferente: a la derecha viven las lecturas, y
 * dos sistemas de anotacion en el mismo lado se pisan. A la izquierda ocupan el
 * hueco que separa la maquina de la columna de texto — hueco que ya se midio
 * contra el texto PINTADO, no contra la caja de la columna.
 */
export const ARQ_HUDS = [
  { id: 'panel', x: 36, y: 14, w: 20, h: 13, retardo: 0, deriva: 1 },
  { id: 'movil', x: 42, y: 29, w: 8.5, h: 13, retardo: 0.18, deriva: -1 },
  { id: 'wallet', x: 34, y: 44, w: 15, h: 8.5, retardo: 0.36, deriva: 1 },
] as const

/*
 * Las tres cajas se comprobaron contra el borde IZQUIERDO de cada anillo, que
 * es el unico sitio donde podian chocar: el anillo de IA empieza en x=56 a la
 * altura de la tarjeta wallet, y el de blockchain en x=59 a la del movil. Con
 * 34..49 y 42..50,5 quedan 5 y 8,5 unidades libres. La comprobacion es
 * aritmetica y no visual a proposito — «parece que no se tocan» ya me fallo.
 */

/** Piso de circuito. Ancla la maquina: sin el, la maquina flota en la nada. */
export const ARQ_SUELO = { y: 92, rx: 50, ry: 7.4 } as const
