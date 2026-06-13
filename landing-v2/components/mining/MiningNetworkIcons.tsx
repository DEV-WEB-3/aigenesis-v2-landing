'use client'

import type { MiningConstellationNodeId } from '@/lib/mining/miningConstellationLayout'

const base = {
  fill: 'none' as const,
  xmlns: 'http://www.w3.org/2000/svg',
  'aria-hidden': true as const,
}

/** Abstract Genesis nucleus — no star / asterisk. */
export function MiningCoreIcon({ size = 40 }: { size?: number }) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="9" stroke="currentColor" strokeWidth="0.9" opacity="0.28" />
      <circle cx="16" cy="16" r="5.8" stroke="currentColor" strokeWidth="1.15" opacity="0.65" />
      <circle cx="16" cy="16" r="2.2" fill="currentColor" opacity="0.85" />
      <path
        d="M16 8.5v2M16 21.5v2M8.5 16h2M21.5 16h2"
        stroke="currentColor"
        strokeWidth="0.85"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M16 11.5c1.8 0 3.2 1.4 3.2 3.2s-1.4 3.2-3.2 3.2"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  )
}

export function MiningNodeIcon({ id, size = 22 }: { id: MiningConstellationNodeId; size?: number }) {
  const props = { ...base, width: size, height: size, viewBox: '0 0 24 24' }

  switch (id) {
    case 'media':
      return (
        <svg {...props}>
          <rect x="4" y="6" width="16" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M9 10h6M9 13h4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
        </svg>
      )
    case 'entrepreneurs':
      return (
        <svg {...props}>
          <path d="M12 5l2 4.2 4.6.7-3.3 3.2.8 4.6L12 15.2 7.9 17.7l.8-4.6L5.4 10l4.6-.7z" stroke="currentColor" strokeWidth="1.15" strokeLinejoin="round" />
        </svg>
      )
    case 'investors':
      return (
        <svg {...props}>
          <path d="M5 17V9l7-4 7 4v8" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M9 17v-5h6v5" stroke="currentColor" strokeWidth="1.15" strokeLinejoin="round" />
        </svg>
      )
    case 'education':
      return (
        <svg {...props}>
          <path d="M3 9.5L12 5l9 4.5L12 14 3 9.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M7 11.5V16c0 1.2 2.2 2.5 5 2.5s5-1.3 5-2.5v-4.5" stroke="currentColor" strokeWidth="1.1" />
        </svg>
      )
    case 'government':
      return (
        <svg {...props}>
          <path d="M5 19V8l7-3 7 3v11" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M9 19v-6h6v6" stroke="currentColor" strokeWidth="1.15" />
        </svg>
      )
    case 'mentors':
      return (
        <svg {...props}>
          <circle cx="12" cy="8.5" r="2.6" stroke="currentColor" strokeWidth="1.2" />
          <path d="M6.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      )
    case 'tech':
      return (
        <svg {...props}>
          <rect x="5" y="5" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M8.5 19h7M10 15v4M14 15v4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
        </svg>
      )
    case 'culture':
      return (
        <svg {...props}>
          <path d="M6 17c0-4 2.7-7 6-7s6 3 6 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="9" cy="11" r="1" fill="currentColor" />
          <circle cx="15" cy="11" r="1" fill="currentColor" />
        </svg>
      )
    default:
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      )
  }
}

export function MiningKpiIcon({ kind }: { kind: 'cycle' | 'chain' | 'network' }) {
  const props = { ...base, width: 18, height: 18, viewBox: '0 0 24 24' }
  if (kind === 'cycle') {
    return (
      <svg {...props}>
        <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="1.25" />
        <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      </svg>
    )
  }
  if (kind === 'chain') {
    return (
      <svg {...props}>
        <path d="M7 12h3l1.5-3 3 6 1.5-3h3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="5" cy="12" r="1.5" fill="currentColor" />
        <circle cx="19" cy="12" r="1.5" fill="currentColor" />
      </svg>
    )
  }
  return (
    <svg {...props}>
      <circle cx="6" cy="12" r="2.2" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="18" cy="6" r="2.2" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="18" cy="18" r="2.2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 11l8-4M8 13l8 4" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" />
    </svg>
  )
}
