'use client'

import { PORTAL_CORE_COLOR, PORTAL_CORE_PULSE_S } from '@/lib/portal/genesisPortalLayout'

export default function GenesisPortalCore() {
  return (
    <div
      className="genesis-portal-core"
      aria-hidden="true"
      style={{ '--portal-core-pulse-s': `${PORTAL_CORE_PULSE_S}s` } as React.CSSProperties}
    >
      <div className="genesis-portal-core__halo" />
      <div
        className="genesis-portal-core__nucleus"
        style={{ backgroundColor: PORTAL_CORE_COLOR }}
      />
    </div>
  )
}
