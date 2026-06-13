'use client'

import { ORACLE_NEURAL_LAYERS, ORACLE_INFERENCE_PULSE_S } from '@/lib/goracle/quantumBrainLayout'

interface GoracleNeuralLayersProps {
  depth: 'back' | 'front'
}

export default function GoracleNeuralLayers({ depth }: GoracleNeuralLayersProps) {
  const layers = depth === 'back' ? ORACLE_NEURAL_LAYERS.slice(0, 2) : ORACLE_NEURAL_LAYERS

  return (
    <div
      className={`goracle-neural-layers goracle-neural-layers--${depth}`}
      style={{ '--oracle-pulse-s': `${ORACLE_INFERENCE_PULSE_S}s` } as React.CSSProperties}
    >
      {layers.map((layer, index) => (
        <div
          key={layer.id}
          className="goracle-neural-layer"
          data-layer={layer.id}
          style={
            {
              '--layer-rx': `${layer.rx * 2}%`,
              '--layer-ry': `${layer.ry * 2}%`,
              '--layer-depth': layer.depth,
              '--layer-opacity': layer.opacity,
              animationDelay: `${index * 0.35}s`,
            } as React.CSSProperties
          }
        >
          <span className="goracle-neural-layer__cloud" aria-hidden="true" />
          <span className="goracle-neural-layer__veil" aria-hidden="true" />
        </div>
      ))}
    </div>
  )
}
