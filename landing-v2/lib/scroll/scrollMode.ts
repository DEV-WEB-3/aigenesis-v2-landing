/** Responsive scroll UX — desktop snap, tablet proximity, mobile natural */

export type ScrollMode = 'snap' | 'proximity' | 'natural'

export const SCROLL_BREAKPOINTS = {
  MOBILE_MAX: 767,
  TABLET_MAX: 1023,
  DESKTOP_MIN: 1024,
} as const

export function resolveScrollMode(width: number): ScrollMode {
  if (width >= SCROLL_BREAKPOINTS.DESKTOP_MIN) return 'snap'
  if (width > SCROLL_BREAKPOINTS.MOBILE_MAX) return 'proximity'
  return 'natural'
}

export function isSnapScrollMode(mode: ScrollMode): boolean {
  return mode === 'snap'
}
