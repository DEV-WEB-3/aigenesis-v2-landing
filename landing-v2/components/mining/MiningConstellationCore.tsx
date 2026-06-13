'use client'

import { MINING_CONSTELLATION_PULSE_S } from '@/lib/mining/miningConstellationLayout'
import { MiningCoreIcon } from '@/components/mining/MiningNetworkIcons'

const ORBIT_COUNT = 7

interface MiningConstellationCoreProps {
  compact?: boolean
}

export default function MiningConstellationCore({ compact = false }: MiningConstellationCoreProps) {
  const iconSize = compact ? 34 : 46

  return (
    <div
      className="mining-constellation-core"
      style={{ '--constellation-pulse-s': `${MINING_CONSTELLATION_PULSE_S}s` } as React.CSSProperties}
    >
      <div className="mining-constellation-core__volumetric" aria-hidden="true">
        <span className="mining-constellation-core__volume mining-constellation-core__volume--a" />
        <span className="mining-constellation-core__volume mining-constellation-core__volume--b" />
        <span className="mining-constellation-core__volume mining-constellation-core__volume--c" />
      </div>

      <div className="mining-constellation-core__rings" aria-hidden="true">
        <span className="mining-constellation-core__ring mining-constellation-core__ring--outer" />
        <span className="mining-constellation-core__ring mining-constellation-core__ring--mid" />
        <span className="mining-constellation-core__ring mining-constellation-core__ring--inner" />
      </div>

      <div className="mining-constellation-core__orbit-field" aria-hidden="true">
        {Array.from({ length: ORBIT_COUNT }, (_, i) => (
          <span
            key={i}
            className="mining-constellation-core__orbit-particle"
            style={
              {
                '--orbit-angle': `${i * (360 / ORBIT_COUNT)}deg`,
                animationDelay: `${i * 0.38}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className="mining-constellation-core__nucleus">
        <div className="mining-constellation-core__inner-glow" aria-hidden="true" />
        <div className="mining-constellation-core__icon">
          <MiningCoreIcon size={iconSize} />
        </div>
      </div>
    </div>
  )
}
