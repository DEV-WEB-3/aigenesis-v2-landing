'use client'

import {
  COMMERCE_GLOBAL_HUBS,
  COMMERCE_PULSE_S,
  globalHubPosition,
  globalHubSatellitePosition,
} from '@/lib/marketplace/globalCommerceLayout'
import MarketplaceHubIcon from '@/components/marketplace/MarketplaceHubIcon'

const SATELLITES_PER_HUB = 8

export default function MarketplaceGlobalHubs() {
  return (
    <>
      <svg
        className="marketplace-global-hubs"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        style={{ '--commerce-pulse-s': `${COMMERCE_PULSE_S}s` } as React.CSSProperties}
      >
        <defs>
          <filter id="marketplace-hub-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="0.75" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="marketplace-hub-aura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(157, 77, 255, 0.22)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {COMMERCE_GLOBAL_HUBS.map((hub) => {
          const { x, y } = globalHubPosition(hub.index)
          const delay = hub.pulseOffset * COMMERCE_PULSE_S
          return (
            <g
              key={hub.id}
              className="marketplace-global-hub"
              data-hub={hub.id}
              style={{ animationDelay: `${delay}s` } as React.CSSProperties}
            >
              <circle cx={x} cy={y} r="5.5" fill="url(#marketplace-hub-aura)" className="marketplace-global-hub__aura" />
              <circle cx={x} cy={y} r="3.2" className="marketplace-global-hub__ring" fill="none" stroke="rgba(157, 77, 255, 0.35)" strokeWidth="0.35" />
              <circle cx={x} cy={y} r="1.35" className="marketplace-global-hub__core" fill="#9D4DFF" filter="url(#marketplace-hub-glow)" />

              {Array.from({ length: SATELLITES_PER_HUB }, (_, si) => {
                const sat = globalHubSatellitePosition(hub.index, si, SATELLITES_PER_HUB)
                return (
                  <circle
                    key={si}
                    cx={sat.x}
                    cy={sat.y}
                    r="0.38"
                    className="marketplace-global-hub__satellite"
                    fill={si % 3 === 0 ? '#00F5FF' : si % 3 === 1 ? '#FF00C8' : '#9D4DFF'}
                    style={{ animationDelay: `${delay + si * 0.12}s` } as React.CSSProperties}
                  />
                )
              })}
            </g>
          )
        })}
      </svg>

      <div className="marketplace-global-hub-markers" aria-hidden="true">
        {COMMERCE_GLOBAL_HUBS.map((hub) => {
          const { x, y } = globalHubPosition(hub.index)
          return (
            <div
              key={`marker-${hub.id}`}
              className="marketplace-global-hub-marker"
              data-hub={hub.id}
              style={
                {
                  left: `${x}%`,
                  top: `${y}%`,
                  animationDelay: `${hub.pulseOffset * COMMERCE_PULSE_S}s`,
                } as React.CSSProperties
              }
            >
              <MarketplaceHubIcon role={hub.id} />
            </div>
          )
        })}
      </div>
    </>
  )
}
