'use client'

import { rutaPublica } from '@/lib/rutaPublica'
import Image from 'next/image'

import { EMISSION } from '@/lib/design/tokens'

import { COMMERCE_GLOBE_CENTER, COMMERCE_PULSE_S } from '@/lib/marketplace/globalCommerceLayout'

const ACTIVITY_BANDS = [
  // 8 · 4 · 2: la de fuera liquida despacio y la de dentro intercambia rapido.
  // Antes eran 3,2 · 2,6 · 2,1 — el mismo orden, pero tan juntos que no se
  // distinguian. Los escalones de la rejilla lo hacen legible.
  { id: 'settlement', rx: 38, ry: 14, particles: 5, dur: 8 },
  { id: 'clearing', rx: 28, ry: 10, particles: 4, dur: 4 },
  { id: 'exchange', rx: 18, ry: 7, particles: 3, dur: 2 },
] as const

export default function MarketplaceCommerceCore() {
  const cx = COMMERCE_GLOBE_CENTER.x
  const cy = COMMERCE_GLOBE_CENTER.y

  return (
    <div
      className="marketplace-commerce-core"
      style={
        {
          left: `${cx}%`,
          top: `${cy}%`,
          '--commerce-pulse-s': `${COMMERCE_PULSE_S}s`,
        } as React.CSSProperties
      }
    >
      <div className="marketplace-commerce-core__volumetric" aria-hidden="true">
        <span className="marketplace-commerce-core__volume marketplace-commerce-core__volume--a" />
        <span className="marketplace-commerce-core__volume marketplace-commerce-core__volume--b" />
      </div>

      <svg
        className="marketplace-commerce-core__activity-layers"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        {ACTIVITY_BANDS.map((band, bi) => {
          const path = `M${cx - band.rx},${cy} A${band.rx},${band.ry} 0 1,1 ${cx + band.rx},${cy} A${band.rx},${band.ry} 0 1,1 ${cx - band.rx},${cy}`
          return (
            <g key={band.id} className={`marketplace-commerce-core__activity-band marketplace-commerce-core__activity-band--${bi}`}>
              <ellipse
                cx={cx}
                cy={cy}
                rx={band.rx}
                ry={band.ry}
                className="marketplace-commerce-core__activity-track"
              />
              {Array.from({ length: band.particles }, (_, pi) => (
                <circle
                  key={pi}
                  r="0.42"
                  className="marketplace-commerce-core__activity-particle"
                  fill={pi % 3 === 0 ? EMISSION.cyan : pi % 3 === 1 ? EMISSION.violetHi : EMISSION.magenta}
                >
                  <animateMotion
                    dur={`${band.dur}s`}
                    repeatCount="indefinite"
                    path={path}
                    begin={`${pi * (band.dur / band.particles)}s`}
                    calcMode="linear"
                  />
                </circle>
              ))}
            </g>
          )
        })}
      </svg>

      <div className="marketplace-commerce-core__nucleus">
        <span className="marketplace-commerce-core__inner-glow" aria-hidden="true" />
        <span className="marketplace-commerce-core__pulse-ring" aria-hidden="true" />
        <span className="marketplace-commerce-core__pulse-ring marketplace-commerce-core__pulse-ring--b" aria-hidden="true" />
        {/*
          EL LOGO DE GEVY, que es de quien es este marketplace.

          Aquí había otro SVG genérico de 24×24 —círculo con cuatro rayos— igual
          que en G-Pulse. Y el logotipo de Gevy llevaba sin usar en
          `public/brand/`: seis archivos entre las dos variantes.

          El marketplace de este ecosistema ES Gevy Shop; la propia hoja de ruta
          lo dice en el hito de 2026 Q2. Que su núcleo mostrara un icono de stock
          en vez de su marca era la desalineación más cara de las tres, porque
          es la marca hija que el proyecto está construyendo.

          Se usa la variante `alt` —el símbolo SIN la palabra «GEVY»—. La versión
          con texto existe y aquí no vale: a 39 px la palabra mide 8 px de alto.
          Para un glifo se usa el símbolo; el lockup es para cuando hay sitio.
        */}
        <span className="marketplace-commerce-core__glyph marca-halo marca-halo--gevy" aria-hidden="true">
          <Image
            src={rutaPublica('/brand/gevy-alt-512.png')}
            alt=""
            width={90}
            height={90}
            className="object-contain"
            aria-hidden
          />
        </span>
      </div>
    </div>
  )
}
