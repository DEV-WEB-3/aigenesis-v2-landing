/**
 * Ancla el grupo WebGL de Mining al centro de la constelación DOM (sigue parallax/resize).
 */
const CAMERA_Z = 5
const FOV_DEG = 75
const MINING_GROUP_Z = -0.08
/** Negative = izquierda en pantalla */
const MINING_GROUP_X_NUDGE = 1.46
/** Amplitud del vaivén horizontal (derecha ↔ izquierda) */
export const MINING_GROUP_X_SWING = 0.24
export const MINING_GROUP_X_SWING_S = 13

export function miningGroupHorizontalSwing(t: number): number {
  return Math.sin((t / MINING_GROUP_X_SWING_S) * Math.PI * 2) * MINING_GROUP_X_SWING
}

export function viewportCenterToWorldGroup(
  centerX: number,
  centerY: number,
  viewportWidth: number,
  viewportHeight: number
): { x: number; y: number; z: number } {
  const ndcX = (centerX / viewportWidth) * 2 - 1
  const ndcY = -(centerY / viewportHeight) * 2 + 1
  const vFov = (FOV_DEG * Math.PI) / 180
  const visibleHeight = 2 * Math.tan(vFov / 2) * CAMERA_Z
  const visibleWidth = visibleHeight * (viewportWidth / viewportHeight)
  return {
    x: ndcX * (visibleWidth / 2),
    y: ndcY * (visibleHeight / 2),
    z: MINING_GROUP_Z,
  }
}

export function readMiningConstellationGroupTarget(): { x: number; y: number; z: number } | null {
  if (typeof document === 'undefined' || typeof window === 'undefined') return null

  const stage =
    document.querySelector('#mining .scene-particle-gutter--featured .mining-constellation__stage') ??
    document.querySelector('#mining .mining-constellation-mobile .mining-constellation__stage') ??
    document.querySelector('#mining .mining-constellation__stage')

  if (!stage) return null

  const rect = stage.getBoundingClientRect()
  if (rect.width < 8 || rect.height < 8) return null

  const target = viewportCenterToWorldGroup(
    rect.left + rect.width / 2,
    rect.top + rect.height / 2,
    window.innerWidth,
    window.innerHeight
  )
  return { ...target, x: target.x + MINING_GROUP_X_NUDGE }
}
