import type { CodigoIdioma } from '@/lib/i18n/idiomas'
import { DICCIONARIO } from '@/lib/i18n/diccionario'

/**
 * LA BÚSQUEDA EN EL DICCIONARIO, SIN REACT.
 *
 * ── POR QUÉ SE SACÓ DEL CONTEXTO (29-ago-2026) ────────────────────────────
 *
 * Esta lógica vivía sólo dentro de `IdiomaContext`, y por eso el único que
 * sabía traducir era el navegador. Da igual mientras el que pinta sea React;
 * deja de dar igual en cuanto alguien pide texto POR HTTP.
 *
 * Y alguien lo pide: `/api/asistente` es el mismo cerebro para la página y
 * para el portal, y devolvía la respuesta del corpus en español SIEMPRE. En la
 * página no se notaba —el componente la pasa por `t()` al pintarla— y en el
 * portal se veía tal cual. El asistente estaba traducido al 100 % y aun así
 * contestaba en español a quien entraba por la otra puerta.
 *
 * El arreglo no es traducir en el portal: es que el endpoint pueda hacerlo,
 * porque la traducción vive donde vive el corpus. Para eso hace falta una
 * función que no dependa de un hook.
 *
 * ── LO QUE HACE, Y LO QUE NO ──────────────────────────────────────────────
 *
 * SIN TRADUCCIÓN DEVUELVE EL ESPAÑOL, nunca la clave ni un hueco. Es la regla
 * del mecanismo entero: el peor caso es la pantalla de hoy.
 *
 * NO AVISA EN DESARROLLO. Ese aviso es cosa del contexto, que sabe qué está
 * pintando y puede avisar una sola vez por cadena; aquí sería ruido por
 * petición. `IdiomaContext` envuelve esta función y añade el aviso.
 */
export function traducir(es: string, idioma: CodigoIdioma | string): string {
  if (idioma === 'es' || typeof es !== 'string' || !es) return es
  /*
   * SIN LETRAS NO HAY NADA QUE TRADUCIR.
   *
   * Aquí llegan también sufijos y cifras —«%», «+», «24/7», «6+»— porque se
   * traduce el componente y no cada llamada, y el componente no sabe si su
   * `value` es una palabra o un símbolo. Sin esta guarda cada uno pediría una
   * entrada al diccionario y ensuciaría el aviso de desarrollo, que es justo
   * la herramienta que sirve para encontrar lo que SÍ falta.
   */
  if (!/[A-Za-zÀ-ɏЀ-ӿ؀-ۿ]/.test(es)) return es
  const fila = DICCIONARIO[es]
  return fila?.[idioma as Exclude<CodigoIdioma, 'es'>] ?? es
}

/**
 * ¿Existe traducción para esta frase en este idioma?
 *
 * Se separa de `traducir` a propósito: preguntar «¿la hay?» mirando si el
 * resultado es distinto del español daría FALSO en las frases que se traducen
 * a sí mismas —las marcas, «P2P», «Powered by»— y eso convertiría una entrada
 * correcta en un hueco aparente. Quien quiera avisar de lo que falta tiene que
 * preguntar por la fila, no comparar cadenas.
 */
export function hayTraduccion(es: string, idioma: CodigoIdioma | string): boolean {
  if (idioma === 'es') return true
  return typeof DICCIONARIO[es]?.[idioma as Exclude<CodigoIdioma, 'es'>] === 'string'
}
