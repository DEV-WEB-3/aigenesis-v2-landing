/**
 * Runtime color execution audit — proves what RGB reaches geometry.attributes.color.
 * Dev only: window.__GENESIS_COLOR_AUDIT__()
 * Pure zone debug: window.__GENESIS_PURE_COLOR_DEBUG__ = true
 */
import { getGenesisLogoPoolColor } from './GenesisLogoMaskSampler'
import { TRUST_CORE_SLOT } from './GenesisLogoLayout'
import {
  NEON_BLUE,
  NEON_CYAN,
  NEON_FUCHSIA,
  NEON_PURPLE,
} from './trustShieldColorAmplification'
import {
  applyNeonStardustGlow,
  computeStardustColorBeforeGlow,
  computeStardustLogoLiveColor,
  LOGO_PERMANENT_GLOW,
  logoMaskGradientUForAudit,
} from './GenesisStardustEntity'

export type ColorBucket = 'fucsia' | 'morado' | 'azul' | 'cyan' | 'blanco' | 'otro'

export type PipelineStageSample = {
  stage: string
  r: number
  g: number
  b: number
  rgb255: string
}

export type ParticleColorSample = {
  particleIndex: number
  poolIndex: number
  spatialU: number
  bucket: ColorBucket
  afterPipeline: PipelineStageSample
  afterDevApply: PipelineStageSample | null
  finalBuffer: PipelineStageSample
  devOverwrote: boolean
}

export type GenesisColorAuditReport = {
  timestamp: string
  pureDebugMode: boolean
  devPanelActive: boolean
  devGlobalEnabled: boolean | null
  particleCounts: Record<ColorBucket, number>
  whitePercent: number
  logoMaskCount: number
  nucleusCount: number
  unstagedSlotCount: number
  zoneCounts: { fucsia: number; morado: number; azul: number; cyan: number }
  representativeSamples: ParticleColorSample[]
  pipelineTraces: Array<{
    label: string
    poolIndex: number
    spatialU: number
    stages: PipelineStageSample[]
  }>
  diagnosis: string[]
}

const AUDIT_INTERVAL_MS = 2000
let lastAuditMs = 0
let lastReport: GenesisColorAuditReport | null = null

const bucketSamples: Partial<Record<ColorBucket, ParticleColorSample>> = {}
const counts: Record<ColorBucket, number> = {
  fucsia: 0,
  morado: 0,
  azul: 0,
  cyan: 0,
  blanco: 0,
  otro: 0,
}
const zoneCounts = { fucsia: 0, morado: 0, azul: 0, cyan: 0 }
let logoMaskCount = 0
let nucleusCount = 0
let unstagedSlotCount = 0

function isAuditEnv(): boolean {
  return typeof process !== 'undefined' && process.env.NODE_ENV !== 'production'
}

export function isGenesisPureColorDebug(): boolean {
  if (!isAuditEnv() || typeof window === 'undefined') return false
  return Boolean(
    (window as Window & { __GENESIS_PURE_COLOR_DEBUG__?: boolean }).__GENESIS_PURE_COLOR_DEBUG__
  )
}

export function isGenesisColorAuditEnabled(): boolean {
  if (!isAuditEnv() || typeof window === 'undefined') return false
  const w = window as Window & { __GENESIS_COLOR_AUDIT_ENABLED__?: boolean }
  return w.__GENESIS_COLOR_AUDIT_ENABLED__ !== false
}

function to255(r: number, g: number, b: number): string {
  return `RGB(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`
}

function stage(name: string, r: number, g: number, b: number): PipelineStageSample {
  return { stage: name, r, g, b, rgb255: to255(r, g, b) }
}

/** Classify final buffer RGB — not anchor constants. */
export function classifyParticleColor(r: number, g: number, b: number): ColorBucket {
  const chroma = Math.max(r, g, b) - Math.min(r, g, b)
  const peak = Math.max(r, g, b)
  if (peak > 0.92 && chroma < 0.12) return 'blanco'
  if (chroma < 0.08) return 'otro'

  const dr = r - NEON_FUCHSIA[0]
  const dg = g - NEON_FUCHSIA[1]
  const db = b - NEON_FUCHSIA[2]
  const dFuchsia = dr * dr + dg * dg + db * db

  const dCyan =
    (r - NEON_CYAN[0]) ** 2 + (g - NEON_CYAN[1]) ** 2 + (b - NEON_CYAN[2]) ** 2
  const dBlue =
    (r - NEON_BLUE[0]) ** 2 + (g - NEON_BLUE[1]) ** 2 + (b - NEON_BLUE[2]) ** 2
  const dPurple =
    (r - NEON_PURPLE[0]) ** 2 + (g - NEON_PURPLE[1]) ** 2 + (b - NEON_PURPLE[2]) ** 2

  const min = Math.min(dFuchsia, dCyan, dBlue, dPurple)
  if (min === dFuchsia) return 'fucsia'
  if (min === dCyan) return 'cyan'
  if (min === dBlue) return 'azul'
  return 'morado'
}

