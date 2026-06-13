/**
 * Ancla el grupo WebGL de Staking al eje del Time Vault DOM.
 */
import { viewportCenterToWorldGroup } from '@/lib/mining/miningParticleAnchor'

const STAKING_GROUP_Z = -0.08
const STAKING_GROUP_X_NUDGE = 0.2

export function readStakingVaultGroupTarget(): { x: number; y: number; z: number } | null {
  if (typeof document === 'undefined' || typeof window === 'undefined') return null

  const vault =
    document.querySelector('#staking .scene-particle-gutter--featured .staking-time-vault') ??
    document.querySelector('#staking .staking-time-vault')

  if (!vault) return null

  const rect = vault.getBoundingClientRect()
  if (rect.width < 8 || rect.height < 8) return null

  const target = viewportCenterToWorldGroup(
    rect.left + rect.width / 2,
    rect.top + rect.height / 2,
    window.innerWidth,
    window.innerHeight
  )

  return { ...target, x: target.x + STAKING_GROUP_X_NUDGE, z: STAKING_GROUP_Z }
}
