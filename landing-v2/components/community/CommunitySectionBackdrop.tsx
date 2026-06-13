'use client'

interface CommunitySectionBackdropProps {
  visible?: boolean
}

export default function CommunitySectionBackdrop({ visible = true }: CommunitySectionBackdropProps) {
  if (!visible) return null

  return (
    <div className="community-section-backdrop" aria-hidden="true">
      <div className="community-section-backdrop__layer community-section-backdrop__layer--deep" />
      <div className="community-section-backdrop__layer community-section-backdrop__layer--mesh" />
      <div className="community-section-backdrop__layer community-section-backdrop__layer--accent" />
    </div>
  )
}
