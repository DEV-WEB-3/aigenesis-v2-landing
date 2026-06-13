/**
 * Temporary color pipeline debug — window.__GENESIS_COLOR_DEBUG__()
 * Compares Genesis anchor colors before/after neon glow.
 */
import {
  applyNeonStardustGlow,
  computeStardustColorBeforeGlow,
  LOGO_PERMANENT_GLOW,
} from './GenesisStardustEntity'
import { NEON_BLUE, NEON_CYAN, NEON_FUCHSIA, NEON_PURPLE } from './trustShieldColorAmplification'

type Rgb = readonly [number, number, number]

function rgbTo255([r, g, b]: Rgb): string {
  return `RGB(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`
}

function chroma([r, g, b]: Rgb): number {
  return Math.max(r, g, b) - Math.min(r, g, b)
}

const ANCHOR_SAMPLES = [
  { id: 'fucsia', label: 'Fucsia Genesis', anchor: NEON_FUCHSIA, poolIndex: 0 },
  { id: 'cyan', label: 'Cyan eléctrico', anchor: NEON_CYAN, poolIndex: 58000 },
  { id: 'azul', label: 'Azul eléctrico', anchor: NEON_BLUE, poolIndex: 42000 },
  { id: 'morado', label: 'Morado Genesis', anchor: NEON_PURPLE, poolIndex: 20000 },
] as const

export function getGenesisColorDebugReport() {
  const pulse = 1
  const brightnessMin = LOGO_PERMANENT_GLOW.BRIGHTNESS_MIN

  const samples = ANCHOR_SAMPLES.map(({ id, label, anchor, poolIndex }) => {
    const beforeGlow = computeStardustColorBeforeGlow(
      anchor[0],
      anchor[1],
      anchor[2],
      0,
      0,
      poolIndex
    ) as Rgb
    const afterGlow = applyNeonStardustGlow(
      beforeGlow[0],
      beforeGlow[1],
      beforeGlow[2],
      pulse,
      brightnessMin
    ) as Rgb

    return {
      id,
      label,
      anchor: rgbTo255(anchor),
      anchorChroma: chroma(anchor),
      beforeGlow: rgbTo255(beforeGlow),
      beforeGlowChroma: chroma(beforeGlow),
      afterGlow: rgbTo255(afterGlow),
      afterGlowChroma: chroma(afterGlow),
      chromaPreserved:
        chroma(anchor) > 0
          ? `${((chroma(afterGlow) / chroma(anchor)) * 100).toFixed(1)}%`
          : 'N/A',
    }
  })

  return {
    constants: {
      NEON_GLOW_LUMINANCE: 2.25,
      NEON_GLOW_SATURATION: 1.85,
      MAGENTA_SPECTRAL_WEIGHT: 1.55,
      BRIGHTNESS_MIN: LOGO_PERMANENT_GLOW.BRIGHTNESS_MIN,
      RGB_MIN: LOGO_PERMANENT_GLOW.RGB_MIN,
      G_BODY_SPECTRAL_MIX_BASE: 0.55,
      bloomIntensity: 0.18,
      bloomThreshold: 0.92,
    },
    samples,
  }
}

export function printGenesisColorDebugReport(): ReturnType<typeof getGenesisColorDebugReport> {
  const report = getGenesisColorDebugReport()
  console.group('[Genesis Color Debug]')
  console.table(report.samples)
  console.log('Constants:', report.constants)
  console.groupEnd()
  return report
}

if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  ;(
    window as Window & { __GENESIS_COLOR_DEBUG__?: typeof printGenesisColorDebugReport }
  ).__GENESIS_COLOR_DEBUG__ = printGenesisColorDebugReport
}
