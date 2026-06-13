'use client'

import {
  GENESIS_GORACLE_AURA_STYLE,
  USE_GENESIS_GORACLE_AURA,
} from '@/lib/goracle/genesisGoracleAuraConfig'

interface GenesisGoracleAuraProps {
  visible?: boolean
}

export default function GenesisGoracleAura({ visible = false }: GenesisGoracleAuraProps) {
  if (!USE_GENESIS_GORACLE_AURA || !visible) return null

  const { BREATH_DURATION_S, OPACITY_MIN, OPACITY_MAX, PULSE_DURATION_S } = GENESIS_GORACLE_AURA_STYLE

  return (
    <div
      className="genesis-goracle-aura"
      aria-hidden="true"
      style={
        {
          '--goracle-aura-breath-duration': `${BREATH_DURATION_S}s`,
          '--goracle-aura-pulse-duration': `${PULSE_DURATION_S}s`,
          '--goracle-aura-opacity-min': OPACITY_MIN,
          '--goracle-aura-opacity-max': OPACITY_MAX,
        } as React.CSSProperties
      }
    >
      <div className="genesis-goracle-aura__intelligence-field" />
    </div>
  )
}
