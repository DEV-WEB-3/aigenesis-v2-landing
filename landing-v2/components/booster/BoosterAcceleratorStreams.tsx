'use client'

import { EMISSION } from '@/lib/design/tokens'
import { desfase } from '@/lib/design/motion'

const FLUJO_S = 4
const ESTELA_S = 8

import {
  BOOSTER_ACCELERATOR_PULSE_S,
  BOOSTER_STREAM_COUNT,
  boosterHelixStreamPath,
  boosterPulseColumnPath,
} from '@/lib/booster/quantumAcceleratorLayout'

export default function BoosterAcceleratorStreams() {
  return (
    <svg
      className="booster-accelerator-streams"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="booster-stream-grad" gradientUnits="userSpaceOnUse" x1="50" y1="88" x2="50" y2="10">
          <stop offset="0%" stopColor={EMISSION.magenta} stopOpacity="0.85" />
          <stop offset="42%" stopColor={EMISSION.violetHi} stopOpacity="0.72" />
          <stop offset="100%" stopColor={EMISSION.cyan} stopOpacity="0.62" />
        </linearGradient>
        <filter id="booster-stream-glow" x="-60%" y="-20%" width="220%" height="140%">
          <feGaussianBlur stdDeviation="0.75" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="booster-stream-glow-soft" x="-80%" y="-30%" width="260%" height="160%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {Array.from({ length: BOOSTER_STREAM_COUNT }, (_, strand) => {
        const d = boosterHelixStreamPath(strand)
        const flowDur = `${FLUJO_S}s`
        // la estela va un escalon mas lenta: se lee como eco, no como copia
        const trailDur = `${ESTELA_S}s`

        return (
          <g key={strand} className="booster-accelerator-stream-group">
            <path
              d={d}
              className="booster-accelerator-stream booster-accelerator-stream--ambient"
              fill="none"
              stroke="url(#booster-stream-grad)"
              filter="url(#booster-stream-glow-soft)"
            />
            <path
              d={d}
              className="booster-accelerator-stream booster-accelerator-stream--flow"
              fill="none"
              stroke="url(#booster-stream-grad)"
              filter="url(#booster-stream-glow)"
            />
            <circle r="0.75" className="booster-accelerator-stream__particle" fill={EMISSION.magenta}>
              <animateMotion
                dur={flowDur}
                repeatCount="indefinite"
                path={d}
                begin={`${desfase(strand, BOOSTER_STREAM_COUNT, FLUJO_S)}s`}
              />
            </circle>
            <circle r="0.45" className="booster-accelerator-stream__particle booster-accelerator-stream__particle--trail" fill={EMISSION.cyan}>
              <animateMotion dur={trailDur} repeatCount="indefinite" path={d} begin={`${desfase(strand, BOOSTER_STREAM_COUNT, ESTELA_S)}s`} />
            </circle>
          </g>
        )
      })}

      <path
        d={boosterPulseColumnPath()}
        className="booster-accelerator-stream booster-accelerator-stream--pulse"
        fill="none"
        stroke="url(#booster-stream-grad)"
        filter="url(#booster-stream-glow)"
        style={{ '--booster-pulse-s': `${BOOSTER_ACCELERATOR_PULSE_S}s` } as React.CSSProperties}
      />
    </svg>
  )
}
