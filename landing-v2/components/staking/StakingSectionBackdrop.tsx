'use client'

import { useSectionVisualActive } from '@/hooks/useSectionVisualActive'

export default function StakingSectionBackdrop() {
  // Sigue el mismo gate pegajoso que el visual de su seccion. Antes
  // recibia `visible={isActive}` y se desmontaba con la seccion a la
  // vista, dejandola plana. Ver `useSectionVisualActive`.
  const visible = useSectionVisualActive(true)
  if (!visible) return null

  return (
    <div className="staking-section-backdrop" aria-hidden="true">
      <div className="staking-section-backdrop__layer staking-section-backdrop__layer--deep" />
      <div className="staking-section-backdrop__layer staking-section-backdrop__layer--vault" />
      <div className="staking-section-backdrop__layer staking-section-backdrop__layer--accent" />
    </div>
  )
}
