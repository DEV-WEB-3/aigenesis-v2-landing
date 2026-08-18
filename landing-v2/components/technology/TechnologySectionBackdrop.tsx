'use client'

import { useSectionVisualActive } from '@/hooks/useSectionVisualActive'

export default function TechnologySectionBackdrop() {
  // Sigue el mismo gate pegajoso que el visual de su seccion. Antes
  // recibia `visible={isActive}` y se desmontaba con la seccion a la
  // vista, dejandola plana. Ver `useSectionVisualActive`.
  const visible = useSectionVisualActive(true)
  if (!visible) return null

  return (
    <div className="technology-section-backdrop" aria-hidden="true">
      <div className="technology-section-backdrop__layer technology-section-backdrop__layer--deep" />
      <div className="technology-section-backdrop__layer technology-section-backdrop__layer--grid" />
    </div>
  )
}
