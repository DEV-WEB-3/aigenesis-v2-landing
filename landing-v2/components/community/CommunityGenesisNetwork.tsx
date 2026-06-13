'use client'

import { COMMUNITY_FORM_S, COMMUNITY_PULSE_S } from '@/lib/community/communityNetworkLayout'
import CommunityOrganicField from '@/components/community/CommunityOrganicField'
import CommunityLinks from '@/components/community/CommunityLinks'
import CommunityNodes from '@/components/community/CommunityNodes'
import CommunityPoolPulses from '@/components/community/CommunityPoolPulses'
import CommunityCore from '@/components/community/CommunityCore'

interface CommunityGenesisNetworkProps {
  isActive: boolean
}

export default function CommunityGenesisNetwork({ isActive }: CommunityGenesisNetworkProps) {
  if (!isActive) return null

  return (
    <div
      className="community-genesis-network community-genesis-network--enter"
      aria-label="Genesis Community Network"
      style={
        {
          '--community-pulse-s': `${COMMUNITY_PULSE_S}s`,
          '--community-form-s': `${COMMUNITY_FORM_S}s`,
        } as React.CSSProperties
      }
    >
      <div className="community-genesis-network__layer community-genesis-network__layer--back">
        <div className="community-genesis-network__atmosphere" aria-hidden="true" />
        <CommunityOrganicField depth="back" />
      </div>

      <div className="community-genesis-network__layer community-genesis-network__layer--mid">
        <CommunityLinks />
        <CommunityPoolPulses />
        <CommunityNodes />
      </div>

      <div className="community-genesis-network__layer community-genesis-network__layer--front">
        <div className="community-genesis-network__stage">
          <CommunityOrganicField depth="front" />
          <CommunityCore />
        </div>
      </div>
    </div>
  )
}
