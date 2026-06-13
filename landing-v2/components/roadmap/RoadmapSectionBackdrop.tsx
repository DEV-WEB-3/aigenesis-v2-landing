'use client'

interface RoadmapSectionBackdropProps {
  visible?: boolean
}

export default function RoadmapSectionBackdrop({ visible = true }: RoadmapSectionBackdropProps) {
  if (!visible) return null

  return (
    <div className="roadmap-section-backdrop" aria-hidden="true">
      <div className="roadmap-section-backdrop__layer roadmap-section-backdrop__layer--deep" />
      <div className="roadmap-section-backdrop__layer roadmap-section-backdrop__layer--ascent" />
    </div>
  )
}
