'use client'

import { EMISSION } from '@/lib/design/tokens'

import {
  COMMERCE_GLOBE_CENTER,
  COMMERCE_PACKET_COLORS,
  COMMERCE_PULSE_S,
  COMMERCE_TRADE_ROUTES,
  type CommercePacketKind,
  tradeRoutePath,
} from '@/lib/marketplace/globalCommerceLayout'

function routePackets(routeIndex: number): { kind: CommercePacketKind; offset: number; reverse: boolean }[] {
  return ([
    { kind: 'product' as const, offset: 0, reverse: false },
    { kind: 'payment' as const, offset: 0.28, reverse: true },
    { kind: 'info' as const, offset: 0.52, reverse: false },
  ] as const).map((p, i) => ({ ...p, offset: p.offset + (routeIndex + i) * 0.06 }))
}

export default function MarketplaceTradeRoutes() {
  return (
    <svg
      className="marketplace-trade-routes"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      style={{ '--commerce-pulse-s': `${COMMERCE_PULSE_S}s` } as React.CSSProperties}
    >
      <defs>
        <linearGradient id="marketplace-route-grad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="100">
          <stop offset="0%" stopColor={EMISSION.cyan} stopOpacity="0.58" />
          <stop offset="50%" stopColor={EMISSION.violetHi} stopOpacity="0.5" />
          <stop offset="100%" stopColor={EMISSION.magenta} stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {COMMERCE_TRADE_ROUTES.map((route, routeIndex) => {
        const d = tradeRoutePath(route.from, route.to)
        return (
          <g key={route.id}>
            <path
              d={d}
              className={`marketplace-trade-route${route.id.startsWith('core') ? ' marketplace-trade-route--core' : ''}`}
              fill="none"
              stroke="url(#marketplace-route-grad)"
              style={{ animationDelay: `${route.delay}s` } as React.CSSProperties}
            />
            {routePackets(routeIndex).map(({ kind, offset, reverse }, pi) => (
              <circle
                key={`${route.id}-${kind}-${pi}`}
                r={kind === 'info' ? 0.38 : 0.46}
                className={`marketplace-trade-route__package marketplace-trade-route__package--${kind}`}
                fill={COMMERCE_PACKET_COLORS[kind]}
              >
                <animateMotion
                  dur={`${route.duration}s`}
                  repeatCount="indefinite"
                  path={d}
                  begin={`${route.delay + offset}s`}
                  keyPoints={reverse ? '1;0' : '0;1'}
                  keyTimes="0;1"
                  calcMode="linear"
                />
              </circle>
            ))}
          </g>
        )
      })}

      <circle
        cx={COMMERCE_GLOBE_CENTER.x}
        cy={COMMERCE_GLOBE_CENTER.y}
        r="1.2"
        className="marketplace-trade-routes__hub"
        fill={EMISSION.magenta}
      />
    </svg>
  )
}
