'use client'

import { useSectionVisualActive } from '@/hooks/useSectionVisualActive'

export default function BoosterSectionBackdrop() {
  // Sigue el mismo gate pegajoso que el visual de su seccion. Antes
  // recibia `visible={isActive}` y se desmontaba con la seccion a la
  // vista, dejandola plana. Ver `useSectionVisualActive`.
  const visible = useSectionVisualActive(true)
  if (!visible) return null

  return (
    <div className="booster-section-backdrop" aria-hidden="true">
      <div className="booster-section-backdrop__layer booster-section-backdrop__layer--deep" />
      <div className="booster-section-backdrop__layer booster-section-backdrop__layer--column" />
      <div className="booster-section-backdrop__layer booster-section-backdrop__layer--accent" />
    </div>
  )
}
