'use client'

import type { OracleSatelliteId } from '@/lib/goracle/quantumBrainLayout'

const iconProps = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  xmlns: 'http://www.w3.org/2000/svg',
  'aria-hidden': true as const,
}

export default function GoracleEcosystemIcon({ id }: { id: OracleSatelliteId }) {
  if (id === 'trust') {
    return (
      <svg {...iconProps}>
        <path
          d="M12 3.5L4.5 7v5.2c0 4.1 3.2 7.9 7.5 9.3 4.3-1.4 7.5-5.2 7.5-9.3V7L12 3.5z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path d="M9.2 12.2l1.8 1.8 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  if (id === 'mining') {
    return (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="2.8" stroke="currentColor" strokeWidth="1.2" />
        <path
          d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6.2 6.2l1.6 1.6M16.2 16.2l1.6 1.6M6.2 17.8l1.6-1.6M16.2 7.8l1.6-1.6"
          stroke="currentColor"
          strokeWidth="1.05"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  if (id === 'booster') {
    return (
      <svg {...iconProps}>
        <path
          d="M12 4.5v12M12 4.5l-3.5 3.5M12 4.5l3.5 3.5M8.5 18.5h7"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M9.5 14.5c1.2-2.2 4-2.2 5.2 0" stroke="currentColor" strokeWidth="1.05" strokeLinecap="round" opacity="0.75" />
      </svg>
    )
  }

  if (id === 'staking') {
    return (
      <svg {...iconProps}>
        <path d="M7.5 11V8.5a4.5 4.5 0 0 1 9 0V11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <rect x="5.5" y="11" width="13" height="9" rx="2.2" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="12" cy="15" r="1.1" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="2.4" stroke="currentColor" strokeWidth="1.15" />
      <path
        d="M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M5.5 18.5l1.4-1.4M17.1 6.9l1.4-1.4"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  )
}
