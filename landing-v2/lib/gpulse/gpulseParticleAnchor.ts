/**
 * Ancla el grupo WebGL de G-Pulse al Signal Network DOM.
 */
import { viewportCenterToWorldGroup } from '@/lib/mining/miningParticleAnchor'

const GPULSE_GROUP_Z = -0.08
const GPULSE_GROUP_X_NUDGE = 0

export function readGpulseSignalGroupTarget(): { x: number; y: number; z: number } | null {
  if (typeof document === 'undefined' || typeof window === 'undefined') return null

  const network =
    document.querySelector('#gpulse .scene-particle-gutter--featured .gpulse-signal-network') ??
    document.querySelector('#gpulse .gpulse-signal-network')

  if (!network) return null

  const rect = network.getBoundingClientRect()
  if (rect.width < 8 || rect.height < 8) return null

  const target = viewportCenterToWorldGroup(
    rect.left + rect.width / 2,
    rect.top + rect.height / 2,
    window.innerWidth,
    window.innerHeight
  )

  return { ...target, x: target.x + GPULSE_GROUP_X_NUDGE, z: GPULSE_GROUP_Z }
}
