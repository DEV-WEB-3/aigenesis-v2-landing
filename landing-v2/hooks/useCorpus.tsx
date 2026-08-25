'use client'

import { type ReactNode, useCallback } from 'react'
import { useIdioma } from '@/context/IdiomaContext'

/**
 * EL CONTENIDO DEL ASISTENTE, EN EL IDIOMA DE QUIEN LEE.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * EL PROBLEMA QUE ARREGLA
 * ═══════════════════════════════════════════════════════════════════════════
 * Hasta ahora sólo se traducía el CHROME —los botones, los rótulos, las
 * pestañas— y el corpus iba marcado con `lang="es"` a fuego. El resultado:
 * cambiabas la web a croata y el asistente cambiaba «Ayuda» por «Pomoć», pero
 * las 99 preguntas y sus respuestas seguían en español. Cambiaba el marco y no
 * el cuadro.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * POR QUÉ NO SE TRADUCE EN CALIENTE CON EL MODELO
 * ═══════════════════════════════════════════════════════════════════════════
 * Sería lo elegante: una fuente en español y el modelo rindiéndola en cada
 * idioma. No se puede, y está medido: `g1.aigenesis.io` es una EXPORTACIÓN
 * ESTÁTICA sobre Hostinger. No hay servidor — `/api/asistente` responde 404
 * ahí. Cualquier traducción tiene que estar horneada antes de subir.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * LA CLAVE ES EL ESPAÑOL, Y ESO HACE IMPOSIBLE LA REGRESIÓN SILENCIOSA
 * ═══════════════════════════════════════════════════════════════════════════
 * Se reutiliza el diccionario que ya usa el resto del sitio, donde la clave es
 * literalmente el texto en español. Eso tiene una consecuencia que vale más que
 * la comodidad: el día que alguien corrija una respuesta en español, la clave
 * cambia y la traducción vieja DEJA DE APLICARSE — se vuelve a ver el español,
 * que es correcto aunque no esté traducido. Nunca se queda una traducción
 * desactualizada diciendo algo que el original ya no dice. En un corpus que
 * habla de dinero, esa propiedad no es un detalle.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * POR QUÉ DEVUELVE TAMBIÉN EL IDIOMA
 * ═══════════════════════════════════════════════════════════════════════════
 * Mientras el corpus no esté traducido entero, habrá textos que salgan en
 * español dentro de una interfaz en otro idioma. Eso hay que DECLARARLO: un
 * lector de pantalla configurado en árabe que se encuentra un párrafo español
 * sin marcar lo pronuncia con la fonética árabe y no se entiende nada. Y un
 * navegador que ofrece traducir la página necesita saber qué trozo está en qué
 * idioma.
 *
 * Marcarlo todo como `es` a fuego —lo de antes— miente en cuanto hay
 * traducción. Marcarlo todo con el idioma de la interfaz miente en cuanto no la
 * hay. La única forma honesta es preguntar por cada texto, y eso es lo que hace
 * esta función.
 */
export interface TextoDelCorpus {
  texto: string
  /** El idioma REAL del texto devuelto, para el atributo `lang`. */
  lang: string
  /** Si es el español de origen por no haber traducción todavía. */
  sinTraducir: boolean
}

/**
 * TITULARES PARTIDOS POR MARKUP — el error de i18n más caro y más fácil de
 * cometer.
 *
 * El titular del hero es «Tu comunidad, / con herramientas reales.», y la
 * segunda mitad va dentro de un `<span>` con degradado. La tentación es guardar
 * dos claves, una por trozo. No funciona: en alemán, en árabe o en ruso el orden
 * de los sintagmas cambia, y lo que en español va al final puede ir al principio.
 * Con dos claves el degradado acaba pintando la palabra equivocada, o la frase
 * queda del revés.
 *
 * La solución es guardar la frase ENTERA como una clave y dejar que sea la
 * TRADUCCIÓN la que diga dónde parte, con una barra. Así cada idioma decide su
 * propio corte, que es la única forma de que la decisión la tome quien conoce el
 * idioma y no quien escribió el componente.
 */
export const partir = (texto: string): [string, string] => {
  const i = texto.indexOf('|')
  return i < 0 ? [texto, ''] : [texto.slice(0, i).trim(), texto.slice(i + 1).trim()]
}

/**
 * Pega «AiG Token» con un espacio duro para que no se parta al final de línea.
 *
 * Se hace AQUÍ y no en la clave del diccionario a propósito: un espacio duro es
 * invisible al leer el código y quien escriba la traducción pondría uno normal
 * sin darse cuenta, con lo que la clave no encajaría y la traducción no se
 * aplicaría. Una clave tiene que poder teclearse.
 */
export const pegarMarca = (s: string): string => s.replace(/AiG Token/g, 'AiG Token')

/**
 * ÉNFASIS DENTRO DE UNA FRASE — el segundo modo de romper una traducción.
 *
 * El párrafo de «Qué es G1» lleva cinco `<b>` intercalados entre el texto. Si se
 * trocea en seis claves para respetar ese markup, la traducción pierde la frase:
 * nadie puede traducir «se encuentra con» sin ver el resto, y el orden de las
 * palabras destacadas cambia según el idioma.
 *
 * Se guarda la frase ENTERA con las partes destacadas entre `**`, como en
 * Markdown, y se convierte aquí. Quien traduce ve una frase completa y decide
 * qué palabras destaca en SU idioma — que puede que no sean las mismas.
 */
export function conEnfasis(texto: string): ReactNode[] {
  return texto.split(/(\*\*[^*]+\*\*)/g).map((trozo, i) =>
    trozo.startsWith('**') && trozo.endsWith('**') ? (
      <b key={i} className="text-genesis-text">
        {trozo.slice(2, -2)}
      </b>
    ) : (
      trozo
    )
  )
}

export function useCorpus(): (es: string) => TextoDelCorpus {
  const { t, idioma } = useIdioma()
  return useCallback(
    (es: string) => {
      const texto = t(es)
      /*
       * `t` devuelve la clave —el español— cuando no encuentra traducción. Así
       * que «el resultado es idéntico a la clave» significa una de dos cosas: no
       * hay traducción, o el idioma activo ES el español. Las dos se resuelven
       * igual: el texto está en español y así se declara.
       */
      const sinTraducir = idioma !== 'es' && texto === es
      return { texto, lang: sinTraducir ? 'es' : idioma, sinTraducir }
    },
    [t, idioma]
  )
}
