import type {
  GenesisParticleControlConfig,
  GenesisParticleControlListener,
  GenesisParticlePresetId,
} from './GenesisParticleControlTypes'
import {
  createDefaultGenesisParticleConfig,
  createPresetConfig,
  STORAGE_KEY_CONFIG,
  STORAGE_KEY_CUSTOM_PRESETS,
} from './GenesisParticleControlDefaults'
import { diagLogControlUpdate } from './GenesisParticleControlDiagnostics'

export const DEV_PARTICLE_CONTROL =
  typeof process !== 'undefined' && process.env.NODE_ENV !== 'production'

type CustomPresetsMap = Record<string, GenesisParticleControlConfig>

let config: GenesisParticleControlConfig = createDefaultGenesisParticleConfig()
let resetCounter = 0
let pausedAt: number | null = null
const listeners = new Set<GenesisParticleControlListener>()

function notify(): void {
  listeners.forEach((fn) => fn())
}

function loadFromStorage(): void {
  if (!DEV_PARTICLE_CONTROL || typeof window === 'undefined') return
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONFIG)
    if (raw) {
      const parsed = JSON.parse(raw) as GenesisParticleControlConfig
      config = { ...createDefaultGenesisParticleConfig(), ...parsed }
    }
  } catch {
    /* ignore corrupt storage */
  }
}

function persistConfig(): void {
  if (!DEV_PARTICLE_CONTROL || typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config))
  } catch {
    /* quota */
  }
}

if (typeof window !== 'undefined' && DEV_PARTICLE_CONTROL) {
  loadFromStorage()
}

export function subscribeGenesisParticleControl(
  listener: GenesisParticleControlListener
): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getGenesisParticleControlConfig(): GenesisParticleControlConfig {
  return config
}

export function setGenesisParticleControlConfig(
  next: GenesisParticleControlConfig
): void {
  config = next
  persistConfig()
  notify()
}

export function patchGenesisParticleControlConfig(
  patch: {
    global?: Partial<GenesisParticleControlConfig['global']>
    transform?: Partial<GenesisParticleControlConfig['transform']>
    layers?: Partial<GenesisParticleControlConfig['layers']>
    logo?: Partial<GenesisParticleControlConfig['logo']>
    shield?: Partial<GenesisParticleControlConfig['shield']>
    neural?: Partial<GenesisParticleControlConfig['neural']>
    validation?: Partial<GenesisParticleControlConfig['validation']>
    flow?: Partial<GenesisParticleControlConfig['flow']>
  }
): void {
  config = {
    ...config,
    global: { ...config.global, ...patch.global },
    transform: { ...config.transform, ...patch.transform },
    layers: patch.layers
      ? ({ ...config.layers, ...patch.layers } as GenesisParticleControlConfig['layers'])
      : config.layers,
    logo: { ...config.logo, ...patch.logo },
    shield: { ...config.shield, ...patch.shield },
    neural: { ...config.neural, ...patch.neural },
    validation: { ...config.validation, ...patch.validation },
    flow: { ...config.flow, ...patch.flow },
  }
  persistConfig()
  notify()
  diagLogControlUpdate('patchGenesisParticleControlConfig', config)
}

export function resetGenesisParticleControlConfig(): void {
  config = createDefaultGenesisParticleConfig()
  pausedAt = null
  persistConfig()
  notify()
}

export function loadGenesisParticlePreset(id: GenesisParticlePresetId): void {
  config = createPresetConfig(id)
  persistConfig()
  notify()
}

export function saveCustomPreset(name: string): void {
  if (!DEV_PARTICLE_CONTROL || typeof window === 'undefined') return
  const trimmed = name.trim()
  if (!trimmed) return
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_PRESETS)
    const map: CustomPresetsMap = raw ? JSON.parse(raw) : {}
    map[trimmed] = config
    localStorage.setItem(STORAGE_KEY_CUSTOM_PRESETS, JSON.stringify(map))
  } catch {
    /* ignore */
  }
}

export function listCustomPresets(): string[] {
  if (!DEV_PARTICLE_CONTROL || typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_PRESETS)
    const map: CustomPresetsMap = raw ? JSON.parse(raw) : {}
    return Object.keys(map).sort()
  } catch {
    return []
  }
}

export function loadCustomPreset(name: string): boolean {
  if (!DEV_PARTICLE_CONTROL || typeof window === 'undefined') return false
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_PRESETS)
    const map: CustomPresetsMap = raw ? JSON.parse(raw) : {}
    const preset = map[name]
    if (!preset) return false
    config = { ...createDefaultGenesisParticleConfig(), ...preset }
    persistConfig()
    notify()
    return true
  } catch {
    return false
  }
}

export function exportGenesisParticleConfigJson(): string {
  return JSON.stringify(config, null, 2)
}

export function importGenesisParticleConfigJson(json: string): boolean {
  try {
    const parsed = JSON.parse(json) as GenesisParticleControlConfig
    config = { ...createDefaultGenesisParticleConfig(), ...parsed }
    persistConfig()
    notify()
    return true
  } catch {
    return false
  }
}

export function requestTrustAnimationReset(): void {
  resetCounter += 1
  notify()
}

export function getTrustAnimationResetCounter(): number {
  return resetCounter
}

export function setParticleControlPaused(paused: boolean, elapsedTime: number): void {
  if (paused) {
    if (pausedAt === null) pausedAt = elapsedTime
  } else {
    pausedAt = null
  }
  config = { ...config, global: { ...config.global, paused } }
  persistConfig()
  notify()
}

/** Returns animation time adjusted for pause + global speed. */
export function resolveDevAnimationTime(elapsedTime: number): number {
  const { global } = config
  if (global.paused) {
    if (pausedAt === null) pausedAt = elapsedTime
    return pausedAt
  }
  return elapsedTime * global.speed
}

export function isDevParticleControlActive(): boolean {
  return DEV_PARTICLE_CONTROL
}
