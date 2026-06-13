'use client'

import { ORACLE_BRAIN_CENTER, ORACLE_INFERENCE_PULSE_S } from '@/lib/goracle/quantumBrainLayout'

const ORBIT_COUNT = 12

export default function GoracleNeuralCore() {
  return (
    <div
      className="goracle-neural-core"
      style={
        {
          left: `${ORACLE_BRAIN_CENTER.x}%`,
          top: `${ORACLE_BRAIN_CENTER.y}%`,
          '--oracle-pulse-s': `${ORACLE_INFERENCE_PULSE_S}s`,
        } as React.CSSProperties
      }
    >
      <div className="goracle-neural-core__volumetric" aria-hidden="true">
        <span className="goracle-neural-core__volume goracle-neural-core__volume--a" />
        <span className="goracle-neural-core__volume goracle-neural-core__volume--b" />
        <span className="goracle-neural-core__volume goracle-neural-core__volume--c" />
      </div>

      <div className="goracle-neural-core__orbit-field" aria-hidden="true">
        {Array.from({ length: ORBIT_COUNT }, (_, i) => (
          <span
            key={i}
            className="goracle-neural-core__orbit-particle"
            style={
              {
                '--orbit-angle': `${i * (360 / ORBIT_COUNT)}deg`,
                animationDelay: `${i * 0.42}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className="goracle-neural-core__nucleus">
        <span className="goracle-neural-core__inner-glow" aria-hidden="true" />
        <span className="goracle-neural-core__inference-ring goracle-neural-core__inference-ring--a" aria-hidden="true" />
        <span className="goracle-neural-core__inference-ring goracle-neural-core__inference-ring--b" aria-hidden="true" />
        <span className="goracle-neural-core__glyph" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="34" height="34" fill="none">
            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.1" />
            <circle cx="12" cy="12" r="1.4" fill="currentColor" opacity="0.85" />
            <path
              d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M5.8 5.8l1.8 1.8M16.4 16.4l1.8 1.8M5.8 18.2l1.8-1.8M16.4 7.6l1.8-1.8"
              stroke="currentColor"
              strokeWidth="0.95"
              strokeLinecap="round"
              opacity="0.7"
            />
          </svg>
        </span>
      </div>
    </div>
  )
}
