'use client'

import {
  GENESIS_TECHNOLOGY_AURA_STYLE,
  USE_GENESIS_TECHNOLOGY_AURA,
} from '@/lib/technology/genesisTechnologyAuraConfig'

interface GenesisTechnologyAuraProps {
  visible?: boolean
}

export default function GenesisTechnologyAura({ visible = false }: GenesisTechnologyAuraProps) {
  if (!USE_GENESIS_TECHNOLOGY_AURA || !visible) return null

  const { BREATH_DURATION_S, OPACITY_MIN, OPACITY_MAX, PULSE_DURATION_S } = GENESIS_TECHNOLOGY_AURA_STYLE

  return (
    <div
      className="genesis-technology-aura"
      aria-hidden="true"
      style={
        {
          '--technology-aura-breath-duration': `${BREATH_DURATION_S}s`,
          '--technology-aura-pulse-duration': `${PULSE_DURATION_S}s`,
          '--technology-aura-opacity-min': OPACITY_MIN,
          '--technology-aura-opacity-max': OPACITY_MAX,
        } as React.CSSProperties
      }
    >
      <div className="genesis-technology-aura__atmosphere" />
    </div>
  )
}
