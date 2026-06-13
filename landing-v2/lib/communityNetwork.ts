/**
 * Phase 13.0 — Genesis Community Network (WebGL star dust, sección 10).
 */
import {
  COMMUNITY_LEADER_COUNT,
  COMMUNITY_LINKS,
  COMMUNITY_NODE_COUNT,
  COMMUNITY_POOL_PULSES,
  COMMUNITY_PULSE_S,
  communityNodePosition,
} from '@/lib/community/communityNetworkLayout'

type Rgb = readonly [number, number, number]

export const COMMUNITY_SECTION_INDEX = 10
export const COMMUNITY_FORM_DURATION = 1.2

export const COMMUNITY_ROLE = {
  CORE: 0,
  LEADER: 1,
  MEMBER: 2,
  LINK: 3,
  PULSE: 4,
  FIELD: 5,
} as const

const META_STRIDE = 6
const SCALE = 1.58
const CX = 0

const CYAN: Rgb = [0, 0.961, 1]
const PURPLE: Rgb = [0.616, 0.302, 1]
const FUCHSIA: Rgb = [1, 0, 0.784]

let cachedCommunityMeta: Float32Array | null = null

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
  const z = (layer - 1) * 0.032 * SCALE + Math.sin(nx * 0.07 + ny * 0.05) * 0.013 * SCALE
  return [CX + x, y, z]
}

function nodeWorld(index: number): [number, number, number] {
  const { x, y, isLeader } = communityNodePosition(index % COMMUNITY_NODE_COUNT)
  const layer = isLeader ? 1.2 : 0.6 + (index % 5) * 0.08
  return toWorld(x, y, layer)
}

function linkPoint(linkIndex: number, h: number): [number, number, number] {
  const link = COMMUNITY_LINKS[linkIndex % COMMUNITY_LINKS.length]
  if (!link) return [CX, 0, 0]
  const from = link.from < 0 ? { x: 50, y: 50 } : communityNodePosition(link.from)
  const to = communityNodePosition(link.to)
  const t = Math.max(0, Math.min(1, h))
  const mx = (from.x + to.x) / 2 + (to.y - from.y) * 0.06
  const my = (from.y + to.y) / 2 + (from.x - to.x) * 0.04
  const x = (1 - t) ** 2 * from.x + 2 * (1 - t) * t * mx + t ** 2 * to.x
  const y = (1 - t) ** 2 * from.y + 2 * (1 - t) * t * my + t ** 2 * to.y
  return toWorld(x, y, 0.8 + Math.sin(t * Math.PI) * 0.35)
}

function pulsePoint(pulseIndex: number, h: number): [number, number, number] {
  const pulse = COMMUNITY_POOL_PULSES[pulseIndex % COMMUNITY_POOL_PULSES.length]
  if (!pulse) return [CX, 0, 0]
  const from = pulse.from < 0 ? { x: 50, y: 50 } : communityNodePosition(pulse.from)
  const to = pulse.to < 0 ? { x: 50, y: 50 } : communityNodePosition(pulse.to)
  const t = Math.max(0, Math.min(1, h))
  const mx = (from.x + to.x) / 2 + (to.y - from.y) * 0.08
  const my = (from.y + to.y) / 2 + (from.x - to.x) * 0.05
  const x = (1 - t) ** 2 * from.x + 2 * (1 - t) * t * mx + t ** 2 * to.x
  const y = (1 - t) ** 2 * from.y + 2 * (1 - t) * t * my + t ** 2 * to.y
  return toWorld(x, y, 1 + Math.sin(t * Math.PI) * 0.4)
}

function corePoint(angle: number, radiusT: number): [number, number, number] {
  const r = (0.05 + radiusT * 0.08) * SCALE
  return [CX + Math.cos(angle) * r, Math.sin(angle) * r * 0.88, Math.sin(angle * 2) * 0.012 * SCALE]
}

function fieldPoint(): [number, number, number] {
  const angle = Math.random() * Math.PI * 2
  const r = (0.12 + Math.random() * 0.4) * SCALE
  return [CX + Math.cos(angle) * r, Math.sin(angle) * r * 0.82, (Math.random() - 0.5) * 0.045 * SCALE]
}

function fillCore(out: Float32Array, meta: Float32Array, idx: number, n: number): number {
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * Math.PI * 2 + Math.random() * 0.1
    const r = 0.28 + Math.random() * 0.65
    const [x, y, z] = corePoint(angle, r)
    write(out, idx, x, y, z, 0.007)
    writeMeta(meta, idx, COMMUNITY_ROLE.CORE, 0, r, angle, Math.random() * Math.PI * 2, 0.09)
    idx++
  }
  return idx
}

