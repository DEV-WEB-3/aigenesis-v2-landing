'use client'

import { COMMUNITY_CENTER, COMMUNITY_PULSE_S } from '@/lib/community/communityNetworkLayout'

export default function CommunityCore() {
  return (
    <div
      className="community-core"
      style={
        {
          left: `${COMMUNITY_CENTER.x}%`,
          top: `${COMMUNITY_CENTER.y}%`,
          '--community-pulse-s': `${COMMUNITY_PULSE_S}s`,
        } as React.CSSProperties
      }
    >
      <div className="community-core__volumetric" aria-hidden="true">
        <span className="community-core__volume community-core__volume--a" />
        <span className="community-core__volume community-core__volume--b" />
      </div>

      <div className="community-core__nucleus">
        <span className="community-core__inner-glow" aria-hidden="true" />
        <span className="community-core__pulse-ring" aria-hidden="true" />
        <span className="community-core__pulse-ring community-core__pulse-ring--b" aria-hidden="true" />
        <span className="community-core__glyph" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="none">
            <circle cx="12" cy="12" r="2.2" fill="currentColor" opacity="0.9" />
            <circle cx="6" cy="8" r="1.3" stroke="currentColor" strokeWidth="1" />
            <circle cx="18" cy="8" r="1.3" stroke="currentColor" strokeWidth="1" />
            <circle cx="6" cy="16" r="1.3" stroke="currentColor" strokeWidth="1" />
            <circle cx="18" cy="16" r="1.3" stroke="currentColor" strokeWidth="1" />
            <path
              d="M7.2 8.8L10 10.8M17 8.8L14 10.8M7.2 15.2L10 13.2M17 15.2L14 13.2"
              stroke="currentColor"
              strokeWidth="0.9"
              strokeLinecap="round"
              opacity="0.75"
            />
          </svg>
        </span>
      </div>
    </div>
  )
}
