'use client'

import { ORACLE_ECOSYSTEM_SATELLITES, ORACLE_INFERENCE_PULSE_S } from '@/lib/goracle/quantumBrainLayout'
import GoracleEcosystemIcon from '@/components/goracle/GoracleEcosystemIcon'

export default function GoracleEcosystemSatellites() {
  return (
    <div
      className="goracle-ecosystem-satellites"
      style={{ '--oracle-pulse-s': `${ORACLE_INFERENCE_PULSE_S}s` } as React.CSSProperties}
    >
      {ORACLE_ECOSYSTEM_SATELLITES.map((sat) => (
        <div
          key={sat.id}
          className="goracle-ecosystem-satellite"
          data-satellite={sat.id}
          style={
            {
              left: `${sat.x}%`,
              top: `${sat.y}%`,
              animationDelay: `${sat.pulseOffset * ORACLE_INFERENCE_PULSE_S}s`,
            } as React.CSSProperties
          }
        >
          <span className="goracle-ecosystem-satellite__halo" aria-hidden="true" />
          <span className="goracle-ecosystem-satellite__ring" aria-hidden="true" />
          <span className="goracle-ecosystem-satellite__icon">
            <GoracleEcosystemIcon id={sat.id} />
          </span>
        </div>
      ))}
    </div>
  )
}
