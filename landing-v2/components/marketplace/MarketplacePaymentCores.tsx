'use client'

import { EMISSION } from '@/lib/design/tokens'

import { COMMERCE_PAYMENT_CORES, COMMERCE_PULSE_S, paymentStreamPath } from '@/lib/marketplace/globalCommerceLayout'
import MarketplacePaymentIcon from '@/components/marketplace/MarketplacePaymentIcon'

export default function MarketplacePaymentCores() {
  return (
    <>
      <svg
        className="marketplace-payment-streams"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="marketplace-payment-grad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="100">
            <stop offset="0%" stopColor={EMISSION.cyan} stopOpacity="0.45" />
            <stop offset="100%" stopColor={EMISSION.magenta} stopOpacity="0.35" />
          </linearGradient>
        </defs>

        {COMMERCE_PAYMENT_CORES.map((core) => {
          const d = paymentStreamPath(core.id)
          const dur = `${COMMERCE_PULSE_S}s`
          return (
            <g key={core.id}>
              <path d={d} className="marketplace-payment-stream" fill="none" stroke="url(#marketplace-payment-grad)" />
              <circle r="0.38" className="marketplace-payment-stream__particle" fill={EMISSION.cyan}>
                <animateMotion dur={dur} repeatCount="indefinite" path={d} begin={`${core.pulseOffset * COMMERCE_PULSE_S}s`} />
              </circle>
              <circle r="0.32" className="marketplace-payment-stream__particle marketplace-payment-stream__particle--out" fill={EMISSION.magenta}>
                <animateMotion
                  dur={dur}
                  repeatCount="indefinite"
                  path={d}
                  begin={`${core.pulseOffset * COMMERCE_PULSE_S + 0.6}s`}
                  keyPoints="1;0"
                  keyTimes="0;1"
                  calcMode="linear"
                />
              </circle>
            </g>
          )
        })}
      </svg>

      <div
        className="marketplace-payment-cores"
        style={{ '--commerce-pulse-s': `${COMMERCE_PULSE_S}s` } as React.CSSProperties}
      >
        {COMMERCE_PAYMENT_CORES.map((core) => (
          <div
            key={core.id}
            className="marketplace-payment-core"
            data-payment={core.id}
            style={
              {
                left: `${core.x}%`,
                top: `${core.y}%`,
                animationDelay: `${core.pulseOffset * COMMERCE_PULSE_S}s`,
              } as React.CSSProperties
            }
          >
            <span className="marketplace-payment-core__halo" aria-hidden="true" />
            <span className="marketplace-payment-core__icon">
              <MarketplacePaymentIcon id={core.id} />
            </span>
          </div>
        ))}
      </div>
    </>
  )
}
