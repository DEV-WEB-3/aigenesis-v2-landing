'use client'

import {
  PORTAL_ABSORB_S,
  PORTAL_CORE_PULSE_S,
  PORTAL_FORM_S,
  PORTAL_CENTER,
  PORTAL_CYAN,
  PORTAL_PURPLE,
  PORTAL_CORE_COLOR,
  PORTAL_RING,
} from '@/lib/portal/genesisPortalLayout'

export default function GenesisPortalRings() {
  const { x: cx, y: cy } = PORTAL_CENTER

  return (
    <svg
      className="genesis-portal-rings"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="portal-ring-outer" gradientUnits="userSpaceOnUse" x1="0" y1="50" x2="100" y2="50">
          <stop offset="0%" stopColor={PORTAL_CYAN} stopOpacity="0.85" />
          <stop offset="55%" stopColor={PORTAL_PURPLE} stopOpacity="0.55" />
          <stop offset="100%" stopColor={PORTAL_CYAN} stopOpacity="0.75" />
        </linearGradient>
        <linearGradient id="portal-ring-middle" gradientUnits="userSpaceOnUse" x1="50" y1="0" x2="50" y2="100">
          <stop offset="0%" stopColor={PORTAL_CYAN} stopOpacity="0.45" />
          <stop offset="50%" stopColor={PORTAL_PURPLE} stopOpacity="0.75" />
          <stop offset="100%" stopColor={PORTAL_CORE_COLOR} stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="portal-ring-core" gradientUnits="userSpaceOnUse" x1="20" y1="20" x2="80" y2="80">
          <stop offset="0%" stopColor={PORTAL_PURPLE} stopOpacity="0.65" />
          <stop offset="100%" stopColor={PORTAL_CORE_COLOR} stopOpacity="0.9" />
        </linearGradient>
        <filter id="portal-ring-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="0.55" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g
        className="genesis-portal-rings__outer"
        style={{ '--portal-spin-dur': `${PORTAL_RING.outer.duration}s` } as React.CSSProperties}
      >
        <ellipse
          cx={cx}
          cy={cy}
          rx={PORTAL_RING.outer.radius * PORTAL_RING.outer.rx}
          ry={PORTAL_RING.outer.radius * PORTAL_RING.outer.ry}
          fill="none"
          stroke="url(#portal-ring-outer)"
          strokeWidth="0.42"
          filter="url(#portal-ring-glow)"
        />
      </g>

      <g
        className="genesis-portal-rings__middle"
        style={{ '--portal-spin-dur': `${PORTAL_RING.middle.duration}s` } as React.CSSProperties}
      >
        <ellipse
          cx={cx}
          cy={cy}
          rx={PORTAL_RING.middle.radius * PORTAL_RING.middle.rx}
          ry={PORTAL_RING.middle.radius * PORTAL_RING.middle.ry}
          fill="none"
          stroke="url(#portal-ring-middle)"
          strokeWidth="0.48"
          filter="url(#portal-ring-glow)"
        />
      </g>

      <g
        className="genesis-portal-rings__core"
        style={{ '--portal-spin-dur': `${PORTAL_RING.core.duration}s` } as React.CSSProperties}
      >
        <ellipse
          cx={cx}
          cy={cy}
          rx={PORTAL_RING.core.radius * PORTAL_RING.core.rx}
          ry={PORTAL_RING.core.radius * PORTAL_RING.core.ry}
          fill="none"
          stroke="url(#portal-ring-core)"
          strokeWidth="0.52"
          filter="url(#portal-ring-glow)"
        />
      </g>
    </svg>
  )
}
