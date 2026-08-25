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

let activa = false
const oyentes = new Set<(v: boolean) => void>()

/** Lo llama el reproductor al arrancar y al parar. */
export function marcarReproduccion(valor: boolean): void {
  if (activa === valor) return
  activa = valor
  /* Se copia antes de recorrer: un oyente que se da de baja dentro de su propia
     llamada mutaría el conjunto en mitad del recorrido. Y `Array.from` en vez de
     `for…of` sobre el Set porque el `target` de este proyecto no permite iterarlo
     directamente. */
  for (const f of Array.from(oyentes)) f(valor)
}

/** Lo llama quien anima: se suscribe y recibe el valor actual de entrada. */
export function alCambiarReproduccion(f: (v: boolean) => void): () => void {
  oyentes.add(f)
  f(activa)
  return () => {
    oyentes.delete(f)
  }
}

export const hayReproduccion = (): boolean => activa
