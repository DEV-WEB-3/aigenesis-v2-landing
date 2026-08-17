import { llegadaDe } from '@/lib/design/motion'

/**
 * Phase 12.0 — Genesis Global Commerce Network (WebGL star dust, sección 9).
 */
import {
  COMMERCE_GLOBAL_HUB_COUNT,
  COMMERCE_PAYMENT_CORES,
  COMMERCE_PULSE_S,
  COMMERCE_TRADE_ROUTES,
  globalHubPosition,
  globalHubSatellitePosition,
} from '@/lib/marketplace/globalCommerceLayout'

type Rgb = readonly [number, number, number]

export const MARKETPLACE_SECTION_INDEX = 9
export const MARKETPLACE_FORM_DURATION = llegadaDe('marketplace')

export const MARKETPLACE_ROLE = {
  CORE: 0,
  CONTINENT: 1,
  ROUTE: 2,
  PACKAGE: 3,
  PAYMENT: 4,
  HALO: 5,
  FIELD: 6,
} as const

const META_STRIDE = 6
const SCALE = 1.55
const CX = 0

const CYAN: Rgb = [0, 0.961, 1]
const PURPLE: Rgb = [0.616, 0.302, 1]
const FUCHSIA: Rgb = [1, 0, 0.784]
const ION: Rgb = [0.239, 0.545, 1]

let cachedMarketplaceMeta: Float32Array | null = null

function write(
  out: Float32Array,
  idx: number,
  x: number,
  y: number,
  z: number,
  jitter = 0.01
): void {
  out[idx * 3] = x + (Math.random() - 0.5) * jitter
  out[idx * 3 + 1] = y + (Math.random() - 0.5) * jitter
  out[idx * 3 + 2] = z + (Math.random() - 0.5) * jitter
}

function writeMeta(
  meta: Float32Array,
  idx: number,
  role: number,
  slot: number,
  param: number,
  aux: number,
  phase: number,
  speed: number
): void {
  const bi = idx * META_STRIDE
  meta[bi] = role
  meta[bi + 1] = slot
  meta[bi + 2] = param
  meta[bi + 3] = aux
  meta[bi + 4] = phase
  meta[bi + 5] = speed
}

function toWorld(nx: number, ny: number, layer: number): [number, number, number] {
  const x = (nx - 50) * 0.018 * SCALE
  const y = -(ny - 50) * 0.018 * SCALE
  const z = (layer - 1) * 0.04 * SCALE + Math.sin(nx * 0.07 + ny * 0.05) * 0.014 * SCALE
  return [CX + x, y, z]
}

function globeSurfacePoint(theta: number, phi: number, shell: number): [number, number, number] {
  const r = (0.32 + shell * 0.06) * SCALE
  const x = CX + Math.cos(phi) * Math.sin(theta) * r
  const y = Math.sin(phi) * r * 0.86
  const z = Math.cos(phi) * Math.cos(theta) * r * 0.72
  return [x, y, z]
}

function globalHubWorld(hub: number, satellite = 0): [number, number, number] {
  const { x, y } =
    satellite === 0 ? globalHubPosition(hub) : globalHubSatellitePosition(hub, satellite)
  const layer = hub % 3
  return toWorld(x, y, layer)
}

function fillGlobalHubs(out: Float32Array, meta: Float32Array, idx: number, n: number): number {
  const perHub = Math.max(3, Math.floor(n / COMMERCE_GLOBAL_HUB_COUNT))
  for (let hub = 0; hub < COMMERCE_GLOBAL_HUB_COUNT && idx < out.length / 3; hub++) {
    for (let j = 0; j < perHub; j++) {
      const [x, y, z] = globalHubWorld(hub, j % 8)
      write(out, idx, x, y, z, 0.01)
      writeMeta(meta, idx, MARKETPLACE_ROLE.CONTINENT, hub, j / perHub, 0, Math.random() * Math.PI * 2, 0.14 + hub * 0.02)
      idx++
    }
  }
  return idx
}

