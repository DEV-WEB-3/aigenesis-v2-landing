'use client'

import type { CommercePaymentId } from '@/lib/marketplace/globalCommerceLayout'

const iconProps = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  xmlns: 'http://www.w3.org/2000/svg',
  'aria-hidden': true as const,
}

export default function MarketplacePaymentIcon({ id }: { id: CommercePaymentId }) {
  if (id === 'aig') {
    return (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.2" />
        <path
          d="M9.5 9.5c1.2-1.2 3.8-1.2 5 0M9.5 14.5c1.2 1.2 3.8 1.2 5 0M12 8v8"
          stroke="currentColor"
          strokeWidth="1.05"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  if (id === 'usdt') {
    return (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.2" />
        <path
          d="M8.5 10.5h7M8.5 13.5h7M12 7.5v9"
          stroke="currentColor"
          strokeWidth="1.05"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  return (
    <svg {...iconProps}>
      <rect x="5" y="8" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5 11h14" stroke="currentColor" strokeWidth="1.05" />
      <rect x="7.5" y="13" width="4" height="2" rx="0.5" fill="currentColor" opacity="0.75" />
    </svg>
  )
}
