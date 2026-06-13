import { viewportCenterToWorldGroup } from '@/lib/mining/miningParticleAnchor'

const TECHNOLOGY_GROUP_Z = -0.08

export function readTechnologyStackGroupTarget(): { x: number; y: number; z: number } | null {
  if (typeof document === 'undefined' || typeof window === 'undefined') return null

  const stack =
    document.querySelector('#technology .scene-particle-gutter--featured .technology-genesis-stack') ??
    document.querySelector('#technology .technology-genesis-stack')

  if (!stack) return null

  const rect = stack.getBoundingClientRect()
  if (rect.width < 8 || rect.height < 8) return null

  return {
    ...viewportCenterToWorldGroup(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      window.innerWidth,
      window.innerHeight
    ),
    z: TECHNOLOGY_GROUP_Z,
  }
}
