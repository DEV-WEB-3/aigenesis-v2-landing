/**
 * Phase 12.0+ — Genesis Global Commerce Network (viewBox 0–100).
 * Abstract connectivity mesh — no flat map, no realistic continents.
 */

export const COMMERCE_PULSE_S = 3.6
export const COMMERCE_FORM_S = 1.2
export const COMMERCE_GLOBE_CENTER = { x: 50, y: 50 } as const
export const COMMERCE_GLOBAL_HUB_COUNT = 6

export type GlobalHubRole = 'catalog' | 'reach' | 'fulfillment' | 'payments' | 'tracking' | 'logistics'
export type CommercePaymentId = 'aig' | 'usdt' | 'fiat'
export type CommercePacketKind = 'product' | 'payment' | 'info'

export interface CommerceGlobalHubDef {
  id: GlobalHubRole
  index: number
  pulseOffset: number
}

export interface CommerceTradeRouteDef {
  id: string
  from: { x: number; y: number }
  to: { x: number; y: number }
  duration: number
  delay: number
}

export interface CommercePaymentCoreDef {
  id: CommercePaymentId
  x: number
  y: number
  pulseOffset: number
}

/** Six abstract global hubs — ring topology, not geographic. */
export const COMMERCE_GLOBAL_HUBS: readonly CommerceGlobalHubDef[] = [
  { id: 'catalog', index: 0, pulseOffset: 0 },
  { id: 'reach', index: 1, pulseOffset: 0.14 },
  { id: 'fulfillment', index: 2, pulseOffset: 0.28 },
  { id: 'payments', index: 3, pulseOffset: 0.42 },
  { id: 'tracking', index: 4, pulseOffset: 0.56 },
  { id: 'logistics', index: 5, pulseOffset: 0.7 },
] as const

export const COMMERCE_PAYMENT_CORES: readonly CommercePaymentCoreDef[] = [
  { id: 'aig', x: 44, y: 54, pulseOffset: 0.08 },
  { id: 'usdt', x: 56, y: 46, pulseOffset: 0.28 },
  { id: 'fiat', x: 54, y: 58, pulseOffset: 0.48 },
] as const

export function globalHubPosition(index: number): { x: number; y: number } {
  const i = ((index % COMMERCE_GLOBAL_HUB_COUNT) + COMMERCE_GLOBAL_HUB_COUNT) % COMMERCE_GLOBAL_HUB_COUNT
  const angle = -Math.PI / 2 + (i / COMMERCE_GLOBAL_HUB_COUNT) * Math.PI * 2
  const r = 29 + (i % 2) * 2.5
  return {
    x: COMMERCE_GLOBE_CENTER.x + Math.cos(angle) * r,
    y: COMMERCE_GLOBE_CENTER.y + Math.sin(angle) * r * 0.86,
  }
}

export function globalHubSatellitePosition(
  hubIndex: number,
  satelliteIndex: number,
  total = 8
): { x: number; y: number } {
  const hub = globalHubPosition(hubIndex)
  const angle = (satelliteIndex / total) * Math.PI * 2 + hubIndex * 0.9
  const r = 3.2 + (satelliteIndex % 3) * 0.9
  return {
    x: hub.x + Math.cos(angle) * r,
    y: hub.y + Math.sin(angle) * r * 0.88,
  }
}

function buildTradeRoutes(): CommerceTradeRouteDef[] {
  const routes: CommerceTradeRouteDef[] = []
  const center = COMMERCE_GLOBE_CENTER

  for (let i = 0; i < COMMERCE_GLOBAL_HUB_COUNT; i++) {
    routes.push({
      id: `core-${i}`,
      from: center,
      to: globalHubPosition(i),
      duration: 2.2 + i * 0.12,
      delay: i * 0.22,
    })
  }

  for (let i = 0; i < COMMERCE_GLOBAL_HUB_COUNT; i++) {
    routes.push({
      id: `ring-${i}`,
      from: globalHubPosition(i),
      to: globalHubPosition((i + 1) % COMMERCE_GLOBAL_HUB_COUNT),
      duration: 3.1,
      delay: 0.35 + i * 0.38,
    })
  }

  const meshPairs: [number, number][] = [
    [0, 2],
    [1, 3],
    [2, 4],
    [3, 5],
    [4, 0],
    [5, 1],
    [0, 3],
    [1, 4],
    [2, 5],
  ]

  meshPairs.forEach(([a, b], idx) => {
    routes.push({
      id: `mesh-${a}-${b}`,
      from: globalHubPosition(a),
      to: globalHubPosition(b),
      duration: 3.4 + (idx % 3) * 0.2,
      delay: 0.5 + idx * 0.28,
    })
  })

  return routes
}

export const COMMERCE_TRADE_ROUTES: readonly CommerceTradeRouteDef[] = buildTradeRoutes()

export function hubExchangePath(fromIndex: number, toIndex: number): string {
  return tradeRoutePath(globalHubPosition(fromIndex), globalHubPosition(toIndex))
}

export const COMMERCE_PACKET_COLORS: Record<CommercePacketKind, string> = {
  product: '#00F5FF',
  payment: '#FF00C8',
  info: '#9D4DFF',
}

/** @deprecated — use globalHubSatellitePosition */
export function continentNodePosition(
  hubIndex: number,
  nodeIndex: number,
  _nodesPer = 8
): { x: number; y: number } {
  return globalHubSatellitePosition(hubIndex, nodeIndex)
}

export function tradeRoutePath(
  from: { x: number; y: number },
  to: { x: number; y: number }
): string {
  const cx = COMMERCE_GLOBE_CENTER.x
  const cy = COMMERCE_GLOBE_CENTER.y
  const mx = (from.x + to.x) / 2
  const my = (from.y + to.y) / 2
  const dx = mx - cx
  const dy = my - cy
  const dist = Math.sqrt(dx * dx + dy * dy) || 1
  const bulge = 6 + Math.abs(from.x - to.x) * 0.035
  const cpx = mx + (-dy / dist) * bulge
  const cpy = my + (dx / dist) * bulge
  return `M${from.x},${from.y} Q${cpx},${cpy} ${to.x},${to.y}`
}

export function paymentStreamPath(paymentId: CommercePaymentId): string {
  const core = COMMERCE_PAYMENT_CORES.find((p) => p.id === paymentId)
  if (!core) return ''
  const cx = COMMERCE_GLOBE_CENTER.x
  const cy = COMMERCE_GLOBE_CENTER.y
  const mx = (core.x + cx) / 2
  const my = (core.y + cy) / 2 - 2
  return `M${core.x},${core.y} Q${mx},${my} ${cx},${cy}`
}

/** @deprecated — use globalHubPosition */
export function hubNodePosition(index: number): { x: number; y: number } {
  return globalHubPosition(index % COMMERCE_GLOBAL_HUB_COUNT)
}

/** @deprecated — use hubExchangePath */
export function coreExchangePath(fromIndex: number, toIndex: number): string {
  return hubExchangePath(fromIndex, toIndex)
}
