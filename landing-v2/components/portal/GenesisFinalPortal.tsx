'use client'

import {
  PORTAL_ABSORB_S,
  PORTAL_CORE_PULSE_S,
  PORTAL_FORM_S,
} from '@/lib/portal/genesisPortalLayout'
import GenesisFutureField from '@/components/portal/GenesisFutureField'
import GenesisPortalRings from '@/components/portal/GenesisPortalRings'
import GenesisPortalCore from '@/components/portal/GenesisPortalCore'
import GenesisPortalStreams from '@/components/portal/GenesisPortalStreams'

interface GenesisFinalPortalProps {
  isActive: boolean
}

export default function GenesisFinalPortal({ isActive }: GenesisFinalPortalProps) {
  if (!isActive) return null

  return (
    <div
      className="genesis-final-portal genesis-final-portal--enter"
      aria-label="Genesis Portal"
      style={
        {
          '--portal-pulse-s': `${PORTAL_CORE_PULSE_S}s`,
          '--portal-absorb-s': `${PORTAL_ABSORB_S}s`,
          '--portal-form-s': `${PORTAL_FORM_S}s`,
        } as React.CSSProperties
      }
    >
      <div className="genesis-portal__layer genesis-portal__layer--background">
        <GenesisFutureField />
      </div>
      <div className="genesis-portal__layer genesis-portal__layer--midground">
        <GenesisPortalStreams />
        <GenesisPortalRings />
      </div>
      <div className="genesis-portal__layer genesis-portal__layer--foreground">
        <GenesisPortalCore />
      </div>
    </div>
  )
}
