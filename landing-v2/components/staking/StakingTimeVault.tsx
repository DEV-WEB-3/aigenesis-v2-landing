'use client'

import { STAKING_VAULT_PULSE_S } from '@/lib/staking/timeVaultLayout'
import StakingVaultCore from '@/components/staking/StakingVaultCore'
import StakingTimeRings from '@/components/staking/StakingTimeRings'
import StakingLockStreams from '@/components/staking/StakingLockStreams'

interface StakingTimeVaultProps {
  isActive: boolean
}

export default function StakingTimeVault({ isActive }: StakingTimeVaultProps) {
  if (!isActive) return null

  return (
    <div
      className="staking-time-vault staking-time-vault--enter"
      aria-label="Genesis Time Vault"
      style={{ '--vault-pulse-s': `${STAKING_VAULT_PULSE_S}s`, '--vault-form-s': '1.4s' } as React.CSSProperties}
    >
      <div className="staking-time-vault__layer staking-time-vault__layer--back">
        <div className="staking-time-vault__ambient" aria-hidden="true" />
      </div>

      <div className="staking-time-vault__layer staking-time-vault__layer--mid">
        <StakingLockStreams />
      </div>

      <div className="staking-time-vault__layer staking-time-vault__layer--front">
        <div className="staking-time-vault__stage">
          <StakingTimeRings />
          <StakingVaultCore />
        </div>
      </div>
    </div>
  )
}
