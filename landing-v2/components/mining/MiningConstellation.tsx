'use client'

import {
  MINING_CONSTELLATION_CENTER,
  MINING_CONSTELLATION_NODES,
  MINING_CONSTELLATION_PULSE_S,
  constellationMobileIndices,
} from '@/lib/mining/miningConstellationLayout'
import MiningConstellationCore from '@/components/mining/MiningConstellationCore'
import MiningConstellationNode from '@/components/mining/MiningConstellationNode'
import MiningConstellationStreams from '@/components/mining/MiningConstellationStreams'
import { useSectionVisualActive } from '@/hooks/useSectionVisualActive'

interface MiningConstellationProps {
  isActive: boolean
  variant?: 'full' | 'compact'
}

export default function MiningConstellation({ isActive, variant = 'full' }: MiningConstellationProps) {
  const visible = useSectionVisualActive(isActive)
  if (!visible) return null

  const isCompact = variant === 'compact'
  const visibleIndices = isCompact
    ? constellationMobileIndices()
    : MINING_CONSTELLATION_NODES.map((_, i) => i)

  return (
    <div
      className={`mining-constellation${isCompact ? ' mining-constellation--compact' : ''}`}
      aria-label="Red Genesis Mining"
      style={{ '--constellation-pulse-s': `${MINING_CONSTELLATION_PULSE_S}s` } as React.CSSProperties}
    >
      <div className="mining-constellation__layer mining-constellation__layer--mid">
        <MiningConstellationStreams visibleIndices={visibleIndices} />
      </div>

      <div className="mining-constellation__layer mining-constellation__layer--front">
        <div className="mining-constellation__stage">
          <div
            className="mining-constellation__core-anchor"
            style={{
              left: `${MINING_CONSTELLATION_CENTER.x}%`,
              top: `${MINING_CONSTELLATION_CENTER.y}%`,
            }}
          >
            <MiningConstellationCore compact={isCompact} />
          </div>
          {visibleIndices.map((index) => (
            <MiningConstellationNode key={MINING_CONSTELLATION_NODES[index]?.id ?? index} index={index} compact={isCompact} />
          ))}
        </div>
      </div>
    </div>
  )
}
