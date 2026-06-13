import { viewportCenterToWorldGroup } from '@/lib/mining/miningParticleAnchor'

const ROADMAP_GROUP_Z = -0.08

export function readRoadmapEvolutionGroupTarget(): { x: number; y: number; z: number } | null {
  if (typeof document === 'undefined' || typeof window === 'undefined') return null

  const path =
    document.querySelector('#roadmap .scene-particle-gutter--featured .roadmap-evolution-path') ??
    document.querySelector('#roadmap .roadmap-evolution-path')

  if (!path) return null

  const rect = path.getBoundingClientRect()
  if (rect.width < 8 || rect.height < 8) return null

  return {
    ...viewportCenterToWorldGroup(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      window.innerWidth,
      window.innerHeight
    ),
    z: ROADMAP_GROUP_Z,
  }
}
