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

export function resolveScrollMode(width: number): ScrollMode {
  if (width >= VIEWPORT.DESKTOP_MIN) return 'flow'
  if (width > VIEWPORT.MOBILE_MAX) return 'proximity'
  return 'natural'
}

export function isSnapScrollMode(mode: ScrollMode): boolean {
  return mode === 'snap'
}
