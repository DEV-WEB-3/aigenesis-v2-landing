import { pulsoDe, respiracionDe } from '@/lib/design/motion'

function readEnvDisabled(name: string): boolean {
  const v = process.env[name] ?? process.env[`NEXT_PUBLIC_${name}`]
  return v === 'false' || v === '0'
}

export const USE_GENESIS_COMMUNITY_AURA = !readEnvDisabled('USE_GENESIS_COMMUNITY_AURA')

export const GENESIS_COMMUNITY_AURA_STYLE = {
  OPACITY_MIN: 0.38,
  OPACITY_MAX: 0.52,
  BREATH_DURATION_S: respiracionDe('comunidad'),
  PULSE_DURATION_S: pulsoDe('comunidad'),
} as const
