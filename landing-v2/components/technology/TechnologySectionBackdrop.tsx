'use client'

interface TechnologySectionBackdropProps {
  visible?: boolean
}

export default function TechnologySectionBackdrop({ visible = true }: TechnologySectionBackdropProps) {
  if (!visible) return null

  return (
    <div className="technology-section-backdrop" aria-hidden="true">
      <div className="technology-section-backdrop__layer technology-section-backdrop__layer--deep" />
      <div className="technology-section-backdrop__layer technology-section-backdrop__layer--grid" />
    </div>
  )
}
