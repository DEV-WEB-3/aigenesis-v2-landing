'use client'

import { GPULSE_NODE_COUNT, gpulseNodePosition, GPULSE_SIGNAL_PULSE_S } from '@/lib/gpulse/signalNetworkLayout'

export default function GpulseSignalNodes() {
  return (
    <svg
      className="gpulse-signal-nodes"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      style={{ '--gpulse-pulse-s': `${GPULSE_SIGNAL_PULSE_S}s` } as React.CSSProperties}
    >
      <defs>
        <filter id="gpulse-node-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="0.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {Array.from({ length: GPULSE_NODE_COUNT }, (_, i) => {
        const { x, y } = gpulseNodePosition(i)
        const delay = (i / GPULSE_NODE_COUNT) * 2.4
        return (
          <g key={i} className="gpulse-signal-node" style={{ animationDelay: `${delay}s` } as React.CSSProperties}>
            <circle cx={x} cy={y} r="1.8" className="gpulse-signal-node__halo" fill="rgba(0, 245, 255, 0.08)" />
            <circle
              cx={x}
              cy={y}
              r="0.85"
              className="gpulse-signal-node__dot"
              fill="#00F5FF"
              filter="url(#gpulse-node-glow)"
            />
            <circle cx={x} cy={y} r="0.35" className="gpulse-signal-node__core" fill="#ffffff" opacity="0.85" />
          </g>
        )
      })}
    </svg>
  )
}
