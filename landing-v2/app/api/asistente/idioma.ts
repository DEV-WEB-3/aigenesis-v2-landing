import type { Respuesta } from '@/lib/soporte/buscar'
import type { Pregunta } from '@/lib/soporte/tipos'
import { IDIOMAS, type CodigoIdioma } from '@/lib/i18n/idiomas'
import { traducir } from '@/lib/i18n/traducir'
import type { RespuestaHibrida } from './hibrido'

/*
 * ═════════════════════════════════════════════════════════════════════════
 * EL CEREBRO HABLA DOCE IDIOMAS, Y HASTA HOY SÓLO POR UNA PUERTA.
 *
 * El corpus está traducido al 100 % —99 preguntas, 198 campos, doce lenguas—
 * pero la traducción se aplicaba al PINTAR: el componente de la página pasa la
 * respuesta por `t()`. Este endpoint devolvía el español crudo, y el portal,
 * que consume por HTTP y no tiene diccionario, lo enseñaba tal cual.
 *
 * O sea: el asistente estaba traducido y contestaba en español a todo el que
 * entraba por la otra puerta. No fallaba nada; simplemente nadie lo veía,
 * porque la superficie que sí traduce es la que se revisa.
 *
 * Ahora el endpoint acepta `idioma` y traduce ANTES de responder. La página no
 * cambia —sigue pidiendo en español y traduciendo al pintar, y traducir dos
 * veces es idempotente porque la clave es el propio español—.
 *
 * LA RESPUESTA DECLARA EN QUÉ IDIOMA VA. No es adorno: la rama híbrida la
 * redacta un modelo en tiempo real, no está en el diccionario y viaja en
 * español pase lo que pase. Devolver `idioma: 'es'` ahí deja que el cliente lo
 * sepa en vez de suponer que lo tradujo. Una respuesta que miente sobre su
 * propio idioma es peor que una sin traducir.
 * ═════════════════════════════════════════════════════════════════════════
 */
export const IDIOMAS_VALIDOS: ReadonlySet<string> = new Set(IDIOMAS.map((i) => i.codigo))

/** Traduce los campos VISIBLES de una pregunta. El `id` y el `proyecto` no se tocan:
    son identificadores, y traducir un identificador rompe el enlace. */
export function preguntaEn(p: Pregunta, idioma: CodigoIdioma): Pregunta {
  return {
    ...p,
    categoria: traducir(p.categoria, idioma),
    pregunta: traducir(p.pregunta, idioma),
    respuesta: traducir(p.respuesta, idioma),
  }
}

export function respuestaEn(r: Respuesta | RespuestaHibrida, idioma: CodigoIdioma) {
  if (idioma === 'es') return { ...r, idioma: 'es' as const }
  switch (r.tipo) {
    case 'respuesta':
      return {
        ...r,
        pregunta: preguntaEn(r.pregunta, idioma),
        relacionadas: r.relacionadas.map((p) => preguntaEn(p, idioma)),
        idioma,
      }
    case 'derivar':
      return {
        ...r,
        motivo: traducir(r.motivo, idioma),
        sugerencias: r.sugerencias.map((p) => preguntaEn(p, idioma)),
        idioma,
      }
    case 'cortesia':
      return { ...r, mensaje: traducir(r.mensaje, idioma), idioma }
    default:
      /* La híbrida la escribe un modelo: no hay fila que buscar. Va en español
         y lo dice, que es la única forma honesta de entregarla. */
      return { ...r, idioma: 'es' as const }
  }
}
