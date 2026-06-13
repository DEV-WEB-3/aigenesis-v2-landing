/**
 * Phase 23.0 — Free-form orbit paths (control points) centered on Genesis nucleus.
 */

export const TOKEN_VALUE_PULSE_S = 4
export const TOKEN_VALUE_NODE_COUNT = 8
export const TOKEN_ATOMIC_ORBIT_COUNT = 5
export const TOKEN_ORBIT_DEFAULT_POINT_COUNT = 10
export const TOKEN_ORBIT_MIN_POINTS = 4
export const TOKEN_ORBIT_MAX_POINTS = 24

export const TOKEN_NUCLEUS_DIAMETER_VB = 14
export const TOKEN_NODE_SIZE_RATIO = 0.13
export const TOKEN_NODE_SLOT_BASE = TOKEN_NUCLEUS_DIAMETER_VB * TOKEN_NODE_SIZE_RATIO

export type TokenValueNodeId =
  | 'wallet'
  | 'marketplace'
  | 'ai'
  | 'holders'
  | 'rewards'
  | 'education'
  | 'liquidity'
  | 'expansion'

export type AtomicEnergyColor = '#FF00C8' | '#00F5FF' | '#9D4DFF'
export type AtomicOrbitTier = 'main' | 'secondary'

export interface OrbitControlPoint {
  x: number
  y: number
}

export interface AtomicOrbitDef {
  rx: number
  ry: number
  rotationDeg: number
  durationS: number
  warp: number
  reverse: boolean
  tier: AtomicOrbitTier
  planeSpinS: number
}

export interface TokenValueNodeDef {
  id: TokenValueNodeId
  color: string
  size: number
  pulseOffset: number
  orbitIndex: number
  phase: number
  mobilePrimary?: boolean
}

export interface OrbitEditorOrbitState {
  points: OrbitControlPoint[]
}

export const TOKEN_VALUE_CENTER = { x: 50, y: 50 } as const

export const ATOMIC_ENERGY_COLORS: readonly AtomicEnergyColor[] = [
  '#FF00C8',
  '#00F5FF',
  '#9D4DFF',
] as const

const ORBIT_RX = 44
const ORBIT_RY = 24

export const TOKEN_ATOMIC_ORBITS: readonly AtomicOrbitDef[] = [
  { rx: ORBIT_RX, ry: ORBIT_RY, rotationDeg: 15.6, durationS: 152, warp: 0, reverse: false, tier: 'main', planeSpinS: 0 },
  { rx: ORBIT_RX, ry: ORBIT_RY, rotationDeg: 51.6, durationS: 144, warp: 0, reverse: true, tier: 'main', planeSpinS: 0 },
  { rx: ORBIT_RX, ry: ORBIT_RY, rotationDeg: 90, durationS: 148, warp: 0, reverse: false, tier: 'main', planeSpinS: 0 },
  { rx: ORBIT_RX, ry: ORBIT_RY, rotationDeg: 128.4, durationS: 140, warp: 0, reverse: true, tier: 'main', planeSpinS: 0 },
  { rx: ORBIT_RX, ry: ORBIT_RY, rotationDeg: 165.6, durationS: 136, warp: 0, reverse: false, tier: 'main', planeSpinS: 0 },
] as const

export const TOKEN_ATOMIC_ORBIT_POINTS: OrbitControlPoint[][] = TOKEN_ATOMIC_ORBITS.map((o) =>
  ellipseControlPoints(o.rx, o.ry, o.rotationDeg, TOKEN_ORBIT_DEFAULT_POINT_COUNT)
)

export const TOKEN_VALUE_NODES: readonly TokenValueNodeDef[] = [
  { id: 'ai', color: '#00F5FF', size: 1, pulseOffset: 0.2, orbitIndex: 0, phase: 0.08, mobilePrimary: true },
  { id: 'expansion', color: '#2962FF', size: 0.92, pulseOffset: 0.48, orbitIndex: 0, phase: 0.58, mobilePrimary: true },
  { id: 'wallet', color: '#00F5FF', size: 0.94, pulseOffset: 0.24, orbitIndex: 1, phase: 0.12, mobilePrimary: true },
  { id: 'marketplace', color: '#FF4DDB', size: 0.9, pulseOffset: 0.28, orbitIndex: 1, phase: 0.62, mobilePrimary: true },
  { id: 'holders', color: '#9D4DFF', size: 0.92, pulseOffset: 0.32, orbitIndex: 2, phase: 0.18 },
  { id: 'rewards', color: '#FF00C8', size: 0.88, pulseOffset: 0.36, orbitIndex: 2, phase: 0.72 },
  { id: 'education', color: '#00F5FF', size: 0.86, pulseOffset: 0.4, orbitIndex: 3, phase: 0.22 },
  { id: 'liquidity', color: '#FF4DDB', size: 0.9, pulseOffset: 0.44, orbitIndex: 4, phase: 0.68 },
] as const

export function roundOrbitCoord(n: number): number {
  return Math.round(n * 10) / 10
}

export function clampOrbitPoint(x: number, y: number): OrbitControlPoint {
  return {
    x: roundOrbitCoord(Math.min(98, Math.max(2, x))),
    y: roundOrbitCoord(Math.min(98, Math.max(2, y))),
  }
}

