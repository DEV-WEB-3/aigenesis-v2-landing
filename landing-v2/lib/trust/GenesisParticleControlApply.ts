/**
 * Phase 4.6 — Apply dev control panel values to Trust Shield particles.
 * No-op in production builds.
 */
import { TRUST_CORE_SLOT } from './GenesisLogoLayout'
import { amplifySaturation } from './trustShieldColorAmplification'
import { TRUST_META_SLOT } from './TrustShieldQuantumArchitecture'
import { TRUST_ROLE } from './trustShieldRoles'
import type { TrustControlLayerId } from './GenesisParticleControlTypes'
import {
  getGenesisParticleControlConfig,
  isDevParticleControlActive,
} from './GenesisParticleControlStore'
import { diagRecordApplyResult } from './GenesisParticleControlDiagnostics'

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const n = parseInt(full, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => v / 255) as [
    number,
    number,
    number,
  ]
}

function lerpColor(
  r: number,
  g: number,
  b: number,
  primary: string,
  secondary: string,
  mix: number
): [number, number, number] {
  const [pr, pg, pb] = hexToRgb(primary)
  const [sr, sg, sb] = hexToRgb(secondary)
  const t = Math.max(0, Math.min(1, mix))
  const tr = pr * t + sr * (1 - t)
  const tg = pg * t + sg * (1 - t)
  const tb = pb * t + sb * (1 - t)
  return [
    r * (1 - 0.35) + tr * 0.35,
    g * (1 - 0.35) + tg * 0.35,
    b * (1 - 0.35) + tb * 0.35,
  ]
}

export function resolveTrustControlLayer(role: number, slot: number): TrustControlLayerId {
  if (role === TRUST_ROLE.CORE) {
    if (slot === TRUST_CORE_SLOT.LOGO_NUCLEUS) return 'nucleusGenesis'
    if (slot === TRUST_CORE_SLOT.ENERGY_FOG || slot === TRUST_CORE_SLOT.SECONDARY) {
      return 'background'
    }
    if (
      slot === TRUST_CORE_SLOT.LOGO_MASK ||
      slot === TRUST_CORE_SLOT.LOGO_HALO ||
      slot === TRUST_CORE_SLOT.VOLUME ||
      slot === TRUST_CORE_SLOT.RING
    ) {
      return 'logoGenesis'
    }
    return 'logoGenesis'
  }
  if (role === TRUST_ROLE.HEX_INNER) return 'shieldInner'
  if (role === TRUST_ROLE.HEX_MID) return 'shieldMid'
  if (role === TRUST_ROLE.HEX_OUTER) return 'shieldOuter'
  if (role === TRUST_ROLE.RADIAL) {
    return slot >= TRUST_META_SLOT.RADIAL_BRIDGE ? 'logoBridges' : 'shieldMid'
  }
  if (role === TRUST_ROLE.NEURAL) return 'neural'
  if (role === TRUST_ROLE.VALIDATION) return 'validation'
  if (role === TRUST_ROLE.FLOW) return 'flow'
  if (role === TRUST_ROLE.AURA) {
    return slot >= TRUST_META_SLOT.AURA_DEEP_SHELL ? 'background' : 'aura'
  }
  return 'aura'
}

export interface TrustDevApplyContext {
  role: number
  slot: number
  param: number
  metaPhase: number
  speed: number
  poolIndex: number
  animT: number
  motion: number
}

export interface TrustDevApplyResult {
  hide: boolean
  px: number
  py: number
  pz: number
  r: number
  g: number
  b: number
  sizeMul: number
}

