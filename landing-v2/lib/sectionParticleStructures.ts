/**
 * Registry — star dust structure por sección (14 capítulos).
 */
import { PARTICLE_COUNT } from './particleConstants'
import { genEcosystemEnergyFlow } from './ecosystemEnergyFlow'
import { genTokenGravityCore } from './tokenGravityCore'
import { genGenesisMiningCore } from './miningDistributedFlow'
import { genBoosterAscendingStack } from './boosterAscendingStack'
import { genStakingSecurityShield } from './stakingSecurityShield'
import { genGpulseSignalWaves } from './gpulseSignalWaves'
import { genGoracleGenesisBrain } from './goracleGenesisBrain'
import { genMarketplaceGlobalNetwork } from './marketplaceGlobalNetwork'
import { genCommunityNetwork } from './communityNetwork'
import { genTechnologyStackNetwork } from './technologyStackNetwork'
import { genRoadmapEvolutionPath } from './roadmapEvolutionPath'
import { genTrustQuantumShield } from './trust/GenesisStardustLogoOnly'
import { MORPH_MAX_PARTICLE_COUNT, padParticleBuffer } from './trust/trust-performance'
import { genSphere } from './particleTargets'
import {
  applyStructureTransform,
  genGenesisPortalNetwork,
} from './particleStructureGenerators'

export interface SectionParticleStructure {
  id: string
  name: string
  sectionIndex: number
  generator: (count: number) => Float32Array
  particleCount: number
  positionBias: { x: number; y: number; z: number }
  scale: number
  density: number
  motionIntensity: number
  /** Velocidad de morph (default 0.032). Trust ~0.088 ≈ 750ms */
  morphLerp?: number
  /** Velocidad de anclaje del grupo (default PARTICLE_OFFSET_LERP) */
  groupLerp?: number
  /** Fade-in de opacidad al entrar (default 0.06) */
  fadeInLerp?: number
}

/** Mobile / tablet — posición actual sin cambios */
const MOBILE_SECTION_BIAS = { x: 0.22, y: 0.02, z: -0.08 }
const MOBILE_CTA_BIAS = { x: 0, y: 0, z: 0 }

/**
 * Desktop — star dust en columna derecha del contenido (~58–72% viewport).
 * Generadores sin cambios; solo bias + escala al transformar targets.
 */
const DESKTOP_SECTION_BIAS: Record<string, { x: number; y: number; z: number }> = {
  trust: { x: 0.94, y: 0.02, z: -0.26 },
  ecosistema: { x: 0.74, y: 0, z: -0.1 },
  token: { x: 0.96, y: 0.02, z: -0.1 },
  mining: { x: 0.88, y: 0, z: -0.06 },
  booster: { x: 0, y: 0.02, z: -0.06 },
  staking: { x: 0, y: 0.02, z: -0.06 },
  gpulse: { x: 0.76, y: 0.02, z: -0.1 },
  goracle: { x: 0.76, y: 0.02, z: -0.1 },
  marketplace: { x: 0.48, y: 0.03, z: -0.1 },
  comunidad: { x: 0.48, y: 0.02, z: -0.1 },
  technology: { x: 0.48, y: 0.03, z: -0.1 },
  roadmap: { x: 0.48, y: 0.02, z: -0.1 },
}

const DESKTOP_CTA_BIAS = { x: 0, y: 0, z: 0 }

const DESKTOP_SCALE_BUMP = 0.04

function resolvePositionBias(id: string, desktop: boolean): { x: number; y: number; z: number } {
  if (!desktop) {
    return id === 'cta' ? MOBILE_CTA_BIAS : MOBILE_SECTION_BIAS
  }
  if (id === 'cta') return DESKTOP_CTA_BIAS
  return DESKTOP_SECTION_BIAS[id] ?? { x: 0.56, y: 0.02, z: -0.1 }
}

