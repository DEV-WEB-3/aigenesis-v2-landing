'use client'

import { STAKING_TIME_RINGS, STAKING_VAULT_PULSE_S } from '@/lib/staking/timeVaultLayout'

export default function StakingTimeRings() {
  return (
    <div className="staking-time-rings" style={{ '--vault-pulse-s': `${STAKING_VAULT_PULSE_S}s` } as React.CSSProperties}>
      {STAKING_TIME_RINGS.map((ring, index) => (
        <div
          key={ring.id}
          className="staking-time-ring"
          data-kpi={ring.label}
          style={
            {
              '--ring-y': `${ring.y}%`,
              '--ring-rx': `${ring.rx}%`,
              '--ring-ry': `${ring.ry}%`,
              '--ring-color': ring.color,
              '--ring-pulse-offset': ring.pulseOffset,
              animationDelay: `${index * 0.25}s`,
            } as React.CSSProperties
          }
        >
          <span className="staking-time-ring__track" aria-hidden="true" />
          <span className="staking-time-ring__glow" aria-hidden="true" />
          <span className="staking-time-ring__pulse" aria-hidden="true" />
        </div>
      ))}
    </div>
  )
}
