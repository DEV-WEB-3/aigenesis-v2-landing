'use client'

import { EMISSION } from '@/lib/design/tokens'
import { desfase } from '@/lib/design/motion'

const FLUJO_S = 4
const ESTELA_S = 8

import {
  MINING_CONSTELLATION_NODES,
  MINING_CONSTELLATION_PULSE_S,
  constellationStreamPath,
} from '@/lib/mining/miningConstellationLayout'

interface MiningConstellationStreamsProps {
  visibleIndices: number[]
}

export default function MiningConstellationStreams({ visibleIndices }: MiningConstellationStreamsProps) {
  return (
    <svg
      className="mining-constellation-streams"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="mining-stream-grad" gradientUnits="userSpaceOnUse" x1="50" y1="50" x2="88" y2="50">
          <stop offset="0%" stopColor={EMISSION.magenta} stopOpacity="0.85" />
          <stop offset="35%" stopColor={EMISSION.violetHi} stopOpacity="0.7" />
          <stop offset="70%" stopColor={EMISSION.blue} stopOpacity="0.6" />
          <stop offset="100%" stopColor={EMISSION.cyan} stopOpacity="0.55" />
        </linearGradient>
        <filter id="mining-stream-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="0.85" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="mining-stream-glow-soft" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="1.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {visibleIndices.map((nodeIndex) => {
        const node = MINING_CONSTELLATION_NODES[nodeIndex]
        if (!node) return null
        const d = constellationStreamPath(nodeIndex)
        const flowDur = `${FLUJO_S}s`
        // un escalon mas lenta, para que la estela se lea como eco
        const trailDur = `${ESTELA_S}s`

        return (
          <g key={node.id} className="mining-constellation-stream-group">
            <path
              d={d}
              className="mining-constellation-stream mining-constellation-stream--ambient"
              fill="none"
              stroke="url(#mining-stream-grad)"
              filter="url(#mining-stream-glow-soft)"
            />
            <path
              d={d}
              className="mining-constellation-stream mining-constellation-stream--flow"
              fill="none"
              stroke="url(#mining-stream-grad)"
              filter="url(#mining-stream-glow)"
            />
            <path
              d={d}
              className="mining-constellation-stream mining-constellation-stream--pulse"
              fill="none"
              stroke="url(#mining-stream-grad)"
              filter="url(#mining-stream-glow)"
              style={
                {
                  '--stream-pulse-offset': node.pulseOffset,
                } as React.CSSProperties
              }
            />
            <circle r="0.9" className="mining-constellation-stream__particle" fill={node.color}>
              <animateMotion
                dur={flowDur}
                repeatCount="indefinite"
                path={d}
                begin={`${desfase(nodeIndex, visibleIndices.length, FLUJO_S)}s`}
              />
            </circle>
            <circle r="0.55" className="mining-constellation-stream__particle mining-constellation-stream__particle--trail" fill={EMISSION.cyan}>
              <animateMotion dur={trailDur} repeatCount="indefinite" path={d} begin={`${desfase(nodeIndex, visibleIndices.length, ESTELA_S)}s`} />
            </circle>
          </g>
        )
      })}
    </svg>
  )
}

export { MINING_CONSTELLATION_PULSE_S }
