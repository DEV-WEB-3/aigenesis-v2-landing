/**
 * Phase 19.0 — Remove ambient decorative stardust (Ecosistema → Portal).
 * Functional diagram particles are preserved; Trust is excluded.
 */
import { ECOSYSTEM_FLOW_ROLE, ECOSYSTEM_SECTION_INDEX } from '@/lib/ecosystemEnergyFlow'
import { MINING_SECTION_INDEX } from '@/lib/miningDistributedFlow'
import { TOKEN_SECTION_INDEX } from '@/lib/tokenGravityCore'
import { BOOSTER_ROLE, BOOSTER_SECTION_INDEX } from '@/lib/boosterAscendingStack'
import { STAKING_ROLE, STAKING_SECTION_INDEX } from '@/lib/stakingSecurityShield'
import { GPULSE_ROLE, GPULSE_SECTION_INDEX } from '@/lib/gpulseSignalWaves'
import { GORACLE_ROLE, GORACLE_SECTION_INDEX } from '@/lib/goracleGenesisBrain'
import { MARKETPLACE_ROLE, MARKETPLACE_SECTION_INDEX } from '@/lib/marketplaceGlobalNetwork'
import { COMMUNITY_ROLE, COMMUNITY_SECTION_INDEX } from '@/lib/communityNetwork'
import { TECHNOLOGY_ROLE, TECHNOLOGY_SECTION_INDEX } from '@/lib/technologyStackNetwork'
import { ROADMAP_ROLE, ROADMAP_SECTION_INDEX } from '@/lib/roadmapEvolutionPath'
import { PORTAL_ROLE, CTA_SECTION_INDEX } from '@/lib/genesisPortalNetwork'

export function isPhase19AmbientSection(sectionIndex: number): boolean {
  return sectionIndex >= ECOSYSTEM_SECTION_INDEX && sectionIndex <= CTA_SECTION_INDEX
}

export function isAmbientStardustRole(sectionIndex: number, role: number): boolean {
  switch (sectionIndex) {
    case ECOSYSTEM_SECTION_INDEX:
      return role === ECOSYSTEM_FLOW_ROLE.DIFFUSE
    case MINING_SECTION_INDEX:
      return true
    case TOKEN_SECTION_INDEX:
      return false
    case BOOSTER_SECTION_INDEX:
      return role === BOOSTER_ROLE.ORBIT || role === BOOSTER_ROLE.COLUMN
    case STAKING_SECTION_INDEX:
      return role === STAKING_ROLE.AURA || role === STAKING_ROLE.MICRO_ORBIT
    case GPULSE_SECTION_INDEX:
      return role === GPULSE_ROLE.FIELD
    case GORACLE_SECTION_INDEX:
      return role === GORACLE_ROLE.FIELD
    case MARKETPLACE_SECTION_INDEX:
      return role === MARKETPLACE_ROLE.FIELD
    case COMMUNITY_SECTION_INDEX:
      return role === COMMUNITY_ROLE.FIELD
    case TECHNOLOGY_SECTION_INDEX:
      return role === TECHNOLOGY_ROLE.FIELD
    case ROADMAP_SECTION_INDEX:
      return role === ROADMAP_ROLE.STARDUST
    case CTA_SECTION_INDEX:
      return role === PORTAL_ROLE.STARDUST
    default:
      return false
  }
}

export interface AmbientWindStardustInput {
  sectionIndex: number
  particleIndex: number
  role: number
  phase: number
  px: number
  py: number
  pz: number
  cr: number
  cg: number
  cb: number
  t: number
  motion: number
}

export interface AmbientWindStardustResult {
  applied: boolean
  hide: boolean
  px: number
  py: number
  pz: number
  cr: number
  cg: number
  cb: number
}

export function applyAmbientWindStardust(input: AmbientWindStardustInput): AmbientWindStardustResult {
  const { sectionIndex, role, px, py, pz } = input

  if (!isPhase19AmbientSection(sectionIndex) || !isAmbientStardustRole(sectionIndex, role)) {
    return { applied: false, hide: false, px, py, pz, cr: input.cr, cg: input.cg, cb: input.cb }
  }

  return { applied: true, hide: true, px, py, pz, cr: 0, cg: 0, cb: 0 }
}
