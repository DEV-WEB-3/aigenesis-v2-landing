/**
 * Phase 4.6 — Temporary diagnostic hooks for control panel wiring.
 * Remove or set GENESIS_PARTICLE_CONTROL_DEBUG = false when done.
 */
import type { GenesisParticleControlConfig } from './GenesisParticleControlTypes'

export const GENESIS_PARTICLE_CONTROL_DEBUG =
  typeof process !== 'undefined' && process.env.NODE_ENV !== 'production'

let applyCallCount = 0
let lastApplySample: {
  r: number
  g: number
  b: number
  px: number
  py: number
  sizeMul: number
  hide: boolean
} | null = null

let frameLogCounter = 0

export function diagLogControlUpdate(source: string, config: GenesisParticleControlConfig): void {
  if (!GENESIS_PARTICLE_CONTROL_DEBUG) return
  console.log('Control Update', config.global.intensity, {
    source,
    brightness: config.global.brightness,
    pointSize: config.global.pointSize,
    opacity: config.global.opacity,
    speed: config.global.speed,
    enabled: config.global.enabled,
  })
}

export function diagRecordApplyResult(result: {
  hide: boolean
  px: number
  py: number
  pz: number
  r: number
  g: number
  b: number
  sizeMul: number
}): void {
  if (!GENESIS_PARTICLE_CONTROL_DEBUG) return
  applyCallCount += 1
  lastApplySample = {
    r: result.r,
    g: result.g,
    b: result.b,
    px: result.px,
    py: result.py,
    sizeMul: result.sizeMul,
    hide: result.hide,
  }
}

export function diagLogParticleSystemFrame(payload: {
  sectionIdx: number
  isTrust: boolean
  hasMeta: boolean
  hasScatter: boolean
  devActive: boolean
  controls: GenesisParticleControlConfig['global']
  materialSize: number
  materialOpacity: number
  particleLimit: number
}): void {
  if (!GENESIS_PARTICLE_CONTROL_DEBUG) return
  frameLogCounter += 1
  if (frameLogCounter % 120 !== 0) return

  console.log('Particle System Reading Controls', payload.controls, {
    sectionIdx: payload.sectionIdx,
    isTrust: payload.isTrust,
    hasMeta: payload.hasMeta,
    hasScatter: payload.hasScatter,
    devActive: payload.devActive,
    applyCallsLast120Frames: applyCallCount,
    lastApplySample,
    materialSize: payload.materialSize,
    materialOpacity: payload.materialOpacity,
    particleLimit: payload.particleLimit,
    chain:
      payload.isTrust && payload.hasMeta && payload.hasScatter && payload.devActive
        ? 'OK — apply path active'
        : 'BLOCKED — see flags above',
  })

  applyCallCount = 0
}

export function getGenesisParticleDiagSnapshot() {
  return {
    applyCallCount,
    lastApplySample,
    debugEnabled: GENESIS_PARTICLE_CONTROL_DEBUG,
  }
}

if (typeof window !== 'undefined' && GENESIS_PARTICLE_CONTROL_DEBUG) {
  ;(window as Window & { __GENESIS_PARTICLE_DIAG__?: typeof getGenesisParticleDiagSnapshot }).__GENESIS_PARTICLE_DIAG__ =
    getGenesisParticleDiagSnapshot
}
