'use client'

import {
  MINING_CONSTELLATION_NODES,
  MINING_CONSTELLATION_PULSE_S,
  constellationNodePosition,
} from '@/lib/mining/miningConstellationLayout'
import { MiningNodeIcon } from '@/components/mining/MiningNetworkIcons'
import { respiracionDe, desfase } from '@/lib/design/motion'

interface MiningConstellationNodeProps {
  index: number
  compact?: boolean
}

export default function MiningConstellationNode({ index, compact = false }: MiningConstellationNodeProps) {
  const node = MINING_CONSTELLATION_NODES[index]
  if (!node) return null

  const { x, y } = constellationNodePosition(index)

  /**
   * Los nodos respiran TODOS al mismo ritmo, y se separan por retardo.
   *
   * Era `4 + (index % 3) * 0,65` — tres duraciones distintas (4 · 4,65 · 5,3)
   * para que no latieran a la vez. La intencion es buena; el metodo hace que
   * los nodos deriven unos de otros sin volver a coincidir nunca, y arrastra
   * dos valores fuera de la rejilla del portal.
   *
   * Mismo efecto a la vista, repartiendo el arranque dentro de un ciclo.
   */
  const respiracion = respiracionDe('mining')
  const retardo = desfase(index, 3, respiracion)

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
          '--node-breathe-s': `${respiracion}s`,
          '--node-breathe-delay': `${retardo.toFixed(3)}s`,
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
