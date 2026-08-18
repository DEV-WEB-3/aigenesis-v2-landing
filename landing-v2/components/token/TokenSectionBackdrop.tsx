'use client'

import { useSectionVisualActive } from '@/hooks/useSectionVisualActive'

export default function TokenSectionBackdrop() {
  // Sigue el mismo gate pegajoso que el visual de su seccion. Antes
  // recibia `visible={isActive}` y se desmontaba con la seccion a la
  // vista, dejandola plana. Ver `useSectionVisualActive`.
  const visible = useSectionVisualActive(true)
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
