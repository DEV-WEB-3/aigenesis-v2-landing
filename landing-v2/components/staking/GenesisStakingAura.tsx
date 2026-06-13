'use client'

import {
  GENESIS_STAKING_AURA_STYLE,
  USE_GENESIS_STAKING_AURA,
} from '@/lib/staking/genesisStakingAuraConfig'

interface GenesisStakingAuraProps {
  visible?: boolean
}

export default function GenesisStakingAura({ visible = false }: GenesisStakingAuraProps) {
  if (!USE_GENESIS_STAKING_AURA || !visible) return null

  const { BREATH_DURATION_S, OPACITY_MIN, OPACITY_MAX, PULSE_DURATION_S } = GENESIS_STAKING_AURA_STYLE

  return (
    <div
      className="genesis-staking-aura"
      aria-hidden="true"
      style={
        {
          '--staking-aura-breath-duration': `${BREATH_DURATION_S}s`,
          '--staking-aura-pulse-duration': `${PULSE_DURATION_S}s`,
          '--staking-aura-opacity-min': OPACITY_MIN,
          '--staking-aura-opacity-max': OPACITY_MAX,
        } as React.CSSProperties
      }
    >
      <div className="genesis-staking-aura__vault-glow" />
    </div>
  )
}
