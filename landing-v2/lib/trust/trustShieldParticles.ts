/**
 * Barrel — Phase 5.3 Genesis Stardust Logo (shape-locked).
 */
export {
  USE_GENESIS_LOGO_V1,
  USE_GENESIS_LOGO_V2,
  ACTIVE_GENESIS_LOGO_VERSION,
} from './genesisLogoVersion'

export {
  TRUST_SECTION_INDEX,
  genGenesisStardustLogoOnly,
  genTrustQuantumShield,
  getGenesisStardustLogoMeta,
  getTrustShieldMeta,
  buildGenesisStardustLogoOnly,
  computeStardustLogoBudget,
  STARDUST_IDENTITY_BUDGET,
  GENESIS_G_RADIUS_NORM,
} from './GenesisStardustLogoOnly'

export {
  TRUST_META_STRIDE,
  TRUST_SHIELD_VISUAL_SCALE,
  TRUST_CORE_RADIUS_MULT,
  TRUST_DEPTH_Z_SCALE,
  TRUST_OUTER_RING_MULT,
} from './trustShieldConstants'

export {
  TRUST_CORE_SLOT,
  GENESIS_LOGO_RADIUS,
  sampleGenesisLogoHalo,
} from './GenesisLogoLayout'

export {
  buildGenesisLogoMaskPoints,
  sampleGenesisLogoParticle,
  getGenesisLogoMaskBounds,
  getGenesisLogoMaskStats,
  GENESIS_LOGO_WORLD_RADIUS,
} from './GenesisLogoMaskSampler'

export {
  MORPH_MAX_PARTICLE_COUNT,
  TRUST_PARTICLE_COUNTS,
  detectTrustPerfTier,
  trustParticleCountForTier,
  trustParticleCountForWidth,
  padParticleBuffer,
  type TrustPerfTier,
} from './trust-performance'

export { buildTrustShieldColors } from './TrustShieldColors'

export {
  NEON_ELECTRIC_CYAN,
  NEON_ELECTRIC_BLUE,
  NEON_PURPLE,
  NEON_GENESIS_PINK,
  NEON_SATURATION_MULT,
  NEON_LUMINANCE_MULT,
} from './trustShieldColorAmplification'

export { TRUST_ROLE, type TrustRoleId } from './trustShieldRoles'

export {
  STARDUST_DENSITY_RATIO,
  STARDUST_LOGO_SLICE,
  LOGO_PERMANENT_GLOW,
  LOGO_SHAPE_LOCK,
  computeStardustSpectralColor,
  computeStardustLogoLiveColor,
  computeStardustRayLiveColor,
  computeLockedLogoMaskPosition,
  isGenesisLogoOuterRay,
  computeGenesisPlasmaDrift,
  GENESIS_G_IDENTITY_SCALE,
  GENESIS_RAY_VISIBILITY,
  GENESIS_LAYER_INTENSITY,
  GENESIS_NEON_PULSE,
  computeNeonLogoPulse,
  computeNeonNucleusPulse,
  computeLogoPermanentPulse,
  applyLogoPermanentGlow,
  applyNeonStardustGlow,
  computeNucleusStardustColor,
  stardustLayerLuminance,
} from './GenesisStardustEntity'

export {
  isTrustLogoLockedSlot,
  computeTrustLockedLogoPosition,
  computeTrustCorePulse,
} from './TrustShieldMorph'

export {
  GENESIS_LOGO_FORM_DURATION,
  BIDIRECTIONAL_FORM_DURATION,
  HERO_CINEMATIC,
  HERO_LOGO_DROP,
  type GenesisFormationMode,
  type BidirectionalSide,
  applyFormationNeonColor,
  buildTrustFormationScatter,
  computeGenesisLogoFormationPosition,
  computeHeroDropLogoCenter,
  formationBidirectionalColorBlend,
  formationBidirectionalSide,
  formationBrightnessMul,
  formationDensityMul,
  formationSaturationMul,
  formationTrailBoost,
  genesisFormationDuration,
  genesisLogoFormationProgress,
  resolveGenesisFormationMode,
  setHeroDropGroupOffset,
  setHeroDropLogoCenter,
} from './GenesisStardustFormation'
