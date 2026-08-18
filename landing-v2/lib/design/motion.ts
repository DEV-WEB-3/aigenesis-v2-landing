/**
 * REJILLA DE MOVIMIENTO — el unico origen de tempo del portal.
 *
 * Antes de este archivo, cada seccion declaraba sus propios tiempos a mano:
 * 2 · 3,6 · 4 · 4 · 4 · 4 · 4,2 · 5 · 5 segundos. Nueve valores que no
 * responden a nada, y tres secciones —mining, booster, token— sin tiempo de
 * llegada declarado en absoluto.
 *
 * Peor: habia DOS sistemas paralelos. Los layouts declaraban `*_PULSE_S` y las
 * aura configs `PULSE_DURATION_S`, y en dos secciones NO COINCIDIAN:
 * marketplace latia a 3,6 en la red y 4 en el resplandor detras; portal a 4 y
 * 6. Dos capas superpuestas de la misma seccion respirando a ritmos distintos
 * se desincronizan y vuelven a coincidir cada 36 segundos.
 *
 * La regla que sustituye a todo eso:
 *
 *   el tempo NO se elige por seccion — se DERIVA del gesto que hace.
 *
 * Un gesto rapido llega rapido. Deja de ser una decision de doce y pasa a ser
 * una consecuencia de seis. Y si alguien anade una seccion, no puede inventar
 * un tempo: tiene que decir que movimiento hace, y el tempo sale de ahi.
 */

import type { SectionId } from '@/lib/routes'

/**
 * Los seis gestos. Vocabulario CERRADO a proposito.
 *
 * Cada uno se usa al menos dos veces. Un gesto usado una sola vez vuelve a ser
 * una excepcion, que es exactamente lo que este archivo existe para eliminar.
 */
export type Movimiento =
  /** Hacia dentro, hasta cerrarse. Custodia y prueba. */
  | 'condensar'
  /** Uno se convierte en muchos, ordenadamente. Apertura. */
  | 'diferenciar'
  /** Alrededor, sin acercarse ni alejarse. Valor que circula. */
  | 'orbitar'
  /** Hacia fuera, rapido, perdiendose. Extraccion y alcance. */
  | 'dispersar'
  /** Muchos independientes se reconocen como uno. Inteligencia. */
  | 'converger'
  /** Direccion lineal, sin volver. Aceleracion y tiempo. */
  | 'avanzar'
  /** Solo el hero: la materia todavia no se ha diferenciado. */
  | 'origen'

/**
 * PULSO — cada cuanto respira la seccion.
 *
 * Tres valores en proporcion 1 : 2 : 4. Que sean multiplos exactos importa:
 * dos secciones adyacentes con pulsos de 2 y 4 coinciden cada dos ciclos, y eso
 * se percibe como una misma respiracion a distinta velocidad. Con 3,6 y 4 —lo
 * que habia— coinciden cada 36 segundos y se percibe como deriva.
 */
export const PULSO_S: Record<Movimiento, number> = {
  // rapidos: extraer y senalar son actos instantaneos
  dispersar: 2,
  avanzar: 2,
  // base: la circulacion y la apertura son el estado neutro del portal
  orbitar: 4,
  diferenciar: 4,
  // lentos: la custodia es paciente, y reconocerse lleva tiempo
  condensar: 8,
  converger: 8,
  // el hero respira con la base
  origen: 4,
}

/**
 * LLEGADA — cuanto tarda la materia en formar la figura al entrar.
 *
 * Se deriva del mismo gesto que el pulso, en proporcion 2 : 3 : 4. Un gesto
 * rapido que llega despacio se contradice, y esa contradiccion era el estado
 * anterior: gpulse dispersaba en 2 s pero tardaba 1 s en llegar, mientras
 * staking condensaba en 5 s y llegaba en 1,4.
 */
export const LLEGADA_S: Record<Movimiento, number> = {
  dispersar: 0.8,
  avanzar: 0.8,
  orbitar: 1.2,
  diferenciar: 1.2,
  condensar: 1.6,
  converger: 1.6,
  origen: 1.2,
}

/**
 * LLEGADA DE ESTABLECIMIENTO — la excepcion declarada, y la unica.
 *
 * El cine no da la misma duracion a todos los planos. La formacion del logo
 * Genesis desde el polvo estelar al entrar en Trust es un PLANO DE
 * ESTABLECIMIENTO: ocurre una sola vez, viniendo del hero, y es el momento en
 * que el visitante entiende de que esta hecho el portal. Comprimirlo a la
 * llegada rutinaria de 1,6 s lo convertiria en un gesto mas.
 *
 * Vale 4 s, que es exactamente lo que valia antes de existir este archivo. La
 * diferencia es que ya no es un numero arbitrario perdido en TrustShieldMorph:
 * es 2,5 veces la llegada mas lenta de la rejilla, declarado como excepcion y
 * con el motivo escrito. Si manana alguien lo cambia, sabe que esta cambiando
 * el plano de establecimiento y no un detalle.
 */
