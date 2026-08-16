'use client'

import { EMISSION } from '@/lib/design/tokens'

import {
  GPULSE_NODE_COUNT,
  gpulseOutflowPath,
  gpulseStreamPath,
  GPULSE_SIGNAL_CENTER,
  GPULSE_SIGNAL_PULSE_S,
} from '@/lib/gpulse/signalNetworkLayout'

export default function GpulseSignalStreams() {
  const outflows = [0, 1, 2, 3, 4, 5]

  return (
    <svg
      className="gpulse-signal-streams"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="gpulse-stream-in-grad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="100">
          <stop offset="0%" stopColor={EMISSION.cyan} stopOpacity="0.65" />
          <stop offset="55%" stopColor={EMISSION.violetHi} stopOpacity="0.55" />
          <stop offset="100%" stopColor={EMISSION.magenta} stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id="gpulse-stream-out-grad" gradientUnits="userSpaceOnUse" x1="50" y1="50" x2="100" y2="0">
          <stop offset="0%" stopColor={EMISSION.violetHi} stopOpacity="0.55" />
          <stop offset="100%" stopColor={EMISSION.magenta} stopOpacity="0.45" />
        </linearGradient>
        <filter id="gpulse-stream-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="0.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {Array.from({ length: GPULSE_NODE_COUNT }, (_, i) => {
        const d = gpulseStreamPath(i)
        const dur = `${3.2 + (i % 5) * 0.35}s`
        const begin = `${(i / GPULSE_NODE_COUNT) * 2.4}s`
        return (
          <g key={`in-${i}`}>
            <path
              d={d}
              className="gpulse-signal-stream gpulse-signal-stream--in"
              fill="none"
              stroke="url(#gpulse-stream-in-grad)"
              opacity="0.28"
            />
            <circle r="0.55" className="gpulse-signal-stream__particle gpulse-signal-stream__particle--in" fill={EMISSION.cyan}>
              <animateMotion dur={dur} repeatCount="indefinite" path={d} begin={begin} />
            </circle>
          </g>
        )
      })}

      {outflows.map((i) => {
        const d = gpulseOutflowPath(i)
        const dur = `${4.5 + i * 0.5}s`
        return (
          <g key={`out-${i}`}>
            <path
              d={d}
              className="gpulse-signal-stream gpulse-signal-stream--out"
              fill="none"
              stroke="url(#gpulse-stream-out-grad)"
              opacity="0.22"
            />
            <circle r="0.42" className="gpulse-signal-stream__particle gpulse-signal-stream__particle--out" fill={EMISSION.magenta}>
              <animateMotion dur={dur} repeatCount="indefinite" path={d} begin={`${i * 0.55 + 1.2}s`} />
            </circle>
          </g>
        )
      })}

      <circle
        cx={GPULSE_SIGNAL_CENTER.x}
        cy={GPULSE_SIGNAL_CENTER.y}
        r="1.1"
        className="gpulse-signal-stream__core-anchor"
        fill={EMISSION.magenta}
        style={{ '--gpulse-pulse-s': `${GPULSE_SIGNAL_PULSE_S}s` } as React.CSSProperties}
      />
    </svg>
  )
}
