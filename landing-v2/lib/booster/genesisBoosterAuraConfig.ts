/**
 * Phase 8.0 — Vertical energy column aura (DOM, behind WebGL).
 */

import { pulsoDe, respiracionDe } from '@/lib/design/motion'
function readEnvDisabled(name: string): boolean {
  const v = process.env[name] ?? process.env[`NEXT_PUBLIC_${name}`]
  return v === 'false' || v === '0'
}

export const USE_GENESIS_BOOSTER_AURA = !readEnvDisabled('USE_GENESIS_BOOSTER_AURA')

export const GENESIS_BOOSTER_AURA_STYLE = {
  OPACITY_MIN: 0.38,
  OPACITY_MAX: 0.52,
  BREATH_DURATION_S: respiracionDe('booster'),
  PULSE_DURATION_S: pulsoDe('booster'),
} as const
