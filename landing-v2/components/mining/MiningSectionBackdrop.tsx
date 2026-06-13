'use client'

interface MiningSectionBackdropProps {
  visible?: boolean
}

export default function MiningSectionBackdrop({ visible = true }: MiningSectionBackdropProps) {
  if (!visible) return null

  return (
    <div className="mining-section-backdrop" aria-hidden="true">
      <div className="mining-section-backdrop__layer mining-section-backdrop__layer--deep" />
      <div className="mining-section-backdrop__layer mining-section-backdrop__layer--mid" />
      <div className="mining-section-backdrop__layer mining-section-backdrop__layer--accent" />
    </div>
  )
}
