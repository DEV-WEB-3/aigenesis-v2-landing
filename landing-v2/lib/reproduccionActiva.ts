/**
 * ¿HAY UN VIDEO REPRODUCIÉNDOSE AHORA MISMO?
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * POR QUÉ EXISTE. El owner reportó que los videos del Aula «se quedan colgados
 * a los dos segundos». Lo reproduje con un navegador de verdad y lo medí:
 *
 *   página            fotograma (mediana)
 *   ───────────────   ───────────────────
 *   portada           98,7 ms   ← 10 fps
 *   /soporte (texto)   8,3 ms   ← 120 fps
 *
 * El mismo video, servido desde el mismo sitio, va fluido en una página de
 * texto y se atasca en la portada. No era el archivo (H.264 1080p con el `moov`
 * al inicio), ni la red (rangos correctos, 3,5 MB/s), ni el CORS, ni el
 * AudioContext: los tres escenarios de control reprodujeron 10,3-10,5 s de 10
 * sin un solo clavón.
 *
 * Es el HÉROE WebGL. Pinta partículas cada fotograma y no le deja turno al
 * decodificador de video. La consola del owner ya lo decía —«requestAnimationFrame
 * handler took 56ms»— y yo pasé por encima de esa línea dos veces buscando la
 * causa en otro sitio.
 *
 * LA REGLA QUE SE APLICA. Cuando alguien pulsa reproducir, ha dicho lo que
 * quiere mirar. El fondo animado deja de ser el contenido y pasa a ser lo que
 * estorba: se para mientras dure el video y vuelve al terminar.
 *
 * POR QUÉ NO ES ESTADO DE REACT. Esto lo escribe un `<video>` en un rincón del
 * árbol y lo lee el lienzo, que está en otra rama y encima del proveedor de
 * contexto. Un contexto nuevo obligaría a envolver la aplicación entera para
 * transportar un booleano. Un módulo con suscriptores cuesta veinte líneas y no
 * arrastra a nadie.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/*
 * ═══════════════════════════════════════════════════════════════════════════
 * LA SEÑAL NO ES UN BOOLEANO, Y ESA ES LA DECISIÓN IMPORTANTE.
 *
 * La primera versión guardaba `let activa = false` y confiaba en que alguien
 * llamara con `false` al terminar. Ese diseño tiene un modo de fallo que no se
 * puede descartar mirando el código: si un solo camino se olvida de apagarlo
 * —un error a mitad de reproducción, una pestaña que se descarga, un desmontaje
 * que no llega a ejecutar su limpieza— la señal se queda encendida PARA SIEMPRE
 * y las tres animaciones dejan de dibujar el resto de la sesión.
 *
 * Y el síntoma de eso no es «falta una animación»: es UN RECTÁNGULO SIN PINTAR
 * detrás del contenido. Que es, literalmente, lo que el owner reportó ver el
 * mismo día que introduje esto. No pude reproducirlo —las capturas de los dos
 * dominios salen correctas— pero un fallo que no consigo provocar y que mi
 * diseño permite no es un fallo descartado: es uno que todavía no me tocó.
 *
 * Así que se guardan los ELEMENTOS, no un estado. Y la respuesta se calcula
 * mirándolos: cuenta si sigue en el documento, no está pausado y no ha
 * terminado. Un elemento que desaparece deja de contar solo. No hay ningún
 * camino que pueda dejar esto encendido, porque no hay nada que apagar.
 * ═══════════════════════════════════════════════════════════════════════════
 */
const enCurso = new Set<HTMLMediaElement>()
const oyentes = new Set<(v: boolean) => void>()

/** ¿Este elemento sigue realmente reproduciendo, ahora mismo? */
const sigueVivo = (el: HTMLMediaElement): boolean =>
  el.isConnected && !el.paused && !el.ended && !el.error

function calcular(): boolean {
  for (const el of Array.from(enCurso)) {
    if (sigueVivo(el)) return true
    /* Se limpia al pasar: un elemento muerto no tiene por qué seguir en la lista. */
    enCurso.delete(el)
  }
  return false
}

let ultimo = false
function avisar(): void {
  const ahora = calcular()
  if (ahora === ultimo) return
  ultimo = ahora
  /* Se copia antes de recorrer: un oyente que se da de baja dentro de su propia
     llamada mutaría el conjunto en mitad del recorrido. Y `Array.from` en vez de
     `for…of` sobre el Set porque el `target` de este proyecto no permite iterarlo
     directamente. */
  for (const f of Array.from(oyentes)) f(ahora)
}

/**
 * Lo llama el reproductor al arrancar y al parar, con SU elemento.
 *
 * El elemento es obligatorio a propósito: sin él volveríamos al booleano global
 * que puede quedarse encendido. Con él, la señal siempre puede verificarse.
 */
export function marcarReproduccion(el: HTMLMediaElement | null, activo: boolean): void {
  if (!el) return
  if (activo) enCurso.add(el)
  else enCurso.delete(el)
  avisar()
}

/** Lo llama quien anima: se suscribe y recibe el valor actual de entrada. */
export function alCambiarReproduccion(f: (v: boolean) => void): () => void {
  oyentes.add(f)
  f(calcular())
  return () => {
    oyentes.delete(f)
  }
}

/*
 * Lo consultan los bucles de animacion, sesenta veces por segundo. Recorrer un
 * conjunto que como mucho tiene un elemento cuesta menos que lo que ahorra, y a
 * cambio no puede mentir: si el video se fue, esto lo dice en el acto sin que
 * nadie haya tenido que acordarse de avisar.
 */
export const hayReproduccion = (): boolean => calcular()
