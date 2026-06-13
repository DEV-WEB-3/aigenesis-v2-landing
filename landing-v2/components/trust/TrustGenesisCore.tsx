'use client'

import { TRUST_CORE_PULSE_S, TRUST_GENESIS_WAVE_S } from '@/lib/trust/trustGenesisCoreLayout'
import TrustGenesisNebula from '@/components/trust/TrustGenesisNebula'
import TrustQuantumRings from '@/components/trust/TrustQuantumRings'
import TrustGenesisWave from '@/components/trust/TrustGenesisWave'
import TrustGenesisCoreSphere from '@/components/trust/TrustGenesisCoreSphere'

interface TrustGenesisCoreProps {
  isActive: boolean
  editorMode?: boolean
}

export default function TrustGenesisCore({ isActive, editorMode = false }: TrustGenesisCoreProps) {
  if (!isActive) return null

  return (
    <div
      className={`trust-genesis-core trust-genesis-core--enter${editorMode ? ' trust-genesis-core--logo-editor' : ''}`}
      aria-label="Genesis Trust Core"
      style={
        {
          '--trust-core-pulse-s': `${TRUST_CORE_PULSE_S}s`,
          '--trust-wave-s': `${TRUST_GENESIS_WAVE_S}s`,
        } as React.CSSProperties
      }
    >
      <div className="trust-genesis-core__layer trust-genesis-core__layer--background">
        <TrustGenesisNebula />
        <TrustQuantumRings />
      </div>
      <div className="trust-genesis-core__layer trust-genesis-core__layer--midground">
        <TrustGenesisWave />
      </div>
      <div className="trust-genesis-core__layer trust-genesis-core__layer--foreground">
        <TrustGenesisCoreSphere isActive={isActive} />
      </div>
    </div>
  )
}
