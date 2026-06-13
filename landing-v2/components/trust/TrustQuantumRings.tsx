'use client'

import { TRUST_QUANTUM_RING } from '@/lib/trust/trustGenesisCoreLayout'

export default function TrustQuantumRings() {
  const cx = 50
  const cy = 50

  return (
    <svg
      className="trust-quantum-rings"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="trust-ring-grad" gradientUnits="userSpaceOnUse" x1="0" y1="50" x2="100" y2="50">
          <stop offset="0%" stopColor="#00F5FF" stopOpacity="0.35" />
          <stop offset="50%" stopColor="#9B4DFF" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#FF00C8" stopOpacity="0.32" />
        </linearGradient>
      </defs>

      <g
        className="trust-quantum-rings__outer"
        style={
          {
            '--trust-ring-dur': `${TRUST_QUANTUM_RING.outer.duration}s`,
            '--trust-ring-opacity': TRUST_QUANTUM_RING.outer.opacity,
          } as React.CSSProperties
        }
      >
        <circle
          cx={cx}
          cy={cy}
          r={TRUST_QUANTUM_RING.outer.radius}
          fill="none"
          stroke="url(#trust-ring-grad)"
          strokeWidth="0.28"
        />
      </g>
      <g
        className="trust-quantum-rings__middle"
        style={
          {
            '--trust-ring-dur': `${TRUST_QUANTUM_RING.middle.duration}s`,
            '--trust-ring-opacity': TRUST_QUANTUM_RING.middle.opacity,
          } as React.CSSProperties
        }
      >
        <circle
          cx={cx}
          cy={cy}
          r={TRUST_QUANTUM_RING.middle.radius}
          fill="none"
          stroke="url(#trust-ring-grad)"
          strokeWidth="0.24"
        />
      </g>
      <g
        className="trust-quantum-rings__inner"
        style={
          {
            '--trust-ring-dur': `${TRUST_QUANTUM_RING.inner.duration}s`,
            '--trust-ring-opacity': TRUST_QUANTUM_RING.inner.opacity,
          } as React.CSSProperties
        }
      >
        <circle
          cx={cx}
          cy={cy}
          r={TRUST_QUANTUM_RING.inner.radius}
          fill="none"
          stroke="url(#trust-ring-grad)"
          strokeWidth="0.2"
        />
      </g>
    </svg>
  )
}
