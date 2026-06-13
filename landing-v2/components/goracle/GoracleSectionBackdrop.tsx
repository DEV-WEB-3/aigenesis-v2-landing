'use client'

interface GoracleSectionBackdropProps {
  visible?: boolean
}

export default function GoracleSectionBackdrop({ visible = true }: GoracleSectionBackdropProps) {
  if (!visible) return null

  return (
    <div className="goracle-section-backdrop" aria-hidden="true">
      <div className="goracle-section-backdrop__layer goracle-section-backdrop__layer--deep" />
      <div className="goracle-section-backdrop__layer goracle-section-backdrop__layer--brain" />
      <div className="goracle-section-backdrop__layer goracle-section-backdrop__layer--accent" />
    </div>
  )
}
