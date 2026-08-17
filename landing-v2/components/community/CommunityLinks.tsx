'use client'

import { EMISSION } from '@/lib/design/tokens'

import { COMMUNITY_LINKS, COMMUNITY_PULSE_S, communityLinkPath } from '@/lib/community/communityNetworkLayout'

export default function CommunityLinks() {
  return (
    <svg
      className="community-links"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      style={{ '--community-pulse-s': `${COMMUNITY_PULSE_S}s` } as React.CSSProperties}
    >
      <defs>
        {/*
          El degradado multiplica a la opacidad de la animacion, no la sustituye.

          Con 0,55→0,28 y una animacion que llegaba a 0,46, la visibilidad real
          de la red era de 0,13 a 0,25 sobre fondo casi negro. Aqui se sube el
          suelo del degradado; el resto lo hace la animacion, que ya no baja a
          cero.
        */}
        <linearGradient id="community-link-grad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="100">
          <stop offset="0%" stopColor={EMISSION.violetHi} stopOpacity="0.95" />
          <stop offset="55%" stopColor={EMISSION.blueHi} stopOpacity="0.7" />
          <stop offset="100%" stopColor={EMISSION.cyan} stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {COMMUNITY_LINKS.map((link) => {
        const d = communityLinkPath(link.from, link.to)
        return (
          <path
            key={link.id}
            d={d}
            className="community-link"
            fill="none"
            stroke="url(#community-link-grad)"
            /*
              `--link-fase` en vez de `animationDelay` en linea: la regla aplica
              DOS animaciones —respiracion y flujo— y un `animationDelay` en
              linea gana al de la hoja y les pone el mismo valor a las dos por
              la via equivocada. Con la variable, la hoja sigue decidiendo.
            */
            style={{ '--link-fase': `${link.lifecycleOffset}s` } as React.CSSProperties}
          />
        )
      })}
    </svg>
  )
}
