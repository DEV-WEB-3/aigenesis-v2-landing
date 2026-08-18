'use client'

import { useSectionVisualActive } from '@/hooks/useSectionVisualActive'

export default function RoadmapSectionBackdrop() {
  // Sigue el mismo gate pegajoso que el visual de su seccion. Antes
  // recibia `visible={isActive}` y se desmontaba con la seccion a la
  // vista, dejandola plana. Ver `useSectionVisualActive`.
  const visible = useSectionVisualActive(true)
  if (!visible) return null

  return (
    <div className="roadmap-section-backdrop" aria-hidden="true">
      <div className="roadmap-section-backdrop__layer roadmap-section-backdrop__layer--deep" />
      <div className="roadmap-section-backdrop__layer roadmap-section-backdrop__layer--ascent" />
    </div>
  )
}
