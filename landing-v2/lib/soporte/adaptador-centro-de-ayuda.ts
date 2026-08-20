import { responder } from './buscar'
import { RESTRICCIONES, PLAZO_DE_UN_RECLAMO, RECLAMO_MINIMO } from './restricciones'
import { DATOS_MINIMOS_DE_UN_CASO } from './flujos-de-dinero'
import type { Proyecto } from './tipos'

/**
 * ADAPTADOR AL CENTRO DE AYUDA DEL PORTAL.
 *
 * ═════════════════════════════════════════════════════════════════════════
 * QUÉ HACE Y POR QUÉ EXISTE.
 *
 * La pantalla `/dashboard/support` ya está construida, y su arquitectura
 * resultó ser la correcta: el motor de respuestas está indexado por TIPO DE
 * INCIDENCIA, y cada tipo trae secuencia de respuestas, lista de comprobación
 * y rúbrica. Lo que tiene dentro hoy son datos de ejemplo.
 *
 * Este archivo es el enchufe: traduce el material verificado de `lib/soporte/`
 * a la forma exacta que esa pantalla espera. No reinventa el modelo de datos
 * —lo respeta— para que cablearlo sea sustituir una fuente, no reescribir una
 * interfaz.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * LA DECISIÓN QUE NO SE NEGOCIA: EL ASISTENTE PUEDE DECIR «NO LO SÉ».
 *
 * `responder()` devuelve `derivar` cuando no entiende la pregunta con
 * suficiente confianza, y ese caso NO se rellena aquí con una respuesta
 * genérica que suene servicial. Se pasa al modo humano.
 *
 * Sobre un producto donde la gente pone dinero, una respuesta plausible y
 * equivocada es peor que un silencio honesto: la persona se va convencida de
 * que le contestamos, actúa sobre eso, y el error se descubre cuando ya movió
 * fondos. Quien vaya a «mejorar» esto bajando el umbral para que conteste
 * siempre, que lea antes esta nota.
 * ═════════════════════════════════════════════════════════════════════════
 */

/** Las cuatro categorías que la pantalla ya tiene. No se inventan otras. */
export type CategoriaTicket = 'retiro' | 'deposito' | 'red' | 'seguridad'

export type PrioridadTicket = 'low' | 'medium' | 'high'

/** La forma del mensaje que la pantalla pinta en el hilo. */
export interface MensajeDelAsistente {
  body: string
  agent: { name: string; level: string }
  /** Si es true, la pantalla debe ofrecer el paso a un humano. */
  derivar: boolean
}

const ASISTENTE = { name: 'Asistente Genesis', level: 'IA' }
const SISTEMA = { name: 'Sistema', level: 'info' }

/**
 * LA RESPUESTA DEL MODO IA.
 *
 * Devuelve siempre algo que se puede pintar, pero marca con `derivar` cuándo
 * ese algo es una derivación en vez de una respuesta. La pantalla decide qué
 * hacer con esa marca; lo que no puede es no enterarse.
 */
export function responderComoAsistente(
  consulta: string,
  proyecto?: Proyecto
): MensajeDelAsistente {
  const r = responder(consulta, proyecto)

  if (r.tipo === 'respuesta') {
    /*
     * Se añaden las relacionadas porque en soporte la segunda pregunta casi
     * siempre está a la vista: quien pregunta por el hold pregunta después
     * cómo cubrirlo. Ofrecerlas ahorra un turno entero de conversación.
     */
    const relacionadas = r.relacionadas.slice(0, 2).map((p) => `· ${p.pregunta}`)
    const cola = relacionadas.length
      ? `\n\nTambién suele preguntarse:\n${relacionadas.join('\n')}`
      : ''
    return { body: `${r.pregunta.respuesta}${cola}`, agent: ASISTENTE, derivar: false }
  }

  /*
   * DERIVACIÓN. El texto dice POR QUÉ no se responde, y no se disculpa de
   * más: «no te lo puedo confirmar» es información útil; «lo siento mucho,
   * qué faena» no lo es. Y se piden ya los datos del caso, para que el humano
   * no tenga que empezar por ahí.
   */
  const sugerencias = r.sugerencias.slice(0, 3).map((p) => `· ${p.pregunta}`)
  const quizas = sugerencias.length
    ? `\n\n¿Alguna de estas se acerca?\n${sugerencias.join('\n')}`
    : ''
  return {
    body: `${r.motivo}${quizas}\n\nSi prefieres que lo vea una persona, ten a mano:\n${DATOS_MINIMOS_DE_UN_CASO.map(
      (d) => `· ${d}`
    ).join('\n')}`,
    agent: SISTEMA,
    derivar: true,
  }
}

