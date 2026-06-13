'use client'

import { GPULSE_SIGNAL_RINGS, GPULSE_SIGNAL_PULSE_S } from '@/lib/gpulse/signalNetworkLayout'

export default function GpulseSignalRings() {
  return (
    <div
      className="gpulse-signal-rings"
      style={{ '--gpulse-pulse-s': `${GPULSE_SIGNAL_PULSE_S}s` } as React.CSSProperties}
    >
      {GPULSE_SIGNAL_RINGS.map((ring, index) => (
        <div
          key={ring.id}
          className="gpulse-signal-ring"
          data-ring={ring.id}
          style={
            {
              '--ring-rx': `${ring.r * 2}%`,
              '--ring-ry': `${ring.ry * 2}%`,
              '--ring-color': ring.color,
              '--ring-glow': ring.glow,
              '--ring-pulse-offset': ring.pulseOffset,
              animationDelay: `${index * 0.18}s`,
            } as React.CSSProperties
          }
        >
          <span className="gpulse-signal-ring__track" aria-hidden="true" />
          <span className="gpulse-signal-ring__glow" aria-hidden="true" />
          <span className="gpulse-signal-ring__pulse" aria-hidden="true" />
        </div>
      ))}
    </div>
  )
}
