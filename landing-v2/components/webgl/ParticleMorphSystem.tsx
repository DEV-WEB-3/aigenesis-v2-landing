'use client'

import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { PARTICLE_COUNT } from '@/lib/particleTargets'
import {
  MORPH_MAX_PARTICLE_COUNT,
  TRUST_CORE_SLOT,
  TRUST_META_STRIDE,
  TRUST_SECTION_INDEX,
  buildTrustFormationScatter,
  buildTrustShieldColors,
  computeGenesisLogoFormationPosition,
  computeTrustLockedLogoPosition,
  formationBrightnessMul,
  formationBidirectionalColorBlend,
  formationBidirectionalSide,
  genesisLogoFormationProgress,
  GENESIS_G_IDENTITY_SCALE,
  getGenesisLogoMaskBounds,
  getTrustShieldMeta,
  resolveGenesisFormationMode,
  setHeroDropGroupOffset,
  trustParticleCountForWidth,
  type GenesisFormationMode,
} from '@/lib/trust/trustShieldParticles'
import { buildStructuredTargets, getSectionStructure } from '@/lib/sectionParticleStructures'
import { morphParticleCountForWidth } from '@/lib/webgl/morphPerformance'
import {
  buildSectionParticleColors,
  COLOR_LERP_SPEED,
  SECTION_PALETTES,
} from '@/lib/webglBrand'
import { buildEcosystemFlowColors, ECOSYSTEM_SECTION_INDEX, getEcosystemFlowMeta, scatterEcosystemFromTrust } from '@/lib/ecosystemEnergyFlow'
import { applyAmbientWindStardust } from '@/lib/ambientWindStardust'
import {
  buildTokenGravityColors,
  computeTokenGravityPosition,
  getTokenGravityMeta,
  TOKEN_META_STRIDE,
  TOKEN_ORBIT_COUNT,
  TOKEN_ROLE,
  TOKEN_SECTION_INDEX,
  amplifyTokenNeon,
  tokenAiNeonColor,
  tokenCoreEmissionStrength,
  tokenAtmosphericDepthMul,
  tokenDepthBrightness,
  tokenRadialPulseStrength,
  TOKEN_POINT_SIZE_MULT,
} from '@/lib/tokenGravityCore'
import {
  tokenCoreFormationProgress,
  tokenParticleFormationT,
} from '@/lib/token/tokenCoreFormation'
import {
  buildMiningStardustColors,
  getMiningFlowMeta,
  MINING_POINT_SIZE_MULT,
  MINING_SECTION_INDEX,
  scatterMiningDispersed,
} from '@/lib/miningDistributedFlow'
import { miningGroupHorizontalSwing, readMiningConstellationGroupTarget } from '@/lib/mining/miningParticleAnchor'
import { readBoosterAcceleratorGroupTarget } from '@/lib/booster/boosterParticleAnchor'
import { readStakingVaultGroupTarget } from '@/lib/staking/stakingParticleAnchor'
import { readGpulseSignalGroupTarget } from '@/lib/gpulse/gpulseParticleAnchor'
import {
  BOOSTER_ROLE,
  BOOSTER_SECTION_INDEX,
  boosterPulseStrength,
  boosterColumnActivation,
  boosterPulseActivation,
  boosterTierActivation,
  boosterStardustFormationBlend,
  buildBoosterStackColors,
  computeBoosterStackPosition,
  getBoosterStackMeta,
  scatterBoosterStardustFromRear,
} from '@/lib/boosterAscendingStack'
import {
  STAKING_FORM_DURATION,
  STAKING_ROLE,
  STAKING_SECTION_INDEX,
  buildStakingShieldColors,
  computeStakingShieldPosition,
  getStakingShieldMeta,
  scatterStakingExterior,
  stakingBodyActivation,
  stakingCoreActivation,
  stakingCoreGlow,
  stakingCorePulse,
  stakingFinisherActivation,
  stakingShackleActivation,
} from '@/lib/stakingSecurityShield'
import {
  GPULSE_FORM_DURATION,
  GPULSE_ROLE,
  GPULSE_SECTION_INDEX,
  buildGpulseWaveColors,
  computeGpulseWavePosition,
  getGpulseWaveMeta,
  gpulseBurstStrength,
  gpulseSparkFlash,
  scatterGpulseFromLeft,
} from '@/lib/gpulseSignalWaves'
import {
  GORACLE_FORM_DURATION,
  GORACLE_ROLE,
  GORACLE_SECTION_INDEX,
  buildGoracleBrainColors,
  computeGoracleBrainPosition,
  getGoracleBrainMeta,
  goracleCoreActivation,
  goracleCorePulse,
  goracleLayerActivation,
  goracleNeuralActivation,
  goracleNeuralPulse,
  goracleStreamActivation,
  goracleSynapseActivation,
  scatterGoracleDispersed,
} from '@/lib/goracleGenesisBrain'
import { readGoracleBrainGroupTarget } from '@/lib/goracle/goracleParticleAnchor'
import {
  MARKETPLACE_FORM_DURATION,
  MARKETPLACE_ROLE,
  MARKETPLACE_SECTION_INDEX,
  buildMarketplaceNetworkColors,
  computeMarketplaceNetworkPosition,
  getMarketplaceNetworkMeta,
  marketplaceCommercePulse,
  marketplaceCoreActivation,
  marketplaceGlobeActivation,
  marketplaceLayerActivation,
  marketplacePaymentActivation,
  marketplaceRouteActivation,
  marketplaceRouteActive,
  scatterMarketplaceExterior,
} from '@/lib/marketplaceGlobalNetwork'
import { readMarketplaceCommerceGroupTarget } from '@/lib/marketplace/marketplaceParticleAnchor'
import {
  COMMUNITY_FORM_DURATION,
  COMMUNITY_ROLE,
  COMMUNITY_SECTION_INDEX,
  buildCommunityNetworkColors,
  computeCommunityNetworkPosition,
  getCommunityNetworkMeta,
  communityCorePulse,
  communityCoreActivation,
  communityGrowthActivation,
  communityLinkActive,
  communityNetworkActivation,
  communityPulseActivation,
  scatterCommunityExterior,
} from '@/lib/communityNetwork'
import { readCommunityNetworkGroupTarget } from '@/lib/community/communityParticleAnchor'
import {
  TECHNOLOGY_FORM_DURATION,
  TECHNOLOGY_ROLE,
  TECHNOLOGY_SECTION_INDEX,
  buildTechnologyStackColors,
  computeTechnologyStackPosition,
  getTechnologyStackMeta,
  scatterTechnologyExterior,
  technologyFlowActivation,
  technologyFlowTravel,
  technologyLayerActivation,
  technologyStackPulse,
} from '@/lib/technologyStackNetwork'
import { readTechnologyStackGroupTarget } from '@/lib/technology/technologyParticleAnchor'
import {
  ROADMAP_FORM_DURATION,
  ROADMAP_ROLE,
  ROADMAP_SECTION_INDEX,
  buildRoadmapTimelineColors,
  computeRoadmapTimelinePosition,
  getRoadmapTimelineMeta,
  roadmapMilestonePulse,
  roadmapSparkFlash,
  roadmapPathActivation,
  roadmapMilestoneActivation,
  scatterRoadmapFromTop,
} from '@/lib/roadmapEvolutionPath'
import { readRoadmapEvolutionGroupTarget } from '@/lib/roadmap/roadmapParticleAnchor'
import {
  CTA_SECTION_INDEX,
  PORTAL_FORM_DURATION,
  PORTAL_ROLE,
  buildPortalNetworkColors,
  computePortalNetworkPosition,
  getPortalNetworkMeta,
  portalAbsorbEnergy,
  portalCorePulse,
  portalRingActivation,
  scatterPortalFromExterior,
} from '@/lib/genesisPortalNetwork'
import {
  computeNucleusApprovedColor,
  computeNucleusStardustColor,
  computeStardustLogoApprovedColor,
  computeStardustLogoLiveColor,
  computeStardustRayLiveColor,
  computeNeonLogoPulse,
  computeNeonNucleusPulse,
  isGenesisLogoOuterRay,
  GENESIS_G_BODY_POINT_SIZE_MULT,
  GENESIS_NEON_PULSE,
  LOGO_PERMANENT_GLOW,
} from '@/lib/trust/GenesisStardustEntity'
import {
  computeTrustParticleDepthTier,
  trustDepthColorMultiplier,
  trustDepthPointSizeMul,
  trustGenesisWaveHighlight,
  getLogoParticleRadialNorm,
} from '@/lib/trust/trustGenesisCoreMotion'
import { trustLogoOrientationDepthCue } from '@/lib/trust/GenesisLogoOrientation'
import {
  isDesktopViewport,
  particleGroupTarget,
  PARTICLE_OFFSET_LERP,
} from '@/lib/webglSceneLayout'
import {
  applyTrustDevParticleControls,
  getTrustDevGlobalOpacity,
  getTrustDevGlobalPointSize,
  getTrustDevTransformRotation,
  getTrustDevTransformScale,
} from '@/lib/trust/GenesisParticleControlApply'
import {
  getTrustAnimationResetCounter,
  getGenesisParticleControlConfig,
  isDevParticleControlActive,
  resolveDevAnimationTime,
} from '@/lib/trust/GenesisParticleControlStore'
import { diagLogParticleSystemFrame } from '@/lib/trust/GenesisParticleControlDiagnostics'
import { entradaDesde, correlacionEntre, movimientoDeIndice, USAR_LINAJE } from '@/lib/webgl/lineage'
import '@/lib/trust/genesisColorDebug'
import '@/lib/trust/genesisColorExecutionAudit'
import {
  isGenesisColorAuditEnabled,
  isGenesisPureColorDebug,
  maybeFlushColorAudit,
  recordTrustParticleColorAudit,
  resetColorAuditFrame,
} from '@/lib/trust/genesisColorExecutionAudit'

interface ParticleMorphSystemProps {
  sectionIndexRef: React.MutableRefObject<number>
  scrollProgressRef: React.MutableRefObject<number>
  heroActive?: boolean
}

const DEFAULT_LERP_SPEED = 0.032

