'use client'

import type { TokenValueNodeId } from '@/lib/token/tokenOrbitalValueLayout'

const base = {
  fill: 'none' as const,
  xmlns: 'http://www.w3.org/2000/svg',
  'aria-hidden': true as const,
}

/** Inline glyph for embedding inside parent SVG (atomic orbit nodes). */
export function TokenValueIconGlyph({ id }: { id: TokenValueNodeId }) {
  switch (id) {
    case 'wallet':
      return (
        <g stroke="currentColor">
          <rect x="4" y="7" width="16" height="11" rx="2" strokeWidth="1.15" />
          <path d="M4 10h16" strokeWidth="1.1" />
          <circle cx="16.5" cy="13" r="1.2" fill="currentColor" stroke="none" opacity="0.85" />
        </g>
      )
    case 'marketplace':
      return (
        <g stroke="currentColor">
          <path d="M5 9l2-4h10l2 4" strokeWidth="1.15" strokeLinejoin="round" />
          <rect x="5" y="9" width="14" height="10" rx="1.5" strokeWidth="1.15" />
          <path d="M9 13h6" strokeWidth="1.1" strokeLinecap="round" />
        </g>
      )
    case 'ai':
      return (
        <g stroke="currentColor">
          <circle cx="12" cy="12" r="3.2" strokeWidth="1.15" />
          <path d="M12 5.5v2M12 16.5v2M5.5 12h2M16.5 12h2" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
          <path d="M8 8.5l1.2 1.2M14.8 14.8l1.2 1.2M15.5 8.5l-1.2 1.2M9.2 14.8l-1.2 1.2" strokeWidth="0.95" strokeLinecap="round" opacity="0.55" />
          <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" opacity="0.85" />
        </g>
      )
    case 'holders':
      return (
        <g stroke="currentColor">
          <circle cx="9" cy="10" r="2.2" strokeWidth="1.1" />
          <circle cx="15" cy="10" r="2.2" strokeWidth="1.1" />
          <path d="M5.5 18c0-2.2 1.8-4 3.5-4s3.5 1.8 3.5 4M12 18c0-2.2 1.8-4 3.5-4s3.5 1.8 3.5 4" strokeWidth="1.1" strokeLinecap="round" />
        </g>
      )
    case 'rewards':
      return (
        <g stroke="currentColor">
          <path d="M12 5l1.8 3.6 4 .6-2.9 2.8.7 4L12 14.2 8.4 16.2l.7-4L6.2 9.2l4-.6L12 5z" strokeWidth="1.1" strokeLinejoin="round" />
        </g>
      )
    case 'education':
      return (
        <g stroke="currentColor">
          <path d="M3 9.5L12 5l9 4.5L12 14 3 9.5z" strokeWidth="1.15" strokeLinejoin="round" />
          <path d="M7 11.5V16c0 1.2 2.2 2.5 5 2.5s5-1.3 5-2.5v-4.5" strokeWidth="1.1" />
        </g>
      )
    case 'liquidity':
      return (
        <g stroke="currentColor">
          <path d="M5 14c2.5-4 4.5-6 7-6s4.5 2 7 6" strokeWidth="1.15" strokeLinecap="round" />
          <path d="M8 17c1.8-2.5 3-3.5 4-3.5s2.2 1 4 3.5" strokeWidth="1.1" strokeLinecap="round" opacity="0.7" />
          <circle cx="12" cy="8" r="1.5" fill="currentColor" stroke="none" opacity="0.75" />
        </g>
      )
    case 'expansion':
      return (
        <g stroke="currentColor">
          <circle cx="12" cy="12" r="3" strokeWidth="1.15" />
          <path d="M12 5v2M12 17v2M5 12h2M17 12h2M7.5 7.5l1.4 1.4M15.1 15.1l1.4 1.4M16.5 7.5l-1.4 1.4M8.9 15.1l-1.4 1.4" strokeWidth="1" strokeLinecap="round" opacity="0.75" />
        </g>
      )
    default:
      return (
        <g stroke="currentColor">
          <circle cx="12" cy="12" r="4" strokeWidth="1.15" />
        </g>
      )
  }
}

export function TokenValueIcon({ id, size = 22 }: { id: TokenValueNodeId; size?: number }) {
  const props = { ...base, width: size, height: size, viewBox: '0 0 24 24' }

  return (
    <svg {...props}>
      <TokenValueIconGlyph id={id} />
    </svg>
  )
}