export const LLEGADA_ESTABLECIMIENTO_S = LLEGADA_S.condensar * 2.5

/**
 * LLEGADA DE PRIMERA PINTURA — la segunda excepcion declarada, y la ultima.
 *
 * La entrada del hero no es una llegada mas: ocurre ANTES que nada, es lo
 * primero que ve alguien que abre la pagina, y compite con la percepcion de
 * velocidad de carga. La llegada mas rapida de la rejilla son 0,8 s, y a 0,8 s
 * el hero se siente lento aunque haya pintado igual de rapido.
 *
 * Valia 0,6 con dos variantes sueltas a 0,55 y 0,5. Es exactamente el rango con
 * el que el LCP bajo de 3,3 s a 1,7 s, asi que el numero se conserva; lo que se
 * quita son las variantes. Como en todas partes: misma duracion, y la
 * separacion por RETARDO, que para eso existe `--hero-entra-retardo`.
 */
export const LLEGADA_PRIMERA_PINTURA_S = 0.6

/**
 * EL GUION — que gesto hace cada seccion.
 *
 * El orden es el de `SECTION_DEFS` sin mover nada, porque el arco narrativo ya
 * estaba en ese orden: una masa unica que se diferencia en funciones y regresa
 * hecha comunidad. Lo que faltaba era que las imagenes lo contaran.
 *
 * `Record<SectionId, Movimiento>` es deliberado: si manana se anade una seccion
 * a SECTION_DEFS y nadie le asigna gesto, esto NO compila. El hueco se
 * convierte en un error de tipos en vez de una seccion que se mueve al azar.
 */
export const MOVIMIENTO_POR_SECCION: Record<SectionId, Movimiento> = {
  // ── ACTO I · el origen. Toda la materia junta.
  /** La esfera contiene Genesis, GPulse y Gevy sin distinguirlos. */
  hero: 'origen',
  /** La masa se compacta en nucleo: el suelo sobre el que se apoya todo. */
  trust: 'condensar',
  /** Primera separacion. El nucleo se abre en las ramas que vienen despues. */
  ecosistema: 'diferenciar',

  // ── ACTO II · las funciones. Nueve estados de la misma materia.
  /** La unidad que circula entre todo lo demas. */
  token: 'orbitar',
  /** Extraccion. El estado mas disperso del recorrido. */
  mining: 'dispersar',
  /** Aceleracion. Lo disperso recibe direccion. */
  booster: 'avanzar',
  /** Retencion. Lo que subio se guarda: entra y se cierra. */
  staking: 'condensar',
  /** Senal. La seccion mas veloz del portal. */
  gpulse: 'dispersar',
  /** Inteligencia. Todo lo disperso vuelve a un centro que lo interpreta. */
  goracle: 'converger',
  /** Intercambio. El valor circula, ahora hacia fuera del ecosistema. */
  marketplace: 'orbitar',
  /** Lo humano. Muchos puntos independientes se reconocen como uno. */
  comunidad: 'converger',
  /** El sustrato. Lo que sostenia todo lo anterior, en capas. */
  technology: 'diferenciar',

  // ── ACTO III · el retorno. La esfera otra vez, con el visitante dentro.
  /**
   * El tiempo. La UNICA seccion lineal del portal, y debe sentirse asi:
   * es la que rompe el ciclo a proposito.
   */
  roadmap: 'avanzar',
  /** La materia regresa al portal del hero. Cierra el circulo. */
  cta: 'condensar',
}

/** Pulso de una seccion, derivado de su gesto. */
export function pulsoDe(seccion: SectionId): number {
  return PULSO_S[MOVIMIENTO_POR_SECCION[seccion]]
}

/**
 * RESPIRACION — cada cuanto late el resplandor de fondo de la seccion.
 *
 * Siempre el DOBLE del pulso. El fondo tiene que ser mas calmado que el
 * contenido: si el resplandor late al mismo ritmo que la figura, compiten; si
 * late a un ritmo cercano pero distinto —lo que habia: 5,5 · 5,2 · 6,2 · 5,4 ·
 * 6,4 contra pulsos de 4— derivan uno contra otro sin volver a coincidir nunca,
 * y eso se percibe como nerviosismo sin poder senalar de donde viene.
 *
 * Esta regla no la invente: la DEDUJE de las dos secciones que ya la cumplian.
 * token late a 4 y respira a 8; gpulse late a 2 y respira a 4. Las otras once
 * tenian numeros arbitrarios. Aciertan dos, asi que el sistema correcto ya
 * estaba en el codigo — solo no estaba escrito.
 */
export function respiracionDe(seccion: SectionId): number {
  return pulsoDe(seccion) * 2
}

