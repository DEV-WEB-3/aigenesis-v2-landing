/**
 * Phase 6.5 — Genesis logo version router.
 *
 * USE_GENESIS_LOGO_V1=true  → frozen V1 (see /backup/genesis-logo-v1/)
 * default                   → V2 premium signature rebrand
 */
import * as V1 from './v1/GenesisStardustEntityV1'
import * as V2 from './v2/GenesisStardustEntityV2'
import { USE_GENESIS_LOGO_V1 } from './genesisLogoVersion'

const impl = USE_GENESIS_LOGO_V1 ? V1 : V2

export { USE_GENESIS_LOGO_V1, USE_GENESIS_LOGO_V2, ACTIVE_GENESIS_LOGO_VERSION } from './genesisLogoVersion'

export const GENESIS_FLAG_WIND = impl.GENESIS_FLAG_WIND
export const GENESIS_G_BODY_POINT_SIZE_MULT = impl.GENESIS_G_BODY_POINT_SIZE_MULT
export const GENESIS_G_IDENTITY_SCALE = impl.GENESIS_G_IDENTITY_SCALE
export const GENESIS_LAYER_INTENSITY = impl.GENESIS_LAYER_INTENSITY
export const GENESIS_NEON_PULSE = impl.GENESIS_NEON_PULSE
export const GENESIS_PLASMA_DRIFT = impl.GENESIS_PLASMA_DRIFT
export const GENESIS_QUANTUM_FIELD = impl.GENESIS_QUANTUM_FIELD
export const GENESIS_RAY_VISIBILITY = impl.GENESIS_RAY_VISIBILITY
export const LOGO_PERMANENT_GLOW = impl.LOGO_PERMANENT_GLOW
export const LOGO_SHAPE_LOCK = impl.LOGO_SHAPE_LOCK
export const STARDUST_DENSITY_RATIO = impl.STARDUST_DENSITY_RATIO
export const STARDUST_LOGO_SLICE = impl.STARDUST_LOGO_SLICE
export const STARDUST_NUCLEUS_CYCLE = impl.STARDUST_NUCLEUS_CYCLE
export const STARDUST_ORBIT_CYCLE = impl.STARDUST_ORBIT_CYCLE
export const STARDUST_SPECTRAL_CYCLE = impl.STARDUST_SPECTRAL_CYCLE
export const STARDUST_SPREAD = impl.STARDUST_SPREAD
export const STARDUST_SPREAD_MULT = impl.STARDUST_SPREAD_MULT
export const applyLogoPermanentGlow: typeof V1.applyLogoPermanentGlow = impl.applyLogoPermanentGlow
export const applyNeonStardustGlow: typeof V1.applyNeonStardustGlow = impl.applyNeonStardustGlow
export const computeGenesisFlagWindOffset: typeof V1.computeGenesisFlagWindOffset = impl.computeGenesisFlagWindOffset
export const computeGenesisNucleusPosition: typeof V1.computeGenesisNucleusPosition = impl.computeGenesisNucleusPosition
export const computeGenesisPlasmaDrift: typeof V1.computeGenesisPlasmaDrift = impl.computeGenesisPlasmaDrift
export const computeLockedLogoMaskPosition: typeof V1.computeLockedLogoMaskPosition = impl.computeLockedLogoMaskPosition
export const computeLogoPermanentPulse: typeof V1.computeLogoPermanentPulse = impl.computeLogoPermanentPulse
export const computeNeonLogoPulse: typeof V1.computeNeonLogoPulse = impl.computeNeonLogoPulse
export const computeNeonNucleusPulse: typeof V1.computeNeonNucleusPulse = impl.computeNeonNucleusPulse
export const computeNucleusApprovedColor: typeof V1.computeNucleusApprovedColor = impl.computeNucleusApprovedColor
export const computeNucleusStardustColor: typeof V1.computeNucleusStardustColor = impl.computeNucleusStardustColor
export const computeShieldFromLogoBias: typeof V1.computeShieldFromLogoBias = impl.computeShieldFromLogoBias
export const computeStardustColorBeforeGlow: typeof V1.computeStardustColorBeforeGlow = impl.computeStardustColorBeforeGlow
export const computeStardustLogoApprovedColor: typeof V1.computeStardustLogoApprovedColor = impl.computeStardustLogoApprovedColor
export const computeStardustLogoLiveColor: typeof V1.computeStardustLogoLiveColor = impl.computeStardustLogoLiveColor
export const computeStardustLogoPosition: typeof V1.computeStardustLogoPosition = impl.computeStardustLogoPosition
export const computeStardustRayLiveColor: typeof V1.computeStardustRayLiveColor = impl.computeStardustRayLiveColor
export const computeStardustSpectralColor: typeof V1.computeStardustSpectralColor = impl.computeStardustSpectralColor
export const isGenesisLogoOuterRay: typeof V1.isGenesisLogoOuterRay = impl.isGenesisLogoOuterRay
export const logoMaskGradientUForAudit: typeof V1.logoMaskGradientUForAudit = impl.logoMaskGradientUForAudit
export const sampleGenesisBrandGradient: typeof V1.sampleGenesisBrandGradient = impl.sampleGenesisBrandGradient
export const scaleLogoIdentityPosition: typeof V1.scaleLogoIdentityPosition = impl.scaleLogoIdentityPosition
export const stardustLayerLuminance: typeof V1.stardustLayerLuminance = impl.stardustLayerLuminance
export const stardustNucleusCount: typeof V1.stardustNucleusCount = impl.stardustNucleusCount