function fillLeaders(out: Float32Array, meta: Float32Array, idx: number, n: number): number {
  const per = Math.max(2, Math.floor(n / COMMUNITY_LEADER_COUNT))
  for (let l = 0; l < COMMUNITY_LEADER_COUNT && idx < out.length / 3; l++) {
    for (let j = 0; j < per; j++) {
      const [x, y, z] = nodeWorld(l)
      write(out, idx, x, y, z, 0.012)
      writeMeta(meta, idx, COMMUNITY_ROLE.LEADER, l, j / per, l, Math.random() * Math.PI * 2, 0.16 + l * 0.02)
      idx++
    }
  }
  return idx
}

function fillMembers(out: Float32Array, meta: Float32Array, idx: number, n: number): number {
  const memberTotal = COMMUNITY_NODE_COUNT - COMMUNITY_LEADER_COUNT
  const per = Math.max(1, Math.floor(n / memberTotal))
  for (let m = COMMUNITY_LEADER_COUNT; m < COMMUNITY_NODE_COUNT && idx < out.length / 3; m++) {
    for (let j = 0; j < per; j++) {
      const [x, y, z] = nodeWorld(m)
      write(out, idx, x, y, z, 0.01)
      writeMeta(meta, idx, COMMUNITY_ROLE.MEMBER, m, j / per, m % 6, Math.random() * Math.PI * 2, 0.12 + (m % 8) * 0.012)
      idx++
    }
  }
  return idx
}

function fillLinks(out: Float32Array, meta: Float32Array, idx: number, n: number): number {
  for (let i = 0; i < n; i++) {
    const link = i % COMMUNITY_LINKS.length
    const h = Math.random()
    const [x, y, z] = linkPoint(link, h)
    write(out, idx, x, y, z, 0.006)
    writeMeta(meta, idx, COMMUNITY_ROLE.LINK, link, h, 0, Math.random() * Math.PI * 2, 0.26 + (i % 5) * 0.04)
    idx++
  }
  return idx
}

function fillPulses(out: Float32Array, meta: Float32Array, idx: number, n: number): number {
  for (let i = 0; i < n; i++) {
    const pulse = i % COMMUNITY_POOL_PULSES.length
    const h = Math.random()
    const [x, y, z] = pulsePoint(pulse, h)
    write(out, idx, x, y, z, 0.005)
    writeMeta(meta, idx, COMMUNITY_ROLE.PULSE, pulse, h, i % 3, Math.random() * Math.PI * 2, 0.34 + (i % 4) * 0.05)
    idx++
  }
  return idx
}

function fillField(out: Float32Array, meta: Float32Array, idx: number, n: number): number {
  for (let i = 0; i < n; i++) {
    const [x, y, z] = fieldPoint()
    write(out, idx, x, y, z, 0.014)
    writeMeta(meta, idx, COMMUNITY_ROLE.FIELD, i % 4, Math.random(), 0, Math.random() * Math.PI * 2, 0.05)
    idx++
  }
  return idx
}

export function buildCommunityNetwork(count: number): { positions: Float32Array; meta: Float32Array } {
  const out = new Float32Array(count * 3)
  const meta = new Float32Array(count * META_STRIDE)
  let idx = 0

  const nCore = Math.floor(count * 0.1)
  const nLeader = Math.floor(count * 0.14)
  const nMember = Math.floor(count * 0.32)
  const nLink = Math.floor(count * 0.18)
  const nPulse = Math.floor(count * 0.14)
  const nField = count - nCore - nLeader - nMember - nLink - nPulse

  idx = fillCore(out, meta, idx, nCore)
  idx = fillLeaders(out, meta, idx, nLeader)
  idx = fillMembers(out, meta, idx, nMember)
  idx = fillLinks(out, meta, idx, nLink)
  idx = fillPulses(out, meta, idx, nPulse)
  idx = fillField(out, meta, idx, nField)

  while (idx < count) {
    idx = fillField(out, meta, idx, 1)
  }

  return { positions: out, meta }
}

export function genCommunityNetwork(count: number): Float32Array {
  const { positions, meta } = buildCommunityNetwork(count)
  cachedCommunityMeta = meta
  return positions
}

/** @deprecated — use genCommunityNetwork */
export function genCommunityConstellation(count: number): Float32Array {
  return genCommunityNetwork(count)
}

export function getCommunityNetworkMeta(): Float32Array | null {
  return cachedCommunityMeta
}

export function scatterCommunityExterior(count: number): Float32Array {
  const scatter = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const bi = i * 3
    const angle = Math.random() * Math.PI * 2
    const r = 0.75 + Math.random() * 0.8
    scatter[bi] = Math.cos(angle) * r
    scatter[bi + 1] = Math.sin(angle) * r * 0.88
    scatter[bi + 2] = (Math.random() - 0.5) * 0.38
  }
  return scatter
}

export function communityCorePulse(t: number, phase: number): number {
  const cycle = COMMUNITY_PULSE_S
  const local = ((t + phase * 0.35) % cycle) / cycle
  return 0.5 + 0.5 * Math.sin(local * Math.PI * 2) ** 1.35
}

