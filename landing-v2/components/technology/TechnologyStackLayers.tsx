'use client'

import { TECH_STACK_LAYERS, TECH_STACK_PULSE_S } from '@/lib/technology/techStackLayout'

export default function TechnologyStackLayers() {
  return (
    <svg
      className="technology-stack-layers"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      style={{ '--tech-pulse-s': `${TECH_STACK_PULSE_S}s` } as React.CSSProperties}
    >
      <defs>
        <filter id="tech-layer-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="0.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {TECH_STACK_LAYERS.map((layer) => {
        const half = layer.width / 2
        const x = 50 - half
        const delay = layer.pulseOffset * TECH_STACK_PULSE_S
        return (
          <g
            key={layer.id}
            className="technology-stack-layer"
            data-layer={layer.id}
            style={{ animationDelay: `${delay}s` } as React.CSSProperties}
          >
            <rect
              x={x}
              y={layer.y - 2.8}
              width={layer.width}
              height={5.6}
              rx={2.8}
              className="technology-stack-layer__plate"
              fill="rgba(6, 8, 20, 0.55)"
              stroke={layer.color}
              strokeWidth="0.35"
              filter="url(#tech-layer-glow)"
            />
            <text
              x="50"
              y={layer.y + 0.9}
              textAnchor="middle"
              className="technology-stack-layer__label"
              fill={layer.color}
              fontSize="2.8"
              fontFamily="var(--font-space-grotesk, system-ui)"
            >
              {layer.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