export function spatialZone(u: number): 'fucsia' | 'morado' | 'azul' | 'cyan' {
  if (u >= 0.72) return 'cyan'
  if (u >= 0.52) return 'azul'
  if (u >= 0.32) return 'morado'
  return 'fucsia'
}

/** Pure zone colors — no glow, for distribution debug. */
export function computePureZoneDebugColor(poolIndex: number): [number, number, number] {
  const u = logoMaskGradientUForAudit(poolIndex)
  if (u >= 0.72) return [NEON_CYAN[0], NEON_CYAN[1], NEON_CYAN[2]]
  if (u >= 0.52) return [NEON_BLUE[0], NEON_BLUE[1], NEON_BLUE[2]]
  if (u >= 0.32) return [NEON_PURPLE[0], NEON_PURPLE[1], NEON_PURPLE[2]]
  return [NEON_FUCHSIA[0], NEON_FUCHSIA[1], NEON_FUCHSIA[2]]
}

export function traceColorPipeline(poolIndex: number, t = 0, phase = 0, pulse = 1): PipelineStageSample[] {
  const [baseR, baseG, baseB] = getGenesisLogoPoolColor(poolIndex)
  const stages: PipelineStageSample[] = [stage('1_png_pool', baseR, baseG, baseB)]

  const beforeGlow = computeStardustColorBeforeGlow(baseR, baseG, baseB, t, phase, poolIndex)
  stages.push(stage('2_before_glow', beforeGlow[0], beforeGlow[1], beforeGlow[2]))

  const afterGlow = applyNeonStardustGlow(
    beforeGlow[0],
    beforeGlow[1],
    beforeGlow[2],
    pulse,
    LOGO_PERMANENT_GLOW.BRIGHTNESS_MIN
  )
  stages.push(stage('3_after_glow', afterGlow[0], afterGlow[1], afterGlow[2]))

  const live = computeStardustLogoLiveColor(poolIndex, t, phase, pulse)
  stages.push(stage('4_computeStardustLogoLiveColor', live[0], live[1], live[2]))

  return stages
}

export function resetColorAuditFrame(): void {
  for (const k of Object.keys(counts) as ColorBucket[]) counts[k] = 0
  zoneCounts.fucsia = 0
  zoneCounts.morado = 0
  zoneCounts.azul = 0
  zoneCounts.cyan = 0
  logoMaskCount = 0
  nucleusCount = 0
  unstagedSlotCount = 0
  for (const k of Object.keys(bucketSamples) as ColorBucket[]) delete bucketSamples[k]
}

export function recordTrustParticleColorAudit(input: {
  particleIndex: number
  slot: number
  poolIndex: number
  afterPipelineR: number
  afterPipelineG: number
  afterPipelineB: number
  afterDevR: number
  afterDevG: number
  afterDevB: number
  devApplied: boolean
}): void {
  if (!isGenesisColorAuditEnabled()) return

  const {
    particleIndex,
    slot,
    poolIndex,
    afterPipelineR,
    afterPipelineG,
    afterPipelineB,
    afterDevR,
    afterDevG,
    afterDevB,
    devApplied,
  } = input

  if (slot === TRUST_CORE_SLOT.LOGO_MASK) logoMaskCount++
  else if (slot === TRUST_CORE_SLOT.LOGO_NUCLEUS) nucleusCount++
  else unstagedSlotCount++

  const fr = devApplied ? afterDevR : afterPipelineR
  const fg = devApplied ? afterDevG : afterPipelineG
  const fb = devApplied ? afterDevB : afterPipelineB

  const bucket = classifyParticleColor(fr, fg, fb)
  counts[bucket]++

  const u = logoMaskGradientUForAudit(poolIndex)
  zoneCounts[spatialZone(u)]++

  if (!bucketSamples[bucket]) {
    const devDelta =
      Math.abs(afterDevR - afterPipelineR) +
      Math.abs(afterDevG - afterPipelineG) +
      Math.abs(afterDevB - afterPipelineB)
    bucketSamples[bucket] = {
      particleIndex,
      poolIndex,
      spatialU: u,
      bucket,
      afterPipeline: stage('pipeline', afterPipelineR, afterPipelineG, afterPipelineB),
      afterDevApply: devApplied
        ? stage('dev_apply', afterDevR, afterDevG, afterDevB)
        : null,
      finalBuffer: stage('geometry.attributes.color', fr, fg, fb),
      devOverwrote: devDelta > 0.001,
    }

    console.log(
      'FINAL PARTICLE RGB',
      bucket.toUpperCase(),
      to255(fr, fg, fb),
      '| pipeline:',
      to255(afterPipelineR, afterPipelineG, afterPipelineB),
      devApplied ? `| dev: ${to255(afterDevR, afterDevG, afterDevB)}` : ''
    )
  }
}

