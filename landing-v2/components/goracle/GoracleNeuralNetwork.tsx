'use client'

import { useMemo } from 'react'
import {
  ORACLE_NEURAL_NODE_COUNT,
  ORACLE_INFERENCE_PULSE_S,
  buildSynapseConnections,
  neuralNodePosition,
  synapsePath,
} from '@/lib/goracle/quantumBrainLayout'

export default function GoracleNeuralNetwork() {
  const synapses = useMemo(() => buildSynapseConnections(), [])

  return (
    <svg
      className="goracle-neural-network"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      style={{ '--oracle-pulse-s': `${ORACLE_INFERENCE_PULSE_S}s` } as React.CSSProperties}
    >
      <defs>
        <linearGradient id="goracle-synapse-grad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="100">
          <stop offset="0%" stopColor="#00F5FF" stopOpacity="0.35" />
          <stop offset="50%" stopColor="#9D4DFF" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#FF00C8" stopOpacity="0.3" />
        </linearGradient>
        <filter id="goracle-node-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="0.65" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {synapses.map(({ from, to }, i) => {
        const d = synapsePath(from, to)
        const delay = (i % 24) * 0.12
        return (
          <path
            key={`${from}-${to}`}
            d={d}
            className="goracle-synapse"
            fill="none"
            stroke="url(#goracle-synapse-grad)"
            style={{ animationDelay: `${delay}s` } as React.CSSProperties}
          />
        )
      })}

      {Array.from({ length: ORACLE_NEURAL_NODE_COUNT }, (_, i) => {
        const { x, y } = neuralNodePosition(i)
        const delay = (i / ORACLE_NEURAL_NODE_COUNT) * 4.8
        return (
          <g key={i} className="goracle-neural-node" style={{ animationDelay: `${delay}s` } as React.CSSProperties}>
            <circle cx={x} cy={y} r="0.55" className="goracle-neural-node__dot" fill="#9D4DFF" filter="url(#goracle-node-glow)" />
          </g>
        )
      })}
    </svg>
  )
}
