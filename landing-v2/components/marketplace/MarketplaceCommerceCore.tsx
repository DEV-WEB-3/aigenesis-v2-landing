'use client'

import { EMISSION } from '@/lib/design/tokens'

import { COMMERCE_GLOBE_CENTER, COMMERCE_PULSE_S } from '@/lib/marketplace/globalCommerceLayout'

const ACTIVITY_BANDS = [
  { id: 'settlement', rx: 38, ry: 14, particles: 5, dur: 3.2 },
  { id: 'clearing', rx: 28, ry: 10, particles: 4, dur: 2.6 },
  { id: 'exchange', rx: 18, ry: 7, particles: 3, dur: 2.1 },
] as const

export default function MarketplaceCommerceCore() {
  const cx = COMMERCE_GLOBE_CENTER.x
  const cy = COMMERCE_GLOBE_CENTER.y

  return (
    <div
      className="marketplace-commerce-core"
      style={
        {
          left: `${cx}%`,
          top: `${cy}%`,
          '--commerce-pulse-s': `${COMMERCE_PULSE_S}s`,
        } as React.CSSProperties
      }
    >
      <div className="marketplace-commerce-core__volumetric" aria-hidden="true">
        <span className="marketplace-commerce-core__volume marketplace-commerce-core__volume--a" />
        <span className="marketplace-commerce-core__volume marketplace-commerce-core__volume--b" />
      </div>

      <svg
        className="marketplace-commerce-core__activity-layers"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        {ACTIVITY_BANDS.map((band, bi) => {
          const path = `M${cx - band.rx},${cy} A${band.rx},${band.ry} 0 1,1 ${cx + band.rx},${cy} A${band.rx},${band.ry} 0 1,1 ${cx - band.rx},${cy}`
          return (
            <g key={band.id} className={`marketplace-commerce-core__activity-band marketplace-commerce-core__activity-band--${bi}`}>
              <ellipse
                cx={cx}
                cy={cy}
                rx={band.rx}
                ry={band.ry}
                className="marketplace-commerce-core__activity-track"
              />
              {Array.from({ length: band.particles }, (_, pi) => (
                <circle
                  key={pi}
                  r="0.42"
                  className="marketplace-commerce-core__activity-particle"
                  fill={pi % 3 === 0 ? EMISSION.cyan : pi % 3 === 1 ? EMISSION.violetHi : EMISSION.magenta}
                >
                  <animateMotion
                    dur={`${band.dur}s`}
                    repeatCount="indefinite"
                    path={path}
                    begin={`${pi * (band.dur / band.particles)}s`}
                    calcMode="linear"
                  />
                </circle>
              ))}
            </g>
          )
        })}
      </svg>

      <div className="marketplace-commerce-core__nucleus">
        <span className="marketplace-commerce-core__inner-glow" aria-hidden="true" />
        <span className="marketplace-commerce-core__pulse-ring" aria-hidden="true" />
        <span className="marketplace-commerce-core__pulse-ring marketplace-commerce-core__pulse-ring--b" aria-hidden="true" />
        <span className="marketplace-commerce-core__glyph" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="39" height="39" fill="none">
            <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.1" />
            <path
              d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21"
              stroke="currentColor"
              strokeWidth="0.95"
              strokeLinecap="round"
              opacity="0.75"
            />
            <circle cx="12" cy="12" r="1.2" fill="currentColor" />
          </svg>
        </span>
      </div>
    </div>
  )
}
