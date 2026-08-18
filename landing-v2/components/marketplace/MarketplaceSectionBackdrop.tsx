'use client'

import { useSectionVisualActive } from '@/hooks/useSectionVisualActive'

export default function MarketplaceSectionBackdrop() {
  // Sigue el mismo gate pegajoso que el visual de su seccion. Antes
  // recibia `visible={isActive}` y se desmontaba con la seccion a la
  // vista, dejandola plana. Ver `useSectionVisualActive`.
  const visible = useSectionVisualActive(true)
  if (!visible) return null

  return (
    <div className="marketplace-section-backdrop" aria-hidden="true">
      <div className="marketplace-section-backdrop__layer marketplace-section-backdrop__layer--deep" />
      <div className="marketplace-section-backdrop__layer marketplace-section-backdrop__layer--globe" />
      <div className="marketplace-section-backdrop__layer marketplace-section-backdrop__layer--accent" />
    </div>
  )
}
