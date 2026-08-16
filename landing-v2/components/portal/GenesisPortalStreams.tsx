'use client'

import { EMISSION } from '@/lib/design/tokens'

import { PORTAL_STREAM_COUNT, portalStreamPath } from '@/lib/portal/genesisPortalLayout'

export default function GenesisPortalStreams() {
  return (
    <svg
      className="genesis-portal-streams"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="portal-stream-grad" gradientUnits="userSpaceOnUse" x1="50" y1="50" x2="50" y2="0">
          <stop offset="0%" stopColor={EMISSION.magenta} stopOpacity="0.55" />
          <stop offset="45%" stopColor={EMISSION.violetHi} stopOpacity="0.35" />
          <stop offset="100%" stopColor={EMISSION.cyan} stopOpacity="0.08" />
        </linearGradient>
      </defs>
      {Array.from({ length: PORTAL_STREAM_COUNT }, (_, i) => (
        <path
          key={i}
          d={portalStreamPath(i)}
          className="genesis-portal-streams__path"
          fill="none"
          stroke="url(#portal-stream-grad)"
          strokeWidth="0.22"
          style={{ animationDelay: `${i * 0.42}s` } as React.CSSProperties}
        />
      ))}
    </svg>
  )
}
