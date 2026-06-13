'use client'

import { BOOSTER_ACCELERATOR_PULSE_S, BOOSTER_TIERS } from '@/lib/booster/quantumAcceleratorLayout'

export default function BoosterAcceleratorLayers() {
  return (
    <div
      className="booster-accelerator-layers"
      style={{ '--booster-pulse-s': `${BOOSTER_ACCELERATOR_PULSE_S}s` } as React.CSSProperties}
    >
      {BOOSTER_TIERS.map((tier, index) => (
        <div
          key={tier.id}
          className={`booster-accelerator-tier booster-accelerator-tier--${tier.id}`}
          data-tier={tier.id}
          style={
            {
              '--tier-y': `${tier.y}%`,
              '--tier-color': tier.color,
              '--tier-glow': tier.glow,
              '--tier-pulse-offset': tier.pulseOffset,
              '--tier-ring-r': `${tier.ringR}%`,
              animationDelay: `${index * 0.22}s`,
            } as React.CSSProperties
          }
        >
          {tier.ringCount === 2 ? (
            <>
              <span className="booster-accelerator-tier__ring booster-accelerator-tier__ring--outer" aria-hidden="true" />
              <span className="booster-accelerator-tier__ring booster-accelerator-tier__ring--inner" aria-hidden="true" />
            </>
          ) : (
            <span className="booster-accelerator-tier__ring booster-accelerator-tier__ring--single" aria-hidden="true" />
          )}
          {tier.id === 'progression' ? (
            <span className="booster-accelerator-tier__burst" aria-hidden="true" />
          ) : null}
          {tier.id === 'activation' ? (
            <span className="booster-accelerator-tier__gather" aria-hidden="true" />
          ) : null}
          <span className="booster-accelerator-tier__pulse-flash" aria-hidden="true" />
        </div>
      ))}

      <div className="booster-accelerator-column-beam" aria-hidden="true">
        <span className="booster-accelerator-column-beam__core" />
        <span className="booster-accelerator-column-beam__sheath" />
      </div>
    </div>
  )
}