export function communityLinkActive(t: number, linkIndex: number): number {
  const link = COMMUNITY_LINKS[linkIndex % COMMUNITY_LINKS.length]
  if (!link) return 0
  const cycle = 5.5 + (linkIndex % 4) * 0.8
  const local = ((t + link.lifecycleOffset) % cycle) / cycle
  const rise = Math.max(0, 1 - Math.abs(local - 0.35) * 3.2)
  const fall = Math.max(0, 1 - Math.abs(local - 0.72) * 4)
  return Math.min(1, rise * 0.85 + fall * 0.55) ** 1.6
}

export function communityPulseTravel(t: number, pulseIndex: number, speed: number): number {
  const pulse = COMMUNITY_POOL_PULSES[pulseIndex % COMMUNITY_POOL_PULSES.length]
  if (!pulse) return 0
  const cycle = pulse.duration * 0.9
  return ((t / cycle) * (0.82 + speed * 0.22) + pulse.delay * 0.1) % 1
}

export function communityGrowthActivation(formT: number, wave: number): number {
  return Math.min(1, Math.max(0, (formT - wave * 0.08) / 0.32))
}

export function communityNetworkActivation(formT: number): number {
  return Math.min(1, Math.max(0, formT / 0.4))
}

export function communityCoreActivation(formT: number): number {
  return Math.min(1, Math.max(0, (formT - 0.42) / 0.28))
}

export function communityPulseActivation(formT: number): number {
  return Math.min(1, Math.max(0, (formT - 0.55) / 0.3))
}

export function computeCommunityNetworkPosition(
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
  const pulse = communityCorePulse(t, phase)
  const breathe = Math.sin(t * 0.14 + phase) * 0.005 * SCALE * motion

  if (role === COMMUNITY_ROLE.CORE) {
    const [x, y, z] = corePoint(aux, param + pulse * 0.07 * motion)
    return [x, y, z + pulse * 0.015 * motion]
  }

  if (role === COMMUNITY_ROLE.LEADER || role === COMMUNITY_ROLE.MEMBER) {
    const [x, y, z] = nodeWorld(slot)
    const driftX = Math.sin(t * 0.22 + slot * 0.4 + phase) * 0.004 * SCALE * motion
    const driftY = Math.cos(t * 0.19 + slot * 0.31) * 0.003 * SCALE * motion
    const leaderBoost = role === COMMUNITY_ROLE.LEADER ? pulse * 0.003 * SCALE : 0
    return [x + driftX, y + driftY + breathe, z + leaderBoost]
  }

  if (role === COMMUNITY_ROLE.LINK) {
    const active = communityLinkActive(t, slot)
    const h = (param + t * 0.02 * active) % 1
    const [x, y, z] = linkPoint(slot, h)
    return [x, y, z + active * 0.01]
  }

  if (role === COMMUNITY_ROLE.PULSE) {
    const travel = communityPulseTravel(t, slot, speed)
    const [x, y, z] = pulsePoint(slot, travel)
    return [x, y, z + pulse * 0.008]
  }

  const [fx, fy, fz] = fieldPoint()
  return [fx + breathe, fy + breathe * 0.5, fz]
}

function colorForRole(role: number, slot: number): Rgb {
  const r = Math.random()
  if (role === COMMUNITY_ROLE.CORE) return FUCHSIA
  if (role === COMMUNITY_ROLE.LEADER) {
    if (r < 0.35) return FUCHSIA
    return PURPLE
  }
  if (role === COMMUNITY_ROLE.PULSE) return CYAN
  if (role === COMMUNITY_ROLE.LINK) return PURPLE
  if (role === COMMUNITY_ROLE.MEMBER) {
    if (r < 0.42) return CYAN
    if (r < 0.72) return PURPLE
    return FUCHSIA
  }
  if (r < 0.4) return PURPLE
  if (r < 0.68) return CYAN
  return FUCHSIA
}

export function buildCommunityNetworkColors(count: number, meta: Float32Array): Float32Array {
  const colors = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const role = meta[i * META_STRIDE]
    const slot = meta[i * META_STRIDE + 1]
    const c = colorForRole(role, slot)
    const dim =
      role === COMMUNITY_ROLE.CORE
        ? 1.12 + Math.random() * 0.1
        : role === COMMUNITY_ROLE.LEADER
          ? 1.04 + Math.random() * 0.1
          : role === COMMUNITY_ROLE.PULSE
            ? 1.02 + Math.random() * 0.1
            : role === COMMUNITY_ROLE.LINK
              ? 0.88 + Math.random() * 0.1
              : role === COMMUNITY_ROLE.FIELD
                ? 0.55 + Math.random() * 0.12
                : 0.82 + Math.random() * 0.14
    colors[i * 3] = Math.min(1, c[0] * dim)
    colors[i * 3 + 1] = Math.min(1, c[1] * dim)
    colors[i * 3 + 2] = Math.min(1, c[2] * dim)
  }
  return colors
}

export const COMMUNITY_META_STRIDE = META_STRIDE
