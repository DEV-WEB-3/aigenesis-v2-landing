'use client'

import { useEffect, useRef, useState } from 'react'
import HeroGenesisOrb from '@/components/hero/HeroGenesisOrb'
import { detectHeroPerfTier, type HeroPerfTier } from '@/lib/hero-performance'
import { cn } from '@/lib/utils'

export type GenesisOrbPlacement = 'trust' | 'token' | 'cta'

interface GenesisOrbSignatureProps {
  placement: GenesisOrbPlacement
  isActive?: boolean
  className?: string
}

const PLACEMENT_LOGO: Record<
  GenesisOrbPlacement,
  { showLogo: boolean; logoSize: 'lg' | 'md' | 'sm' }
> = {
  trust: { showLogo: true, logoSize: 'md' },
  token: { showLogo: true, logoSize: 'sm' },
  cta: { showLogo: true, logoSize: 'lg' },
}

/**
 * Reuses Hero Genesis Orb as ambient brand signature behind section content.
 * z-index 0 — never overlaps cards, text, or CTAs.
 */
export default function GenesisOrbSignature({
  placement,
  isActive = true,
  className,
}: GenesisOrbSignatureProps) {
  const [tier, setTier] = useState<HeroPerfTier>('medium')
  const tierLockedRef = useRef(false)
  const { showLogo, logoSize } = PLACEMENT_LOGO[placement]

  useEffect(() => {
    if (tierLockedRef.current) return
    tierLockedRef.current = true
    setTier(detectHeroPerfTier())
  }, [])

  return (
    <div
      className={cn('genesis-orb-signature', `genesis-orb-signature--${placement}`, className)}
      aria-hidden="true"
    >
      <HeroGenesisOrb
        tier={tier}
        variant="signature"
        showLogo={showLogo}
        logoSize={logoSize}
        paused={!isActive}
      />
    </div>
  )
}
