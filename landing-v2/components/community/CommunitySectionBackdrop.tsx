'use client'

import { useSectionVisualActive } from '@/hooks/useSectionVisualActive'

export default function CommunitySectionBackdrop() {
  // Sigue el mismo gate pegajoso que el visual de su seccion. Antes
  // recibia `visible={isActive}` y se desmontaba con la seccion a la
  // vista, dejandola plana. Ver `useSectionVisualActive`.
  const visible = useSectionVisualActive(true)
  if (!visible) return null

  return (
    <div className="community-section-backdrop" aria-hidden="true">
      <div className="community-section-backdrop__layer community-section-backdrop__layer--deep" />
      <div className="community-section-backdrop__layer community-section-backdrop__layer--mesh" />
      <div className="community-section-backdrop__layer community-section-backdrop__layer--accent" />
    </div>
  )
}