function routePoint(routeIndex: number, h: number): [number, number, number] {
  const route = COMMERCE_TRADE_ROUTES[routeIndex % COMMERCE_TRADE_ROUTES.length]
  if (!route) return [CX, 0, 0]
  const { from, to } = route
  const cx = 50
  const cy = 50
  const mx = (from.x + to.x) / 2
  const my = (from.y + to.y) / 2
  const dx = mx - cx
  const dy = my - cy
  const dist = Math.sqrt(dx * dx + dy * dy) || 1
  const bulge = 7
  const cpx = mx + (-dy / dist) * bulge
  const cpy = my + (dx / dist) * bulge
  const t = Math.max(0, Math.min(1, h))
  const x = (1 - t) ** 2 * from.x + 2 * (1 - t) * t * cpx + t ** 2 * to.x
  const y = (1 - t) ** 2 * from.y + 2 * (1 - t) * t * cpy + t ** 2 * to.y
  const arcLift = Math.sin(t * Math.PI) * 3
  return toWorld(x, y - arcLift * 0.015, 1 + Math.sin(t * Math.PI) * 0.5)
}

function paymentWorld(payment: number): [number, number, number] {
  const p = COMMERCE_PAYMENT_CORES[payment % COMMERCE_PAYMENT_CORES.length]
  if (!p) return [CX, 0, 0]
  return toWorld(p.x, p.y, 1)
}

function corePoint(angle: number, radiusT: number): [number, number, number] {
  const r = (0.05 + radiusT * 0.07) * SCALE
  return [CX + Math.cos(angle) * r, Math.sin(angle) * r * 0.88, Math.sin(angle * 2) * 0.012 * SCALE]
}

function haloPoint(theta: number, phi: number): [number, number, number] {
  const r = 0.42 * SCALE
  return [
    CX + Math.cos(phi) * Math.sin(theta) * r,
    Math.sin(phi) * r * 0.85,
    Math.cos(phi) * Math.cos(theta) * r * 0.65,
  ]
}

function fieldPoint(): [number, number, number] {
  const angle = Math.random() * Math.PI * 2
  const r = (0.15 + Math.random() * 0.45) * SCALE
  return [CX + Math.cos(angle) * r, Math.sin(angle) * r * 0.82, (Math.random() - 0.5) * 0.05 * SCALE]
}

function fillCore(out: Float32Array, meta: Float32Array, idx: number, n: number): number {
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * Math.PI * 2 + Math.random() * 0.1
    const r = 0.3 + Math.random() * 0.65
    const [x, y, z] = corePoint(angle, r)
    write(out, idx, x, y, z, 0.007)
    writeMeta(meta, idx, MARKETPLACE_ROLE.CORE, 0, r, angle, Math.random() * Math.PI * 2, 0.08)
    idx++
  }
  return idx
}

function fillGlobalHubParticles(out: Float32Array, meta: Float32Array, idx: number, n: number): number {
  return fillGlobalHubs(out, meta, idx, n)
}

function fillGlobeShell(out: Float32Array, meta: Float32Array, idx: number, n: number): number {
  for (let i = 0; i < n; i++) {
    const theta = (i / n) * Math.PI * 2 + Math.random() * 0.08
    const phi = (Math.random() - 0.5) * Math.PI * 0.75
    const shell = 0.7 + Math.random() * 0.28
    const [x, y, z] = globeSurfacePoint(theta, phi, shell)
    write(out, idx, x, y, z, 0.008)
    writeMeta(meta, idx, MARKETPLACE_ROLE.HALO, Math.floor(shell * 3) % 3, theta, phi, Math.random() * Math.PI * 2, 0.05)
    idx++
  }
  return idx
}

function fillRoutes(out: Float32Array, meta: Float32Array, idx: number, n: number): number {
  for (let i = 0; i < n; i++) {
    const route = i % COMMERCE_TRADE_ROUTES.length
    const h = Math.random()
    const [x, y, z] = routePoint(route, h)
    write(out, idx, x, y, z, 0.006)
    writeMeta(meta, idx, MARKETPLACE_ROLE.ROUTE, route, h, 0, Math.random() * Math.PI * 2, 0.3 + (i % 5) * 0.04)
    idx++
  }
  return idx
}

function fillPackages(out: Float32Array, meta: Float32Array, idx: number, n: number): number {
  for (let i = 0; i < n; i++) {
    const route = i % COMMERCE_TRADE_ROUTES.length
    const h = Math.random()
    const [x, y, z] = routePoint(route, h)
    write(out, idx, x, y, z, 0.005)
    writeMeta(meta, idx, MARKETPLACE_ROLE.PACKAGE, route, h, i % 3, Math.random() * Math.PI * 2, 0.38 + (i % 4) * 0.05)
    idx++
  }
  return idx
}

