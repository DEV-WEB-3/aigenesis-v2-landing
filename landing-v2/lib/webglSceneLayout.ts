/**
 * Alineación espacial contenido ↔ partículas WebGL.
 * Solo offsets de posición — no altera morphs, colores ni tamaños.
 */
export const DESKTOP_MIN_WIDTH = 1024
export const CTA_SECTION_INDEX = 13

export const PARTICLE_GROUP_OFFSET = {
  hero: { x: 0, y: 0, z: 0 },
  /** Mobile / tablet — sin cambios */
  section: { x: -0.54, y: 0.06, z: 0 },
} as const

export const PARTICLE_OFFSET_LERP = 0.055

/** Desktop — ancla el grupo en la columna derecha (~58–72% viewport) */
const DESKTOP_GROUP: Record<number, { x: number; y: number; z: number }> = {
  1: { x: 1.56, y: 0.02, z: -0.32 },
  2: { x: 0.48, y: 0.02, z: -0.08 },
  3: { x: 0.88, y: 0, z: -0.08 },
  4: { x: 0.5, y: 0.02, z: -0.08 },
  5: { x: 0.5, y: 0.03, z: -0.08 },
  6: { x: 0.62, y: 0.03, z: -0.08 },
  7: { x: 0.52, y: 0.03, z: -0.08 },
  8: { x: 0.52, y: 0.03, z: -0.08 },
  9: { x: 0.32, y: 0.04, z: -0.05 },
  10: { x: 0.3, y: 0.03, z: -0.05 },
  11: { x: 0.32, y: 0.04, z: -0.05 },
  12: { x: 0.36, y: 0.02, z: -0.05 },
  13: { x: 0, y: 0.05, z: 0 },
}

const DESKTOP_GROUP_DEFAULT = { x: 0.32, y: 0.04, z: -0.05 }

export function isDesktopViewport(width: number): boolean {
  return width >= DESKTOP_MIN_WIDTH
}

export function particleGroupTarget(
  sectionIndex: number,
  desktop = false
): { x: number; y: number; z: number } {
  if (sectionIndex === 0) return PARTICLE_GROUP_OFFSET.hero
  if (!desktop) {
    if (sectionIndex === CTA_SECTION_INDEX) return { x: 0, y: 0.05, z: 0 }
    return PARTICLE_GROUP_OFFSET.section
  }
  return DESKTOP_GROUP[sectionIndex] ?? DESKTOP_GROUP_DEFAULT
}
