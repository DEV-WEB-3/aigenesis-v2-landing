'use client'

type MiningIconKind = 'emission' | 'participation' | 'distribution'

const iconProps = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  xmlns: 'http://www.w3.org/2000/svg',
  'aria-hidden': true as const,
}

export function MiningStoryIcon({ kind }: { kind: MiningIconKind }) {
  if (kind === 'emission') {
    return (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="1.35" />
        <path
          d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.4 5.4l1.7 1.7M16.9 16.9l1.7 1.7M5.4 18.6l1.7-1.7M16.9 7.1l1.7-1.7"
          stroke="currentColor"
          strokeWidth="1.15"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  if (kind === 'participation') {
    return (
      <svg {...iconProps}>
        <circle cx="6.5" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.25" />
        <circle cx="17.5" cy="7" r="2.6" stroke="currentColor" strokeWidth="1.25" />
        <circle cx="17.5" cy="17" r="2.6" stroke="currentColor" strokeWidth="1.25" />
        <path
          d="M8.8 11.2l5.8-3.2M8.8 12.8l5.8 3.2M14.6 8.8l0 6.4"
          stroke="currentColor"
          strokeWidth="1.15"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  return (
    <svg {...iconProps}>
      <path
        d="M3.5 12c2.6-4.2 5.2-4.2 7.8 0s5.2 4.2 7.8 0"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M3.5 16.2c2.6-4.2 5.2-4.2 7.8 0s5.2 4.2 7.8 0"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        opacity="0.72"
      />
      <circle cx="19.8" cy="12" r="1.6" fill="currentColor" />
    </svg>
  )
}
