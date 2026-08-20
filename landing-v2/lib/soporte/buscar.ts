import type { Pregunta, Proyecto } from './tipos'
import { PREGUNTAS_GENESIS } from './preguntas-genesis'
import { PREGUNTAS_GEVY } from './preguntas-gevy'
import { PREGUNTAS_GPULSE } from './preguntas-gpulse'

/**
 * EL BUSCADOR DE SOPORTE.
 *
 * Alimenta las tres superficies —la página de preguntas, el buscador y el
 * asistente— desde un solo juego de datos, para que no puedan divergir.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * LA DECISIÓN DE DISEÑO QUE IMPORTA: ESTE BUSCADOR PREFIERE NO CONTESTAR.
 *
 * Un buscador normal siempre devuelve algo: ordena por parecido y enseña lo
 * mejor que encontró. Aquí eso es peligroso. Si alguien escribe «me cobraron
 * dos veces» y le devolvemos, por parecido de palabras, la respuesta sobre
 * las formas de pago, esa persona se va convencida de que le contestamos.
 *
 * Sobre un producto donde la gente pone dinero, una respuesta plausible pero
 * equivocada es peor que un «no lo sé». Así que hay UMBRAL: por debajo de él
 * no se devuelve nada y quien pregunta pasa a un humano. Es la misma regla
 * que rige el resto del material — el hueco declarado vence a la respuesta
 * verosímil.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const TODAS_LAS_PREGUNTAS: readonly Pregunta[] = [
  ...PREGUNTAS_GENESIS,
  ...PREGUNTAS_GEVY,
  ...PREGUNTAS_GPULSE,
]

/**
 * Se normaliza sin acentos y sin signos, porque nadie escribe con tildes
 * cuando tiene un problema — y menos desde el móvil. Es la misma lección que
 * dejó escapar un término vetado escrito sin tilde en la guarda de lenguaje:
 * comprobar sólo la ortografía cuidada es no comprobar el caso que llega.
 */
export function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9%\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Palabras que aparecen en casi toda pregunta y no distinguen nada. Sin esta
 * lista, «cómo puedo entrar» y «cómo puedo pagar» se parecen entre sí por
 * culpa de «como» y «puedo», que es exactamente el falso parecido que el
 * umbral tiene que evitar.
 */
const VACIAS = new Set([
  'que', 'como', 'donde', 'cuando', 'porque', 'por', 'para', 'con', 'sin',
  'del', 'las', 'los', 'una', 'uno', 'mi', 'me', 'te', 'se', 'lo', 'la', 'el',
  'de', 'en', 'y', 'o', 'a', 'es', 'esta', 'estoy', 'tengo', 'puedo', 'hacer',
  'hola', 'buenas', 'buenos', 'dias', 'tardes', 'noches', 'favor', 'ayuda',
  'gracias', 'pues', 'aun', 'mas', 'muy', 'tambien', 'sobre',
  /*
   * VERBOS DE INTENCIÓN — y aquí está la lección que dejó una prueba real.
   *
   * «Necesito ayuda pues no puedo ingresar… no reconoce mi password» seguía
   * devolviendo la respuesta del hold DESPUÉS de añadir el peso por rareza.
   * El motivo es sutil: «necesito» aparecía en un único sinónimo de toda la
   * base, así que para el cálculo de rareza era una palabra valiosísima.
   *
   * Y es al revés. La rareza mide MI colección, no el idioma de quien
   * escribe. Un verbo con el que empieza medio canal de soporte no distingue
   * nada por muy poco que yo lo haya escrito. Estas palabras se descartan a
   * mano porque ninguna estadística sobre catorce fichas las va a detectar.
   */
  'necesito', 'quiero', 'quisiera', 'saber', 'ayudenme', 'alguien', 'gente',
])

function terminos(texto: string): string[] {
  return normalizar(texto)
    .split(' ')
    .filter((t) => t.length > 2 && !VACIAS.has(t))
}

/**
 * PUNTUACIÓN. Los pesos no son arbitrarios y conviene justificarlos:
 *
 *  · Un acierto en `sinonimos` vale MÁS que uno en la pregunta oficial,
 *    porque los sinónimos son literalmente las palabras que la gente teclea.
 *    Quien escribe «frozen» debe llegar a la respuesta del hold aunque esa
 *    palabra no aparezca en ninguna pregunta redactada por nosotros.
 *  · La respuesta puntúa poco: contiene mucho texto y generaría parecidos
 *    accidentales, que es justo lo que el umbral existe para frenar.
 */
