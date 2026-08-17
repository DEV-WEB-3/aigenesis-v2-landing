/** Responsive scroll UX — desktop snap, tablet proximity, mobile natural */

import { VIEWPORT } from '@/lib/viewport'

/**
 * `flow` — scroll continuo con secciones ancladas por proximidad.
 *
 * Sustituye a `snap` en escritorio. El snap obligatorio parecía premium y costaba
 * más de lo que aparentaba; todo esto se midió sobre este mismo sitio:
 *
 *  1. Mataba el scroll ligado. El progreso intermedio sólo existía durante el
 *     salto animado — nunca se descansa a media sección —, así que el morfeo de
 *     partículas apenas tenía margen para actuar.
 *  2. Obligaba a desmontar: sólo la sección activa estaba en el DOM, 1 de 14.
 *  3. Disparaba el coste de cristal: en la transición conviven la sección
 *     saliente y la entrante, de 5 superficies a 12, justo cuando la GPU ya está
 *     ocupada animando.
 *
 * `flow` conserva la sensación de capítulo —las secciones siguen ocupando el
 * alto de pantalla y el scroll se acomoda a ellas— pero deja descansar en
 * cualquier punto, que es lo que devuelve el progreso continuo.
 *
 * `snap` se mantiene en el tipo a propósito: permite volver atrás con un cambio
 * de una línea si la comparación no convence.
 */
export type ScrollMode = 'flow' | 'snap' | 'proximity' | 'natural'

/**
 * Alias histórico. Los umbrales viven ahora en `lib/viewport.ts`, que es la
 * definición única; esto se mantiene para no romper los imports existentes.
 */
export const SCROLL_BREAKPOINTS = VIEWPORT

/**
 * ESCRITORIO VUELVE A `snap`. Y el porqué importa, porque yo mismo lo saqué.
 *
 * `flow` se eligió por una razón real: con enganche OBLIGATORIO y secciones de
 * alto fijo con `overflow: hidden`, el contenido que no cabía quedaba
 * inalcanzable — no había forma de llegar a él, porque el enganche impedía
 * descansar a media sección y el recorte lo escondía. Con eso, `flow` era la
 * decisión correcta.
 *
 * Lo que estaba mal no era el enganche: era que las secciones NO CABÍAN.
 * Medido en una ventana real de portátil a zoom 100 % (1914×683), Booster
 * perdía 190 px de contenido, recortados 93 arriba y 97 abajo.
 *
 * Resuelto eso —densidad ligada al alto de ventana, y `min-height` para que la
 * sección crezca en vez de cortar—, ya no hay nada inalcanzable, y el enganche
 * por páginas deja de tener coste. Vuelve, que es además lo que la plataforma
 * pide: catorce capítulos se leen de uno en uno.
 *
 * El orden fue el que importaba: primero que quepa, después el enganche. Al
 * revés, el enganche vuelve a esconder lo que no cabe.
 */
export function resolveScrollMode(width: number): ScrollMode {
  if (width >= VIEWPORT.DESKTOP_MIN) return 'snap'
  if (width > VIEWPORT.MOBILE_MAX) return 'proximity'
  return 'natural'
}

export function isSnapScrollMode(mode: ScrollMode): boolean {
  return mode === 'snap'
}