function fillPayments(out: Float32Array, meta: Float32Array, idx: number, n: number): number {
  const per = Math.max(2, Math.floor(n / COMMERCE_PAYMENT_CORES.length))
  for (let p = 0; p < COMMERCE_PAYMENT_CORES.length; p++) {
    for (let j = 0; j < per && idx < out.length / 3; j++) {
      const [x, y, z] = paymentWorld(p)
      write(out, idx, x + (Math.random() - 0.5) * 0.02 * SCALE, y, z, 0.008)
      writeMeta(meta, idx, MARKETPLACE_ROLE.PAYMENT, p, j / per, 0, Math.random() * Math.PI * 2, 0.15 + p * 0.04)
      idx++
    }
  }
  return idx
}

function fillField(out: Float32Array, meta: Float32Array, idx: number, n: number): number {
  for (let i = 0; i < n; i++) {
    const [x, y, z] = fieldPoint()
    write(out, idx, x, y, z, 0.014)
    writeMeta(meta, idx, MARKETPLACE_ROLE.FIELD, i % 3, Math.random(), 0, Math.random() * Math.PI * 2, 0.05)
    idx++
  }
  return idx
}

export function buildMarketplaceGlobalNetwork(count: number): {
  positions: Float32Array
  meta: Float32Array
} {
  const out = new Float32Array(count * 3)
  const meta = new Float32Array(count * META_STRIDE)
  let idx = 0

  const nCore = Math.floor(count * 0.09)
  const nHub = Math.floor(count * 0.3)
  const nHalo = Math.floor(count * 0.1)
  const nRoute = Math.floor(count * 0.16)
  const nPackage = Math.floor(count * 0.22)
  const nPayment = Math.floor(count * 0.1)
  const nField = count - nCore - nHub - nHalo - nRoute - nPackage - nPayment

  idx = fillCore(out, meta, idx, nCore)
  idx = fillGlobalHubParticles(out, meta, idx, nHub)
  idx = fillGlobeShell(out, meta, idx, nHalo)
  idx = fillRoutes(out, meta, idx, nRoute)
  idx = fillPackages(out, meta, idx, nPackage)
  idx = fillPayments(out, meta, idx, nPayment)
  idx = fillField(out, meta, idx, nField)

  while (idx < count) {
    idx = fillField(out, meta, idx, 1)
  }

  return { positions: out, meta }
}

export function genMarketplaceGlobalNetwork(count: number): Float32Array {
  const { positions, meta } = buildMarketplaceGlobalNetwork(count)
  cachedMarketplaceMeta = meta
  return positions
}

/** @deprecated — use genMarketplaceGlobalNetwork */
export function genMarketplaceGrid(count: number): Float32Array {
  return genMarketplaceGlobalNetwork(count)
}

export function getMarketplaceNetworkMeta(): Float32Array | null {
  return cachedMarketplaceMeta
}

export function scatterMarketplaceExterior(count: number): Float32Array {
  const scatter = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const bi = i * 3
    const angle = Math.random() * Math.PI * 2
    const r = 0.8 + Math.random() * 0.75
    scatter[bi] = Math.cos(angle) * r
    scatter[bi + 1] = Math.sin(angle) * r * 0.88
    scatter[bi + 2] = (Math.random() - 0.5) * 0.4
  }
  return scatter
}

export function marketplaceCommercePulse(t: number, phase: number): number {
  const cycle = COMMERCE_PULSE_S
  const local = ((t + phase * 0.3) % cycle) / cycle
  return 0.5 + 0.5 * Math.sin(local * Math.PI * 2) ** 1.4
}

export function marketplaceRouteActive(t: number, routeIndex: number): number {
  const route = COMMERCE_TRADE_ROUTES[routeIndex % COMMERCE_TRADE_ROUTES.length]
  if (!route) return 0
  const cycle = route.duration + 0.6
  const local = ((t + route.delay) % cycle) / cycle
  return Math.max(0, 1 - Math.abs(local - 0.28) * 4.5) ** 2
}

export function marketplacePackageTravel(t: number, routeIndex: number, speed: number): number {
  const route = COMMERCE_TRADE_ROUTES[routeIndex % COMMERCE_TRADE_ROUTES.length]
  if (!route) return 0
  const cycle = route.duration * 0.85
  return ((t / cycle) * (0.85 + speed * 0.25) + route.delay * 0.12) % 1
}

export function marketplaceLayerActivation(formT: number, layer: number): number {
  return Math.min(1, Math.max(0, (formT - layer * 0.1) / 0.38))
}

export function marketplaceGlobeActivation(formT: number): number {
  return Math.min(1, Math.max(0, formT / 0.42))
}

export function marketplaceRouteActivation(formT: number): number {
  return Math.min(1, Math.max(0, (formT - 0.35) / 0.32))
}

