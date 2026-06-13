'use client'

import { TOKEN_VALUE_PULSE_S } from '@/lib/token/tokenOrbitalValueLayout'
import GenesisTokenCore from '@/components/token/GenesisTokenCore'

interface TokenValueCoreProps {
  compact?: boolean
}

/** Token section nucleus — layered Genesis assets (GenesisTokenCore). */
export default function TokenValueCore({ compact = false }: TokenValueCoreProps) {
  return (
    <div
      className="token-value-core"
      style={{ '--token-value-pulse-s': `${TOKEN_VALUE_PULSE_S}s` } as React.CSSProperties}
    >
      <GenesisTokenCore compact={compact} />
    </div>
  )
}
