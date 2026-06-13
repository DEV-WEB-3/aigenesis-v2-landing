'use client'

import { PORTAL_STARDUST_COUNT, portalStardustStart } from '@/lib/portal/genesisPortalLayout'

export default function GenesisPortalStardust() {
  return (
    <div className="genesis-portal-stardust" aria-hidden="true">
      {Array.from({ length: PORTAL_STARDUST_COUNT }, (_, i) => {
        const { x, y, delay } = portalStardustStart(i)
        return (
          <span
            key={i}
            className="genesis-portal-stardust__particle"
            style={
              {
                '--stardust-x': `${x}%`,
                '--stardust-y': `${y}%`,
                '--stardust-delay': `${delay}s`,
              } as React.CSSProperties
            }
          />
        )
      })}
    </div>
  )
}