const PESO = { sinonimo: 5, pregunta: 3, categoria: 1, respuesta: 1 }

/**
 * CUÁNTO DISTINGUE CADA PALABRA. Sin esto el buscador se equivoca feo, y lo
 * comprobé con una pregunta real del canal:
 *
 *   «Necesito ayuda pues no puedo ingresar a la plataforma de AIG ya que no
 *    reconoce mi password»
 *
 * devolvía «dónde consigo AIG para cubrir el hold». El motivo: «necesito» y
 * «aig» aparecen por toda la base y sumaban lo mismo que «password», que es
 * la única palabra que de verdad señala una respuesta. Dos aciertos vacíos
 * ganaban a un acierto exacto.
 *
 * La corrección es la de siempre en un buscador: una palabra vale por lo raro
 * que sea encontrarla. Si aparece en casi todas las fichas no distingue nada
 * y se le baja el peso; si aparece en una sola, es oro. Arregla la clase
 * entera en vez del caso que la destapó — «aig» sigue contando cuando de
 * verdad discrimina, y deja de mandar cuando no.
 */
const RAREZA = (() => {
  const documentos = TODAS_LAS_PREGUNTAS.map((p) =>
    new Set(terminos([p.pregunta, (p.sinonimos ?? []).join(' '), p.categoria, p.respuesta].join(' ')))
  )
  const frecuencia = new Map<string, number>()
  for (const doc of documentos) {
    doc.forEach((t) => frecuencia.set(t, (frecuencia.get(t) ?? 0) + 1))
  }
  const total = documentos.length
  return (termino: string): number => {
    const df = frecuencia.get(termino) ?? 0
    if (df === 0) return 1
    /* Suelo de 0.15: una palabra muy común pesa poco, pero nunca cero — si
       la consulta entera es de palabras comunes, algo hay que puntuar. */
    return Math.max(0.15, Math.log(total / df) / Math.log(total))
  }
})()

/**
 * UMBRAL. Un solo acierto flojo —una palabra suelta dentro de una respuesta
 * larga— no basta para afirmar que hemos entendido la pregunta.
 */
export const UMBRAL_DE_CONFIANZA = 3

export interface Resultado {
  pregunta: Pregunta
  puntos: number
}

export function buscar(
  consulta: string,
  opciones: { proyecto?: Proyecto; limite?: number } = {}
): Resultado[] {
  const busca = terminos(consulta)
  if (busca.length === 0) return []

  const candidatas = opciones.proyecto
    ? TODAS_LAS_PREGUNTAS.filter(
        (p) => p.proyecto === opciones.proyecto || p.proyecto === 'ecosistema'
      )
    : TODAS_LAS_PREGUNTAS

  const resultados: Resultado[] = []
  for (const pregunta of candidatas) {
    const campos = [
      { texto: (pregunta.sinonimos ?? []).join(' '), peso: PESO.sinonimo },
      { texto: pregunta.pregunta, peso: PESO.pregunta },
      { texto: pregunta.categoria, peso: PESO.categoria },
      { texto: pregunta.respuesta, peso: PESO.respuesta },
    ]
    let puntos = 0
    const acertados = new Set<string>()
    for (const { texto, peso } of campos) {
      const normalizado = ` ${normalizar(texto)} `
      for (const t of busca) {
        /* Se exige límite de palabra a la izquierda: sin eso, «aig» acierta
           dentro de «vigilar» y el parecido se infla con ruido. */
        if (normalizado.includes(` ${t}`)) {
          puntos += peso * RAREZA(t)
          acertados.add(t)
        }
      }
    }

    /*
     * COBERTURA DE LA CONSULTA — la segunda guarda contra responder de más, y
     * salió de un caso real de la prueba.
     *
     * «a que hora es la reunion de hoy con el equipo» devolvía la respuesta
     * sobre cuánto tarda un reclamo, porque «hora» encajaba dentro de «72
     * horas». Una sola palabra de cuatro, y con eso se daba por entendida la
     * pregunta.
     *
     * La regla: si alguien escribe varias palabras con contenido y sólo UNA
     * encaja, no hemos entendido nada — hemos encontrado una coincidencia.
     * Se exigen dos.
     *
     * La excepción está pensada, no es un parche: cuando la consulta ENTERA
     * es una palabra —«frozen», «congelado», «hold»— pedir dos aciertos sería
     * imposible de cumplir, y esas búsquedas de una palabra son de las más
     * frecuentes en soporte.
     */
    const coberturaSuficiente = busca.length === 1 || acertados.size >= 2
    if (puntos > 0 && coberturaSuficiente) resultados.push({ pregunta, puntos })
  }

  return resultados
    .sort((a, b) => b.puntos - a.puntos)
    .slice(0, opciones.limite ?? 5)
}

