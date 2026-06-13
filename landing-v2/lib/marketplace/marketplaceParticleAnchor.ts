/**
 * Ancla el grupo WebGL de Marketplace al Global Commerce DOM.
 */
import { viewportCenterToWorldGroup } from '@/lib/mining/miningParticleAnchor'

const MARKETPLACE_GROUP_Z = -0.08
const MARKETPLACE_GROUP_X_NUDGE = 0

export function readMarketplaceCommerceGroupTarget(): { x: number; y: number; z: number } | null {
  if (typeof document === 'undefined' || typeof window === 'undefined') return null

  const globe =
    document.querySelector('#marketplace .scene-particle-gutter--featured .marketplace-global-commerce') ??
    document.querySelector('#marketplace .marketplace-global-commerce')

  if (!globe) return null

  const rect = globe.getBoundingClientRect()
  if (rect.width < 8 || rect.height < 8) return null

  const target = viewportCenterToWorldGroup(
    rect.left + rect.width / 2,
    rect.top + rect.height / 2,
    window.innerWidth,
    window.innerHeight
  )

  return { ...target, x: target.x + MARKETPLACE_GROUP_X_NUDGE, z: MARKETPLACE_GROUP_Z }
}
