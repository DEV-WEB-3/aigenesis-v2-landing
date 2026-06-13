'use client'

import { TRUST_GENESIS_WAVE_S } from '@/lib/trust/trustGenesisCoreLayout'

export default function TrustGenesisWave() {
  return (
    <div
      className="trust-genesis-wave"
      aria-hidden="true"
      style={{ '--trust-wave-s': `${TRUST_GENESIS_WAVE_S}s` } as React.CSSProperties}
    >
      <div className="trust-genesis-wave__ring trust-genesis-wave__ring--a" />
      <div className="trust-genesis-wave__ring trust-genesis-wave__ring--b" />
    </div>
  )
}
