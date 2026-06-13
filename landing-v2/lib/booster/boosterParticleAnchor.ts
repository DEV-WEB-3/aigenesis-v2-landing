/**
 * Ancla el grupo WebGL de Booster al eje del acelerador DOM.
 */
import { viewportCenterToWorldGroup } from '@/lib/mining/miningParticleAnchor'

const BOOSTER_GROUP_Z = -0.08
/** Ajuste fino — positivo = derecha */
const BOOSTER_GROUP_X_NUDGE = 0

export function readBoosterAcceleratorGroupTarget(): { x: number; y: number; z: number } | null {
  if (typeof document === 'undefined' || typeof window === 'undefined') return null

  const stage =
    document.querySelector('#booster .scene-particle-gutter--featured .booster-quantum-accelerator__stage') ??
    document.querySelector('#booster .booster-quantum-accelerator__stage')

  if (!stage) return null

  const rect = stage.getBoundingClientRect()
  if (rect.width < 8 || rect.height < 8) return null

  const target = viewportCenterToWorldGroup(
    rect.left + rect.width / 2,
    rect.top + rect.height / 2,
    window.innerWidth,
    window.innerHeight
  )

  return { ...target, x: target.x + BOOSTER_GROUP_X_NUDGE, z: BOOSTER_GROUP_Z }
}
