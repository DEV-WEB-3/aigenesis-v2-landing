'use client'

import { STAKING_VAULT_CENTER, STAKING_VAULT_PULSE_S } from '@/lib/staking/timeVaultLayout'

const ORBIT_COUNT = 8

export default function StakingVaultCore() {
  return (
    <div
      className="staking-vault-core"
      style={
        {
          left: `${STAKING_VAULT_CENTER.x}%`,
          top: `${STAKING_VAULT_CENTER.y}%`,
          '--vault-pulse-s': `${STAKING_VAULT_PULSE_S}s`,
        } as React.CSSProperties
      }
    >
      <div className="staking-vault-core__volumetric" aria-hidden="true">
        <span className="staking-vault-core__volume staking-vault-core__volume--a" />
        <span className="staking-vault-core__volume staking-vault-core__volume--b" />
      </div>

      <div className="staking-vault-core__orbit-field" aria-hidden="true">
        {Array.from({ length: ORBIT_COUNT }, (_, i) => (
          <span
            key={i}
            className="staking-vault-core__orbit-particle"
            style={
              {
                '--orbit-angle': `${i * (360 / ORBIT_COUNT)}deg`,
                animationDelay: `${i * 0.55}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className="staking-vault-core__nucleus">
        <span className="staking-vault-core__inner-glow" aria-hidden="true" />
        <span className="staking-vault-core__lock-glyph" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="36" height="36" fill="none">
            <path
              d="M7 11V8a5 5 0 0 1 10 0v3"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <rect x="5" y="11" width="14" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="12" cy="15.5" r="1.2" fill="currentColor" />
          </svg>
        </span>
      </div>
    </div>
  )
}
