'use client'

import {
  MINING_CONSTELLATION_NODES,
  MINING_CONSTELLATION_PULSE_S,
  constellationNodePosition,
} from '@/lib/mining/miningConstellationLayout'
import { MiningNodeIcon } from '@/components/mining/MiningNetworkIcons'

interface MiningConstellationNodeProps {
  index: number
  compact?: boolean
}

export default function MiningConstellationNode({ index, compact = false }: MiningConstellationNodeProps) {
  const node = MINING_CONSTELLATION_NODES[index]
  if (!node) return null

  const { x, y } = constellationNodePosition(index)
  const breatheDur = 4 + (index % 3) * 0.65

  return (
    <div
      className="mining-constellation-node"
      data-node={node.id}
      style={
        {
          '--nx': `${x}%`,
          '--ny': `${y}%`,
          '--node-color': node.color,
          '--node-glow': node.glow,
          '--node-pulse-offset': node.pulseOffset,
          '--node-breathe-s': `${breatheDur}s`,
          animationDelay: `${index * 0.18}s`,
        } as React.CSSProperties
      }
    >
      <span className="mining-constellation-node__halo" aria-hidden="true" />
      <span className="mining-constellation-node__ring" aria-hidden="true" />
      <span className="mining-constellation-node__pulse-flash" aria-hidden="true" />
      <span className="mining-constellation-node__icon">
        <MiningNodeIcon id={node.id} size={compact ? 20 : 24} />
      </span>
    </div>
  )
}

export { MINING_CONSTELLATION_PULSE_S }
