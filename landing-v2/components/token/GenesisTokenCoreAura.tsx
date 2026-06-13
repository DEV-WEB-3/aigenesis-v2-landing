'use client'

import {
  GENESIS_TOKEN_CORE_AURA_STYLE,
  USE_GENESIS_TOKEN_CORE_AURA,
} from '@/lib/token/genesisTokenCoreAuraConfig'

interface GenesisTokenCoreAuraProps {
  visible?: boolean
}

export default function GenesisTokenCoreAura({ visible = false }: GenesisTokenCoreAuraProps) {
  if (!USE_GENESIS_TOKEN_CORE_AURA || !visible) return null

  const { BREATH_DURATION_S, OPACITY_MIN, OPACITY_MAX, PULSE_DURATION_S } =
    GENESIS_TOKEN_CORE_AURA_STYLE

  return (
    <div
      className="genesis-token-core-aura"
      aria-hidden="true"
      data-genesis-token-core-aura
      style={
        {
          '--token-aura-breath-duration': `${BREATH_DURATION_S}s`,
          '--token-aura-pulse-duration': `${PULSE_DURATION_S}s`,
          '--token-aura-opacity-min': OPACITY_MIN,
          '--token-aura-opacity-max': OPACITY_MAX,
        } as React.CSSProperties
      }
    >
      <div className="genesis-token-core-aura__glow" />
    </div>
  )
}
