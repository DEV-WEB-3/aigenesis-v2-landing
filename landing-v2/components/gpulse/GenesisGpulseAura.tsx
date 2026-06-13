'use client'

import {
  GENESIS_GPULSE_AURA_STYLE,
  USE_GENESIS_GPULSE_AURA,
} from '@/lib/gpulse/genesisGpulseAuraConfig'

interface GenesisGpulseAuraProps {
  visible?: boolean
}

export default function GenesisGpulseAura({ visible = false }: GenesisGpulseAuraProps) {
  if (!USE_GENESIS_GPULSE_AURA || !visible) return null

  const { BREATH_DURATION_S, OPACITY_MIN, OPACITY_MAX, PULSE_DURATION_S } = GENESIS_GPULSE_AURA_STYLE

  return (
    <div
      className="genesis-gpulse-aura"
      aria-hidden="true"
      style={
        {
          '--gpulse-aura-breath-duration': `${BREATH_DURATION_S}s`,
          '--gpulse-aura-pulse-duration': `${PULSE_DURATION_S}s`,
          '--gpulse-aura-opacity-min': OPACITY_MIN,
          '--gpulse-aura-opacity-max': OPACITY_MAX,
        } as React.CSSProperties
      }
    >
      <div className="genesis-gpulse-aura__signal-field" />
    </div>
  )
}