/**
 * Anticipación de la forma siguiente según el scroll.
 *
 * Hasta ahora las partículas sólo interpolaban hacia la forma de la sección
 * activa a ritmo fijo: el scroll no participaba, así que cada cambio se leía
 * como un salto entre dos estados. Con el progreso ya cableado, la forma empieza
 * a inclinarse hacia la de la sección siguiente conforme se avanza.
 *
 * LA VENTANA ESTÁ ATADA A CUÁNDO CAMBIA EL ÍNDICE, y eso hay que medirlo cada
 * vez que cambia el modelo de scroll. No es un número estético.
 *
 * El índice lo decide un IntersectionObserver por umbral de ratio, y ese umbral
 * DEPENDE DEL MODO: 0.48 con snap, 0.32 con flow. Medido en el navegador:
 *
 *   con snap ... el índice cambiaba en p ≈ 0.80
 *   con flow ... cambia en p ≈ 0.50
 *
 * Los valores anteriores (START 0.30 / END 0.70 / CUTOFF 0.75) estaban ajustados
 * al primer caso. Al pasar a flow quedaron mal colocados y se volvieron dañinos:
 * medido, a p=0.58 la mezcla valía 0.48 con la sección siguiente YA activa, así
 * que anticipaba dos secciones por delante — exactamente el fallo que el corte
 * existía para evitar.
 *
 * Ahora toda la ventana cabe ANTES del cambio de índice:
 *
 *  - START 0.08 — arranca pronto porque sólo hay hasta 0.50 de recorrido útil.
 *  - END 0.44 — el máximo se alcanza justo antes del cambio.
 *  - CUTOFF 0.50 — en cuanto el índice cambia, el objetivo YA es la sección
 *    nueva y anticipar más apuntaría dos por delante. Aquí se apaga.
 *  - MAX 0.8 — subido desde 0.6. Con el snap obligatorio el progreso intermedio
 *    apenas existía y un valor alto no llegaba a verse; con flow el recorrido es
 *    continuo y la anticipación tiene sitio para leerse.
 *
 * El corte no produce un salto visible porque lo que cambia es el OBJETIVO, no
 * la posición: las partículas se mueven un 3.2% por fotograma hacia él, así que
 * un cambio instantáneo de objetivo se absorbe en la interpolación de siempre.
 *
 * SI SE CAMBIA EL MODO DE SCROLL, HAY QUE VOLVER A MEDIR ESTOS CUATRO NÚMEROS.
 */
const SCROLL_BLEND_START = 0.08
const SCROLL_BLEND_END = 0.44
const SCROLL_BLEND_CUTOFF = 0.5
const SCROLL_BLEND_MAX = 0.8

function scrollBlendAmount(progress: number): number {
  if (!Number.isFinite(progress)) return 0
  if (progress <= SCROLL_BLEND_START || progress > SCROLL_BLEND_CUTOFF) return 0
  const t = Math.min(
    1,
    (progress - SCROLL_BLEND_START) / (SCROLL_BLEND_END - SCROLL_BLEND_START)
  )
  // smoothstep: entra y sale sin esquinas
  return t * t * (3 - 2 * t) * SCROLL_BLEND_MAX
}
const DEFAULT_FADE_LERP = 0.06
const TARGET_OPACITY = 0.78
const ORGANIC_STRENGTH = 0.014

function commitAmbientWindTreatment(
  sectionIndex: number,
  particleIndex: number,
  role: number,
  phase: number,
  bi: number,
  pos: Float32Array,
  col: Float32Array,
  t: number,
  motion: number
): void {
  const result = applyAmbientWindStardust({
    sectionIndex,
    particleIndex,
    role,
    phase,
    px: pos[bi]!,
    py: pos[bi + 1]!,
    pz: pos[bi + 2]!,
    cr: col[bi]!,
    cg: col[bi + 1]!,
    cb: col[bi + 2]!,
    t,
    motion,
  })
  if (!result.applied) return
  if (result.hide) {
    pos[bi] = -120
    pos[bi + 1] = -120
    pos[bi + 2] = 0
    col[bi] = 0
    col[bi + 1] = 0
    col[bi + 2] = 0
    return
  }
  pos[bi] = result.px
  pos[bi + 1] = result.py
  pos[bi + 2] = result.pz
  col[bi] = result.cr
  col[bi + 1] = result.cg
  col[bi + 2] = result.cb
}
const DEFAULT_POINT_SIZE = 0.028
const TRUST_POINT_SIZE = 0.042
const TRUST_TARGET_OPACITY = 0.92

function padColors(buf: Float32Array, maxCount: number): Float32Array {
  const n = buf.length / 3
  if (n >= maxCount) return buf
  const out = new Float32Array(maxCount * 3)
  out.set(buf)
  return out
}

function activeParticleCount(sectionIdx: number, trustCount: number, morphCount: number): number {
  return sectionIdx === TRUST_SECTION_INDEX ? trustCount : morphCount
}

function scatterEcosystemMorph(morph: Float32Array, fromTrust = false): void {
  if (fromTrust) {
    morph.set(scatterEcosystemFromTrust(morph.length / 3))
    return
  }
  for (let i = 0; i < morph.length / 3; i++) {
    const bi = i * 3
    morph[bi] = 0.2 + Math.random() * 0.85
    morph[bi + 1] = (Math.random() - 0.5) * 2.4
    morph[bi + 2] = (Math.random() - 0.5) * 0.45
  }
}

function scatterMiningStardustMorph(morph: Float32Array): void {
  morph.set(scatterMiningDispersed(morph.length / 3))
}

function scatterTokenMorph(morph: Float32Array): void {
  for (let i = 0; i < morph.length / 3; i++) {
    const bi = i * 3
    morph[bi] = (Math.random() - 0.2) * 1.6
    morph[bi + 1] = (Math.random() - 0.5) * 2.6
    morph[bi + 2] = (Math.random() - 0.5) * 0.5
  }
}

function scatterBoosterFromBelow(morph: Float32Array, meta: Float32Array | null): void {
  for (let i = 0; i < morph.length / 3; i++) {
    const bi = i * 3
    if (meta && meta[i * 6] === BOOSTER_ROLE.DUST) continue
    morph[bi] = 0.25 + Math.random() * 0.55
    morph[bi + 1] = -1.35 - Math.random() * 0.65
    morph[bi + 2] = (Math.random() - 0.5) * 0.35
  }
  if (meta) {
    scatterBoosterStardustFromRear(morph, meta, morph.length / 3)
  }
}

function scatterStakingFromExterior(morph: Float32Array): void {
  const exterior = scatterStakingExterior(morph.length / 3)
  morph.set(exterior)
}

function scatterGpulseMorph(morph: Float32Array): void {
  const left = scatterGpulseFromLeft(morph.length / 3)
  morph.set(left)
}

function scatterGoracleMorph(morph: Float32Array): void {
  const dispersed = scatterGoracleDispersed(morph.length / 3)
  morph.set(dispersed)
}

function scatterMarketplaceMorph(morph: Float32Array): void {
  const exterior = scatterMarketplaceExterior(morph.length / 3)
  morph.set(exterior)
}

function scatterCommunityMorph(morph: Float32Array): void {
  const exterior = scatterCommunityExterior(morph.length / 3)
  morph.set(exterior)
}

function scatterTechnologyMorph(morph: Float32Array): void {
  const exterior = scatterTechnologyExterior(morph.length / 3)
  morph.set(exterior)
}

function scatterRoadmapMorph(morph: Float32Array): void {
  const top = scatterRoadmapFromTop(morph.length / 3)
  morph.set(top)
}

function scatterPortalMorph(morph: Float32Array): void {
  const exterior = scatterPortalFromExterior(morph.length / 3)
  morph.set(exterior)
}

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3
}

function makeCircleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')!
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 28)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.5, 'rgba(255,255,255,0.85)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.beginPath()
  ctx.arc(32, 32, 28, 0, Math.PI * 2)
  ctx.fillStyle = grad
  ctx.fill()
  return new THREE.CanvasTexture(canvas)
}

