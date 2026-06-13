'use client'

import { GPULSE_SIGNAL_PULSE_S, GPULSE_SIGNAL_FORM_S } from '@/lib/gpulse/signalNetworkLayout'
import GpulseSignalCore from '@/components/gpulse/GpulseSignalCore'
import GpulseSignalRings from '@/components/gpulse/GpulseSignalRings'
import GpulseRadarSweep from '@/components/gpulse/GpulseRadarSweep'
import GpulseSignalStreams from '@/components/gpulse/GpulseSignalStreams'
import GpulseSignalNodes from '@/components/gpulse/GpulseSignalNodes'

interface GpulseSignalNetworkProps {
  isActive: boolean
}

export default function GpulseSignalNetwork({ isActive }: GpulseSignalNetworkProps) {
  if (!isActive) return null

  return (
    <div
      className="gpulse-signal-network gpulse-signal-network--enter"
      aria-label="Genesis Signal Core"
      style={
        {
          '--gpulse-pulse-s': `${GPULSE_SIGNAL_PULSE_S}s`,
          '--gpulse-form-s': `${GPULSE_SIGNAL_FORM_S}s`,
        } as React.CSSProperties
      }
    >
      <div className="gpulse-signal-network__layer gpulse-signal-network__layer--back">
        <div className="gpulse-signal-network__field" aria-hidden="true" />
        <GpulseRadarSweep />
      </div>

      <div className="gpulse-signal-network__layer gpulse-signal-network__layer--mid">
        <GpulseSignalStreams />
        <GpulseSignalNodes />
      </div>

      <div className="gpulse-signal-network__layer gpulse-signal-network__layer--front">
        <div className="gpulse-signal-network__stage">
          <GpulseSignalRings />
          <GpulseSignalCore />
        </div>
      </div>
    </div>
  )
}
