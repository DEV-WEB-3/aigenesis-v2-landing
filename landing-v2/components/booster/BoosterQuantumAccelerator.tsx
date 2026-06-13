'use client'

import { BOOSTER_ACCELERATOR_PULSE_S } from '@/lib/booster/quantumAcceleratorLayout'
import BoosterAcceleratorLayers from '@/components/booster/BoosterAcceleratorLayers'
import BoosterAcceleratorStreams from '@/components/booster/BoosterAcceleratorStreams'

interface BoosterQuantumAcceleratorProps {
  isActive: boolean
}

export default function BoosterQuantumAccelerator({ isActive }: BoosterQuantumAcceleratorProps) {
  if (!isActive) return null

  return (
    <div
      className="booster-quantum-accelerator"
      aria-label="Acelerador cuántico Genesis Booster"
      style={{ '--booster-pulse-s': `${BOOSTER_ACCELERATOR_PULSE_S}s` } as React.CSSProperties}
    >
      <div className="booster-quantum-accelerator__layer booster-quantum-accelerator__layer--back">
        <div className="booster-quantum-accelerator__volumetric" aria-hidden="true">
          <span className="booster-quantum-accelerator__volume booster-quantum-accelerator__volume--a" />
          <span className="booster-quantum-accelerator__volume booster-quantum-accelerator__volume--b" />
          <span className="booster-quantum-accelerator__volume booster-quantum-accelerator__volume--c" />
        </div>
      </div>

      <div className="booster-quantum-accelerator__layer booster-quantum-accelerator__layer--mid">
        <BoosterAcceleratorStreams />
      </div>

      <div className="booster-quantum-accelerator__layer booster-quantum-accelerator__layer--front">
        <div className="booster-quantum-accelerator__stage">
          <BoosterAcceleratorLayers />
        </div>
      </div>
    </div>
  )
}
