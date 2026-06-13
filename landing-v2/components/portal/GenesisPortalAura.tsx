'use client'

import {
  GENESIS_PORTAL_AURA_STYLE,
  USE_GENESIS_PORTAL_AURA,
} from '@/lib/portal/genesisPortalAuraConfig'

interface GenesisPortalAuraProps {
  visible?: boolean
}

export default function GenesisPortalAura({ visible = false }: GenesisPortalAuraProps) {
  if (!USE_GENESIS_PORTAL_AURA || !visible) return null

  const { BREATH_DURATION_S, OPACITY_MIN, OPACITY_MAX, PULSE_DURATION_S } = GENESIS_PORTAL_AURA_STYLE

  return (
    <div
      className="genesis-portal-aura"
      aria-hidden="true"
      style={
        {
          '--portal-aura-breath-duration': `${BREATH_DURATION_S}s`,
          '--portal-aura-pulse-duration': `${PULSE_DURATION_S}s`,
          '--portal-aura-opacity-min': OPACITY_MIN,
          '--portal-aura-opacity-max': OPACITY_MAX,
        } as React.CSSProperties
      }
    >
      <div className="genesis-portal-aura__atmosphere" />
    </div>
  )
}
