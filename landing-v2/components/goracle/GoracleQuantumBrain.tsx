'use client'

import { ORACLE_INFERENCE_PULSE_S, ORACLE_BRAIN_FORM_S } from '@/lib/goracle/quantumBrainLayout'
import GoracleNeuralCore from '@/components/goracle/GoracleNeuralCore'
import GoracleNeuralLayers from '@/components/goracle/GoracleNeuralLayers'
import GoracleNeuralNetwork from '@/components/goracle/GoracleNeuralNetwork'
import GoracleDataStreams from '@/components/goracle/GoracleDataStreams'
import GoracleEcosystemSatellites from '@/components/goracle/GoracleEcosystemSatellites'

interface GoracleQuantumBrainProps {
  isActive: boolean
}

export default function GoracleQuantumBrain({ isActive }: GoracleQuantumBrainProps) {
  if (!isActive) return null

  return (
    <div
      className="goracle-quantum-brain goracle-quantum-brain--enter"
      aria-label="Genesis Quantum Brain"
      style={
        {
          '--oracle-pulse-s': `${ORACLE_INFERENCE_PULSE_S}s`,
          '--oracle-form-s': `${ORACLE_BRAIN_FORM_S}s`,
        } as React.CSSProperties
      }
    >
      <div className="goracle-quantum-brain__layer goracle-quantum-brain__layer--back">
        <div className="goracle-quantum-brain__field" aria-hidden="true" />
        <GoracleNeuralLayers depth="back" />
      </div>

      <div className="goracle-quantum-brain__layer goracle-quantum-brain__layer--mid">
        <GoracleNeuralNetwork />
        <GoracleDataStreams />
        <GoracleEcosystemSatellites />
      </div>

      <div className="goracle-quantum-brain__layer goracle-quantum-brain__layer--front">
        <div className="goracle-quantum-brain__stage">
          <GoracleNeuralLayers depth="front" />
          <GoracleNeuralCore />
        </div>
      </div>
    </div>
  )
}
