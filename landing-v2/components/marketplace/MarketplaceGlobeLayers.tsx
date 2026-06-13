'use client'

import { COMMERCE_PULSE_S } from '@/lib/marketplace/globalCommerceLayout'

interface MarketplaceGlobeLayersProps {
  depth: 'back' | 'front'
}

export default function MarketplaceGlobeLayers({ depth }: MarketplaceGlobeLayersProps) {
  return (
    <div
      className={`marketplace-globe-layers marketplace-globe-layers--${depth}`}
      style={{ '--commerce-pulse-s': `${COMMERCE_PULSE_S}s` } as React.CSSProperties}
    >
      <span className="marketplace-globe-layers__activity-band marketplace-globe-layers__activity-band--outer" aria-hidden="true" />
      {depth === 'front' && (
        <>
          <span className="marketplace-globe-layers__activity-band marketplace-globe-layers__activity-band--mid" aria-hidden="true" />
          <span className="marketplace-globe-layers__activity-band marketplace-globe-layers__activity-band--inner" aria-hidden="true" />
        </>
      )}
      <span className="marketplace-globe-layers__mesh" aria-hidden="true" />
    </div>
  )
}
