/**
 * Ancla el grupo WebGL de G-Oracle al Quantum Brain DOM.
 */
import { viewportCenterToWorldGroup } from '@/lib/mining/miningParticleAnchor'

const GORACLE_GROUP_Z = -0.08
const GORACLE_GROUP_X_NUDGE = 0

export function readGoracleBrainGroupTarget(): { x: number; y: number; z: number } | null {
  if (typeof document === 'undefined' || typeof window === 'undefined') return null

  const brain =
    document.querySelector('#goracle .scene-particle-gutter--featured .goracle-quantum-brain') ??
    document.querySelector('#goracle .goracle-quantum-brain')

  if (!brain) return null

  const rect = brain.getBoundingClientRect()
  if (rect.width < 8 || rect.height < 8) return null

  const target = viewportCenterToWorldGroup(
    rect.left + rect.width / 2,
    rect.top + rect.height / 2,
    window.innerWidth,
    window.innerHeight
  )

  return { ...target, x: target.x + GORACLE_GROUP_X_NUDGE, z: GORACLE_GROUP_Z }
}
