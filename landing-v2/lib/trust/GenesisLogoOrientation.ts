/**
 * Trust logo 3D orientation — premium emblem tilt (Y + subtle X).
 * Right edge closer, left recedes — coin / badge floating.
 */
import type { Vec3 } from './TrustShieldLayout'

/** Primary yaw — left tilt (~34°, derecha → izquierda). */
export const GENESIS_LOGO_ROTATION_Y = -0.58

/** Secondary pitch — top recedes (~7°). */
export const GENESIS_LOGO_ROTATION_X = -0.12

function rotateAroundY(x: number, y: number, z: number, angle: number): Vec3 {
  const c = Math.cos(angle)
  const s = Math.sin(angle)
  return [c * x + s * z, y, -s * x + c * z]
}

function rotateAroundX(x: number, y: number, z: number, angle: number): Vec3 {
  const c = Math.cos(angle)
  const s = Math.sin(angle)
  return [x, c * y - s * z, s * y + c * z]
}

export function applyGenesisLogoOrientation(x: number, y: number, z: number): Vec3 {
  const [yx, yy, yz] = rotateAroundY(x, y, z, GENESIS_LOGO_ROTATION_Y)
  return rotateAroundX(yx, yy, yz, GENESIS_LOGO_ROTATION_X)
}

/** Subtle Z-based brightness cue after orientation (±8%). */
export function trustLogoOrientationDepthCue(z: number): number {
  const t = Math.max(-1, Math.min(1, z / 0.09))
  return 1 + t * 0.08
}
