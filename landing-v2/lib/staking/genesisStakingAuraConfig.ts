import { pulsoDe, respiracionDe } from '@/lib/design/motion'

function readEnvDisabled(name: string): boolean {
  const v = process.env[name] ?? process.env[`NEXT_PUBLIC_${name}`]
  return v === 'false' || v === '0'
}

export const USE_GENESIS_STAKING_AURA = !readEnvDisabled('USE_GENESIS_STAKING_AURA')

export const GENESIS_STAKING_AURA_STYLE = {
  OPACITY_MIN: 0.38,
  OPACITY_MAX: 0.52,
  BREATH_DURATION_S: respiracionDe('staking'),
  PULSE_DURATION_S: pulsoDe('staking'),
} as const
