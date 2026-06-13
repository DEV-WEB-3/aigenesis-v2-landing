'use client'

interface GpulseSectionBackdropProps {
  visible?: boolean
}

export default function GpulseSectionBackdrop({ visible = true }: GpulseSectionBackdropProps) {
  if (!visible) return null

  return (
    <div className="gpulse-section-backdrop" aria-hidden="true">
      <div className="gpulse-section-backdrop__layer gpulse-section-backdrop__layer--deep" />
      <div className="gpulse-section-backdrop__layer gpulse-section-backdrop__layer--network" />
      <div className="gpulse-section-backdrop__layer gpulse-section-backdrop__layer--accent" />
    </div>
  )
}
