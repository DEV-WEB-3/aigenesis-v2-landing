'use client'

interface TokenSectionBackdropProps {
  visible?: boolean
}

export default function TokenSectionBackdrop({ visible = true }: TokenSectionBackdropProps) {
  if (!visible) return null

  return (
    <div className="token-section-backdrop" aria-hidden="true">
      <div className="token-section-backdrop__layer token-section-backdrop__layer--deep" />
      <div className="token-section-backdrop__layer token-section-backdrop__layer--blue" />
      <div className="token-section-backdrop__layer token-section-backdrop__layer--mid" />
      <div className="token-section-backdrop__layer token-section-backdrop__layer--vignette" />
    </div>
  )
}
