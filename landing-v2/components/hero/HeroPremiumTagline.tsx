'use client'

import { useT } from '@/context/IdiomaContext'
import { EMISSION } from '@/lib/design/tokens'

import type { CSSProperties } from 'react'

const TAGLINE_ITEMS = [
  { label: 'AI', dot: EMISSION.magenta },
  { label: 'Blockchain', dot: EMISSION.violet },
  { label: 'Marketplace', dot: EMISSION.blueHi },
  { label: 'Intelligence Network', dot: EMISSION.cyan },
] as const

interface HeroPremiumTaglineProps {
  delay?: number
}

export default function HeroPremiumTagline({ delay = 0.1 }: HeroPremiumTaglineProps) {

  const t = useT()
  return (
    /*
      Era `motion.p`, que emite `opacity: 0` en el HTML del servidor y no se ve
      hasta que hidrata React. Pasa a la animacion CSS del hero con sus mismos
      tiempos —0,55 s de duracion y 10 px de subida, no 16 como el resto.
    */
    <p
      className="hero-premium-tagline hero-entra"
      style={
        {
          '--hero-entra-retardo': `${delay}s`,
          // Era `0.55s`: una duracion propia para separarse del resto. La
          // separacion la hace el RETARDO de la linea de arriba; una duracion
          // distinta solo saca este elemento de la rejilla del portal.
          '--hero-entra-desde': '10px',
        } as CSSProperties
      }
      aria-label={t('AI, Blockchain, Marketplace, Intelligence Network')}
    >
      {TAGLINE_ITEMS.map((item, index) => (
        <span key={item.label} className="hero-premium-tagline__segment">
          {index > 0 && (
            <span
              className="hero-premium-tagline__dot"
              style={{ color: TAGLINE_ITEMS[index - 1].dot }}
              aria-hidden="true"
            >
              ·
            </span>
          )}
          <span>{item.label}</span>
        </span>
      ))}
    </p>
  )
}
