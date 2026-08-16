/** Responsive scroll UX — desktop snap, tablet proximity, mobile natural */

import { VIEWPORT } from '@/lib/viewport'

export type ScrollMode = 'snap' | 'proximity' | 'natural'

/**
 * Alias histórico. Los umbrales viven ahora en `lib/viewport.ts`, que es la
 * definición única; esto se mantiene para no romper los imports existentes.
 */
export const SCROLL_BREAKPOINTS = VIEWPORT

export function resolveScrollMode(width: number): ScrollMode {
  if (width >= VIEWPORT.DESKTOP_MIN) return 'snap'
  if (width > VIEWPORT.MOBILE_MAX) return 'proximity'
  return 'natural'
}

export function isSnapScrollMode(mode: ScrollMode): boolean {
  return mode === 'snap'
}
