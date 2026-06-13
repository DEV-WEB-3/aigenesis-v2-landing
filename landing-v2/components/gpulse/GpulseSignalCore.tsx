'use client'

import { GPULSE_SIGNAL_CENTER, GPULSE_SIGNAL_PULSE_S } from '@/lib/gpulse/signalNetworkLayout'

const ORBIT_COUNT = 10

export default function GpulseSignalCore() {
  return (
    <div
      className="gpulse-signal-core"
      style={
        {
          left: `${GPULSE_SIGNAL_CENTER.x}%`,
          top: `${GPULSE_SIGNAL_CENTER.y}%`,
          '--gpulse-pulse-s': `${GPULSE_SIGNAL_PULSE_S}s`,
        } as React.CSSProperties
      }
    >
      <div className="gpulse-signal-core__volumetric" aria-hidden="true">
        <span className="gpulse-signal-core__volume gpulse-signal-core__volume--a" />
        <span className="gpulse-signal-core__volume gpulse-signal-core__volume--b" />
      </div>

      <div className="gpulse-signal-core__orbit-field" aria-hidden="true">
        {Array.from({ length: ORBIT_COUNT }, (_, i) => (
          <span
            key={i}
            className="gpulse-signal-core__orbit-particle"
            style={
              {
                '--orbit-angle': `${i * (360 / ORBIT_COUNT)}deg`,
                animationDelay: `${i * 0.38}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className="gpulse-signal-core__nucleus">
        <span className="gpulse-signal-core__inner-glow" aria-hidden="true" />
        <span className="gpulse-signal-core__pulse-ring" aria-hidden="true" />
        <span className="gpulse-signal-core__glyph" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="none">
            <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.1" />
            <path
              d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.1 5.1l2.1 2.1M16.8 16.8l2.1 2.1M5.1 18.9l2.1-2.1M16.8 7.2l2.1-2.1"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.75"
            />
          </svg>
        </span>
      </div>
    </div>
  )
}
