'use client'

import { rutaPublica } from '@/lib/rutaPublica'
import { TOKEN_VALUE_PULSE_S } from '@/lib/token/tokenOrbitalValueLayout'

interface TokenValueCoreProps {
  compact?: boolean
}

/* `rutaPublica`: sin esto, al colgar el sitio de una subcarpeta estas
   imagenes apuntan a la raiz del dominio y dan 404. Pasó de verdad — tres
   `.webp` rotos en `aigenesis.io/nueva/`, vistos en la consola del navegador y
   no por mi barrido, porque yo habia buscado `/brand/` y `/docs/` en vez de la
   clase entera: cualquier cadena literal que empiece por `/`. */
const ASSET_BASE = rutaPublica('/assets/token-core')

const NUCLEUS_IMAGE_LAYERS = [
  {
    id: 'energy-ring',
    file: 'genesis-energy-ring',
    wrapClass: 'token-value-core__energy-ring',
    imgClass: 'token-value-core__energy-ring-img',
    priority: true,
  },
  {
    id: 'sparks',
    file: 'genesis-nucleus-sparks',
    wrapClass: 'token-value-core__sparks',
    imgClass: 'token-value-core__sparks-img',
  },
] as const

function NucleusImageLayer({
  file,
  wrapClass,
  imgClass,
  priority = false,
}: {
  file: string
  wrapClass: string
  imgClass: string
  priority?: boolean
}) {
  const base = `${ASSET_BASE}/${file}`
  return (
    <div className={wrapClass} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${base}.png`}
        srcSet={`${base}.webp 1x, ${base}@2x.webp 2x`}
        alt=""
        className={imgClass}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        draggable={false}
      />
    </div>
  )
}

export default function TokenValueCore({ compact = false }: TokenValueCoreProps) {
  return (
    <div
      className={`token-value-core${compact ? ' token-value-core--compact' : ''}`}
      style={{ '--token-value-pulse-s': `${TOKEN_VALUE_PULSE_S}s` } as React.CSSProperties}
    >
      <div className="token-value-core__halo-deep" aria-hidden="true" />

      <div className="token-value-core__volumetric" aria-hidden="true">
        <span className="token-value-core__volume token-value-core__volume--a" />
      </div>

      <div className="token-value-core__rings" aria-hidden="true">
        <span className="token-value-core__ring token-value-core__ring--energy" />
        <span className="token-value-core__ring token-value-core__ring--inner" />
      </div>

      <div className="token-value-core__nucleus">
        <div className="token-value-core__inner-glow" aria-hidden="true" />

        {NUCLEUS_IMAGE_LAYERS.map((layer) => (
          <NucleusImageLayer key={layer.id} {...layer} />
        ))}

        <div className="token-value-core__logo-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${ASSET_BASE}/genesis-nucleus-mark.png`}
            srcSet={`${ASSET_BASE}/genesis-nucleus-mark.webp 1x, ${ASSET_BASE}/genesis-nucleus-mark@2x.webp 2x`}
            alt=""
            className="token-value-core__nucleus-mark"
            loading="eager"
            decoding="async"
            draggable={false}
          />
        </div>
      </div>
    </div>
  )
}
