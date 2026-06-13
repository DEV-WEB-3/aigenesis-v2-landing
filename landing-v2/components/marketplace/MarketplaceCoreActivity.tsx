'use client'

import {
  COMMERCE_GLOBE_CENTER,
  COMMERCE_GLOBAL_HUBS,
  COMMERCE_PACKET_COLORS,
  COMMERCE_PULSE_S,
  type CommercePacketKind,
  globalHubPosition,
  tradeRoutePath,
} from '@/lib/marketplace/globalCommerceLayout'

const KINDS: CommercePacketKind[] = ['product', 'payment', 'info']

export default function MarketplaceCoreActivity() {
  const spokes = KINDS.map((kind, i) => {
    const hub = globalHubPosition(COMMERCE_GLOBAL_HUBS[i]?.index ?? i)
    return { kind, path: tradeRoutePath(COMMERCE_GLOBE_CENTER, hub), delay: i * 0.45 }
  })

  return (
    <svg
      className="marketplace-core-activity"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      style={{ '--commerce-pulse-s': `${COMMERCE_PULSE_S}s` } as React.CSSProperties}
    >
      {spokes.map(({ kind, path, delay }) => (
        <g key={kind}>
          <path d={path} className="marketplace-core-activity__stream" fill="none" stroke={COMMERCE_PACKET_COLORS[kind]} opacity="0.24" />
          <circle
            r="0.4"
            className={`marketplace-core-activity__particle marketplace-core-activity__particle--${kind}`}
            fill={COMMERCE_PACKET_COLORS[kind]}
          >
            <animateMotion dur="2s" repeatCount="indefinite" path={path} begin={`${delay}s`} />
          </circle>
          <circle
            r="0.34"
            className={`marketplace-core-activity__particle marketplace-core-activity__particle--${kind}`}
            fill={COMMERCE_PACKET_COLORS[kind]}
            opacity="0.75"
          >
            <animateMotion
              dur="2s"
              repeatCount="indefinite"
              path={path}
              begin={`${delay + 1}s`}
              keyPoints="1;0"
              keyTimes="0;1"
              calcMode="linear"
            />
          </circle>
        </g>
      ))}
    </svg>
  )
}
