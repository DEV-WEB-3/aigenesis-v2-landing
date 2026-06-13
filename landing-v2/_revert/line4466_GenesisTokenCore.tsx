'use client'

import Image from 'next/image'

export type GenesisTokenCoreLayerId =
  | 'ambientGlow'
  | 'outerRing'
  | 'midRing'
  | 'innerRing'
  | 'radialBars'
  | 'centerC'
  | 'sparks'
  | 'particles'
  | 'coreLogo'

export type GenesisTokenCoreLayers = Record<GenesisTokenCoreLayerId, boolean>

const ASSET_BASE = '/assets/genesis-token-core'

const DEFAULT_LAYERS: GenesisTokenCoreLayers = {
  ambientGlow: true,
  outerRing: true,
  midRing: true,
  innerRing: true,
  radialBars: true,
  centerC: true,
  sparks: true,
  particles: true,
  coreLogo: false,
}

interface LayerDef {
  id: GenesisTokenCoreLayerId
  file: string
  zIndex: number
  className: string
  scale?: number
}

/** Stacking order — coreLogo optional full composite; production uses decomposed layers. */
const LAYER_STACK: LayerDef[] = [
  { id: 'ambientGlow', file: 'genesis-ambient-glow', zIndex: 1, className: 'genesis-token-core__layer--ambient' },
  { id: 'outerRing', file: 'genesis-outer-ring', zIndex: 2, className: 'genesis-token-core__layer--outer-ring' },
  { id: 'midRing', file: 'genesis-mid-ring', zIndex: 3, className: 'genesis-token-core__layer--mid-ring' },
  { id: 'innerRing', file: 'genesis-inner-ring', zIndex: 4, className: 'genesis-token-core__layer--inner-ring' },
  { id: 'radialBars', file: 'genesis-radial-bars', zIndex: 5, className: 'genesis-token-core__layer--radial-bars' },
  { id: 'centerC', file: 'genesis-center-c', zIndex: 6, className: 'genesis-token-core__layer--center-c', scale: 0.42 },
  { id: 'sparks', file: 'genesis-sparks', zIndex: 7, className: 'genesis-token-core__layer--sparks', scale: 0.88 },
  { id: 'particles', file: 'genesis-particles', zIndex: 8, className: 'genesis-token-core__layer--particles', scale: 0.95 },
  { id: 'coreLogo', file: 'genesis-core-logo', zIndex: 9, className: 'genesis-token-core__layer--core-logo' },
]

interface GenesisTokenCoreProps {
  compact?: boolean
  layers?: Partial<GenesisTokenCoreLayers>
  className?: string
}

function LayerImage({ file, alt, priority }: { file: string; alt: string; priority?: boolean }) {
  const base = `${ASSET_BASE}/${file}`
  return (
    <picture>
      <source
        type="image/webp"
        srcSet={`${base}.webp 1x, ${base}@2x.webp 2x`}
      />
      <Image
        src={`${base}.webp`}
        alt={alt}
        fill
        sizes="(max-width: 768px) 80px, 120px"
        className="genesis-token-core__img"
        priority={priority}
        draggable={false}
      />
    </picture>
  )
}

export default function GenesisTokenCore({
  compact = false,
  layers: layerOverrides,
  className = '',
}: GenesisTokenCoreProps) {
  const layers: GenesisTokenCoreLayers = { ...DEFAULT_LAYERS, ...layerOverrides }

  return (
    <div
      className={`genesis-token-core${compact ? ' genesis-token-core--compact' : ''}${className ? ` ${className}` : ''}`}
      aria-hidden="true"
    >
      {LAYER_STACK.map((layer, index) => {
        if (!layers[layer.id]) return null
        const scale = layer.scale ?? 1
        return (
          <div
            key={layer.id}
            className={`genesis-token-core__layer ${layer.className}`}
            style={{ zIndex: layer.zIndex, '--gtc-scale': scale } as React.CSSProperties}
            data-layer={layer.id}
          >
            <div className="genesis-token-core__layer-frame">
              <LayerImage
                file={layer.file}
                alt=""
                priority={index < 3}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export { DEFAULT_LAYERS, LAYER_STACK }
