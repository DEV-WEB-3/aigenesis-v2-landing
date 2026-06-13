'use client'

interface StakingSectionBackdropProps {
  visible?: boolean
}

export default function StakingSectionBackdrop({ visible = true }: StakingSectionBackdropProps) {
  if (!visible) return null

  return (
    <div className="staking-section-backdrop" aria-hidden="true">
      <div className="staking-section-backdrop__layer staking-section-backdrop__layer--deep" />
      <div className="staking-section-backdrop__layer staking-section-backdrop__layer--vault" />
      <div className="staking-section-backdrop__layer staking-section-backdrop__layer--accent" />
    </div>
  )
}
