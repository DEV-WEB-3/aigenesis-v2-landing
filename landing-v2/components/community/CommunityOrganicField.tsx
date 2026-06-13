'use client'

import { COMMUNITY_PULSE_S } from '@/lib/community/communityNetworkLayout'

interface CommunityOrganicFieldProps {
  depth: 'back' | 'front'
}

export default function CommunityOrganicField({ depth }: CommunityOrganicFieldProps) {
  return (
    <div
      className={`community-organic-field community-organic-field--${depth}`}
      style={{ '--community-pulse-s': `${COMMUNITY_PULSE_S}s` } as React.CSSProperties}
    >
      <span className="community-organic-field__band community-organic-field__band--outer" aria-hidden="true" />
      {depth === 'front' && (
        <>
          <span className="community-organic-field__band community-organic-field__band--mid" aria-hidden="true" />
          <span className="community-organic-field__band community-organic-field__band--inner" aria-hidden="true" />
        </>
      )}
      <span className="community-organic-field__mesh" aria-hidden="true" />
    </div>
  )
}
