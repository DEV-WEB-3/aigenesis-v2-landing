'use client'

import {
  GENESIS_BOOSTER_AURA_STYLE,
  USE_GENESIS_BOOSTER_AURA,
} from '@/lib/booster/genesisBoosterAuraConfig'

interface GenesisBoosterAuraProps {
  visible?: boolean
}

export default function GenesisBoosterAura({ visible = false }: GenesisBoosterAuraProps) {
  if (!USE_GENESIS_BOOSTER_AURA || !visible) return null

  const { BREATH_DURATION_S, OPACITY_MIN, OPACITY_MAX, PULSE_DURATION_S } = GENESIS_BOOSTER_AURA_STYLE

  return (
    <div
      className="genesis-booster-aura"
      aria-hidden="true"
      data-genesis-booster-aura
      style={
        {
          '--booster-aura-breath-duration': `${BREATH_DURATION_S}s`,
          '--booster-aura-pulse-duration': `${PULSE_DURATION_S}s`,
          '--booster-aura-opacity-min': OPACITY_MIN,
          '--booster-aura-opacity-max': OPACITY_MAX,
        } as React.CSSProperties
      }
    >
      <div className="genesis-booster-aura__column" />
    </div>
  )
}