export function applyTrustDevParticleControls(
  px: number,
  py: number,
  pz: number,
  r: number,
  g: number,
  b: number,
  ctx: TrustDevApplyContext
): TrustDevApplyResult {
  if (!isDevParticleControlActive()) {
    return finalizeApplyResult({ hide: false, px, py, pz, r, g, b, sizeMul: 1 })
  }

  const cfg = getGenesisParticleControlConfig()
  const { global, layers, logo, shield, neural, validation, flow } = cfg

  if (!global.enabled) {
    return finalizeApplyResult({ hide: true, px, py, pz, r: 0, g: 0, b: 0, sizeMul: 0 })
  }

  const layerId = resolveTrustControlLayer(ctx.role, ctx.slot)
  const layer = layers[layerId]

  if (!layer.visible) {
    return finalizeApplyResult({ hide: true, px, py, pz, r: 0, g: 0, b: 0, sizeMul: 0 })
  }

  if (layerId === 'nucleusGenesis' && !logo.nucleusEnabled) {
    return finalizeApplyResult({ hide: true, px, py, pz, r: 0, g: 0, b: 0, sizeMul: 0 })
  }
  if (layerId === 'validation' && !validation.enabled) {
    return finalizeApplyResult({ hide: true, px, py, pz, r: 0, g: 0, b: 0, sizeMul: 0 })
  }
  if (layerId === 'flow' && !flow.enabled) {
    return finalizeApplyResult({ hide: true, px, py, pz, r: 0, g: 0, b: 0, sizeMul: 0 })
  }

  let ox = layer.offsetX * layer.scale
  let oy = layer.offsetY * layer.scale
  let oz = layer.offsetZ * layer.scale

  if (layerId === 'logoGenesis' || layerId === 'nucleusGenesis') {
    ox += cfg.transform.x * 0.02
    oy += cfg.transform.y * 0.02
    oz += cfg.transform.z * 0.02
  } else {
    ox += cfg.transform.x * 0.015
    oy += cfg.transform.y * 0.015
    oz += cfg.transform.z * 0.015
  }

  px += ox
  py += oy
  pz += oz * shield.depthZ

  if (layerId.startsWith('shield')) {
    const s = shield.scale
    px *= s
    py *= s
    pz *= s * shield.depthZ
  }

  if (layerId === 'nucleusGenesis') {
    const pulse = 1 + Math.sin(ctx.animT * 0.35 * logo.nucleusPulse + ctx.metaPhase) * 0.04
    const ns = logo.nucleusSize * pulse
    px *= ns
    py *= ns
  }

  let cr = r
  let cg = g
  let cb = b

  const bright =
    global.brightness *
    global.intensity *
    layer.brightness *
    layer.intensity *
    layer.opacity

  ;[cr, cg, cb] = amplifySaturation(cr, cg, cb, layer.saturation)
  cr *= bright
  cg *= bright
  cb *= bright

  const colorMix = 0.25 + (ctx.poolIndex % 10) * 0.05
  ;[cr, cg, cb] = lerpColor(cr, cg, cb, layer.primaryColor, layer.secondaryColor, colorMix)

  if (layerId === 'logoGenesis') {
    cr *= logo.brightness * logo.density
    cg *= logo.brightness * logo.density
    cb *= logo.brightness * logo.density
    ;[cr, cg, cb] = amplifySaturation(cr, cg, cb, logo.tornasolSaturation)
    cr = cr * (0.85 + logo.magentaIntensity * 0.15)
    cg = cg * (0.85 + logo.cyanIntensity * 0.1 + logo.blueIntensity * 0.05)
    cb = cb * (0.85 + logo.blueIntensity * 0.1 + logo.purpleIntensity * 0.05)
  }

  if (layerId === 'nucleusGenesis') {
    const nb = logo.nucleusBrightness
    cr *= nb
    cg *= nb
    cb *= nb
  }

  if (layerId.startsWith('shield') || layerId === 'logoBridges') {
    const sb = shield.intensity * shield.nodeBrightness
    cr *= sb
    cg *= sb
    cb *= sb
  }

  if (layerId === 'neural') {
    const ni = neural.intensity * neural.connectionBrightness * neural.connectionDensity
    cr *= ni
    cg *= ni
    cb *= ni
  }

  if (layerId === 'validation') {
    const [vr, vg, vb] = hexToRgb(validation.color)
    cr = cr * 0.55 + vr * 0.45 * validation.brightness
    cg = cg * 0.55 + vg * 0.45 * validation.brightness
    cb = cb * 0.55 + vb * 0.45 * validation.brightness
  }

  if (layerId === 'flow') {
    const [fr, fg, fb] = hexToRgb(flow.color)
    cr = cr * 0.5 + fr * 0.5 * flow.brightness
    cg = cg * 0.5 + fg * 0.5 * flow.brightness
    cb = cb * 0.5 + fb * 0.5 * flow.brightness
  }

  const sizeMul =
    global.pointSize *
    layer.particleSize *
    (layerId.startsWith('shield') ? shield.nodeSize : 1) *
    (layerId === 'neural' ? neural.hotspotSize * 0.25 + 0.75 : 1)

  return finalizeApplyResult({
    hide: false,
    px,
    py,
    pz,
    r: Math.min(1, cr),
    g: Math.min(1, cg),
    b: Math.min(1, cb),
    sizeMul,
  })
}

function finalizeApplyResult(result: TrustDevApplyResult): TrustDevApplyResult {
  diagRecordApplyResult(result)
  return result
}

export function getTrustDevGlobalPointSize(baseSize: number): number {
  if (!isDevParticleControlActive()) return baseSize
  const { global } = getGenesisParticleControlConfig()
  return baseSize * global.pointSize
}

export function getTrustDevGlobalOpacity(baseOpacity: number): number {
  if (!isDevParticleControlActive()) return baseOpacity
  const { global } = getGenesisParticleControlConfig()
  return baseOpacity * global.opacity
}

export function getTrustDevTransformScale(): number {
  if (!isDevParticleControlActive()) return 1
  return getGenesisParticleControlConfig().transform.scale
}

export function getTrustDevTransformRotation(): [number, number, number] {
  if (!isDevParticleControlActive()) return [0, 0, 0]
  const t = getGenesisParticleControlConfig().transform
  return [t.rotX, t.rotY, t.rotZ]
}

/** Multipliers for runtime pulse effects (validation, flow, neural, shield). */
export function getTrustDevEffectMultipliers(layerId: TrustControlLayerId): {
  speed: number
  pulse: number
  trail: number
  bridge: number
  edge: number
  hotspot: number
} {
  if (!isDevParticleControlActive()) {
    return { speed: 1, pulse: 1, trail: 1, bridge: 1, edge: 1, hotspot: 1 }
  }
  const cfg = getGenesisParticleControlConfig()
  const layer = cfg.layers[layerId]
  return {
    speed: layer.speed * cfg.global.speed,
    pulse: cfg.validation.pulseLength * cfg.validation.pulseFrequency,
    trail: cfg.flow.trailLength * cfg.flow.trailIntensity,
    bridge: cfg.shield.bridgeStrength,
    edge: cfg.shield.edgeIntensity * cfg.shield.hexThickness,
    hotspot: cfg.neural.hotspotIntensity * cfg.neural.hotspotSize,
  }
}

export function getTrustDevNeuralPulseSpeed(): number {
  if (!isDevParticleControlActive()) return 1
  return getGenesisParticleControlConfig().neural.pulseSpeed
}

export function getTrustDevFlowSpeed(): number {
  if (!isDevParticleControlActive()) return 1
  return getGenesisParticleControlConfig().flow.speed
}

export function getTrustDevValidationSpeed(): number {
  if (!isDevParticleControlActive()) return 1
  return getGenesisParticleControlConfig().validation.speed
}
