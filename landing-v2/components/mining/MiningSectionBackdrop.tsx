'use client'

import { useSectionVisualActive } from '@/hooks/useSectionVisualActive'

export default function MiningSectionBackdrop() {
  // Sigue el mismo gate pegajoso que el visual de su seccion. Antes
  // recibia `visible={isActive}` y se desmontaba con la seccion a la
  // vista, dejandola plana. Ver `useSectionVisualActive`.
  const visible = useSectionVisualActive(true)
  if (!visible) return null

  return (
    <div className="mining-section-backdrop" aria-hidden="true">
      <div className="mining-section-backdrop__layer mining-section-backdrop__layer--deep" />
      <div className="mining-section-backdrop__layer mining-section-backdrop__layer--mid" />
      <div className="mining-section-backdrop__layer mining-section-backdrop__layer--accent" />
    </div>
  )
}
