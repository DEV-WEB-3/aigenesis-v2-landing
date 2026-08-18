import { EMISSION, INK, VOID } from '@/lib/design/tokens'
import type {
  FlowDevControls,
  GenesisParticleControlConfig,
  GenesisParticlePresetId,
  LayerParticleControls,
  LogoDevControls,
  NeuralDevControls,
  ShieldDevControls,
  TrustControlLayerId,
  ValidationDevControls,
} from './GenesisParticleControlTypes'
import { TRUST_CONTROL_LAYER_IDS } from './GenesisParticleControlTypes'

export const STORAGE_KEY_CONFIG = 'genesis-particle-control-config'
export const STORAGE_KEY_CUSTOM_PRESETS = 'genesis-particle-control-custom-presets'

export function createDefaultLayerControls(): LayerParticleControls {
  return {
    visible: true,
    intensity: 1,
    brightness: 1,
    saturation: 1,
    particleSize: 1,
    speed: 1,
    opacity: 1,
    primaryColor: EMISSION.cyan,
    secondaryColor: EMISSION.magenta,
    offsetX: 0,
    offsetY: 0,
    offsetZ: 0,
    scale: 1,
  }
}

export function createDefaultLayers(): Record<TrustControlLayerId, LayerParticleControls> {
  const layers = {} as Record<TrustControlLayerId, LayerParticleControls>
  for (const id of TRUST_CONTROL_LAYER_IDS) {
    layers[id] = createDefaultLayerControls()
  }
  layers.logoGenesis.primaryColor = EMISSION.magenta
  layers.logoGenesis.secondaryColor = EMISSION.cyan
  layers.nucleusGenesis.primaryColor = EMISSION.magenta
  // Era '#fff5f0', un blanco cálido que no existía en ninguna paleta: un valor
  // suelto de un solo uso. Se unifica con la tinta base.
  layers.nucleusGenesis.secondaryColor = INK.base
  layers.shieldInner.primaryColor = EMISSION.blueHi
  layers.shieldMid.primaryColor = EMISSION.blueHi
  layers.shieldOuter.primaryColor = EMISSION.blueHi
  layers.logoBridges.primaryColor = EMISSION.cyan
  layers.neural.primaryColor = EMISSION.cyan
  layers.validation.primaryColor = INK.base
  layers.validation.secondaryColor = EMISSION.cyan
  layers.flow.primaryColor = EMISSION.blueHi
  layers.aura.primaryColor = EMISSION.blue
  layers.background.primaryColor = VOID.surface
  return layers
}

export function createDefaultLogoControls(): LogoDevControls {
  return {
    density: 1,
    brightness: 1,
    tornasolSaturation: 1,
    magentaIntensity: 1,
    cyanIntensity: 1,
    blueIntensity: 1,
    purpleIntensity: 1,
    nucleusEnabled: true,
    nucleusSize: 1,
    nucleusBrightness: 1,
    nucleusPulse: 1,
  }
}

export function createDefaultShieldControls(): ShieldDevControls {
  return {
    hexThickness: 1,
    intensity: 1,
    nodeBrightness: 1,
    nodeSize: 1,
    bridgeStrength: 1,
    edgeIntensity: 1,
    depthZ: 1,
    scale: 1,
  }
}

export function createDefaultNeuralControls(): NeuralDevControls {
  return {
    intensity: 1,
    connectionDensity: 1,
    connectionBrightness: 1,
    pulseSpeed: 1,
    hotspotSize: 1,
    hotspotIntensity: 1,
  }
}

export function createDefaultValidationControls(): ValidationDevControls {
  return {
    enabled: true,
    color: INK.base,
    brightness: 1,
    speed: 1,
    pulseLength: 1,
    pulseFrequency: 1,
  }
}

export function createDefaultFlowControls(): FlowDevControls {
  return {
    enabled: true,
    color: EMISSION.blueHi,
    brightness: 1,
    speed: 1,
    trailLength: 1,
    trailIntensity: 1,
  }
}