/**
 * LO QUE USA EL ASISTENTE. Devuelve una respuesta sólo cuando hay confianza
 * suficiente; si no, dice que no lo sabe y deriva.
 *
 * El `derivar` no es un fallo del sistema: es una salida legítima y la única
 * honesta cuando no se ha entendido la pregunta.
 */
export type Respuesta =
  | { tipo: 'respuesta'; pregunta: Pregunta; relacionadas: readonly Pregunta[] }
  | { tipo: 'derivar'; motivo: string; sugerencias: readonly Pregunta[] }

export function responder(consulta: string, proyecto?: Proyecto): Respuesta {
  const encontrados = buscar(consulta, { proyecto, limite: 4 })
  const mejor = encontrados[0]

  if (!mejor || mejor.puntos < UMBRAL_DE_CONFIANZA) {
    return {
      tipo: 'derivar',
      motivo:
        'No he entendido la pregunta lo bastante bien como para responderla con seguridad. Prefiero pasarte con alguien del equipo antes que darte algo que suene bien y esté mal.',
      sugerencias: encontrados.map((r) => r.pregunta),
    }
  }

  /*
   * Una respuesta marcada `porDefinir` NO se entrega como si fuera firme,
   * aunque haya coincidido de lleno: está redactada precisamente para
   * derivar, y su texto ya lo dice. Se acompaña del motivo para que la
   * persona entienda que no es que no la hayamos encontrado.
   */
  if (mejor.pregunta.fuente === 'porDefinir') {
    return {
      tipo: 'derivar',
      motivo: mejor.pregunta.respuesta,
      sugerencias: encontrados.slice(1).map((r) => r.pregunta),
    }
  }

  /*
   * LAS RELACIONADAS TAMBIÉN TIENEN QUE GANARSE EL SITIO, y esto salió de
   * probar el asistente de punta a punta.
   *
   * A una respuesta correcta sobre el mínimo para reclamar le colgaba, como
   * «también suele preguntarse», una pregunta de la TIENDA sobre pagar con
   * AIG. Coincidían dos palabras y con eso entraba.
   *
   * Una sugerencia que no viene a cuento no es ruido inofensivo: le resta
   * credibilidad a la respuesta buena que va justo encima. La persona piensa
   * que el sistema no la ha entendido, y deja de fiarse de lo que acaba de
   * leer. Así que se exigen dos cosas: superar el umbral por sí misma, y
   * estar cerca de la que ganó — la mitad de su puntuación.
   */
  const relacionadas = encontrados
    .slice(1)
    .filter((r) => r.puntos >= UMBRAL_DE_CONFIANZA && r.puntos >= mejor.puntos * 0.5)
    /*
     * Y ADEMÁS TIENEN QUE SER DEL MISMO PRODUCTO.
     *
     * Filtrar sólo por puntuación no bastó: a la respuesta sobre el mínimo
     * para reclamar le seguía colgando una pregunta de la TIENDA sobre pagar
     * con AIG, porque compartían «usdt» y «deja» y empataban de puntos.
     *
     * El fallo no era de puntuación, era de categoría: quien pregunta por su
     * reclamo en Genesis no está preguntando por la caja de la tienda.
     * Parecerse en dos palabras no las hace hermanas. Se exige que la
     * sugerencia pertenezca al mismo producto que la respuesta que ganó.
     */
    .filter((r) => r.pregunta.proyecto === mejor.pregunta.proyecto)
    .map((r) => r.pregunta)

  return { tipo: 'respuesta', pregunta: mejor.pregunta, relacionadas }
}
