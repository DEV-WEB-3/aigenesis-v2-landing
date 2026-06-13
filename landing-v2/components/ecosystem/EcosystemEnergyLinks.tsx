'use client'

import { useEffect, useRef } from 'react'

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

  useEffect(() => {
    if (!isActive || !svgRef.current) return
    const paths = svgRef.current.querySelectorAll<SVGPathElement>('[data-energy-path]')
    paths.forEach((path, i) => {
      path.style.animationDelay = `${i * 0.22}s`
    })
  }, [isActive])

  if (!isActive) return null

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
          <stop offset="0%" stopColor="#E91E8B" stopOpacity="0.85" />
          <stop offset="35%" stopColor="#6E56CF" stopOpacity="0.75" />
          <stop offset="65%" stopColor="#3D8BFF" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.65" />
        </linearGradient>
        <filter id="eco-link-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="0.9" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Token core pulse ring */}
      <circle cx="50" cy="10" r="6" className="eco-token-pulse-ring" />
      <circle cx="50" cy="10" r="3.2" className="eco-token-core-glow" />

      {LINKS.map(({ id, d, primary }) => (
        <g key={id}>
          <path
            d={d}
            className={`eco-energy-link ${primary ? 'eco-energy-link--primary' : ''}`}
            data-energy-path
            fill="none"
            stroke="url(#eco-link-grad)"
            filter="url(#eco-link-glow)"
          />
          <circle r="1.1" className="eco-energy-particle" fill="#22D3EE">
            <animateMotion dur={`${3.2 + (id.length % 3) * 0.4}s`} repeatCount="indefinite" path={d} />
          </circle>
          {primary ? (
            <circle r="0.75" className="eco-energy-particle eco-energy-particle--trail" fill="#E91E8B">
              <animateMotion
                dur={`${3.8 + (id.length % 4) * 0.35}s`}
                repeatCount="indefinite"
                path={d}
                begin="0.6s"
              />
            </circle>
          ) : null}
        </g>
      ))}

      {/* Marketplace halo */}
      <ellipse cx="50" cy="66" rx="14" ry="5" className="eco-marketplace-halo" />

      {/* Comunidad reception */}
      <ellipse cx="50" cy="88" rx="16" ry="5.5" className="eco-comunidad-reception" />
    </svg>
  )
}
