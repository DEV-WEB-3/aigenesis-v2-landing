'use client'

import {
  GENESIS_MARKETPLACE_AURA_STYLE,
  USE_GENESIS_MARKETPLACE_AURA,
} from '@/lib/marketplace/genesisMarketplaceAuraConfig'

interface GenesisMarketplaceAuraProps {
  visible?: boolean
}

export default function GenesisMarketplaceAura({ visible = false }: GenesisMarketplaceAuraProps) {
  if (!USE_GENESIS_MARKETPLACE_AURA || !visible) return null

  const { BREATH_DURATION_S, OPACITY_MIN, OPACITY_MAX, PULSE_DURATION_S } = GENESIS_MARKETPLACE_AURA_STYLE

  return (
    <div
      className="genesis-marketplace-aura"
      aria-hidden="true"
      style={
        {
          '--marketplace-aura-breath-duration': `${BREATH_DURATION_S}s`,
          '--marketplace-aura-pulse-duration': `${PULSE_DURATION_S}s`,
          '--marketplace-aura-opacity-min': OPACITY_MIN,
          '--marketplace-aura-opacity-max': OPACITY_MAX,
        } as React.CSSProperties
      }
    >
      <div className="genesis-marketplace-aura__atmosphere" />
    </div>
  )
}
