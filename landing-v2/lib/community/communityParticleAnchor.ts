/**
 * Ancla el grupo WebGL de Community al Genesis Community Network DOM.
 */
import { viewportCenterToWorldGroup } from '@/lib/mining/miningParticleAnchor'

const COMMUNITY_GROUP_Z = -0.08
const COMMUNITY_GROUP_X_NUDGE = 0

export function readCommunityNetworkGroupTarget(): { x: number; y: number; z: number } | null {
  if (typeof document === 'undefined' || typeof window === 'undefined') return null

  const network =
    document.querySelector('#comunidad .scene-particle-gutter--featured .community-genesis-network') ??
    document.querySelector('#comunidad .community-genesis-network')

  if (!network) return null

  const rect = network.getBoundingClientRect()
  if (rect.width < 8 || rect.height < 8) return null

  const target = viewportCenterToWorldGroup(
    rect.left + rect.width / 2,
    rect.top + rect.height / 2,
    window.innerWidth,
    window.innerHeight
  )

  return { ...target, x: target.x + COMMUNITY_GROUP_X_NUDGE, z: COMMUNITY_GROUP_Z }
}
