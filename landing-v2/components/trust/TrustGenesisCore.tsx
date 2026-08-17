'use client'

import { TRUST_CORE_PULSE_S, TRUST_GENESIS_WAVE_S } from '@/lib/trust/trustGenesisCoreLayout'
import TrustGenesisNebula from '@/components/trust/TrustGenesisNebula'
import TrustQuantumRings from '@/components/trust/TrustQuantumRings'
import TrustGenesisWave from '@/components/trust/TrustGenesisWave'
import TrustGenesisCoreSphere from '@/components/trust/TrustGenesisCoreSphere'
import { llegadaDe } from '@/lib/design/motion'

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
          /*
            La formacion del nucleo valia 1 s a fuego en el CSS, sin variable
            que la conectara con nada. Es la LLEGADA de la seccion, asi que sale
            de la rejilla como todas las demas — y ahora ademas se puede ver
            desde aqui que existe.
          */
          '--trust-form-s': `${llegadaDe('trust')}s`,
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
