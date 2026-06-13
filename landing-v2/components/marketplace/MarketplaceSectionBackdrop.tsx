'use client'

interface MarketplaceSectionBackdropProps {
  visible?: boolean
}

export default function MarketplaceSectionBackdrop({ visible = true }: MarketplaceSectionBackdropProps) {
  if (!visible) return null

  return (
    <div className="marketplace-section-backdrop" aria-hidden="true">
      <div className="marketplace-section-backdrop__layer marketplace-section-backdrop__layer--deep" />
      <div className="marketplace-section-backdrop__layer marketplace-section-backdrop__layer--globe" />
      <div className="marketplace-section-backdrop__layer marketplace-section-backdrop__layer--accent" />
    </div>
  )
}
