'use client'

import { COMMUNITY_POOL_PULSES, COMMUNITY_PULSE_S, poolPulsePath } from '@/lib/community/communityNetworkLayout'

export default function CommunityPoolPulses() {
  return (
    <svg
      className="community-pool-pulses"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      style={{ '--community-pulse-s': `${COMMUNITY_PULSE_S}s` } as React.CSSProperties}
    >
      <defs>
        <linearGradient id="community-pool-grad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="100">
          <stop offset="0%" stopColor="#00F5FF" stopOpacity="0.7" />
          <stop offset="55%" stopColor="#9D4DFF" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FF00C8" stopOpacity="0.45" />
        </linearGradient>
      </defs>

      {COMMUNITY_POOL_PULSES.map((pulse) => {
        const d = poolPulsePath(pulse.from, pulse.to)
        return (
          <g key={pulse.id}>
            <path
              d={d}
              className="community-pool-pulse__track"
              fill="none"
              stroke="url(#community-pool-grad)"
              opacity="0.18"
            />
            <circle r="0.44" className="community-pool-pulse__particle" fill="#00F5FF">
              <animateMotion
                dur={`${pulse.duration}s`}
                repeatCount="indefinite"
                path={d}
                begin={`${pulse.delay}s`}
              />
            </circle>
            <circle r="0.34" className="community-pool-pulse__particle community-pool-pulse__particle--b" fill="#FF00C8" opacity="0.8">
              <animateMotion
                dur={`${pulse.duration}s`}
                repeatCount="indefinite"
                path={d}
                begin={`${pulse.delay + pulse.duration * 0.45}s`}
                keyPoints="1;0"
                keyTimes="0;1"
                calcMode="linear"
              />
            </circle>
          </g>
        )
      })}
    </svg>
  )
}