export function marketplaceCoreActivation(formT: number): number {
  return Math.min(1, Math.max(0, (formT - 0.5) / 0.28))
}

export function marketplacePaymentActivation(formT: number): number {
  return Math.min(1, Math.max(0, (formT - 0.62) / 0.26))
}

export function computeMarketplaceNetworkPosition(
  meta: Float32Array,
  i: number,
  t: number,
  motion: number
): [number, number, number] {
  const mi = i * META_STRIDE
  const role = meta[mi]
  const slot = meta[mi + 1]
  const param = meta[mi + 2]
  const aux = meta[mi + 3]
  const phase = meta[mi + 4]
  const speed = meta[mi + 5]
  const pulse = marketplaceCommercePulse(t, phase)
  const breathe = Math.sin(t * 0.16 + phase) * 0.004 * SCALE * motion

  if (role === MARKETPLACE_ROLE.CORE) {
    const [x, y, z] = corePoint(aux, param + pulse * 0.08 * motion)
    return [x, y, z + pulse * 0.014 * motion]
  }

  if (role === MARKETPLACE_ROLE.CONTINENT) {
    const [x, y, z] = globalHubWorld(slot, Math.floor(param * 8))
    const drift = Math.sin(t * 0.28 + slot) * 0.003 * SCALE * motion
    return [x + drift, y + breathe, z]
  }

  if (role === MARKETPLACE_ROLE.HALO) {
    const spin = param + t * 0.004
    const [x, y, z] = haloPoint(spin, aux + Math.sin(t * 0.08) * 0.03)
    return [x, y + breathe * 0.35, z]
  }

  if (role === MARKETPLACE_ROLE.ROUTE || role === MARKETPLACE_ROLE.PACKAGE) {
    const active = marketplaceRouteActive(t, slot)
    const travel = marketplacePackageTravel(t, slot, speed)
    const h = role === MARKETPLACE_ROLE.PACKAGE ? travel : (param + travel * active * 0.5) % 1
    const [x, y, z] = routePoint(slot, h)
    return [x, y, z + active * 0.012]
  }

  if (role === MARKETPLACE_ROLE.PAYMENT) {
    const [x, y, z] = paymentWorld(slot)
    const flicker = pulse * 0.01 * SCALE * motion
    return [x + flicker, y + breathe * 0.4, z]
  }

  const [fx, fy, fz] = fieldPoint()
  return [fx + breathe, fy + breathe * 0.5, fz]
}

function colorForRole(role: number, slot: number): Rgb {
  const r = Math.random()
  if (role === MARKETPLACE_ROLE.CORE) return FUCHSIA
  if (role === MARKETPLACE_ROLE.PAYMENT) {
    if (slot === 0) return FUCHSIA
    if (slot === 1) return CYAN
    return ION
  }
  if (role === MARKETPLACE_ROLE.PACKAGE) {
    if (r < 0.45) return CYAN
    return PURPLE
  }
  if (role === MARKETPLACE_ROLE.ROUTE) {
    if (r < 0.5) return CYAN
    if (r < 0.78) return PURPLE
    return FUCHSIA
  }
  if (role === MARKETPLACE_ROLE.CONTINENT || role === MARKETPLACE_ROLE.HALO) {
    if (r < 0.4) return CYAN
    if (r < 0.72) return PURPLE
    return FUCHSIA
  }
  if (r < 0.38) return PURPLE
  if (r < 0.7) return CYAN
  return FUCHSIA
}

export function buildMarketplaceNetworkColors(count: number, meta: Float32Array): Float32Array {
  const colors = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const role = meta[i * META_STRIDE]
    const slot = meta[i * META_STRIDE + 1]
    const c = colorForRole(role, slot)
    const dim =
      role === MARKETPLACE_ROLE.CORE
        ? 1.1 + Math.random() * 0.12
        : role === MARKETPLACE_ROLE.PACKAGE
          ? 1.02 + Math.random() * 0.1
          : role === MARKETPLACE_ROLE.ROUTE
            ? 0.92 + Math.random() * 0.1
            : role === MARKETPLACE_ROLE.FIELD
              ? 0.58 + Math.random() * 0.12
              : 0.84 + Math.random() * 0.14
    colors[i * 3] = Math.min(1, c[0] * dim)
    colors[i * 3 + 1] = Math.min(1, c[1] * dim)
    colors[i * 3 + 2] = Math.min(1, c[2] * dim)
  }
  return colors
}

export const MARKETPLACE_META_STRIDE = META_STRIDE
