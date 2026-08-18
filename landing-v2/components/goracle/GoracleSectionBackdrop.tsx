'use client'

import { useSectionVisualActive } from '@/hooks/useSectionVisualActive'

export default function GoracleSectionBackdrop() {
  // Sigue el mismo gate pegajoso que el visual de su seccion. Antes
  // recibia `visible={isActive}` y se desmontaba con la seccion a la
  // vista, dejandola plana. Ver `useSectionVisualActive`.
  const visible = useSectionVisualActive(true)
  if (!visible) return null

  return (
    <div className="goracle-section-backdrop" aria-hidden="true">
      <div className="goracle-section-backdrop__layer goracle-section-backdrop__layer--deep" />
      <div className="goracle-section-backdrop__layer goracle-section-backdrop__layer--brain" />
      <div className="goracle-section-backdrop__layer goracle-section-backdrop__layer--accent" />
    </div>
  )
}