/**
 * LA LISTA DE COMPROBACIÓN POR CATEGORÍA.
 *
 * La pantalla ya tiene un `checklist` persistente por ticket. Esto lo llena
 * con lo que de verdad hay que verificar en cada tipo de caso, en vez de con
 * los dos ejemplos de relleno que trae hoy.
 *
 * El orden importa: primero lo que descarta el caso entero (¿está dentro del
 * plazo? ¿supera el mínimo?), después lo que lo reconstruye. Empezar pidiendo
 * el hash de algo que aún no ha tenido tiempo de llegar hace perder el turno
 * a los dos lados.
 */
export function listaDeComprobacion(categoria: CategoriaTicket): readonly string[] {
  const comunes = DATOS_MINIMOS_DE_UN_CASO

  switch (categoria) {
    case 'retiro':
      return [
        `¿Han pasado más de 72 horas? Antes de ese plazo NO es un caso: ${PLAZO_DE_UN_RECLAMO.porQue}`,
        `¿Superaba el mínimo de ${RECLAMO_MINIMO.minimoUsdt} USDT? Por debajo, el reclamo no se ejecuta y no es una avería.`,
        '¿Esperaba USDT? El reclamo convierte a AIG: comprobar que el malentendido no es ése.',
        '¿Su holding cubría el mínimo en el momento de reclamar?',
        ...comunes,
      ]
    case 'deposito':
      return [
        '¿La transferencia salió de verdad? Pedir el hash antes que nada.',
        '¿Red correcta? Un envío desde otra cadena no se recupera.',
        '¿Ha repetido el envío? Cambia por completo lo que hay que buscar.',
        ...comunes,
      ]
    case 'red':
      return [
        '¿Está mirando el arrastre del 50% o los puntos nuevos? Son columnas distintas.',
        '¿Tiene volumen en las DOS piernas? Sin lado menor no hay emparejamiento.',
        '¿Repartió los dos enlaces de referido o siempre el mismo?',
        ...comunes,
      ]
    case 'seguridad':
      return [
        'NO pedir nunca contraseña ni frase de recuperación — y avisar de que nadie del equipo las pide.',
        '¿Le han contactado por un canal no oficial?',
        '¿Pide cambio de wallet? La wallet no se cambia: no prometerlo.',
        ...comunes,
      ]
  }
}

/**
 * SUGERENCIAS RÁPIDAS de la pantalla. Hoy trae tres de ejemplo; éstas salen
 * de lo que la gente pregunta de verdad, medido sobre 789 mensajes de los
 * canales reales.
 */
export const SUGERENCIAS_RAPIDAS: readonly string[] = [
  'Mi cuenta está congelada',
  'Reclamé y no me ha llegado',
  'No me cuadra el saldo con MetaMask',
  'No puedo entrar',
  '¿Desde cuánto puedo reclamar?',
]

/**
 * TRIAJE: qué restricciones puede resolver la propia persona.
 *
 * Se expone para que la pantalla pueda enseñarlo ANTES de abrir el ticket.
 * Cinco de las siete causas de «no puedo reclamar» las resuelve el usuario
 * solo, y la más frecuente —el holding— se reactiva automáticamente. Un
 * ticket abierto para eso es tiempo perdido en los dos lados.
 */
export const AUTORRESOLUBLES = RESTRICCIONES.filter((r) => !r.necesitaSoporte)
export const NECESITAN_HUMANO = RESTRICCIONES.filter((r) => r.necesitaSoporte)

/**
 * EL AVISO QUE NO HAY QUE BORRAR TODAVÍA.
 *
 * La pantalla dice hoy que la integración con backoffice no existe. Mientras
 * sea verdad, tiene que seguir diciéndolo: quitarlo antes de tiempo convierte
 * una limitación declarada en una promesa rota.
 */
export const AVISO_MIENTRAS_NO_HAYA_BACKOFFICE =
  'Este asistente responde con el material verificado del ecosistema. Para gestiones que requieran revisar tu cuenta, usa los canales oficiales del proyecto — la integración de tickets todavía no está disponible.'