function buildDiagnosis(report: GenesisColorAuditReport): string[] {
  const lines: string[] = []
  const samples = report.representativeSamples

  const devOverwrite = samples.filter((s) => s.devOverwrote)
  if (devOverwrite.length > 0) {
    const ex = devOverwrite[0]!
    lines.push(
      `SOBRESCRITURA DEV: GenesisParticleControlApply.ts lerpColor() mezcla 35% hacia primaryColor/secondaryColor del panel (default #22d3ee pastel) DESPUÉS de computeStardustLogoLiveColor().`
    )
    lines.push(
      `Ejemplo ${ex.bucket}: pipeline ${ex.afterPipeline.rgb255} → final buffer ${ex.finalBuffer.rgb255}`
    )
  }

  if (report.whitePercent > 15) {
    lines.push(
      `BLANCO ${report.whitePercent.toFixed(1)}%: applyNeonStardustGlow() + preserveHueBrightnessFloor() en GenesisStardustEntity.ts (~L222-235) empujan picos a 0.99 antes del buffer.`
    )
  }

  const glowCollapse = samples.find(
    (s) =>
      s.afterPipeline.stage &&
      classifyParticleColor(s.afterPipeline.r, s.afterPipeline.g, s.afterPipeline.b) !== s.bucket
  )
  if (glowCollapse) {
    lines.push(
      `GLOW colapsa matices: before_glow vs live en pool ${glowCollapse.poolIndex} — ver pipelineTraces.`
    )
  }

  if (report.unstagedSlotCount > 0) {
    lines.push(
      `${report.unstagedSlotCount} partículas Trust NO reciben color live en ParticleMorphSystem.tsx (solo LOGO_MASK/NUCLEUS en L562-573) — conservan buffer inicial de buildTrustShieldColors().`
    )
  }

  return lines
}

export function buildGenesisColorAuditReport(options?: {
  devPanelActive?: boolean
  devGlobalEnabled?: boolean | null
}): GenesisColorAuditReport {
  const total = Object.values(counts).reduce((a, b) => a + b, 0)
  const whitePercent = total > 0 ? (counts.blanco / total) * 100 : 0

  const tracePoolIndices = [0, 15000, 30000, 45000, 58000]
  const pipelineTraces = tracePoolIndices.map((poolIndex) => ({
    label: `pool ${poolIndex} u=${logoMaskGradientUForAudit(poolIndex).toFixed(3)}`,
    poolIndex,
    spatialU: logoMaskGradientUForAudit(poolIndex),
    stages: traceColorPipeline(poolIndex),
  }))

  const report: GenesisColorAuditReport = {
    timestamp: new Date().toISOString(),
    pureDebugMode: isGenesisPureColorDebug(),
    devPanelActive: options?.devPanelActive ?? false,
    devGlobalEnabled: options?.devGlobalEnabled ?? null,
    particleCounts: { ...counts },
    whitePercent,
    logoMaskCount,
    nucleusCount,
    unstagedSlotCount,
    zoneCounts: { ...zoneCounts },
    representativeSamples: Object.values(bucketSamples) as ParticleColorSample[],
    pipelineTraces,
    diagnosis: [],
  }
  report.diagnosis = buildDiagnosis(report)
  lastReport = report
  return report
}

export function maybeFlushColorAudit(
  isTrust: boolean,
  options?: { devPanelActive?: boolean; devGlobalEnabled?: boolean | null }
): GenesisColorAuditReport | null {
  if (!isTrust || !isGenesisColorAuditEnabled()) return null
  const now = typeof performance !== 'undefined' ? performance.now() : Date.now()
  if (now - lastAuditMs < AUDIT_INTERVAL_MS) return lastReport
  lastAuditMs = now
  const report = buildGenesisColorAuditReport(options)
  console.group('[Genesis Color Execution Audit]')
  console.log('Conteo por color (geometry.attributes.color):', report.particleCounts)
  console.log('Zona espacial (pool U):', report.zoneCounts)
  console.log(`Blancas: ${report.particleCounts.blanco} (${report.whitePercent.toFixed(1)}%)`)
  console.table(report.representativeSamples)
  console.log('Pipeline traces:', report.pipelineTraces)
  console.log('Diagnóstico:', report.diagnosis)
  console.groupEnd()
  return report
}

export function printGenesisColorExecutionAudit(): GenesisColorAuditReport {
  resetColorAuditFrame()
  const report = buildGenesisColorAuditReport()
  console.group('[Genesis Color Execution Audit — offline pipeline]')
  console.table(report.pipelineTraces.flatMap((t) => t.stages.map((s) => ({ ...s, trace: t.label }))))
  console.log('Ejecuta en #trust para conteo real de partículas; visita la sección 2s.')
  console.groupEnd()
  return report
}

export function getLastGenesisColorAuditReport(): GenesisColorAuditReport | null {
  return lastReport
}

if (isAuditEnv() && typeof window !== 'undefined') {
  const w = window as Window & {
    __GENESIS_COLOR_AUDIT__?: typeof printGenesisColorExecutionAudit
    __GENESIS_PURE_COLOR_DEBUG__?: boolean
    __GENESIS_COLOR_AUDIT_ENABLED__?: boolean
  }
  w.__GENESIS_COLOR_AUDIT__ = printGenesisColorExecutionAudit
  w.__GENESIS_COLOR_AUDIT_ENABLED__ = true
}
