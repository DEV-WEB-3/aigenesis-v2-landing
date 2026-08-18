'use client'

import { useSectionVisualActive } from '@/hooks/useSectionVisualActive'

export default function GpulseSectionBackdrop() {
  // Sigue el mismo gate pegajoso que el visual de su seccion. Antes
  // recibia `visible={isActive}` y se desmontaba con la seccion a la
  // vista, dejandola plana. Ver `useSectionVisualActive`.
  const visible = useSectionVisualActive(true)
  if (!visible) return null

  return (
    <div className="gpulse-section-backdrop" aria-hidden="true">
      <div className="gpulse-section-backdrop__layer gpulse-section-backdrop__layer--deep" />
      <div className="gpulse-section-backdrop__layer gpulse-section-backdrop__layer--network" />
      <div className="gpulse-section-backdrop__layer gpulse-section-backdrop__layer--accent" />
    </div>
  )
}