export default function ParticleMorphSystem({
  sectionIndexRef,
  scrollProgressRef,
  heroActive = false,
}: ParticleMorphSystemProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const pointsRef = useRef<THREE.Points>(null!)
  const morphPosRef = useRef<Float32Array | null>(null)
  const [desktopLayout, setDesktopLayout] = useState(false)
  const [trustParticleCount, setTrustParticleCount] = useState(PARTICLE_COUNT)
  const [morphParticleCount, setMorphParticleCount] = useState(PARTICLE_COUNT)

  useEffect(() => {
    const sync = () => {
      const w = window.innerWidth
      setDesktopLayout(isDesktopViewport(w))
      setTrustParticleCount(trustParticleCountForWidth(w))
      setMorphParticleCount(morphParticleCountForWidth(w))
    }
    sync()
    window.addEventListener('resize', sync)
    return () => window.removeEventListener('resize', sync)
  }, [])

  const allTargets = useMemo(
    () => buildStructuredTargets(desktopLayout, trustParticleCount),
    [desktopLayout, trustParticleCount]
  )
  const circleTexture = useMemo(() => makeCircleTexture(), [])

  const particlePhases = useMemo(() => {
    const phases = new Float32Array(MORPH_MAX_PARTICLE_COUNT)
    for (let i = 0; i < MORPH_MAX_PARTICLE_COUNT; i++) {
      phases[i] = Math.random() * Math.PI * 2
    }
    return phases
  }, [])

  const sectionColorTargets = useMemo(() => {
    const tokenMeta = getTokenGravityMeta()
    return SECTION_PALETTES.map((_, i) => {
      let colors: Float32Array
      if (i === TRUST_SECTION_INDEX) {
        const trustMeta = getTrustShieldMeta()
        colors = trustMeta
          ? buildTrustShieldColors(trustParticleCount, trustMeta)
          : buildSectionParticleColors(i, PARTICLE_COUNT)
      } else if (i === ECOSYSTEM_SECTION_INDEX) {
        colors = buildEcosystemFlowColors(PARTICLE_COUNT)
      } else if (i === TOKEN_SECTION_INDEX && tokenMeta) {
        colors = buildTokenGravityColors(PARTICLE_COUNT, tokenMeta)
      } else if (i === MINING_SECTION_INDEX) {
        const miningMeta = getMiningFlowMeta()
        colors = miningMeta
          ? buildMiningStardustColors(PARTICLE_COUNT, miningMeta)
          : buildSectionParticleColors(i, PARTICLE_COUNT)
      } else if (i === BOOSTER_SECTION_INDEX) {
        const boosterMeta = getBoosterStackMeta()
        colors = boosterMeta
          ? buildBoosterStackColors(PARTICLE_COUNT, boosterMeta)
          : buildSectionParticleColors(i, PARTICLE_COUNT)
      } else if (i === STAKING_SECTION_INDEX) {
        const stakingMeta = getStakingShieldMeta()
        colors = stakingMeta
          ? buildStakingShieldColors(PARTICLE_COUNT, stakingMeta)
          : buildSectionParticleColors(i, PARTICLE_COUNT)
      } else if (i === GPULSE_SECTION_INDEX) {
        const gpulseMeta = getGpulseWaveMeta()
        colors = gpulseMeta
          ? buildGpulseWaveColors(PARTICLE_COUNT, gpulseMeta)
          : buildSectionParticleColors(i, PARTICLE_COUNT)
      } else if (i === GORACLE_SECTION_INDEX) {
        const goracleMeta = getGoracleBrainMeta()
        colors = goracleMeta
          ? buildGoracleBrainColors(PARTICLE_COUNT, goracleMeta)
          : buildSectionParticleColors(i, PARTICLE_COUNT)
      } else if (i === MARKETPLACE_SECTION_INDEX) {
        const marketplaceMeta = getMarketplaceNetworkMeta()
        colors = marketplaceMeta
          ? buildMarketplaceNetworkColors(PARTICLE_COUNT, marketplaceMeta)
          : buildSectionParticleColors(i, PARTICLE_COUNT)
      } else if (i === COMMUNITY_SECTION_INDEX) {
        const communityMeta = getCommunityNetworkMeta()
        colors = communityMeta
          ? buildCommunityNetworkColors(PARTICLE_COUNT, communityMeta)
          : buildSectionParticleColors(i, PARTICLE_COUNT)
      } else if (i === TECHNOLOGY_SECTION_INDEX) {
        const technologyMeta = getTechnologyStackMeta()
        colors = technologyMeta
          ? buildTechnologyStackColors(PARTICLE_COUNT, technologyMeta)
          : buildSectionParticleColors(i, PARTICLE_COUNT)
      } else if (i === ROADMAP_SECTION_INDEX) {
        const roadmapMeta = getRoadmapTimelineMeta()
        colors = roadmapMeta
          ? buildRoadmapTimelineColors(PARTICLE_COUNT, roadmapMeta)
          : buildSectionParticleColors(i, PARTICLE_COUNT)
      } else if (i === CTA_SECTION_INDEX) {
        const portalMeta = getPortalNetworkMeta()
        colors = portalMeta
          ? buildPortalNetworkColors(PARTICLE_COUNT, portalMeta)
          : buildSectionParticleColors(i, PARTICLE_COUNT)
      } else {
        colors = buildSectionParticleColors(i, PARTICLE_COUNT)
      }
      return padColors(colors, MORPH_MAX_PARTICLE_COUNT)
    })
  }, [allTargets, trustParticleCount])

  const ecosystemFlowMeta = useMemo(() => getEcosystemFlowMeta(), [allTargets])
  const miningStardustMeta = useMemo(() => getMiningFlowMeta(), [allTargets])
  const trustShieldMeta = useMemo(() => getTrustShieldMeta(), [allTargets])
  const tokenGravityMeta = useMemo(() => getTokenGravityMeta(), [allTargets])
  const boosterStackMeta = useMemo(() => getBoosterStackMeta(), [allTargets])
  const stakingShieldMeta = useMemo(() => getStakingShieldMeta(), [allTargets])
  const gpulseWaveMeta = useMemo(() => getGpulseWaveMeta(), [allTargets])
  const goracleBrainMeta = useMemo(() => getGoracleBrainMeta(), [allTargets])
  const marketplaceNetworkMeta = useMemo(() => getMarketplaceNetworkMeta(), [allTargets])
  const communityNetworkMeta = useMemo(() => getCommunityNetworkMeta(), [allTargets])
  const technologyStackMeta = useMemo(() => getTechnologyStackMeta(), [allTargets])
  const roadmapTimelineMeta = useMemo(() => getRoadmapTimelineMeta(), [allTargets])
  const portalNetworkMeta = useMemo(() => getPortalNetworkMeta(), [allTargets])

  const currentPositions = useMemo(() => {
    morphPosRef.current = new Float32Array(allTargets[0])
    return morphPosRef.current
  }, [allTargets])

  const currentColors = useMemo(
    () => new Float32Array(sectionColorTargets[0]),
    [sectionColorTargets]
  )

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(currentColors, 3))
    return geo
  }, [currentPositions, currentColors])

  const prevSectionRef = useRef(0)
  const opacityRef = useRef(TARGET_OPACITY)
  const tokenEnterTimeRef = useRef(-1)
  const tokenScatterRef = useRef<Float32Array | null>(null)
  const boosterEnterTimeRef = useRef(-1)
  const stakingEnterTimeRef = useRef(-1)
  const gpulseEnterTimeRef = useRef(-1)
  const goracleEnterTimeRef = useRef(-1)
  const marketplaceEnterTimeRef = useRef(-1)
  const communityEnterTimeRef = useRef(-1)
  const technologyEnterTimeRef = useRef(-1)
  const roadmapEnterTimeRef = useRef(-1)
  const portalEnterTimeRef = useRef(-1)
  const trustDepthSizeRef = useRef(1)
  const devResetCounterRef = useRef(0)
  const trustEnterTimeRef = useRef(-1)
  const trustScatterRef = useRef<Float32Array | null>(null)
  const trustFormationModeRef = useRef<GenesisFormationMode>('direct')
  const trustDirectEntryPendingRef = useRef(false)
  const lastTrustFromSectionRef = useRef(0)
  const ecosystemEnterTimeRef = useRef(-1)
  const miningEnterTimeRef = useRef(-1)

  /** Sondas: `?sonda=linaje` y `?sonda=relevo`. Apagadas por defecto. */
  const sondaLinajeRef = useRef(false)
  const sondaRelevoRef = useRef(false)
  useEffect(() => {
    const s = new URLSearchParams(window.location.search).get('sonda')
    sondaLinajeRef.current = s === 'linaje'
    sondaRelevoRef.current = s === 'relevo'
  }, [])

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, '').toLowerCase()
    if (hash === 'trust' || hash === 'confianza') {
      trustDirectEntryPendingRef.current = true
    }
  }, [])

  useFrame(({ clock }) => {
    if (heroActive) return
    if (!pointsRef.current || !groupRef.current || !morphPosRef.current) return

    const sectionIdx = Math.min(sectionIndexRef.current, allTargets.length - 1)
    const structure = getSectionStructure(sectionIdx)
    const morphLerp = structure.morphLerp ?? DEFAULT_LERP_SPEED
    const groupLerp = structure.groupLerp ?? PARTICLE_OFFSET_LERP
    const fadeLerp = structure.fadeInLerp ?? DEFAULT_FADE_LERP
    const offsetTarget = particleGroupTarget(sectionIdx, desktopLayout)
    const g = groupRef.current.position

    const target = allTargets[sectionIdx]
    const colorTarget = sectionColorTargets[sectionIdx]
    const morph = morphPosRef.current
    const pos = geometry.attributes.position.array as Float32Array
    const col = geometry.attributes.color.array as Float32Array

    if (prevSectionRef.current !== sectionIdx) {
      const enteringTrustFromHero =
        sectionIdx === TRUST_SECTION_INDEX &&
        (prevSectionRef.current === 0 || prevSectionRef.current < 0)
      const enteringEcosystemFromTrust =
        sectionIdx === ECOSYSTEM_SECTION_INDEX &&
        prevSectionRef.current === TRUST_SECTION_INDEX
      if (
        sectionIdx === TRUST_SECTION_INDEX ||
        sectionIdx === ECOSYSTEM_SECTION_INDEX ||
        sectionIdx === TOKEN_SECTION_INDEX ||
        sectionIdx === MINING_SECTION_INDEX ||
        sectionIdx === BOOSTER_SECTION_INDEX ||
        sectionIdx === STAKING_SECTION_INDEX ||
        sectionIdx === GPULSE_SECTION_INDEX ||
        sectionIdx === GORACLE_SECTION_INDEX ||
        sectionIdx === ROADMAP_SECTION_INDEX
      ) {
        opacityRef.current = enteringTrustFromHero
          ? TRUST_TARGET_OPACITY
          : enteringEcosystemFromTrust
            ? TRUST_TARGET_OPACITY * 0.88
            : 0.12
      }
      if (sectionIdx === TRUST_SECTION_INDEX) {
        const fromSection =
          prevSectionRef.current >= 0 ? prevSectionRef.current : lastTrustFromSectionRef.current
        lastTrustFromSectionRef.current = fromSection
        const directEntry = trustDirectEntryPendingRef.current
        trustDirectEntryPendingRef.current = false
        trustFormationModeRef.current = resolveGenesisFormationMode(fromSection, directEntry)
        if (trustFormationModeRef.current === 'fromHeroLogoDrop') {
          const trustGroup = particleGroupTarget(TRUST_SECTION_INDEX, desktopLayout)
          setHeroDropGroupOffset([trustGroup.x, trustGroup.y, trustGroup.z])
        }
        // Corria en produccion en cada entrada a Trust. Ahora dice ademas que
        // modo de relevo se eligio, que es justo lo que hay que poder ver.
        if (sondaLinajeRef.current || sondaRelevoRef.current) {
          console.log('[Relevo] trust enter', {
            fromSection,
            mode: trustFormationModeRef.current,
            directEntry,
          })
        }
        trustEnterTimeRef.current = clock.getElapsedTime()
        const trustLimit = activeParticleCount(sectionIdx, trustParticleCount, morphParticleCount)
        const meta = getTrustShieldMeta()
        if (meta) {
          trustScatterRef.current = buildTrustFormationScatter(
            trustLimit,
            trustFormationModeRef.current,
            window.innerWidth,
            (i) => {
              const p = computeTrustLockedLogoPosition(meta, i, 0, 0)
              return [p[0], p[1], p[2]] as [number, number, number]
            }
          )
          if (trustFormationModeRef.current === 'bidirectional') {
            const scatter = trustScatterRef.current
            for (let i = 0; i < trustLimit; i++) {
              const bi = i * 3
              morph[bi] = scatter[bi]!
              morph[bi + 1] = scatter[bi + 1]!
              morph[bi + 2] = scatter[bi + 2]!
              pos[bi] = scatter[bi]!
              pos[bi + 1] = scatter[bi + 1]!
              pos[bi + 2] = scatter[bi + 2]!
            }
            geometry.attributes.position.needsUpdate = true
          }
          if (trustFormationModeRef.current === 'fromHeroLogoDrop') {
            for (let i = 0; i < trustLimit; i++) {
              const mi = i * TRUST_META_STRIDE
              const slot = meta[mi + 1]!
              const poolIndex = meta[mi + 3]!
              const bi = i * 3
              if (slot === TRUST_CORE_SLOT.LOGO_MASK) {
                const [r, g, b] = computeStardustLogoApprovedColor(poolIndex)
                col[bi] = r
                col[bi + 1] = g
                col[bi + 2] = b
              } else if (slot === TRUST_CORE_SLOT.LOGO_NUCLEUS) {
                const [r, g, b] = computeNucleusApprovedColor()
                col[bi] = r
                col[bi + 1] = g
                col[bi + 2] = b
              }
            }
            if (pointsRef.current) {
              const mat = pointsRef.current.material as THREE.PointsMaterial
              mat.size = TRUST_POINT_SIZE * GENESIS_G_BODY_POINT_SIZE_MULT
            }
          }
        }
      } else if (sectionIdx !== TRUST_SECTION_INDEX) {
        trustEnterTimeRef.current = -1
        trustScatterRef.current = null
      }
      /**
       * EL LINAJE — la entrada desciende del estado real anterior.
       *
       * `pos` en este instante contiene la salida de la seccion que dejamos, asi
       * que la informacion de linaje estaba disponible todo el tiempo: once de
       * doce transiciones la descartaban para poner `Math.random()` en una
       * anilla. Y cuatro de esas anillas eran la misma con constantes movidas
       * por debajo del umbral perceptible.
       *
       * `entradaDesde` no reemplaza el estado anterior: lo transforma segun el
       * gesto de la seccion que llega. Ninguna particula teletransporta.
       *
       * Las dispersiones antiguas siguen en este archivo y vuelven a correr
       * poniendo USAR_LINAJE a false.
       */
      const limiteEntrada = activeParticleCount(
        sectionIdx,
        trustParticleCount,
        morphParticleCount,
      )
      const linaje = (respaldo: () => void) => {
        const mov = movimientoDeIndice(sectionIdx)
        // El diagnostico se calcula en LOS DOS caminos: sin el baseline del
        // camino viejo, la correlacion del nuevo no significa nada.
        const antes = sondaLinajeRef.current ? new Float32Array(pos.subarray(0, limiteEntrada * 3)) : null
        let diag = { correlacion: 0, desplazamiento: 0 }
        if (USAR_LINAJE) {
          diag = entradaDesde(pos, morph, mov, limiteEntrada)
        } else {
          respaldo()
          if (antes) diag = correlacionEntre(antes, morph, limiteEntrada)
        }
        /**
         * La sonda del linaje. Se enciende con `?sonda=linaje` en la URL, igual
         * que los modos editor que ya existen en este repo.
         *
         * Sin esto el linaje no es comprobable: una transicion puede parecer
         * continua por casualidad —si las dos figuras se parecen— y parecer un
         * corte aunque funcione, si el gesto es grande. La correlacion no se
         * deja enganar por ninguno de los dos casos.
         */
        if (sondaLinajeRef.current) {
          let nanPos = 0
          let rmax = 0
          let aparcadas = 0
          for (let i = 0; i < limiteEntrada; i++) {
            const bi = i * 3
            const x = pos[bi]
            const y = pos[bi + 1]
            const z = pos[bi + 2]
            if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) {
              nanPos++
            } else if (x! <= -100) {
              // aparcadero: (-120,-120,0). Medir el radio aqui daria 169,7 y
              // taparia el radio real de la escena, que es lo que importa.
              aparcadas++
            } else {
              rmax = Math.max(rmax, Math.hypot(x!, y!, z!))
            }
          }
          const registro = (window as unknown as { __linaje?: unknown[] }).__linaje ?? []
          registro.push({
            de: prevSectionRef.current,
            a: sectionIdx,
            gesto: mov,
            correlacion: Number(diag.correlacion.toFixed(4)),
            desplazamiento: Number(diag.desplazamiento.toFixed(4)),
            limite: limiteEntrada,
            bufferParticulas: pos.length / 3,
            fueraDeRango: Math.max(0, limiteEntrada - pos.length / 3),
            nanEnPos: nanPos,
            aparcadas,
            radioMaximo: Number(rmax.toFixed(3)),
          })
          ;(window as unknown as { __linaje?: unknown[] }).__linaje = registro
        }
      }

      if (sectionIdx === ECOSYSTEM_SECTION_INDEX) {
        linaje(() =>
          scatterEcosystemMorph(morph, prevSectionRef.current === TRUST_SECTION_INDEX),
        )
        ecosystemEnterTimeRef.current = clock.getElapsedTime()
      } else if (sectionIdx !== ECOSYSTEM_SECTION_INDEX) {
        ecosystemEnterTimeRef.current = -1
      }
      if (sectionIdx === TOKEN_SECTION_INDEX) {
        linaje(() => scatterTokenMorph(morph))
        tokenScatterRef.current = new Float32Array(morph)
        tokenEnterTimeRef.current = clock.getElapsedTime()
      } else if (sectionIdx !== TOKEN_SECTION_INDEX) {
        tokenEnterTimeRef.current = -1
        tokenScatterRef.current = null
      }
      if (sectionIdx === MINING_SECTION_INDEX) {
        linaje(() => scatterMiningStardustMorph(morph))
        miningEnterTimeRef.current = clock.getElapsedTime()
      } else if (sectionIdx !== MINING_SECTION_INDEX) {
        miningEnterTimeRef.current = -1
      }
      if (sectionIdx === BOOSTER_SECTION_INDEX) {
        linaje(() => scatterBoosterFromBelow(morph, getBoosterStackMeta()))
        boosterEnterTimeRef.current = clock.getElapsedTime()
      }
      if (sectionIdx === STAKING_SECTION_INDEX) {
        linaje(() => scatterStakingFromExterior(morph))
        stakingEnterTimeRef.current = clock.getElapsedTime()
      }
      if (sectionIdx === GPULSE_SECTION_INDEX) {
        linaje(() => scatterGpulseMorph(morph))
        gpulseEnterTimeRef.current = clock.getElapsedTime()
      }
      if (sectionIdx === GORACLE_SECTION_INDEX) {
        linaje(() => scatterGoracleMorph(morph))
        goracleEnterTimeRef.current = clock.getElapsedTime()
      }
      if (sectionIdx === MARKETPLACE_SECTION_INDEX) {
        linaje(() => scatterMarketplaceMorph(morph))
        marketplaceEnterTimeRef.current = clock.getElapsedTime()
      }
      if (sectionIdx === COMMUNITY_SECTION_INDEX) {
        linaje(() => scatterCommunityMorph(morph))
        communityEnterTimeRef.current = clock.getElapsedTime()
      }
      if (sectionIdx === TECHNOLOGY_SECTION_INDEX) {
        linaje(() => scatterTechnologyMorph(morph))
        technologyEnterTimeRef.current = clock.getElapsedTime()
      }
      if (sectionIdx === ROADMAP_SECTION_INDEX) {
        linaje(() => scatterRoadmapMorph(morph))
        roadmapEnterTimeRef.current = clock.getElapsedTime()
      }
      if (sectionIdx === CTA_SECTION_INDEX) {
        linaje(() => scatterPortalMorph(morph))
        portalEnterTimeRef.current = clock.getElapsedTime()
      }
      prevSectionRef.current = sectionIdx
      if (sectionIdx >= 0) {
        lastTrustFromSectionRef.current = sectionIdx
      }
    }

    const t = clock.getElapsedTime()
    const isTrustSection = sectionIdx === TRUST_SECTION_INDEX
    const isTokenSection = sectionIdx === TOKEN_SECTION_INDEX
    const isMiningSection = sectionIdx === MINING_SECTION_INDEX
    const trustFormElapsed =
      trustEnterTimeRef.current >= 0 ? t - trustEnterTimeRef.current : 999
    const trustFormTGlobal = isTrustSection
      ? genesisLogoFormationProgress(trustFormElapsed, trustFormationModeRef.current)
      : 1
    const heroDropForming =
      isTrustSection &&
      trustFormTGlobal < 1 &&
      trustFormationModeRef.current === 'fromHeroLogoDrop'

    const heroGroupTarget = particleGroupTarget(0, desktopLayout)
    let effectiveGroupTarget = heroDropForming ? heroGroupTarget : offsetTarget
    if (!heroDropForming && isMiningSection) {
      const miningAnchor = readMiningConstellationGroupTarget()
      if (miningAnchor) {
        effectiveGroupTarget = {
          ...miningAnchor,
          x: miningAnchor.x + miningGroupHorizontalSwing(t),
        }
      }
    } else if (!heroDropForming && sectionIdx === BOOSTER_SECTION_INDEX) {
      const boosterAnchor = readBoosterAcceleratorGroupTarget()
      if (boosterAnchor) {
        effectiveGroupTarget = boosterAnchor
      }
    } else if (!heroDropForming && sectionIdx === STAKING_SECTION_INDEX) {
      const stakingAnchor = readStakingVaultGroupTarget()
      if (stakingAnchor) {
        effectiveGroupTarget = stakingAnchor
      }
    } else if (!heroDropForming && sectionIdx === GPULSE_SECTION_INDEX) {
      const gpulseAnchor = readGpulseSignalGroupTarget()
      if (gpulseAnchor) {
        effectiveGroupTarget = gpulseAnchor
      }
    } else if (!heroDropForming && sectionIdx === GORACLE_SECTION_INDEX) {
      const goracleAnchor = readGoracleBrainGroupTarget()
      if (goracleAnchor) {
        effectiveGroupTarget = goracleAnchor
      }
    } else if (!heroDropForming && sectionIdx === MARKETPLACE_SECTION_INDEX) {
      const marketplaceAnchor = readMarketplaceCommerceGroupTarget()
      if (marketplaceAnchor) {
        effectiveGroupTarget = marketplaceAnchor
      }
    } else if (!heroDropForming && sectionIdx === COMMUNITY_SECTION_INDEX) {
      const communityAnchor = readCommunityNetworkGroupTarget()
      if (communityAnchor) {
        effectiveGroupTarget = communityAnchor
      }
    } else if (!heroDropForming && sectionIdx === TECHNOLOGY_SECTION_INDEX) {
      const technologyAnchor = readTechnologyStackGroupTarget()
      if (technologyAnchor) {
        effectiveGroupTarget = technologyAnchor
      }
    } else if (!heroDropForming && sectionIdx === ROADMAP_SECTION_INDEX) {
      const roadmapAnchor = readRoadmapEvolutionGroupTarget()
      if (roadmapAnchor) {
        effectiveGroupTarget = roadmapAnchor
      }
    }
    g.x += (effectiveGroupTarget.x - g.x) * groupLerp
    g.y += (effectiveGroupTarget.y - g.y) * groupLerp
    g.z += (effectiveGroupTarget.z - g.z) * groupLerp

    const particleLimit = activeParticleCount(sectionIdx, trustParticleCount, morphParticleCount)
    geometry.setDrawRange(0, particleLimit)

    if (isTrustSection && trustShieldMeta) {
      let depthSizeSum = 0
      let depthCount = 0
      for (let di = 0; di < particleLimit; di++) {
        const dmi = di * TRUST_META_STRIDE
        const dslot = trustShieldMeta[dmi + 1]
        if (dslot === TRUST_CORE_SLOT.LOGO_MASK || dslot === TRUST_CORE_SLOT.LOGO_NUCLEUS) {
          const poolIdx = trustShieldMeta[dmi + 3]
          depthSizeSum += trustDepthPointSizeMul(computeTrustParticleDepthTier(poolIdx))
          depthCount++
        }
      }
      trustDepthSizeRef.current = depthCount > 0 ? depthSizeSum / depthCount : 1
    } else {
      trustDepthSizeRef.current = 1
    }

    const heroDropNeonLock =
      isTrustSection && trustFormationModeRef.current === 'fromHeroLogoDrop'

    if (heroDropForming || heroDropNeonLock) {
      opacityRef.current = TRUST_TARGET_OPACITY
    } else {
      opacityRef.current += ((isTrustSection ? TRUST_TARGET_OPACITY : TARGET_OPACITY) - opacityRef.current) * fadeLerp
    }
    const material = pointsRef.current.material as THREE.PointsMaterial
    const trustMaterialOpacity =
      heroDropForming || heroDropNeonLock
        ? TRUST_TARGET_OPACITY
        : Math.max(
            LOGO_PERMANENT_GLOW.OPACITY_MIN,
            getTrustDevGlobalOpacity(opacityRef.current)
          )
    material.opacity = isTrustSection ? trustMaterialOpacity : opacityRef.current
    const baseTrustSize = TRUST_POINT_SIZE * GENESIS_G_BODY_POINT_SIZE_MULT
    const trustSizePulse =
      isTrustSection && !heroDropNeonLock
        ? 1 + Math.sin(t * GENESIS_NEON_PULSE.SPEED) * GENESIS_NEON_PULSE.AMPLITUDE * 0.38
        : 1
    const targetPointSize = isTrustSection
      ? (heroDropNeonLock ? baseTrustSize : getTrustDevGlobalPointSize(baseTrustSize)) *
        trustSizePulse *
        trustDepthSizeRef.current
      : isTokenSection
        ? DEFAULT_POINT_SIZE * TOKEN_POINT_SIZE_MULT
        : isMiningSection
          ? DEFAULT_POINT_SIZE * MINING_POINT_SIZE_MULT
          : DEFAULT_POINT_SIZE
    material.size += (targetPointSize - material.size) * 0.1

    if (isTrustSection && isDevParticleControlActive() && !heroDropNeonLock) {
      const devReset = getTrustAnimationResetCounter()
      if (devReset !== devResetCounterRef.current) {
        devResetCounterRef.current = devReset
      }
      const [rx, ry, rz] = getTrustDevTransformRotation()
      groupRef.current.rotation.x = THREE.MathUtils.degToRad(rx)
      groupRef.current.rotation.y = THREE.MathUtils.degToRad(ry)
      groupRef.current.rotation.z = THREE.MathUtils.degToRad(rz)
      const devScale = getTrustDevTransformScale()
      groupRef.current.scale.set(devScale, devScale, devScale)
    } else if (!isTrustSection) {
      groupRef.current.rotation.set(0, 0, 0)
      groupRef.current.scale.set(1, 1, 1)
    }

    diagLogParticleSystemFrame({
      sectionIdx,
      isTrust: isTrustSection,
      hasMeta: Boolean(trustShieldMeta),
      hasScatter: Boolean(trustScatterRef.current),
      devActive: isDevParticleControlActive(),
      controls: getGenesisParticleControlConfig().global,
      materialSize: material.size,
      materialOpacity: material.opacity,
      particleLimit,
    })

    // Anticipación de la forma siguiente en función del scroll. `blend` es 0
    // mientras no se haya avanzado lo suficiente dentro de la sección, y ahí
    // este bloque se comporta exactamente igual que antes de existir.
    const blend = scrollBlendAmount(scrollProgressRef.current)
    const nextTarget =
      blend > 0 ? allTargets[Math.min(sectionIdx + 1, allTargets.length - 1)] : null

    if (process.env.NODE_ENV !== 'production') {
      ;(window as Window & { __GENESIS_MORPH_BLEND__?: number }).__GENESIS_MORPH_BLEND__ = blend
    }

    for (let i = 0; i < particleLimit * 3; i++) {
      if (!isTrustSection) {
        const aim = nextTarget
          ? target[i] + (nextTarget[i] - target[i]) * blend
          : target[i]
        morph[i] += (aim - morph[i]) * morphLerp
        col[i] += (colorTarget[i] - col[i]) * COLOR_LERP_SPEED
      }
    }

    const motion = structure.motionIntensity
    const breathe = 1 + Math.sin(t * 0.38) * 0.012 * motion
    const isTrust = sectionIdx === TRUST_SECTION_INDEX
    const isEcosystem = sectionIdx === ECOSYSTEM_SECTION_INDEX
    const isToken = sectionIdx === TOKEN_SECTION_INDEX
    const isMining = sectionIdx === MINING_SECTION_INDEX
    const isBooster = sectionIdx === BOOSTER_SECTION_INDEX
    const isStaking = sectionIdx === STAKING_SECTION_INDEX
    const isGpulse = sectionIdx === GPULSE_SECTION_INDEX
    const isGoracle = sectionIdx === GORACLE_SECTION_INDEX
    const isMarketplace = sectionIdx === MARKETPLACE_SECTION_INDEX
    const isCommunity = sectionIdx === COMMUNITY_SECTION_INDEX
    const isTechnology = sectionIdx === TECHNOLOGY_SECTION_INDEX
    const isRoadmap = sectionIdx === ROADMAP_SECTION_INDEX
    const isPortal = sectionIdx === CTA_SECTION_INDEX

    const tokenFormElapsed =
      isToken && tokenEnterTimeRef.current >= 0 ? t - tokenEnterTimeRef.current : 999
    const tokenFormTGlobal = isToken ? tokenCoreFormationProgress(tokenFormElapsed) : 1

    const tokenFormT =
      isToken && tokenEnterTimeRef.current >= 0
        ? tokenFormTGlobal
        : 1

    const boosterFormT =
      isBooster && boosterEnterTimeRef.current >= 0
        ? easeOutCubic(Math.min(1, (t - boosterEnterTimeRef.current) / 0.82))
        : 1

    const stakingFormT =
      isStaking && stakingEnterTimeRef.current >= 0
        ? easeOutCubic(Math.min(1, (t - stakingEnterTimeRef.current) / STAKING_FORM_DURATION))
        : 1

    const gpulseFormT =
      isGpulse && gpulseEnterTimeRef.current >= 0
        ? easeOutCubic(Math.min(1, (t - gpulseEnterTimeRef.current) / GPULSE_FORM_DURATION))
        : 1

    const goracleFormT =
      isGoracle && goracleEnterTimeRef.current >= 0
        ? easeOutCubic(Math.min(1, (t - goracleEnterTimeRef.current) / GORACLE_FORM_DURATION))
        : 1

    const marketplaceFormT =
      isMarketplace && marketplaceEnterTimeRef.current >= 0
        ? easeOutCubic(Math.min(1, (t - marketplaceEnterTimeRef.current) / MARKETPLACE_FORM_DURATION))
        : 1

    const communityFormT =
      isCommunity && communityEnterTimeRef.current >= 0
        ? easeOutCubic(Math.min(1, (t - communityEnterTimeRef.current) / COMMUNITY_FORM_DURATION))
        : 1

    const technologyFormT =
      isTechnology && technologyEnterTimeRef.current >= 0
        ? easeOutCubic(Math.min(1, (t - technologyEnterTimeRef.current) / TECHNOLOGY_FORM_DURATION))
        : 1

    const roadmapFormT =
      isRoadmap && roadmapEnterTimeRef.current >= 0
        ? easeOutCubic(Math.min(1, (t - roadmapEnterTimeRef.current) / ROADMAP_FORM_DURATION))
        : 1

    const portalFormT =
      isPortal && portalEnterTimeRef.current >= 0
        ? easeOutCubic(Math.min(1, (t - portalEnterTimeRef.current) / PORTAL_FORM_DURATION))
        : 1

    if (isTrust && trustShieldMeta && isGenesisColorAuditEnabled()) {
      resetColorAuditFrame()
    }

    for (let i = 0; i < particleLimit; i++) {
      const phase = particlePhases[i]
      let ox = Math.sin(t * 0.55 + phase) * ORGANIC_STRENGTH * motion
      const oy = Math.cos(t * 0.42 + phase * 1.17) * ORGANIC_STRENGTH * 0.85 * motion
      const oz = Math.sin(t * 0.36 + phase * 0.73) * ORGANIC_STRENGTH * 0.65 * motion

      if (isTrust && trustShieldMeta) {
        const bi = i * 3
        const mi = i * TRUST_META_STRIDE
        const role = trustShieldMeta[mi]
        const slot = trustShieldMeta[mi + 1]
        const param = trustShieldMeta[mi + 2]
        const aux = trustShieldMeta[mi + 3]
        const metaPhase = trustShieldMeta[mi + 4]
        const speed = trustShieldMeta[mi + 5]
        const heroDropLogoLock =
          trustFormationModeRef.current === 'fromHeroLogoDrop' &&
          (slot === TRUST_CORE_SLOT.LOGO_MASK || slot === TRUST_CORE_SLOT.LOGO_NUCLEUS)
        const bypassDevForNeon =
          slot === TRUST_CORE_SLOT.LOGO_MASK || slot === TRUST_CORE_SLOT.LOGO_NUCLEUS
        const animT =
          bypassDevForNeon || !isDevParticleControlActive()
            ? t
            : resolveDevAnimationTime(t)

        const trustFormElapsed =
          trustEnterTimeRef.current >= 0 ? animT - trustEnterTimeRef.current : 999
        const trustFormT = genesisLogoFormationProgress(
          trustFormElapsed,
          trustFormationModeRef.current
        )
        const trustScatter = trustScatterRef.current
        const forming = trustFormT < 1 && trustScatter !== null
        const skipDevColorOverride = forming || bypassDevForNeon

        const [ax, ay, az] = computeTrustLockedLogoPosition(
          trustShieldMeta,
          i,
          animT,
          motion
        )

        if (forming) {
          const formationMode = trustFormationModeRef.current
          const [fx, fy, fz] = computeGenesisLogoFormationPosition(
            [ax, ay, az],
            [trustScatter[bi]!, trustScatter[bi + 1]!, trustScatter[bi + 2]!],
            trustFormT,
            animT,
            i,
            formationMode,
            GENESIS_G_IDENTITY_SCALE
          )
          pos[bi] = fx
          pos[bi + 1] = fy
          pos[bi + 2] = fz
        } else {
          pos[bi] = ax
          pos[bi + 1] = ay
          pos[bi + 2] = az
        }

        let pipelineR = col[bi]
        let pipelineG = col[bi + 1]
        let pipelineB = col[bi + 2]

        if (slot === TRUST_CORE_SLOT.LOGO_MASK) {
          const isRay = isGenesisLogoOuterRay(aux)
          const [sr, sg, sb] = heroDropLogoLock
            ? computeStardustLogoApprovedColor(aux)
            : (() => {
                const pulse = computeNeonLogoPulse(animT, metaPhase)
                return isRay
                  ? computeStardustRayLiveColor(aux, animT, metaPhase, pulse)
                  : computeStardustLogoLiveColor(aux, animT, metaPhase, pulse)
              })()
          pipelineR = sr
          pipelineG = sg
          pipelineB = sb
          col[bi] = sr
          col[bi + 1] = sg
          col[bi + 2] = sb
        } else if (slot === TRUST_CORE_SLOT.LOGO_NUCLEUS) {
          const [nr, ng, nb] = heroDropLogoLock
            ? computeNucleusApprovedColor()
            : (() => {
                const pulse = computeNeonNucleusPulse(animT, metaPhase)
                return computeNucleusStardustColor(animT, metaPhase, pulse, param)
              })()
          pipelineR = nr
          pipelineG = ng
          pipelineB = nb
          col[bi] = nr
          col[bi + 1] = ng
          col[bi + 2] = nb
        }

        if (
          forming &&
          trustFormationModeRef.current === 'bidirectional' &&
          (slot === TRUST_CORE_SLOT.LOGO_MASK || slot === TRUST_CORE_SLOT.LOGO_NUCLEUS)
        ) {
          const bounds = getGenesisLogoMaskBounds()
          const centerX = (bounds.minX + bounds.maxX) * 0.5
          const side = formationBidirectionalSide(ax, i, centerX)
          const [br, bg, bb] = formationBidirectionalColorBlend(
            trustFormT,
            i,
            side,
            pipelineR,
            pipelineG,
            pipelineB,
            aux,
            ax,
            centerX,
            bounds.halfExtent
          )
          pipelineR = br
          pipelineG = bg
          pipelineB = bb
          col[bi] = br
          col[bi + 1] = bg
          col[bi + 2] = bb
        }

        if (slot === TRUST_CORE_SLOT.LOGO_MASK || slot === TRUST_CORE_SLOT.LOGO_NUCLEUS) {
          const tier = computeTrustParticleDepthTier(aux)
          const depthMul = trustDepthColorMultiplier(tier)
          col[bi] = Math.min(1, col[bi] * depthMul)
          col[bi + 1] = Math.min(1, col[bi + 1] * depthMul)
          col[bi + 2] = Math.min(1, col[bi + 2] * depthMul)

          const radial =
            slot === TRUST_CORE_SLOT.LOGO_MASK
              ? getLogoParticleRadialNorm(aux)
              : param * 0.32
          const wave = trustGenesisWaveHighlight(radial, animT)
          if (wave > 0.04) {
            const boost = wave * 0.42
            col[bi] = Math.min(1, col[bi] + boost * (1 - col[bi] * 0.35))
            col[bi + 1] = Math.min(1, col[bi + 1] + boost * 0.55)
            col[bi + 2] = Math.min(1, col[bi + 2] + boost * 0.75)
          }

          if (slot === TRUST_CORE_SLOT.LOGO_MASK && isGenesisLogoOuterRay(aux)) {
            col[bi] *= 0.88
            col[bi + 1] *= 0.88
            col[bi + 2] *= 0.92
          }

          const orientDepth = trustLogoOrientationDepthCue(pos[bi + 2]!)
          col[bi] = Math.min(1, col[bi] * orientDepth)
          col[bi + 1] = Math.min(1, col[bi + 1] * orientDepth)
          col[bi + 2] = Math.min(1, col[bi + 2] * orientDepth)
        }

        if (forming && trustFormationModeRef.current !== 'fromHeroLogoDrop') {
          const formationMode = trustFormationModeRef.current
          const brightMul = formationBrightnessMul(trustFormT, i, formationMode)
          col[bi] = Math.min(1, col[bi] * brightMul)
          col[bi + 1] = Math.min(1, col[bi + 1] * brightMul)
          col[bi + 2] = Math.min(1, col[bi + 2] * brightMul)
        }

        const devApplied = skipDevColorOverride
          ? {
              hide: false,
              px: pos[bi],
              py: pos[bi + 1],
              pz: pos[bi + 2],
              r: col[bi],
              g: col[bi + 1],
              b: col[bi + 2],
              sizeMul: 1,
            }
          : applyTrustDevParticleControls(
              pos[bi],
              pos[bi + 1],
              pos[bi + 2],
              col[bi],
              col[bi + 1],
              col[bi + 2],
              {
                role,
                slot,
                param,
                metaPhase,
                speed,
                poolIndex: aux,
                animT,
                motion,
              }
            )
        if (devApplied.hide) {
          pos[bi] = -120
          pos[bi + 1] = -120
          pos[bi + 2] = 0
          col[bi] = 0
          col[bi + 1] = 0
          col[bi + 2] = 0
        } else {
          pos[bi] = devApplied.px
          pos[bi + 1] = devApplied.py
          pos[bi + 2] = devApplied.pz
          col[bi] = devApplied.r
          col[bi + 1] = devApplied.g
          col[bi + 2] = devApplied.b
          if (devApplied.sizeMul !== 1 && isDevParticleControlActive()) {
            const sm = 1 + (devApplied.sizeMul - 1) * 0.22
            col[bi] = Math.min(1, col[bi] * sm)
            col[bi + 1] = Math.min(1, col[bi + 1] * sm)
            col[bi + 2] = Math.min(1, col[bi + 2] * sm)
          }
        }

        if (
          isGenesisColorAuditEnabled() &&
          (slot === TRUST_CORE_SLOT.LOGO_MASK || slot === TRUST_CORE_SLOT.LOGO_NUCLEUS)
        ) {
          recordTrustParticleColorAudit({
            particleIndex: i,
            slot,
            poolIndex: aux,
            afterPipelineR: pipelineR,
            afterPipelineG: pipelineG,
            afterPipelineB: pipelineB,
            afterDevR: col[bi],
            afterDevG: col[bi + 1],
            afterDevB: col[bi + 2],
            devApplied: !skipDevColorOverride && isDevParticleControlActive(),
          })
        }
        continue
      }

      if (isEcosystem) {
        const bi = i * 3
        pos[bi] = -120
        pos[bi + 1] = -120
        pos[bi + 2] = 0
        col[bi] = 0
        col[bi + 1] = 0
        col[bi + 2] = 0
        continue
      }

      if (isToken) {
        const bi = i * 3
        pos[bi] = -120
        pos[bi + 1] = -120
        pos[bi + 2] = 0
        col[bi] = 0
        col[bi + 1] = 0
        col[bi + 2] = 0
        continue
      }

      if (isMining) {
        const bi = i * 3
        pos[bi] = -120
        pos[bi + 1] = -120
        pos[bi + 2] = 0
        col[bi] = 0
        col[bi + 1] = 0
        col[bi + 2] = 0
        continue
      }

      if (isBooster && boosterStackMeta) {
        const bi = i * 3
        const mi = i * 6
        const role = boosterStackMeta[mi]
        const slot = boosterStackMeta[mi + 1]
        const aux = boosterStackMeta[mi + 3]
        const phase = boosterStackMeta[mi + 4]
        if (role === BOOSTER_ROLE.DUST && (aux ?? 0) <= 0.0001) {
          pos[bi] = -120
          pos[bi + 1] = -120
          pos[bi + 2] = 0
          col[bi] = 0
          col[bi + 1] = 0
          col[bi + 2] = 0
          continue
        }
        const [ax, ay, az] = computeBoosterStackPosition(boosterStackMeta, i, t, motion)

        let roleBlend = boosterFormT
        if (
          role === BOOSTER_ROLE.PLATFORM ||
          role === BOOSTER_ROLE.HALO ||
          role === BOOSTER_ROLE.ORBIT ||
          role === BOOSTER_ROLE.NODE
        ) {
          roleBlend = easeOutCubic(boosterTierActivation(boosterFormT, slot))
        } else if (role === BOOSTER_ROLE.COLUMN || role === BOOSTER_ROLE.LINK) {
          roleBlend = easeOutCubic(boosterColumnActivation(boosterFormT))
        } else if (role === BOOSTER_ROLE.PULSE) {
          roleBlend = easeOutCubic(boosterPulseActivation(boosterFormT))
        } else if (role === BOOSTER_ROLE.DUST) {
          roleBlend = boosterStardustFormationBlend(boosterFormT, phase)
        }

        pos[bi] = morph[bi] * (1 - roleBlend) + ax * roleBlend
        pos[bi + 1] = morph[bi + 1] * (1 - roleBlend) + ay * roleBlend
        pos[bi + 2] = morph[bi + 2] * (1 - roleBlend) + az * roleBlend

        if (role === BOOSTER_ROLE.DUST && roleBlend < 1) {
          const fade = 0.18 + roleBlend * 0.82
          col[bi] *= fade
          col[bi + 1] *= fade
          col[bi + 2] *= fade
        }

        if (roleBlend >= 0.82) {
          if (role === BOOSTER_ROLE.PULSE) {
            const pulse = boosterPulseStrength(t, phase)
            if (pulse > 0.04) {
              const boost = pulse * 0.52
              col[bi] = Math.min(1, col[bi] + boost * (1 - col[bi]))
              col[bi + 1] = Math.min(1, col[bi + 1] + boost * (0.86 - col[bi + 1]))
              col[bi + 2] = Math.min(1, col[bi + 2] + boost * (1 - col[bi + 2]))
            }
          }
          if (role === BOOSTER_ROLE.HALO) {
            const glow = (0.12 + Math.sin(t * 0.55 + phase) * 0.08) * roleBlend
            col[bi] = Math.min(1, col[bi] + glow * 0.55)
            col[bi + 1] = Math.min(1, col[bi + 1] + glow * 0.35)
          }
          if (role === BOOSTER_ROLE.NODE && slot === 2) {
            const tip = Math.sin(t * 0.65 + phase) * 0.06 + 0.06
            col[bi] = Math.min(1, col[bi] + tip)
          }
          if (role === BOOSTER_ROLE.ORBIT && slot === 2) {
            const burst = boosterPulseStrength(t, phase) * 0.38
            if (burst > 0.04) {
              col[bi] = Math.min(1, col[bi] + burst * 0.22)
              col[bi + 1] = Math.min(1, col[bi + 1] + burst * 0.35)
              col[bi + 2] = Math.min(1, col[bi + 2] + burst * 0.48)
            }
          }
          if (role === BOOSTER_ROLE.PLATFORM && slot === 0) {
            const gather = Math.sin(t * 0.55 + phase) * 0.04 + 0.04
            col[bi] = Math.min(1, col[bi] + gather)
          }
        }
        commitAmbientWindTreatment(
          BOOSTER_SECTION_INDEX,
          i,
          role,
          phase,
          bi,
          pos,
          col,
          t,
          motion
        )
        continue
      }

      if (isStaking && stakingShieldMeta) {
        const bi = i * 3
        const mi = i * 6
        const role = stakingShieldMeta[mi]
        const phase = stakingShieldMeta[mi + 4]
        const [ax, ay, az] = computeStakingShieldPosition(stakingShieldMeta, i, t, motion)

        let roleBlend = stakingFormT
        if (role === STAKING_ROLE.SHACKLE || role === STAKING_ROLE.SHACKLE_INNER) {
          roleBlend = easeOutCubic(stakingShackleActivation(stakingFormT))
        } else if (role === STAKING_ROLE.BODY_SHELL || role === STAKING_ROLE.BODY_FILL || role === STAKING_ROLE.AURA) {
          roleBlend = easeOutCubic(stakingBodyActivation(stakingFormT))
        } else if (role === STAKING_ROLE.CORE) {
          roleBlend = easeOutCubic(stakingCoreActivation(stakingFormT))
        } else if (role === STAKING_ROLE.MICRO_ORBIT || role === STAKING_ROLE.SPARKLE) {
          roleBlend = easeOutCubic(stakingFinisherActivation(stakingFormT))
        }

        pos[bi] = morph[bi] * (1 - roleBlend) + ax * roleBlend
        pos[bi + 1] = morph[bi + 1] * (1 - roleBlend) + ay * roleBlend
        pos[bi + 2] = morph[bi + 2] * (1 - roleBlend) + az * roleBlend

        if (roleBlend >= 0.88) {
          if (role === STAKING_ROLE.CORE) {
            const glow = stakingCoreGlow(t, phase) * 0.368
            const pulse = stakingCorePulse(t, phase) * 0.437
            const boost = glow + pulse
            col[bi] = Math.min(1, col[bi] + boost * (1 - col[bi]))
            col[bi + 1] = Math.min(1, col[bi + 1] + boost * 0.8)
            col[bi + 2] = Math.min(1, col[bi + 2] + boost)
          }
          if (role === STAKING_ROLE.SPARKLE && Math.sin(t * 1.2 + phase * 2) > 0.65) {
            col[bi] = Math.min(1, col[bi] + 0.18)
            col[bi + 1] = Math.min(1, col[bi + 1] + 0.28)
            col[bi + 2] = Math.min(1, col[bi + 2] + 0.35)
          }
          if (role === STAKING_ROLE.AURA) {
            const soft = (0.06 + Math.sin(t * 0.25 + phase) * 0.04) * roleBlend
            col[bi] = Math.min(1, col[bi] + soft * 0.45)
            col[bi + 1] = Math.min(1, col[bi + 1] + soft * 0.55)
          }
        }
        commitAmbientWindTreatment(
          STAKING_SECTION_INDEX,
          i,
          role,
          phase,
          bi,
          pos,
          col,
          t,
          motion
        )
        continue
      }

      if (isGpulse && gpulseWaveMeta) {
        const bi = i * 3
        const mi = i * 6
        const role = gpulseWaveMeta[mi]
        const phase = gpulseWaveMeta[mi + 4]
        const [ax, ay, az] = computeGpulseWavePosition(gpulseWaveMeta, i, t, motion)
        const blend = gpulseFormT

        pos[bi] = morph[bi] * (1 - blend) + ax * blend
        pos[bi + 1] = morph[bi + 1] * (1 - blend) + ay * blend
        pos[bi + 2] = morph[bi + 2] * (1 - blend) + az * blend

        if (blend >= 0.85) {
          const burst = gpulseBurstStrength(t, phase)
          if (burst > 0.05) {
            const boost = burst * 0.42
            col[bi] = Math.min(1, col[bi] + boost * (1 - col[bi]))
            col[bi + 1] = Math.min(1, col[bi + 1] + boost * 0.75)
            col[bi + 2] = Math.min(1, col[bi + 2] + boost)
          }
          if (role === GPULSE_ROLE.CORE && burst > 0.06) {
            const core = burst * 0.52
            col[bi] = Math.min(1, col[bi] + core)
            col[bi + 1] = Math.min(1, col[bi + 1] + core * 0.45)
            col[bi + 2] = Math.min(1, col[bi + 2] + core * 0.72)
          }
          if (role === GPULSE_ROLE.NODE) {
            const flash = gpulseSparkFlash(t, phase)
            if (flash > 0.12) {
              const spark = flash * 0.44
              col[bi] = Math.min(1, col[bi] + spark * 0.35)
              col[bi + 1] = Math.min(1, col[bi + 1] + spark * 0.55)
              col[bi + 2] = Math.min(1, col[bi + 2] + spark * 0.95)
            }
          }
          if (role === GPULSE_ROLE.STREAM_IN && burst > 0.06) {
            col[bi + 2] = Math.min(1, col[bi + 2] + burst * 0.42)
            col[bi + 1] = Math.min(1, col[bi + 1] + burst * 0.22)
          }
          if (role === GPULSE_ROLE.STREAM_OUT && burst > 0.08) {
            col[bi] = Math.min(1, col[bi] + burst * 0.38)
            col[bi + 1] = Math.min(1, col[bi + 1] + burst * 0.18)
          }
        }
        commitAmbientWindTreatment(
          GPULSE_SECTION_INDEX,
          i,
          role,
          phase,
          bi,
          pos,
          col,
          t,
          motion
        )
        continue
      }

      if (isGoracle && goracleBrainMeta) {
        const bi = i * 3
        const mi = i * 6
        const role = goracleBrainMeta[mi]
        const slot = goracleBrainMeta[mi + 1]
        const phase = goracleBrainMeta[mi + 4]
        const speed = goracleBrainMeta[mi + 5]
        const [ax, ay, az] = computeGoracleBrainPosition(goracleBrainMeta, i, t, motion)

        let roleBlend = goracleFormT
        if (role === GORACLE_ROLE.LAYER) {
          roleBlend = easeOutCubic(goracleLayerActivation(goracleFormT, slot))
        } else if (role === GORACLE_ROLE.NEURAL) {
          roleBlend = easeOutCubic(goracleNeuralActivation(goracleFormT))
        } else if (role === GORACLE_ROLE.CORE) {
          roleBlend = easeOutCubic(goracleCoreActivation(goracleFormT))
        } else if (role === GORACLE_ROLE.SYNAPSE) {
          roleBlend = easeOutCubic(goracleSynapseActivation(goracleFormT))
        } else if (role === GORACLE_ROLE.STREAM_IN || role === GORACLE_ROLE.STREAM_OUT) {
          roleBlend = easeOutCubic(goracleStreamActivation(goracleFormT))
        }

        pos[bi] = morph[bi] * (1 - roleBlend) + ax * roleBlend
        pos[bi + 1] = morph[bi + 1] * (1 - roleBlend) + ay * roleBlend
        pos[bi + 2] = morph[bi + 2] * (1 - roleBlend) + az * roleBlend

        if (roleBlend >= 0.85) {
          if (role === GORACLE_ROLE.CORE) {
            const pulse = goracleCorePulse(t, phase)
            const boost = pulse * 0.48
            col[bi] = Math.min(1, col[bi] + boost * (1 - col[bi]))
            col[bi + 1] = Math.min(1, col[bi + 1] + boost * 0.55)
            col[bi + 2] = Math.min(1, col[bi + 2] + boost * 0.72)
          }
          if (role === GORACLE_ROLE.NEURAL || role === GORACLE_ROLE.SYNAPSE) {
            const neural = goracleNeuralPulse(t, phase, speed)
            if (neural > 0.05) {
              const boost = neural * 0.32
              col[bi] = Math.min(1, col[bi] + boost * 0.65)
              col[bi + 1] = Math.min(1, col[bi + 1] + boost * 0.48)
              col[bi + 2] = Math.min(1, col[bi + 2] + boost * 0.85)
            }
          }
          if (role === GORACLE_ROLE.STREAM_IN) {
            const burst = goracleCorePulse(t, phase)
            if (burst > 0.05) {
              col[bi + 2] = Math.min(1, col[bi + 2] + burst * 0.38)
              col[bi + 1] = Math.min(1, col[bi + 1] + burst * 0.2)
            }
          }
          if (role === GORACLE_ROLE.STREAM_OUT) {
            const burst = goracleCorePulse(t, phase)
            if (burst > 0.35) {
              col[bi] = Math.min(1, col[bi] + burst * 0.32)
              col[bi + 1] = Math.min(1, col[bi + 1] + burst * 0.16)
            }
          }
        }
        commitAmbientWindTreatment(
          GORACLE_SECTION_INDEX,
          i,
          role,
          phase,
          bi,
          pos,
          col,
          t,
          motion
        )
        continue
      }

      if (isMarketplace && marketplaceNetworkMeta) {
        const bi = i * 3
        const mi = i * 6
        const role = marketplaceNetworkMeta[mi]
        const slot = marketplaceNetworkMeta[mi + 1]
        const phase = marketplaceNetworkMeta[mi + 4]
        const [ax, ay, az] = computeMarketplaceNetworkPosition(marketplaceNetworkMeta, i, t, motion)

        let roleBlend = marketplaceFormT
        if (role === MARKETPLACE_ROLE.HALO || role === MARKETPLACE_ROLE.FIELD) {
          roleBlend = easeOutCubic(marketplaceLayerActivation(marketplaceFormT, slot))
        } else if (role === MARKETPLACE_ROLE.CONTINENT) {
          roleBlend = easeOutCubic(marketplaceGlobeActivation(marketplaceFormT))
        } else if (role === MARKETPLACE_ROLE.ROUTE || role === MARKETPLACE_ROLE.PACKAGE) {
          roleBlend = easeOutCubic(marketplaceRouteActivation(marketplaceFormT))
        } else if (role === MARKETPLACE_ROLE.CORE) {
          roleBlend = easeOutCubic(marketplaceCoreActivation(marketplaceFormT))
        } else if (role === MARKETPLACE_ROLE.PAYMENT) {
          roleBlend = easeOutCubic(marketplacePaymentActivation(marketplaceFormT))
        }

        pos[bi] = morph[bi] * (1 - roleBlend) + ax * roleBlend
        pos[bi + 1] = morph[bi + 1] * (1 - roleBlend) + ay * roleBlend
        pos[bi + 2] = morph[bi + 2] * (1 - roleBlend) + az * roleBlend

        if (roleBlend >= 0.85) {
          const pulse = marketplaceCommercePulse(t, phase)
          if (role === MARKETPLACE_ROLE.CORE) {
            const boost = pulse * 0.46
            col[bi] = Math.min(1, col[bi] + boost * (1 - col[bi]))
            col[bi + 1] = Math.min(1, col[bi + 1] + boost * 0.42)
            col[bi + 2] = Math.min(1, col[bi + 2] + boost * 0.68)
          }
          if (role === MARKETPLACE_ROLE.ROUTE || role === MARKETPLACE_ROLE.PACKAGE) {
            const active = marketplaceRouteActive(t, slot)
            if (active > 0.06) {
              const boost = active * 0.34
              col[bi + 2] = Math.min(1, col[bi + 2] + boost * 0.75)
              col[bi + 1] = Math.min(1, col[bi + 1] + boost * 0.35)
            }
          }
          if (role === MARKETPLACE_ROLE.PAYMENT && pulse > 0.55) {
            col[bi] = Math.min(1, col[bi] + (pulse - 0.55) * 0.35)
            col[bi + 2] = Math.min(1, col[bi + 2] + (pulse - 0.55) * 0.28)
          }
        }
        commitAmbientWindTreatment(
          MARKETPLACE_SECTION_INDEX,
          i,
          role,
          phase,
          bi,
          pos,
          col,
          t,
          motion
        )
        continue
      }

      if (isCommunity && communityNetworkMeta) {
        const bi = i * 3
        const mi = i * 6
        const role = communityNetworkMeta[mi]
        const slot = communityNetworkMeta[mi + 1]
        const phase = communityNetworkMeta[mi + 4]
        const [ax, ay, az] = computeCommunityNetworkPosition(communityNetworkMeta, i, t, motion)

        let roleBlend = communityFormT
        if (role === COMMUNITY_ROLE.MEMBER) {
          roleBlend = easeOutCubic(communityGrowthActivation(communityFormT, slot % 8))
        } else if (role === COMMUNITY_ROLE.LEADER || role === COMMUNITY_ROLE.LINK) {
          roleBlend = easeOutCubic(communityNetworkActivation(communityFormT))
        } else if (role === COMMUNITY_ROLE.CORE) {
          roleBlend = easeOutCubic(communityCoreActivation(communityFormT))
        } else if (role === COMMUNITY_ROLE.PULSE) {
          roleBlend = easeOutCubic(communityPulseActivation(communityFormT))
        }

        pos[bi] = morph[bi] * (1 - roleBlend) + ax * roleBlend
        pos[bi + 1] = morph[bi + 1] * (1 - roleBlend) + ay * roleBlend
        pos[bi + 2] = morph[bi + 2] * (1 - roleBlend) + az * roleBlend

        if (roleBlend >= 0.85) {
          const pulse = communityCorePulse(t, phase)
          if (role === COMMUNITY_ROLE.CORE) {
            const boost = pulse * 0.48
            col[bi] = Math.min(1, col[bi] + boost * (1 - col[bi]))
            col[bi + 1] = Math.min(1, col[bi + 1] + boost * 0.38)
            col[bi + 2] = Math.min(1, col[bi + 2] + boost * 0.72)
          }
          if (role === COMMUNITY_ROLE.LINK) {
            const active = communityLinkActive(t, slot)
            if (active > 0.06) {
              col[bi + 1] = Math.min(1, col[bi + 1] + active * 0.28)
              col[bi + 2] = Math.min(1, col[bi + 2] + active * 0.22)
            }
          }
          if (role === COMMUNITY_ROLE.PULSE && pulse > 0.5) {
            col[bi + 2] = Math.min(1, col[bi + 2] + (pulse - 0.5) * 0.42)
          }
        }
        commitAmbientWindTreatment(
          COMMUNITY_SECTION_INDEX,
          i,
          role,
          phase,
          bi,
          pos,
          col,
          t,
          motion
        )
        continue
      }

      if (isTechnology && technologyStackMeta) {
        const bi = i * 3
        const mi = i * 6
        const role = technologyStackMeta[mi]
        const slot = technologyStackMeta[mi + 1]
        const phase = technologyStackMeta[mi + 4]
        const speed = technologyStackMeta[mi + 5]
        const [ax, ay, az] = computeTechnologyStackPosition(technologyStackMeta, i, t, motion)

        let roleBlend = technologyFormT
        if (role === TECHNOLOGY_ROLE.LAYER) {
          roleBlend = easeOutCubic(technologyLayerActivation(technologyFormT, slot))
        } else if (role === TECHNOLOGY_ROLE.FLOW || role === TECHNOLOGY_ROLE.PULSE) {
          roleBlend = easeOutCubic(technologyFlowActivation(technologyFormT))
        }

        pos[bi] = morph[bi] * (1 - roleBlend) + ax * roleBlend
        pos[bi + 1] = morph[bi + 1] * (1 - roleBlend) + ay * roleBlend
        pos[bi + 2] = morph[bi + 2] * (1 - roleBlend) + az * roleBlend

        if (roleBlend >= 0.85) {
          const pulse = technologyStackPulse(t, phase)
          if (role === TECHNOLOGY_ROLE.PULSE) {
            const travel = technologyFlowTravel(t, slot, speed)
            if (travel > 0.1 && travel < 0.92) {
              col[bi + 2] = Math.min(1, col[bi + 2] + pulse * 0.38)
            }
          }
          if (role === TECHNOLOGY_ROLE.SPINE && pulse > 0.55) {
            col[bi] = Math.min(1, col[bi] + (pulse - 0.55) * 0.32)
            col[bi + 2] = Math.min(1, col[bi + 2] + (pulse - 0.55) * 0.28)
          }
        }
        commitAmbientWindTreatment(
          TECHNOLOGY_SECTION_INDEX,
          i,
          role,
          phase,
          bi,
          pos,
          col,
          t,
          motion
        )
        continue
      }

      if (isRoadmap && roadmapTimelineMeta) {
        const bi = i * 3
        const mi = i * 6
        const role = roadmapTimelineMeta[mi]
        const slot = roadmapTimelineMeta[mi + 1]
        const phase = roadmapTimelineMeta[mi + 4]
        const speed = roadmapTimelineMeta[mi + 5]
        const [ax, ay, az] = computeRoadmapTimelinePosition(roadmapTimelineMeta, i, t, motion)

        let roleBlend = roadmapFormT
        if (role === ROADMAP_ROLE.NODE || role === ROADMAP_ROLE.HALO) {
          roleBlend = easeOutCubic(roadmapMilestoneActivation(roadmapFormT, slot))
        } else if (role === ROADMAP_ROLE.PATH || role === ROADMAP_ROLE.PULSE) {
          roleBlend = easeOutCubic(roadmapPathActivation(roadmapFormT))
        }

        pos[bi] = morph[bi] * (1 - roleBlend) + ax * roleBlend
        pos[bi + 1] = morph[bi + 1] * (1 - roleBlend) + ay * roleBlend
        pos[bi + 2] = morph[bi + 2] * (1 - roleBlend) + az * roleBlend

        if (roleBlend >= 0.82) {
          const pulse = roadmapMilestonePulse(t, slot, speed)
          if (role === ROADMAP_ROLE.NODE && pulse > 0.08) {
            const boost = pulse * 0.48
            col[bi] = Math.min(1, col[bi] + boost * (1 - col[bi]))
            col[bi + 1] = Math.min(1, col[bi + 1] + boost * 0.75)
            col[bi + 2] = Math.min(1, col[bi + 2] + boost * 0.95)
          }
          if (role === ROADMAP_ROLE.HALO && pulse > 0.06) {
            const halo = pulse * 0.34
            col[bi] = Math.min(1, col[bi] + halo * 0.7)
            col[bi + 1] = Math.min(1, col[bi + 1] + halo * 0.55)
            col[bi + 2] = Math.min(1, col[bi + 2] + halo * 0.85)
          }
          if (role === ROADMAP_ROLE.PULSE && pulse > 0.1) {
            const spark = pulse * 0.55
            col[bi] = Math.min(1, col[bi] + spark)
            col[bi + 1] = Math.min(1, col[bi + 1] + spark * 0.82)
            col[bi + 2] = Math.min(1, col[bi + 2] + spark * 0.95)
          }
          if (role === ROADMAP_ROLE.PATH) {
            const flash = roadmapSparkFlash(t, phase)
            if (flash > 0.15) {
              const spark = flash * 0.2
              col[bi] = Math.min(1, col[bi] + spark * 0.65)
              col[bi + 1] = Math.min(1, col[bi + 1] + spark * 0.5)
              col[bi + 2] = Math.min(1, col[bi + 2] + spark * 0.75)
            }
          }
          if (role === ROADMAP_ROLE.STARDUST) {
            const flash = roadmapSparkFlash(t, phase)
            if (flash > 0.2) {
              col[bi + 2] = Math.min(1, col[bi + 2] + flash * 0.12)
            }
          }
        }
        commitAmbientWindTreatment(
          ROADMAP_SECTION_INDEX,
          i,
          role,
          phase,
          bi,
          pos,
          col,
          t,
          motion
        )
        continue
      }

      if (isPortal && portalNetworkMeta) {
        const bi = i * 3
        const mi = i * 6
        const role = portalNetworkMeta[mi]
        const [ax, ay, az] = computePortalNetworkPosition(portalNetworkMeta, i, t, motion)

        let roleBlend = portalFormT
        if (role === PORTAL_ROLE.OUTER_RING) {
          roleBlend = easeOutCubic(portalRingActivation(portalFormT, 0))
        } else if (role === PORTAL_ROLE.MIDDLE_RING) {
          roleBlend = easeOutCubic(portalRingActivation(portalFormT, 1))
        } else if (role === PORTAL_ROLE.CORE_RING) {
          roleBlend = easeOutCubic(portalRingActivation(portalFormT, 2))
        }

        pos[bi] = morph[bi] * (1 - roleBlend) + ax * roleBlend
        pos[bi + 1] = morph[bi + 1] * (1 - roleBlend) + ay * roleBlend
        pos[bi + 2] = morph[bi + 2] * (1 - roleBlend) + az * roleBlend

        if (roleBlend >= 0.78) {
          const absorb = portalAbsorbEnergy(t)
          const corePulse = portalCorePulse(t)
          if (role === PORTAL_ROLE.CORE) {
            const boost = corePulse * 0.55 + absorb * 0.35
            col[bi] = Math.min(1, col[bi] + boost * (1 - col[bi] * 0.4))
            col[bi + 1] = Math.min(1, col[bi + 1] + boost * 0.35)
            col[bi + 2] = Math.min(1, col[bi + 2] + boost * 0.65)
          }
          if (role === PORTAL_ROLE.STARDUST && absorb > 0.2) {
            const spark = absorb * 0.28
            col[bi + 2] = Math.min(1, col[bi + 2] + spark * 0.45)
          }
          if (
            (role === PORTAL_ROLE.OUTER_RING ||
              role === PORTAL_ROLE.MIDDLE_RING ||
              role === PORTAL_ROLE.CORE_RING) &&
            absorb > 0.35
          ) {
            const ringBoost = absorb * 0.22
            col[bi] = Math.min(1, col[bi] + ringBoost * 0.6)
            col[bi + 1] = Math.min(1, col[bi + 1] + ringBoost * 0.45)
            col[bi + 2] = Math.min(1, col[bi + 2] + ringBoost * 0.75)
          }
          if (role === PORTAL_ROLE.STREAM && corePulse > 0.65) {
            col[bi + 2] = Math.min(1, col[bi + 2] + (corePulse - 0.65) * 0.18)
          }
        }
        commitAmbientWindTreatment(
          CTA_SECTION_INDEX,
          i,
          role,
          portalNetworkMeta[mi + 4]!,
          bi,
          pos,
          col,
          t,
          motion
        )
        continue
      }

      const bi = i * 3
      pos[bi] = morph[bi] + ox
      pos[bi + 1] = morph[bi + 1] + oy
      pos[bi + 2] = morph[bi + 2] + oz
    }

    geometry.attributes.position.needsUpdate = true
    geometry.attributes.color.needsUpdate = true

    if (isTrust && trustShieldMeta && isGenesisColorAuditEnabled()) {
      const devCfg = isDevParticleControlActive() ? getGenesisParticleControlConfig() : null
      maybeFlushColorAudit(true, {
        devPanelActive: isDevParticleControlActive(),
        devGlobalEnabled: devCfg?.global.enabled ?? null,
      })
    }

    if (sectionIdx === 0) {
      const heroBreathe = 1 + Math.sin(t * 0.35) * 0.02
      pointsRef.current.scale.setScalar(heroBreathe)
      pointsRef.current.rotation.y += 0.0006
      pointsRef.current.rotation.x += 0.0002
    } else {
      const s = pointsRef.current.scale.x
      const targetScale = breathe
      pointsRef.current.scale.setScalar(s + (targetScale - s) * 0.06)
      pointsRef.current.rotation.y *= 0.996
      pointsRef.current.rotation.x *= 0.996
    }
  })

  return (
    <group ref={groupRef}>
      <points ref={pointsRef} geometry={geometry}>
        <pointsMaterial
          size={0.028}
          sizeAttenuation
          transparent
          opacity={0.78}
          map={circleTexture}
          alphaTest={0.05}
          vertexColors
          depthWrite={false}
        />
      </points>
    </group>
  )
}