export function createDefaultGenesisParticleConfig(): GenesisParticleControlConfig {
  return {
    global: {
      enabled: true,
      paused: false,
      speed: 1,
      intensity: 1,
      brightness: 1,
      pointSize: 1,
      opacity: 1,
    },
    transform: {
      x: 0,
      y: 0,
      z: 0,
      scale: 1,
      rotX: 0,
      rotY: 0,
      rotZ: 0,
    },
    layers: createDefaultLayers(),
    logo: createDefaultLogoControls(),
    shield: createDefaultShieldControls(),
    neural: createDefaultNeuralControls(),
    validation: createDefaultValidationControls(),
    flow: createDefaultFlowControls(),
  }
}

function mergeConfig(
  base: GenesisParticleControlConfig,
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
): GenesisParticleControlConfig {
  return {
    global: { ...base.global, ...patch.global },
    transform: { ...base.transform, ...patch.transform },
    layers: patch.layers ? ({ ...base.layers, ...patch.layers } as GenesisParticleControlConfig['layers']) : base.layers,
    logo: { ...base.logo, ...patch.logo },
    shield: { ...base.shield, ...patch.shield },
    neural: { ...base.neural, ...patch.neural },
    validation: { ...base.validation, ...patch.validation },
    flow: { ...base.flow, ...patch.flow },
  }
}

/** Built-in presets — visual tuning only, no geometry/budget changes. */
export function createPresetConfig(id: GenesisParticlePresetId): GenesisParticleControlConfig {
  const base = createDefaultGenesisParticleConfig()
  switch (id) {
    case 'premium':
      return mergeConfig(base, {
        global: { brightness: 1.12, intensity: 1.08, pointSize: 1.05 },
        logo: { brightness: 1.15, tornasolSaturation: 1.2, nucleusBrightness: 1.2 },
        shield: { intensity: 1.1, nodeBrightness: 1.15 },
      })
    case 'intense':
      return mergeConfig(base, {
        global: { brightness: 1.28, intensity: 1.22, pointSize: 1.12, opacity: 0.92 },
        logo: { brightness: 1.35, tornasolSaturation: 1.45, magentaIntensity: 1.2 },
        shield: { intensity: 1.25, edgeIntensity: 1.3, bridgeStrength: 1.2 },
        neural: { intensity: 1.3, hotspotIntensity: 1.25 },
        validation: { brightness: 1.2 },
        flow: { brightness: 1.25, trailIntensity: 1.3 },
      })
    case 'soft':
      return mergeConfig(base, {
        global: { brightness: 0.82, intensity: 0.78, pointSize: 0.92, opacity: 0.65 },
        logo: { brightness: 0.88, tornasolSaturation: 0.85 },
        shield: { intensity: 0.8 },
        layers: {
          ...base.layers,
          aura: { ...base.layers.aura, opacity: 0.55, intensity: 0.7 },
        },
      })
    case 'performance':
      return mergeConfig(base, {
        global: { pointSize: 0.88, opacity: 0.72 },
        neural: { connectionDensity: 0.75, hotspotIntensity: 0.8 },
        flow: { trailLength: 0.7, trailIntensity: 0.75 },
        layers: {
          ...base.layers,
          aura: { ...base.layers.aura, visible: false },
          background: { ...base.layers.background, opacity: 0.5 },
        },
      })
    case 'mobileSafe':
      return mergeConfig(base, {
        global: { brightness: 0.95, pointSize: 0.9, opacity: 0.7 },
        logo: { brightness: 1.05 },
        shield: { intensity: 0.9 },
        layers: {
          ...base.layers,
          background: { ...base.layers.background, intensity: 0.6 },
        },
      })
    case 'cinematic':
      return mergeConfig(base, {
        global: { speed: 0.72, brightness: 1.05, opacity: 0.85 },
        logo: { nucleusPulse: 0.75, tornasolSaturation: 1.15 },
        neural: { pulseSpeed: 0.65 },
        flow: { speed: 0.7, trailLength: 1.35 },
        validation: { pulseFrequency: 0.8 },
      })
    default:
      return base
  }
}
