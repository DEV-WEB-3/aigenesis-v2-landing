'use client'

import type { GlobalHubRole } from '@/lib/marketplace/globalCommerceLayout'

const iconProps = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  xmlns: 'http://www.w3.org/2000/svg',
  'aria-hidden': true as const,
}

/** Abstract icons — no text, no geographic map. */
export default function MarketplaceHubIcon({ role }: { role: GlobalHubRole }) {
  if (role === 'catalog') {
    return (
      <svg {...iconProps}>
        <rect x="5" y="6" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.1" />
        <rect x="13" y="6" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.1" opacity="0.75" />
        <rect x="5" y="14" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.1" opacity="0.75" />
        <rect x="13" y="14" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.1" />
      </svg>
    )
  }

  if (role === 'reach') {
    return (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="2.4" stroke="currentColor" strokeWidth="1.1" />
        <circle cx="5" cy="8" r="1.4" stroke="currentColor" strokeWidth="1" />
        <circle cx="19" cy="8" r="1.4" stroke="currentColor" strokeWidth="1" />
        <circle cx="6" cy="17" r="1.4" stroke="currentColor" strokeWidth="1" />
        <circle cx="18" cy="17" r="1.4" stroke="currentColor" strokeWidth="1" />
        <path d="M6.8 9.2l3.8 2M17.2 9.2l-3.8 2M7.2 15.8l3.4-2.2M16.8 15.8l-3.4-2.2" stroke="currentColor" strokeWidth="0.95" strokeLinecap="round" opacity="0.7" />
      </svg>
    )
  }

  if (role === 'fulfillment') {
    return (
      <svg {...iconProps}>
        <path d="M5 8.5h14v10H5z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
        <path d="M8.5 8.5V6.5h7v2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
        <path d="M9 13h6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.75" />
      </svg>
    )
  }

  if (role === 'payments') {
    return (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="6.5" stroke="currentColor" strokeWidth="1.1" />
        <path d="M8.5 12h7M12 8.5v7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
      </svg>
    )
  }

  if (role === 'tracking') {
    return (
      <svg {...iconProps}>
        <path d="M5 16c3-5 11-5 14 0" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
        <circle cx="8" cy="13" r="1.2" fill="currentColor" />
        <circle cx="12" cy="11.5" r="1.2" fill="currentColor" opacity="0.75" />
        <circle cx="16" cy="13" r="1.2" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg {...iconProps}>
      <path d="M6 8h12M6 12h12M6 16h8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M16 16l3 2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <circle cx="18.5" cy="18.5" r="1.2" fill="currentColor" />
    </svg>
  )
}
