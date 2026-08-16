'use client'

import { EMISSION } from '@/lib/design/tokens'

import {
  COMMUNITY_GROWTH_CYCLE_S,
  COMMUNITY_NODE_COUNT,
  COMMUNITY_PULSE_S,
  communityGrowthDelay,
  communityNodePosition,
} from '@/lib/community/communityNetworkLayout'

export default function CommunityNodes() {
  return (
    <svg
      className="community-nodes"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      style={
        {
          '--community-pulse-s': `${COMMUNITY_PULSE_S}s`,
          '--community-growth-s': `${COMMUNITY_GROWTH_CYCLE_S}s`,
        } as React.CSSProperties
      }
    >
      <defs>
        <filter id="community-node-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="0.55" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="community-leader-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255, 0, 200, 0.35)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      {Array.from({ length: COMMUNITY_NODE_COUNT }, (_, i) => {
        const { x, y, isLeader } = communityNodePosition(i)
        const growthDelay = communityGrowthDelay(i)
        const r = isLeader ? 1.05 : 0.42 + (i % 4) * 0.06
        return (
          <g
            key={i}
            className={`community-node${isLeader ? ' community-node--leader' : ''}`}
            style={{ animationDelay: `${growthDelay}s` } as React.CSSProperties}
          >
            {isLeader && (
              <circle cx={x} cy={y} r={r * 2.2} fill="url(#community-leader-glow)" className="community-node__halo" />
            )}
            <circle
              cx={x}
              cy={y}
              r={r}
              className="community-node__dot"
              fill={isLeader ? EMISSION.magenta : i % 3 === 0 ? EMISSION.cyan : i % 3 === 1 ? EMISSION.violetHi : EMISSION.magenta}
              filter="url(#community-node-glow)"
              opacity={isLeader ? 0.92 : 0.72}
            />
            {!isLeader && (
              <circle cx={x} cy={y} r={r * 0.6} className="community-node__spark" fill={EMISSION.cyan} opacity="0">
                <animate
                  attributeName="opacity"
                  values="0;0;0.55;0;0"
                  dur={`${COMMUNITY_GROWTH_CYCLE_S * 3.6}s`}
                  begin={`${growthDelay + 0.8}s`}
                  repeatCount="indefinite"
                />
              </circle>
            )}
          </g>
        )
      })}
    </svg>
  )
}
