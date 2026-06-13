'use client'

import { GPULSE_SIGNAL_CENTER } from '@/lib/gpulse/signalNetworkLayout'

export default function GpulseRadarSweep() {
  return (
    <div className="gpulse-radar-sweep" aria-hidden="true">
      <div className="gpulse-radar-sweep__disc">
        <div className="gpulse-radar-sweep__beam" />
        <div className="gpulse-radar-sweep__trail" />
      </div>
      <svg
        className="gpulse-radar-sweep__grid"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id="gpulse-radar-fade" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(157, 77, 255, 0.12)" />
            <stop offset="55%" stopColor="rgba(255, 0, 200, 0.04)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <circle
          cx={GPULSE_SIGNAL_CENTER.x}
          cy={GPULSE_SIGNAL_CENTER.y}
          r="42"
          fill="url(#gpulse-radar-fade)"
          opacity="0.5"
        />
        {[18, 28, 38].map((r) => (
          <ellipse
            key={r}
            cx={GPULSE_SIGNAL_CENTER.x}
            cy={GPULSE_SIGNAL_CENTER.y}
            rx={r}
            ry={r * 0.86}
            fill="none"
            stroke="rgba(157, 77, 255, 0.06)"
            strokeWidth="0.25"
          />
        ))}
      </svg>
    </div>
  )
}