export const SECTION_PARTICLE_STRUCTURES: readonly SectionParticleStructure[] = [
  {
    id: 'hero',
    name: 'Hero Genesis Sphere',
    sectionIndex: 0,
    generator: genSphere,
    particleCount: PARTICLE_COUNT,
    positionBias: { x: 0, y: 0, z: 0 },
    scale: 1,
    density: 0.85,
    motionIntensity: 0.35,
  },
  {
    id: 'trust',
    name: 'Genesis Stardust Logo',
    sectionIndex: 1,
    generator: genTrustQuantumShield,
    particleCount: PARTICLE_COUNT,
    positionBias: MOBILE_SECTION_BIAS,
    scale: 0.9,
    density: 1,
    motionIntensity: 0.18,
    morphLerp: 0.12,
    groupLerp: 0.15,
    fadeInLerp: 0.14,
  },
  {
    id: 'ecosistema',
    name: 'Ecosystem Energy Flow',
    sectionIndex: 2,
    generator: genEcosystemEnergyFlow,
    particleCount: PARTICLE_COUNT,
    positionBias: MOBILE_SECTION_BIAS,
    scale: 1.0,
    density: 1,
    motionIntensity: 0.2,
    morphLerp: 0.092,
    groupLerp: 0.16,
    fadeInLerp: 0.16,
  },
  {
    id: 'token',
    name: 'Genesis Token Atomic Orbital',
    sectionIndex: 3,
    generator: genTokenGravityCore,
    particleCount: PARTICLE_COUNT,
    positionBias: MOBILE_SECTION_BIAS,
    scale: 1.08,
    density: 0.42,
    motionIntensity: 0.18,
    morphLerp: 0.078,
    groupLerp: 0.15,
    fadeInLerp: 0.14,
  },
  {
    id: 'mining',
    name: 'Mining Genesis Stardust',
    sectionIndex: 4,
    generator: genGenesisMiningCore,
    particleCount: PARTICLE_COUNT,
    positionBias: MOBILE_SECTION_BIAS,
    scale: 1.38,
    density: 0.58,
    motionIntensity: 0.12,
    morphLerp: 0.082,
    groupLerp: 0.22,
    fadeInLerp: 0.14,
  },
  {
    id: 'booster',
    name: 'Booster Quantum Accelerator',
    sectionIndex: 5,
    generator: genBoosterAscendingStack,
    particleCount: PARTICLE_COUNT,
    positionBias: MOBILE_SECTION_BIAS,
    scale: 1.32,
    density: 0.96,
    motionIntensity: 0.44,
    morphLerp: 0.092,
    groupLerp: 0.2,
    fadeInLerp: 0.15,
  },
  {
    id: 'staking',
    name: 'Staking Genesis Time Vault',
    sectionIndex: 6,
    generator: genStakingSecurityShield,
    particleCount: PARTICLE_COUNT,
    positionBias: MOBILE_SECTION_BIAS,
    scale: 1.9,
    density: 1.05,
    motionIntensity: 0.16,
    morphLerp: 0.078,
    groupLerp: 0.2,
    fadeInLerp: 0.14,
  },
  {
    id: 'gpulse',
    name: 'G-Pulse Signal Network',
    sectionIndex: 7,
    generator: genGpulseSignalWaves,
    particleCount: PARTICLE_COUNT,
    positionBias: MOBILE_SECTION_BIAS,
    scale: 1.08,
    density: 0.92,
    motionIntensity: 0.44,
    morphLerp: 0.1,
    groupLerp: 0.15,
    fadeInLerp: 0.14,
  },
  {
    id: 'goracle',
    name: 'G-Oracle Quantum Brain',
    sectionIndex: 8,
    generator: genGoracleGenesisBrain,
    particleCount: PARTICLE_COUNT,
    positionBias: MOBILE_SECTION_BIAS,
    scale: 1.18,
    density: 0.9,
    motionIntensity: 0.42,
    morphLerp: 0.088,
    groupLerp: 0.15,
    fadeInLerp: 0.14,
  },
  {
    id: 'marketplace',
    name: 'Marketplace Global Commerce',
    sectionIndex: 9,
    generator: genMarketplaceGlobalNetwork,
    particleCount: PARTICLE_COUNT,
    positionBias: MOBILE_SECTION_BIAS,
    scale: 1.12,
    density: 0.88,
    motionIntensity: 0.46,
    morphLerp: 0.09,
    groupLerp: 0.15,
    fadeInLerp: 0.14,
  },
  {
    id: 'comunidad',
    name: 'Genesis Community Network',
    sectionIndex: 10,
    generator: genCommunityNetwork,
    particleCount: PARTICLE_COUNT,
    positionBias: MOBILE_SECTION_BIAS,
    scale: 1.08,
    density: 0.86,
    motionIntensity: 0.48,
    morphLerp: 0.09,
    groupLerp: 0.15,
    fadeInLerp: 0.14,
  },
  {
    id: 'technology',
    name: 'Genesis Technology Stack',
    sectionIndex: 11,
    generator: genTechnologyStackNetwork,
    particleCount: PARTICLE_COUNT,
    positionBias: MOBILE_SECTION_BIAS,
    scale: 1.02,
    density: 0.9,
    motionIntensity: 0.42,
    morphLerp: 0.09,
    groupLerp: 0.15,
    fadeInLerp: 0.14,
  },
  {
    id: 'roadmap',
    name: 'Genesis Evolution Path',
    sectionIndex: 12,
    generator: genRoadmapEvolutionPath,
    particleCount: PARTICLE_COUNT,
    positionBias: MOBILE_SECTION_BIAS,
    scale: 1.06,
    density: 0.88,
    motionIntensity: 0.44,
    morphLerp: 0.09,
    groupLerp: 0.15,
    fadeInLerp: 0.14,
  },
  {
    id: 'cta',
    name: 'Genesis Final Portal',
    sectionIndex: 13,
    generator: genGenesisPortalNetwork,
    particleCount: PARTICLE_COUNT,
    positionBias: MOBILE_CTA_BIAS,
    scale: 0.97,
    density: 0.86,
    motionIntensity: 0.48,
  },
] as const

export function getSectionStructure(sectionIndex: number): SectionParticleStructure {
  return (
    SECTION_PARTICLE_STRUCTURES[sectionIndex] ??
    SECTION_PARTICLE_STRUCTURES[SECTION_PARTICLE_STRUCTURES.length - 1]
  )
}

export function buildStructuredTargets(
  desktop = false,
  trustParticleCount = PARTICLE_COUNT
): Float32Array[] {
  return SECTION_PARTICLE_STRUCTURES.map((structure) => {
    const count =
      structure.id === 'trust' ? trustParticleCount : structure.particleCount
    const raw = structure.generator(count)
    const bias = resolvePositionBias(structure.id, desktop)
    let scale = structure.scale
    if (desktop && structure.sectionIndex > 0 && structure.id !== 'trust') {
      scale = structure.scale + DESKTOP_SCALE_BUMP
    }
    if (structure.id === 'staking' && !desktop) {
      scale *= 0.92
    }
    const transformed = applyStructureTransform(raw, bias, scale)
    return padParticleBuffer(transformed, MORPH_MAX_PARTICLE_COUNT)
  })
}
