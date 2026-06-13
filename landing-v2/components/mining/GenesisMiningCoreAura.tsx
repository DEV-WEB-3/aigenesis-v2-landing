'use client'

import {
  GENESIS_MINING_CORE_AURA_STYLE,
  USE_GENESIS_MINING_CORE_AURA,
} from '@/lib/mining/genesisMiningCoreAuraConfig'

interface GenesisMiningCoreAuraProps {
  visible?: boolean
}

export default function GenesisMiningCoreAura({ visible = false }: GenesisMiningCoreAuraProps) {
  if (!USE_GENESIS_MINING_CORE_AURA || !visible) return null

  const { BREATH_DURATION_S, OPACITY_MIN, OPACITY_MAX, PULSE_DURATION_S } =
    GENESIS_MINING_CORE_AURA_STYLE

  return (
    <div
      className="genesis-mining-core-aura"
      aria-hidden="true"
      data-genesis-mining-core-aura
      style={
        {
          '--mining-aura-breath-duration': `${BREATH_DURATION_S}s`,
          '--mining-aura-pulse-duration': `${PULSE_DURATION_S}s`,
          '--mining-aura-opacity-min': OPACITY_MIN,
          '--mining-aura-opacity-max': OPACITY_MAX,
        } as React.CSSProperties
      }
    >
      <div className="genesis-mining-core-aura__glow" />
    </div>
  )
}
