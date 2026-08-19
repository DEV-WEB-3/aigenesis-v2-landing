'use client'

import { useT } from '@/context/IdiomaContext'
import { COMMERCE_FORM_S, COMMERCE_PULSE_S } from '@/lib/marketplace/globalCommerceLayout'
import MarketplaceCommerceCore from '@/components/marketplace/MarketplaceCommerceCore'
import MarketplaceGlobeLayers from '@/components/marketplace/MarketplaceGlobeLayers'
import MarketplaceGlobalHubs from '@/components/marketplace/MarketplaceGlobalHubs'
import MarketplaceTradeRoutes from '@/components/marketplace/MarketplaceTradeRoutes'
import MarketplacePaymentCores from '@/components/marketplace/MarketplacePaymentCores'
import MarketplaceCoreActivity from '@/components/marketplace/MarketplaceCoreActivity'
import { useSectionVisualActive } from '@/hooks/useSectionVisualActive'

interface MarketplaceGlobalCommerceProps {
  isActive: boolean
}

export default function MarketplaceGlobalCommerce({ isActive }: MarketplaceGlobalCommerceProps) {

  const t = useT()
  const visible = useSectionVisualActive(isActive)
  if (!visible) return null

  return (
    <div
      className="marketplace-global-commerce marketplace-global-commerce--enter"
      aria-label={t('Genesis Global Commerce Network')}
      style={
        {
          '--commerce-pulse-s': `${COMMERCE_PULSE_S}s`,
          '--commerce-form-s': `${COMMERCE_FORM_S}s`,
        } as React.CSSProperties
      }
    >
      <div className="marketplace-global-commerce__layer marketplace-global-commerce__layer--back">
        <div className="marketplace-global-commerce__atmosphere" aria-hidden="true" />
        <MarketplaceGlobeLayers depth="back" />
      </div>

      <div className="marketplace-global-commerce__layer marketplace-global-commerce__layer--mid">
        <MarketplaceGlobalHubs />
        <MarketplaceTradeRoutes />
        <MarketplaceCoreActivity />
        <MarketplacePaymentCores />
      </div>

      <div className="marketplace-global-commerce__layer marketplace-global-commerce__layer--front">
        <div className="marketplace-global-commerce__stage">
          <MarketplaceGlobeLayers depth="front" />
          <MarketplaceCommerceCore />
        </div>
      </div>
    </div>
  )
}
