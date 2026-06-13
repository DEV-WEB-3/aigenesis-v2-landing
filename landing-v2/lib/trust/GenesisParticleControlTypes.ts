/** Phase 4.6 — Dev particle control panel types (Trust Shield). */

export type TrustControlLayerId =
  | 'logoGenesis'
  | 'nucleusGenesis'
  | 'shieldInner'
  | 'shieldMid'
  | 'shieldOuter'
  | 'logoBridges'
  | 'neural'
  | 'validation'
  | 'flow'
  | 'aura'
  | 'background'

export const TRUST_CONTROL_LAYER_IDS: readonly TrustControlLayerId[] = [
  'logoGenesis',
  'nucleusGenesis',
  'shieldInner',
  'shieldMid',
  'shieldOuter',
  'logoBridges',
  'neural',
  'validation',
  'flow',
  'aura',
  'background',
] as const

export const TRUST_CONTROL_LAYER_LABELS: Record<TrustControlLayerId, string> = {
  logoGenesis: 'Logo Genesis',
  nucleusGenesis: 'Núcleo Genesis',
  shieldInner: 'Escudo interno',
  shieldMid: 'Escudo medio',
  shieldOuter: 'Escudo externo',
  logoBridges: 'Puentes logo → escudo',
  neural: 'Red neural',
  validation: 'Validación',
  flow: 'Flujo energético',
  aura: 'Aura',
  background: 'Fondo',
}

export type GenesisParticlePresetId =
  | 'default'
  | 'premium'
  | 'intense'
  | 'soft'
  | 'performance'
  | 'mobileSafe'
  | 'cinematic'

export const PRESET_LABELS: Record<GenesisParticlePresetId, string> = {
  default: 'Default',
  premium: 'Premium',
  intense: 'Intense',
  soft: 'Soft',
  performance: 'Performance',
  mobileSafe: 'Mobile Safe',
  cinematic: 'Cinematic',
}

export interface GlobalParticleControls {
  enabled: boolean
  paused: boolean
  speed: number
  intensity: number
  brightness: number
  pointSize: number
  opacity: number
}

export interface TransformControls {
  x: number
  y: number
  z: number
  scale: number
  rotX: number
  rotY: number
  rotZ: number
}

export interface LayerParticleControls {
  visible: boolean
  intensity: number
  brightness: number
  saturation: number
  particleSize: number
  speed: number
  opacity: number
  primaryColor: string
  secondaryColor: string
  offsetX: number
  offsetY: number
  offsetZ: number
  scale: number
}

export interface LogoDevControls {
  density: number
  brightness: number
  tornasolSaturation: number
  magentaIntensity: number
  cyanIntensity: number
  blueIntensity: number
  purpleIntensity: number
  nucleusEnabled: boolean
  nucleusSize: number
  nucleusBrightness: number
  nucleusPulse: number
}

export interface ShieldDevControls {
  hexThickness: number
  intensity: number
  nodeBrightness: number
  nodeSize: number
  bridgeStrength: number
  edgeIntensity: number
  depthZ: number
  scale: number
}

export interface NeuralDevControls {
  intensity: number
  connectionDensity: number
  connectionBrightness: number
  pulseSpeed: number
  hotspotSize: number
  hotspotIntensity: number
}

export interface ValidationDevControls {
  enabled: boolean
  color: string
  brightness: number
  speed: number
  pulseLength: number
  pulseFrequency: number
}

export interface FlowDevControls {
  enabled: boolean
  color: string
  brightness: number
  speed: number
  trailLength: number
  trailIntensity: number
}

export interface GenesisParticleControlConfig {
  global: GlobalParticleControls
  transform: TransformControls
  layers: Record<TrustControlLayerId, LayerParticleControls>
  logo: LogoDevControls
  shield: ShieldDevControls
  neural: NeuralDevControls
  validation: ValidationDevControls
  flow: FlowDevControls
}

export interface GenesisParticleControlRuntime {
  config: GenesisParticleControlConfig
  resetCounter: number
  pausedAt: number | null
}

export type GenesisParticleControlListener = () => void
