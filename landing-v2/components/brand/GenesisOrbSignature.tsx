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

  /*
   * EL LOGO ESPERA A QUE SU SECCION SE HAYA VISITADO.
   *
   * El orbe se renderizaba siempre y solo se pausaba, asi que su logo se
   * descargaba en la carga inicial aunque estuviera catorce secciones mas
   * abajo. `loading="lazy"` no lo frenaba: al cargar, las secciones aun no han
   * montado su contenido y quedan apiladas, asi que la de CTA arrancaba a
   * 2148 px y su imagen a 1739 px de la ventana — dentro del umbral de Chrome
   * en conexion lenta. Medido en movil: 46 KB del orbe de CTA a los 806 ms.
   *
   * Adelantarlo no aporta NADA: la imagen es una firma de marca decorativa
   * (`aria-hidden`) detras del contenido, invisible hasta que llegas ahi.
   *
   * El pestillo es de ida: una vez visto, no se vuelve a desmontar, para que
   * volver a pasar por la seccion no lo haga aparecer otra vez.
   */
  const [yaVisto, setYaVisto] = useState(false)

  useEffect(() => {
    if (tierLockedRef.current) return
    tierLockedRef.current = true
    setTier(detectHeroPerfTier())
  }, [])

  useEffect(() => {
    if (isActive) setYaVisto(true)
  }, [isActive])

  return (
    <div
      className={cn('genesis-orb-signature', `genesis-orb-signature--${placement}`, className)}
      aria-hidden="true"
    >
      <HeroGenesisOrb
        tier={tier}
        variant="signature"
        showLogo={showLogo && yaVisto}
        logoSize={logoSize}
        paused={!isActive}
      />
    </div>
  )
}
