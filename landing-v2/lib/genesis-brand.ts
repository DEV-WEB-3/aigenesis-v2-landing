import { EMISSION, INK, VOID } from '@/lib/design/tokens'
/**
 * Paleta oficial GENESIS — fuente única para toda la web.
 * Fucsia = energía · Azul = tecnología · Violeta = ecosistema · Void = premium dark
 */
export const GENESIS_COLORS = {
  void: VOID.black,
  base: VOID.base,
  surface: VOID.surface,
  text: INK.base,
  mist: INK.muted,
  ghost: INK.faint,
  fuchsia: EMISSION.magenta,
  fuchsiaSoft: EMISSION.magentaHi,
  core: EMISSION.violet,
  ion: EMISSION.blueHi,
  cyan: EMISSION.cyan,
  pulse: EMISSION.blue,
} as const

/** RGB 0–255 — canvas, CSS vars */
export const GENESIS_RGB = {
  fuchsia: [233, 30, 139] as const,
  fuchsiaSoft: [255, 79, 184] as const,
  core: [110, 86, 207] as const,
  ion: [61, 139, 255] as const,
  cyan: [34, 211, 238] as const,
  pulse: [91, 108, 255] as const,
  mist: [170, 180, 200] as const,
  ghost: [92, 107, 130] as const,
  void: [5, 7, 13] as const,
} as const

/** RGB normalizado 0–1 — WebGL */
export const GENESIS_RGB_NORM = {
  fuchsia: [0.914, 0.118, 0.545] as const,
  fuchsiaSoft: [1.0, 0.31, 0.722] as const,
  core: [0.431, 0.337, 0.812] as const,
  ion: [0.239, 0.545, 1.0] as const,
  cyan: [0.133, 0.827, 0.933] as const,
  pulse: [0.357, 0.424, 1.0] as const,
  mist: [0.667, 0.706, 0.784] as const,
  ghost: [0.361, 0.42, 0.51] as const,
  void: [0.02, 0.027, 0.051] as const,
  success: [0.184, 0.816, 0.498] as const,
} as const

export type GenesisColorKey = 'fuchsia' | 'core' | 'ion'

/** Gradiente horizontal: fucsia ← violeta ← cyan */
export function genesisColorAtX(nx: number): GenesisColorKey {
  if (nx < 0.32) return 'fuchsia'
  if (nx > 0.58) return 'ion'
  if (nx >= 0.4 && nx <= 0.52) return 'core'
  return nx < 0.46 ? 'fuchsia' : 'ion'
}