export function ellipseControlPoints(
  rx: number,
  ry: number,
  rotationDeg: number,
  count = TOKEN_ORBIT_DEFAULT_POINT_COUNT
): OrbitControlPoint[] {
  const { x: cx, y: cy } = TOKEN_VALUE_CENTER
  const rad = (rotationDeg * Math.PI) / 180
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)
  return Array.from({ length: count }, (_, i) => {
    const t = (i / count) * Math.PI * 2
    const lx = Math.cos(t) * rx
    const ly = Math.sin(t) * ry
    return clampOrbitPoint(cx + lx * cos - ly * sin, cy + lx * sin + ly * cos)
  })
}

/** Smooth closed path through control points (Catmull-Rom → cubic Bezier). */
export function orbitSmoothClosedPath(points: readonly OrbitControlPoint[]): string {
  const n = points.length
  if (n < 3) return ''
  const at = (i: number) => points[(i + n) % n]!

  let d = `M${at(0).x.toFixed(2)},${at(0).y.toFixed(2)}`
  for (let i = 0; i < n; i++) {
    const p0 = at(i - 1)
    const p1 = at(i)
    const p2 = at(i + 1)
    const p3 = at(i + 2)
    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6
    d += ` C${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`
  }
  return `${d} Z`
}

export function orbitGradientAngle(points: readonly OrbitControlPoint[]): number {
  if (points.length < 2) return 0
  const { x: cx, y: cy } = TOKEN_VALUE_CENTER
  const p = points[Math.floor(points.length / 4)] ?? points[0]!
  return (Math.atan2(p.y - cy, p.x - cx) * 180) / Math.PI
}

export function defaultOrbitEditorState(): OrbitEditorOrbitState[] {
  return TOKEN_ATOMIC_ORBIT_POINTS.map((points) => ({
    points: points.map((p) => ({ ...p })),
  }))
}

export function orbitEditorStateFromEllipse(orbitIndex: number): OrbitEditorOrbitState {
  const def = TOKEN_ATOMIC_ORBITS[orbitIndex]
  if (!def) return { points: [] }
  return {
    points: ellipseControlPoints(def.rx, def.ry, def.rotationDeg, TOKEN_ORBIT_DEFAULT_POINT_COUNT),
  }
}

export function legacyEllipseFromOrbitDraft(
  draft: { rotationDeg?: number; rx?: number; ry?: number },
  orbitIndex: number
): OrbitEditorOrbitState {
  const def = TOKEN_ATOMIC_ORBITS[orbitIndex]
  return {
    points: ellipseControlPoints(
      draft.rx ?? def?.rx ?? ORBIT_RX,
      draft.ry ?? def?.ry ?? ORBIT_RY,
      draft.rotationDeg ?? def?.rotationDeg ?? 0,
      TOKEN_ORBIT_DEFAULT_POINT_COUNT
    ),
  }
}

export function tokenNodeSlotSize(nodeIndex: number): number {
  const node = TOKEN_VALUE_NODES[nodeIndex]
  return TOKEN_NODE_SLOT_BASE * (node?.size ?? 1)
}

export function atomicOrbitLocalPoint(
  orbit: AtomicOrbitDef,
  phase: number
): { x: number; y: number } {
  const cx = TOKEN_VALUE_CENTER.x
  const cy = TOKEN_VALUE_CENTER.y
  const t = phase * Math.PI * 2
  const lx = cx + Math.cos(t) * orbit.rx
  const ly = cy + Math.sin(t) * orbit.ry
  return { x: lx, y: ly }
}

export function atomicOrbitLocalPath(orbitIndex: number): string {
  const points = TOKEN_ATOMIC_ORBIT_POINTS[orbitIndex]
  if (!points?.length) return ''
  return orbitSmoothClosedPath(points)
}

export function atomicOrbitPathFromDims(rx: number, ry: number, steps = 96): string {
  const cx = TOKEN_VALUE_CENTER.x
  const cy = TOKEN_VALUE_CENTER.y
  const parts: string[] = []
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2
    const x = cx + Math.cos(t) * rx
    const y = cy + Math.sin(t) * ry
    parts.push(i === 0 ? `M${x.toFixed(2)},${y.toFixed(2)}` : `L${x.toFixed(2)},${y.toFixed(2)}`)
  }
  return `${parts.join(' ')} Z`
}

export function atomicOrbitDuration(orbitIndex: number): number {
  return TOKEN_ATOMIC_ORBITS[orbitIndex]?.durationS ?? 140
}

export function atomicOrbitReverse(orbitIndex: number): boolean {
  return TOKEN_ATOMIC_ORBITS[orbitIndex]?.reverse ?? false
}

export function atomicOrbitRotation(orbitIndex: number): number {
  return TOKEN_ATOMIC_ORBITS[orbitIndex]?.rotationDeg ?? 0
}

export function atomicOrbitPlaneSpin(orbitIndex: number): number {
  return TOKEN_ATOMIC_ORBITS[orbitIndex]?.planeSpinS ?? 0
}

export function atomicOrbitTier(orbitIndex: number): AtomicOrbitTier {
  return TOKEN_ATOMIC_ORBITS[orbitIndex]?.tier ?? 'main'
}

export function atomicEnergyDotPhases(orbitIndex: number): readonly number[] {
  return [0.12, 0.42, 0.68, 0.88]
}

export function tokenValueMobileIndices(): number[] {
  return TOKEN_VALUE_NODES.map((n, i) => (n.mobilePrimary ? i : -1)).filter((i) => i >= 0)
}

export function atomicNodeTravelDuration(nodeIndex: number): number {
  const node = TOKEN_VALUE_NODES[nodeIndex]
  if (!node) return 140
  return atomicOrbitDuration(node.orbitIndex) * 2.1
}
