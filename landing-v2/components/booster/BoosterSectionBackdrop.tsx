'use client'

interface BoosterSectionBackdropProps {
  visible?: boolean
}

export default function BoosterSectionBackdrop({ visible = true }: BoosterSectionBackdropProps) {
  if (!visible) return null

  return (
    <div className="booster-section-backdrop" aria-hidden="true">
      <div className="booster-section-backdrop__layer booster-section-backdrop__layer--deep" />
      <div className="booster-section-backdrop__layer booster-section-backdrop__layer--column" />
      <div className="booster-section-backdrop__layer booster-section-backdrop__layer--accent" />
    </div>
  )
}
