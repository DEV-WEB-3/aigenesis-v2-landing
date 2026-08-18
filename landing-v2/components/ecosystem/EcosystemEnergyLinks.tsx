'use client'

import { EMISSION } from '@/lib/design/tokens'

import { useEffect, useRef } from 'react'
import { useSectionVisualActive } from '@/hooks/useSectionVisualActive'
import { desfase } from '@/lib/design/motion'

const FLUJO_S = 4
const ESTELA_S = 8

/** SVG energy links — mirrors DOM map topology (viewBox 0 0 100 100). */
const LINKS: { id: string; d: string; primary?: boolean }[] = [
  { id: 't-mining', d: 'M50,10 Q32,18 18,28', primary: true },
  { id: 't-booster', d: 'M50,10 Q50,18 50,28', primary: true },
  { id: 't-staking', d: 'M50,10 Q68,18 82,28', primary: true },
  { id: 'm-gpulse', d: 'M18,28 Q22,38 30,48' },
  { id: 'b-gpulse', d: 'M50,28 Q42,38 30,48' },
  { id: 'b-goracle', d: 'M50,28 Q58,38 70,48' },
  { id: 's-goracle', d: 'M82,28 Q78,38 70,48' },
  { id: 'gp-mp', d: 'M30,48 Q38,58 50,66', primary: true },
  { id: 'go-mp', d: 'M70,48 Q62,58 50,66', primary: true },
  { id: 'mp-com', d: 'M50,66 Q50,76 50,88', primary: true },
]

interface EcosystemEnergyLinksProps {
  isActive: boolean
}

export default function EcosystemEnergyLinks({ isActive }: EcosystemEnergyLinksProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const visible = useSectionVisualActive(isActive)

  useEffect(() => {
    if (!visible || !svgRef.current) return
    const paths = svgRef.current.querySelectorAll<SVGPathElement>('[data-energy-path]')
    paths.forEach((path, i) => {
      path.style.animationDelay = `${i * 0.22}s`
    })
  }, [visible])

  if (!visible) return null

  return (
    <svg
      ref={svgRef}
      className="ecosystem-energy-links"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="eco-link-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={EMISSION.magenta} stopOpacity="0.85" />
          <stop offset="35%" stopColor={EMISSION.violet} stopOpacity="0.75" />
          <stop offset="65%" stopColor={EMISSION.blueHi} stopOpacity="0.7" />
          <stop offset="100%" stopColor={EMISSION.cyan} stopOpacity="0.65" />
        </linearGradient>
        <filter id="eco-link-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="0.9" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/*
          Los dos halos de llegada. Iban sin relleno y sin regla CSS, asi que
          heredaban el `fill` por defecto de SVG —NEGRO— y se pintaban como dos
          ovalos opacos sobre el vacio. El degradado va aqui, y el `fill` va como
          atributo en la elipse: asi no depende de que exista una hoja de estilo.
        */}
        <radialGradient id="eco-halo-violeta">
          <stop offset="0%" stopColor={EMISSION.violetHi} stopOpacity="0.20" />
          <stop offset="55%" stopColor={EMISSION.violet} stopOpacity="0.08" />
          <stop offset="100%" stopColor={EMISSION.violet} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="eco-halo-cian">
          <stop offset="0%" stopColor={EMISSION.cyan} stopOpacity="0.18" />
          <stop offset="55%" stopColor={EMISSION.cyan} stopOpacity="0.07" />
          <stop offset="100%" stopColor={EMISSION.cyan} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Token core pulse ring */}
      <circle cx="50" cy="10" r="6" className="eco-token-pulse-ring" />
      <circle cx="50" cy="10" r="3.2" className="eco-token-core-glow" />

      {LINKS.map(({ id, d, primary }, i) => (
        <g key={id}>
          <path
            d={d}
            className={`eco-energy-link ${primary ? 'eco-energy-link--primary' : ''}`}
            data-energy-path
            fill="none"
            stroke="url(#eco-link-grad)"
            filter="url(#eco-link-glow)"
          />
          <circle r="1.1" className="eco-energy-particle" fill={EMISSION.cyan}>
            <animateMotion
              dur={`${FLUJO_S}s`}
              repeatCount="indefinite"
              path={d}
              begin={`${desfase(i, LINKS.length, FLUJO_S)}s`}
            />
          </circle>
          {primary ? (
            <circle r="0.75" className="eco-energy-particle eco-energy-particle--trail" fill={EMISSION.magenta}>
              <animateMotion
                dur={`${ESTELA_S}s`}
                repeatCount="indefinite"
                path={d}
                begin={`${desfase(i, LINKS.length, ESTELA_S)}s`}
              />
            </circle>
          ) : null}
        </g>
      ))}

      {/* Halo donde convergen GPulse y G-Oracle sobre Marketplace */}
      <ellipse cx="50" cy="66" rx="14" ry="5" className="eco-marketplace-halo" fill="url(#eco-halo-violeta)" />

      {/* Halo de llegada de la ultima linea, en Comunidad */}
      <ellipse cx="50" cy="88" rx="16" ry="5.5" className="eco-comunidad-reception" fill="url(#eco-halo-cian)" />
    </svg>
  )
}
