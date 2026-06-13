'use client'

import {
  GENESIS_BACKGROUND_AURA_STYLE,
  USE_GENESIS_BACKGROUND_AURA,
} from '@/lib/trust/genesisBackgroundAuraConfig'

interface GenesisBackgroundAuraProps {
  visible?: boolean
}

export default function GenesisBackgroundAura({ visible = false }: GenesisBackgroundAuraProps) {
  if (!USE_GENESIS_BACKGROUND_AURA || !visible) return null

  const { BREATH_DURATION_S, OPACITY_MIN, OPACITY_MAX } = GENESIS_BACKGROUND_AURA_STYLE

  return (
    <div
      className="genesis-background-aura"
      aria-hidden="true"
      data-genesis-background-aura
      style={
        {
          '--genesis-aura-breath-duration': `${BREATH_DURATION_S}s`,
          '--genesis-aura-opacity-min': OPACITY_MIN,
          '--genesis-aura-opacity-max': OPACITY_MAX,
        } as React.CSSProperties
      }
    >
      <div className="genesis-background-aura__glow" />
    </div>
  )
}
