'use client'

import {
  GENESIS_ROADMAP_AURA_STYLE,
  USE_GENESIS_ROADMAP_AURA,
} from '@/lib/roadmap/genesisRoadmapAuraConfig'

interface GenesisRoadmapAuraProps {
  visible?: boolean
}

export default function GenesisRoadmapAura({ visible = false }: GenesisRoadmapAuraProps) {
  if (!USE_GENESIS_ROADMAP_AURA || !visible) return null

  const { BREATH_DURATION_S, OPACITY_MIN, OPACITY_MAX, PULSE_DURATION_S } = GENESIS_ROADMAP_AURA_STYLE

  return (
    <div
      className="genesis-roadmap-aura"
      aria-hidden="true"
      style={
        {
          '--roadmap-aura-breath-duration': `${BREATH_DURATION_S}s`,
          '--roadmap-aura-pulse-duration': `${PULSE_DURATION_S}s`,
          '--roadmap-aura-opacity-min': OPACITY_MIN,
          '--roadmap-aura-opacity-max': OPACITY_MAX,
        } as React.CSSProperties
      }
    >
      <div className="genesis-roadmap-aura__atmosphere" />
    </div>
  )
}