/**
 * ARMONICO — un sub-ritmo interno de la seccion.
 *
 * Una seccion puede tener varias capas moviendose a distinta velocidad; lo que
 * no puede es que esas velocidades no guarden relacion. Trust tenia SEIS ciclos
 * sueltos —4 · 3,5 · 2,4 · 3,6 · 4,8 · 2,2— y ninguno era multiplo de otro:
 * seis ritmos independientes latiendo a la vez en la seccion que establece el
 * tono del portal.
 *
 * Con divisiones exactas del pulso, las capas vuelven a coincidir cada ciclo en
 * vez de no coincidir jamas. Es la diferencia entre un acorde y ruido.
 *
 * @param division 1 = al pulso · 2 = al doble de velocidad · 4 = al cuadruple
 */
export function armonico(seccion: SectionId, division: 1 | 2 | 4): number {
  return pulsoDe(seccion) / division
}

/** Tiempo de llegada de una seccion, derivado de su gesto. */
export function llegadaDe(seccion: SectionId): number {
  return LLEGADA_S[MOVIMIENTO_POR_SECCION[seccion]]
}

/**
 * Los valores admitidos, para que el verificador pueda comprobar que nadie
 * declara un tempo fuera de la rejilla. Sin esto, la unificacion se deshace
 * sola: la gramatica anterior YA existia —`_PULSE_S`, `_FORM_S`, `*Position`
 * estaban en las doce— y se degrado a doce copias divergentes precisamente
 * porque nada comprobaba que siguieran de acuerdo.
 */
export const PULSOS_ADMITIDOS = [2, 4, 8] as const
export const LLEGADAS_ADMITIDAS = [0.8, 1.2, 1.6] as const

/**
 * LLEGADA DEL CONTENIDO — el texto, no la figura.
 *
 * `LLEGADA_S` describe cuanto tarda LA MATERIA en formar la figura de la
 * seccion, y por eso se deriva del gesto. El bloque de texto —antetitulo,
 * titular, parrafo, tarjetas, boton— es otra cosa: es el mismo tipo de material
 * en las catorce, asi que entra igual en las catorce. Lo que cambia de una
 * seccion a otra es su VISUAL, y de eso ya se encarga cada `*_FORM_S`.
 *
 * Valia 0,75 en `slideLeft`, 0,65 en `slideLeftCrisp`, 0,65 en `wordV` y 0,7 en
 * las dos variantes propias de ecosistema. Cuatro numeros distintos, ninguno en
 * la rejilla, para el mismo gesto repetido catorce veces — exactamente el
 * desorden que este archivo existe para eliminar, sobreviviendo en la capa de
 * framer-motion.
 *
 * Se toma el escalon MAS RAPIDO de la rejilla porque un bloque de texto que
 * tarda en llegar se siente lento aunque haya pintado a tiempo; es el mismo
 * razonamiento que la excepcion de primera pintura del hero.
 */
export const LLEGADA_CONTENIDO_S = LLEGADAS_ADMITIDAS[0]

/**
 * LLEGADA DE UNA CIFRA — lo que tarda un contador en subir hasta su valor.
 *
 * Es deliberadamente el escalon MAS LENTO: una cifra que sube tiene que poder
 * leerse mientras sube, o el efecto no aporta nada y solo retrasa el dato.
 *
 * Valia 1,8 en dos sitios —`SceneShared` y `EcosystemSection` tienen cada uno
 * su contador, con el mismo numero copiado y distinto retardo—. El retardo
 * puede diferir; la duracion no tenia por que.
 */
export const LLEGADA_CIFRA_S = LLEGADAS_ADMITIDAS[2]

/**
 * PARALAJE — las tres profundidades del fondo.
 *
 * Deliberadamente GLOBAL, no derivado de la seccion. El paralaje describe la
 * PROFUNDIDAD DEL ESPACIO, no el caracter de la seccion: si cada una inventa
 * sus velocidades de fondo, el portal se siente como doce habitaciones. Con las
 * mismas tres en todas, se siente como un solo espacio por el que te mueves.
 *
 * Que sean 1 : 2 : 4 importa para que la separacion se PERCIBA. Mining tenia
 * 14 · 11 · 9 para sus tres capas: la mas lenta era 1,55 veces la mas rapida, y
 * a esa distancia tres capas se leen como una sola algo borrosa. Con 8 · 16 ·
 * 32 hay profundidad de verdad.
 */
export const PARALAJE = {
  /** Lo mas cercano. Se mueve visiblemente. */
  frente: 8,
  medio: 16,
  /** El fondo lejano. Casi imperceptible, y esa es la idea. */
  fondo: 32,
} as const

/**
 * DESFASE — como se desincroniza un grupo de elementos iguales.
 *
 * Nunca cambiando la duracion. Mining daba a cada nodo `4 + (index % 3) * 0,65`
 * —4 · 4,65 · 5,3— para que no latieran a la vez: la intencion es correcta y el
 * metodo hace que los nodos deriven unos de otros para siempre, sin volver a
 * coincidir jamas.
 *
 * Misma duracion y distinto RETARDO consigue lo mismo a la vista, y ademas
 * mantiene el grupo en fase con el resto del portal. Reparte los elementos de
 * forma pareja dentro de un ciclo.
 */
export function desfase(indice: number, total: number, ciclo: number): number {
  return ((indice % total) / total) * ciclo
}
