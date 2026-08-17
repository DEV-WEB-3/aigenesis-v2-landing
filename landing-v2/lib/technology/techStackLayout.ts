import { EMISSION } from '@/lib/design/tokens'
import { pulsoDe, llegadaDe } from '@/lib/design/motion'
/**
 * Phase 14.0 — Genesis Technology Stack (viewBox 0–100).
 * Backend → Infraestructura → IA → Blockchain → Aplicaciones
 */

export const TECH_STACK_PULSE_S = pulsoDe('technology')
export const TECH_STACK_FORM_S = llegadaDe('technology')
export const TECH_STACK_CENTER = { x: 50, y: 50 } as const

export type TechStackLayerId =
  | 'backend'
  | 'infraestructura'
  | 'ia'
  | 'blockchain'
  | 'aplicaciones'

export interface TechStackLayerDef {
  id: TechStackLayerId
  label: string
  index: number
  y: number
  width: number
  color: string
  pulseOffset: number
}

export interface TechStackFlowDef {
  id: string
  fromLayer: number
  toLayer: number
  duration: number
  delay: number
}

/** Top → bottom as specified: Backend down to Aplicaciones */
export const TECH_STACK_LAYERS: readonly TechStackLayerDef[] = [
  { id: 'backend', label: 'Backend', index: 0, y: 15, width: 52, color: EMISSION.violetHi, pulseOffset: 0 },
  { id: 'infraestructura', label: 'Infraestructura', index: 1, y: 30, width: 58, color: EMISSION.blueHi, pulseOffset: 0.12 },
  { id: 'ia', label: 'IA', index: 2, y: 45, width: 54, color: EMISSION.magenta, pulseOffset: 0.24 },
  { id: 'blockchain', label: 'Blockchain', index: 3, y: 60, width: 56, color: EMISSION.violetHi, pulseOffset: 0.36 },
  { id: 'aplicaciones', label: 'Aplicaciones', index: 4, y: 75, width: 62, color: EMISSION.cyan, pulseOffset: 0.48 },
] as const

export function techLayerPosition(index: number): { x: number; y: number; w: number } {
  const layer = TECH_STACK_LAYERS[index % TECH_STACK_LAYERS.length]
  if (!layer) return { x: 50, y: 50, w: 50 }
  return { x: TECH_STACK_CENTER.x, y: layer.y, w: layer.width }
}

export function techLayerPlatePoint(layerIndex: number, t: number): { x: number; y: number } {
  const { x, y, w } = techLayerPosition(layerIndex)
  const half = w / 2
  const px = x - half + t * w
  const wave = Math.sin(t * Math.PI * 3 + layerIndex) * 0.8
  return { x: px, y: y + wave }
}

function buildFlows(): TechStackFlowDef[] {
  const flows: TechStackFlowDef[] = []
  for (let i = 0; i < TECH_STACK_LAYERS.length - 1; i++) {
    flows.push({
      id: `flow-${i}-${i + 1}`,
      fromLayer: i,
      toLayer: i + 1,
      duration: 2.4 + i * 0.18,
      delay: i * 0.35,
    })
  }
  return flows
}

export const TECH_STACK_FLOWS: readonly TechStackFlowDef[] = buildFlows()

export function techStackFlowPath(fromLayer: number, toLayer: number): string {
  const a = techLayerPosition(fromLayer)
  const b = techLayerPosition(toLayer)
  const startY = a.y + 2.2
  const endY = b.y - 2.2
  const mx = (a.x + b.x) / 2 + 3
  const my = (startY + endY) / 2
  return `M${a.x},${startY} Q${mx},${my} ${b.x},${endY}`
}
