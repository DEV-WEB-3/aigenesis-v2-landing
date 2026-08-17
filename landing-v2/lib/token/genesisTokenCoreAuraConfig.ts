/**
 * Phase 20.5 — Economic Core volumetric aura (DOM, behind WebGL).
 */

import { pulsoDe, respiracionDe } from '@/lib/design/motion'
function readEnvDisabled(name: string): boolean {
  const v = process.env[name] ?? process.env[`NEXT_PUBLIC_${name}`]
  return v === 'false' || v === '0'
}

export const USE_GENESIS_TOKEN_CORE_AURA = !readEnvDisabled('USE_GENESIS_TOKEN_CORE_AURA')

export const GENESIS_TOKEN_CORE_AURA_STYLE = {
  OPACITY_MIN: 0.38,
  OPACITY_MAX: 0.52,
  BREATH_DURATION_S: respiracionDe('token'),
  PULSE_DURATION_S: pulsoDe('token'),
} as const
