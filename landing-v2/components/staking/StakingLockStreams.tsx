'use client'

import {
  stakingLockStreamPath,
  stakingOutflowPath,
  stakingShieldContourPath,
  STAKING_VAULT_CENTER,
  STAKING_VAULT_PULSE_S,
} from '@/lib/staking/timeVaultLayout'

export default function StakingLockStreams() {
  const streams = [0, 1, 2, 3, 4]
  const outflows = [0, 1, 2]

  return (
    <svg
      className="staking-lock-streams"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="staking-stream-grad" gradientUnits="userSpaceOnUse" x1="50" y1="8" x2="50" y2="92">
          <stop offset="0%" stopColor="#00F5FF" stopOpacity="0.55" />
          <stop offset="45%" stopColor="#2962FF" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#9D4DFF" stopOpacity="0.45" />
        </linearGradient>
        <filter id="staking-stream-glow" x="-40%" y="-20%" width="180%" height="140%">
          <feGaussianBlur stdDeviation="0.7" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path
        d={stakingShieldContourPath()}
        className="staking-stability-shield"
        fill="none"
        stroke="url(#staking-stream-grad)"
        filter="url(#staking-stream-glow)"
        style={{ '--vault-pulse-s': `${STAKING_VAULT_PULSE_S}s` } as React.CSSProperties}
      />

      {streams.map((i) => {
        const d = stakingLockStreamPath(i)
        const dur = `${5.5 + i * 0.6}s`
        return (
          <g key={`in-${i}`}>
            <path d={d} className="staking-lock-stream staking-lock-stream--in" fill="none" stroke="url(#staking-stream-grad)" />
            <circle r="0.65" className="staking-lock-stream__particle" fill="#00F5FF">
              <animateMotion dur={dur} repeatCount="indefinite" path={d} />
            </circle>
          </g>
        )
      })}

      {outflows.map((i) => {
        const d = stakingOutflowPath(i)
        const dur = `${7 + i * 0.8}s`
        return (
          <g key={`out-${i}`}>
            <path d={d} className="staking-lock-stream staking-lock-stream--out" fill="none" stroke="url(#staking-stream-grad)" />
            <circle r="0.45" className="staking-lock-stream__particle staking-lock-stream__particle--out" fill="#2962FF">
              <animateMotion dur={dur} repeatCount="indefinite" path={d} begin={`${i * 0.4}s`} />
            </circle>
          </g>
        )
      })}

      <circle
        cx={STAKING_VAULT_CENTER.x}
        cy={STAKING_VAULT_CENTER.y}
        r="1.2"
        className="staking-lock-stream__core-anchor"
        fill="#FF00C8"
      />
    </svg>
  )
}
