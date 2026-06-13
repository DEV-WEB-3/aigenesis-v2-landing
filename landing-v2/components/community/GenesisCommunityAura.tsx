'use client'

import {
  GENESIS_COMMUNITY_AURA_STYLE,
  USE_GENESIS_COMMUNITY_AURA,
} from '@/lib/community/genesisCommunityAuraConfig'

interface GenesisCommunityAuraProps {
  visible?: boolean
}

export default function GenesisCommunityAura({ visible = false }: GenesisCommunityAuraProps) {
  if (!USE_GENESIS_COMMUNITY_AURA || !visible) return null

  const { BREATH_DURATION_S, OPACITY_MIN, OPACITY_MAX, PULSE_DURATION_S } = GENESIS_COMMUNITY_AURA_STYLE

  return (
    <div
      className="genesis-community-aura"
      aria-hidden="true"
      style={
        {
          '--community-aura-breath-duration': `${BREATH_DURATION_S}s`,
          '--community-aura-pulse-duration': `${PULSE_DURATION_S}s`,
          '--community-aura-opacity-min': OPACITY_MIN,
          '--community-aura-opacity-max': OPACITY_MAX,
        } as React.CSSProperties
      }
    >
      <div className="genesis-community-aura__atmosphere" />
    </div>
  )
}
