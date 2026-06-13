'use client'

import { COMMUNITY_LINKS, COMMUNITY_PULSE_S, communityLinkPath } from '@/lib/community/communityNetworkLayout'

export default function CommunityLinks() {
  return (
    <svg
      className="community-links"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      style={{ '--community-pulse-s': `${COMMUNITY_PULSE_S}s` } as React.CSSProperties}
    >
      <defs>
        <linearGradient id="community-link-grad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="100">
          <stop offset="0%" stopColor="#9D4DFF" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#9D4DFF" stopOpacity="0.28" />
        </linearGradient>
      </defs>

      {COMMUNITY_LINKS.map((link) => {
        const d = communityLinkPath(link.from, link.to)
        return (
          <path
            key={link.id}
            d={d}
            className="community-link"
            fill="none"
            stroke="url(#community-link-grad)"
            style={{ animationDelay: `${link.lifecycleOffset}s` } as React.CSSProperties}
          />
        )
      })}
    </svg>
  )
}
