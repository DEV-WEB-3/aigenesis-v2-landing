'use client'

import {
  ORACLE_ECOSYSTEM_SATELLITES,
  ORACLE_BRAIN_CENTER,
  ORACLE_INFERENCE_PULSE_S,
  oracleOutflowPath,
  satelliteStreamPath,
} from '@/lib/goracle/quantumBrainLayout'

export default function GoracleDataStreams() {
  const outflows = [0, 1, 2, 3, 4, 5, 6, 7]

  return (
    <svg
      className="goracle-data-streams"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="goracle-stream-in-grad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="100">
          <stop offset="0%" stopColor="#00F5FF" stopOpacity="0.6" />
          <stop offset="55%" stopColor="#9D4DFF" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FF00C8" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id="goracle-stream-out-grad" gradientUnits="userSpaceOnUse" x1="50" y1="50" x2="100" y2="0">
          <stop offset="0%" stopColor="#9D4DFF" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FF00C8" stopOpacity="0.48" />
        </linearGradient>
      </defs>

      {ORACLE_ECOSYSTEM_SATELLITES.map((sat) => {
        const d = satelliteStreamPath(sat.id)
        const dur = `${4.8 + sat.pulseOffset * 3}s`
        const begin = `${sat.pulseOffset * ORACLE_INFERENCE_PULSE_S}s`
        return (
          <g key={`in-${sat.id}`}>
            <path d={d} className="goracle-data-stream goracle-data-stream--in" fill="none" stroke="url(#goracle-stream-in-grad)" />
            <circle r="0.5" className="goracle-data-stream__particle goracle-data-stream__particle--in" fill="#00F5FF">
              <animateMotion dur={dur} repeatCount="indefinite" path={d} begin={begin} />
            </circle>
          </g>
        )
      })}

      {outflows.map((i) => {
        const d = oracleOutflowPath(i)
        const dur = `${6 + i * 0.55}s`
        return (
          <g key={`out-${i}`}>
            <path d={d} className="goracle-data-stream goracle-data-stream--out" fill="none" stroke="url(#goracle-stream-out-grad)" />
            <circle r="0.38" className="goracle-data-stream__particle goracle-data-stream__particle--out" fill="#FF00C8">
              <animateMotion dur={dur} repeatCount="indefinite" path={d} begin={`${1.5 + i * 0.45}s`} />
            </circle>
          </g>
        )
      })}

      <circle
        cx={ORACLE_BRAIN_CENTER.x}
        cy={ORACLE_BRAIN_CENTER.y}
        r="1.15"
        className="goracle-data-stream__core-anchor"
        fill="#FF00C8"
        style={{ '--oracle-pulse-s': `${ORACLE_INFERENCE_PULSE_S}s` } as React.CSSProperties}
      />
    </svg>
  )
}
