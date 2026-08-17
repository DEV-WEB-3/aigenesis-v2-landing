/**
 * Phase 13.0 — Genesis Community Network (viewBox 0–100).
 * Organic human network — no pyramid, no MLM triangle, no arrow.
 */

import { pulsoDe, llegadaDe, respiracionDe } from '@/lib/design/motion'

export const COMMUNITY_PULSE_S = pulsoDe('comunidad')
export const COMMUNITY_FORM_S = llegadaDe('comunidad')
/**
 * El ciclo con el que emergen los nodos nuevos.
 *
 * Era 4,5 y se multiplicaba por 3,2 y por 3,6 en dos sitios distintos, dando
 * 14,4 y 16,2 segundos: dos valores sueltos que ademas no coincidian entre si,
 * para lo que deberia ser el mismo latido de crecimiento.
 *
 * Ahora es la respiracion de la seccion, y los dos usos la comparten sin
 * multiplicadores. Una comunidad que crece es un fondo lento, no un pulso.
 */
export const COMMUNITY_GROWTH_CYCLE_S = respiracionDe('comunidad')
export const COMMUNITY_CENTER = { x: 50, y: 50 } as const
export const COMMUNITY_LEADER_COUNT = 6
export const COMMUNITY_MEMBER_COUNT = 58
export const COMMUNITY_NODE_COUNT = COMMUNITY_LEADER_COUNT + COMMUNITY_MEMBER_COUNT

export interface CommunityNodeDef {
  index: number
  isLeader: boolean
  branch: number
  growthWave: number
}

export interface CommunityLinkDef {
  id: string
  from: number
  to: number
  lifecycleOffset: number
}

export interface CommunityPoolPulseDef {
  id: string
  from: number
  to: number
  duration: number
  delay: number
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v))
}

/** Six leader nodes — ring around core, asymmetric organic spacing. */
export function leaderNodePosition(leaderIndex: number): { x: number; y: number } {
  const i = ((leaderIndex % COMMUNITY_LEADER_COUNT) + COMMUNITY_LEADER_COUNT) % COMMUNITY_LEADER_COUNT
  const angle = -Math.PI / 2 + (i / COMMUNITY_LEADER_COUNT) * Math.PI * 2 + Math.sin(i * 1.7) * 0.18
  const r = 16.5 + (i % 3) * 1.8 + Math.cos(i * 2.3) * 0.9
  return {
    x: COMMUNITY_CENTER.x + Math.cos(angle) * r,
    y: COMMUNITY_CENTER.y + Math.sin(angle) * r * 0.82,
  }
}

/** Member nodes branch organically from leaders — neural tree, not pyramid. */
export function memberNodePosition(memberIndex: number): { x: number; y: number; branch: number } {
  const branch = memberIndex % COMMUNITY_LEADER_COUNT
  const ring = Math.floor(memberIndex / COMMUNITY_LEADER_COUNT)
  const hub = leaderNodePosition(branch)
  const golden = memberIndex * 2.399963 + branch * 0.85
  const r = 7.5 + ring * 2.6 + (memberIndex % 4) * 0.75
  const wobbleX = Math.sin(golden * 1.3) * 2.2 + Math.cos(memberIndex * 0.71) * 1.4
  const wobbleY = Math.cos(golden * 0.9) * 1.8 + Math.sin(memberIndex * 1.17) * 1.2
  return {
    x: clamp(hub.x + Math.cos(golden) * r + wobbleX, 6, 94),
    y: clamp(hub.y + Math.sin(golden) * r * 0.76 + wobbleY, 6, 94),
    branch,
  }
}

export function communityNodePosition(index: number): { x: number; y: number; isLeader: boolean; branch: number } {
  if (index < COMMUNITY_LEADER_COUNT) {
    const { x, y } = leaderNodePosition(index)
    return { x, y, isLeader: true, branch: index }
  }
  const memberIndex = index - COMMUNITY_LEADER_COUNT
  const { x, y, branch } = memberNodePosition(memberIndex)
  return { x, y, isLeader: false, branch }
}

export function communityNodeDef(index: number): CommunityNodeDef {
  const { isLeader, branch } = communityNodePosition(index)
  const growthWave = isLeader ? 0 : Math.floor((index - COMMUNITY_LEADER_COUNT) / 6)
  return { index, isLeader, branch, growthWave: growthWave + (isLeader ? 0 : 1) }
}

export function communityLinkPath(fromIndex: number, toIndex: number): string {
  const a = fromIndex < 0 ? COMMUNITY_CENTER : communityNodePosition(fromIndex)
  const b = toIndex < 0 ? COMMUNITY_CENTER : communityNodePosition(toIndex)
  const mx = (a.x + b.x) / 2 + (b.y - a.y) * 0.07
  const my = (a.y + b.y) / 2 + (a.x - b.x) * 0.05
  return `M${a.x},${a.y} Q${mx},${my} ${b.x},${b.y}`
}

function buildCommunityLinks(): CommunityLinkDef[] {
  const links: CommunityLinkDef[] = []
  const seen = new Set<string>()

  const add = (from: number, to: number, offset: number) => {
    if (from === to) return
    const a = Math.min(from, to)
    const b = Math.max(from, to)
    const key = `${a}-${b}`
    if (seen.has(key)) return
    seen.add(key)
    links.push({ id: key, from: a, to: b, lifecycleOffset: offset })
  }

  for (let l = 0; l < COMMUNITY_LEADER_COUNT; l++) {
    add(-1, l, l * 0.22)
  }

  for (let m = COMMUNITY_LEADER_COUNT; m < COMMUNITY_NODE_COUNT; m++) {
    const { branch } = communityNodePosition(m)
    add(branch, m, (m % 11) * 0.18)
    if (m % 7 === 0 && m + 1 < COMMUNITY_NODE_COUNT) add(m, m + 1, m * 0.07)
  }

  for (let i = 0; i < COMMUNITY_NODE_COUNT; i++) {
    const a = communityNodePosition(i)
    for (let j = i + 1; j < COMMUNITY_NODE_COUNT; j++) {
      const b = communityNodePosition(j)
      const dx = a.x - b.x
      const dy = a.y - b.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 11.5 && ((i * 7 + j * 13) % 17 < 5 || (i + j) % 13 === 0)) {
        add(i, j, (i + j) * 0.09)
      }
    }
  }

  return links.slice(0, 96)
}

function buildPoolPulses(): CommunityPoolPulseDef[] {
  const pulses: CommunityPoolPulseDef[] = []
  for (let l = 0; l < COMMUNITY_LEADER_COUNT; l++) {
    pulses.push({
      id: `pool-core-${l}`,
      from: l,
      to: -1,
      duration: 2.8 + l * 0.15,
      delay: l * 0.55,
    })
    const member = COMMUNITY_LEADER_COUNT + l * 7 + 2
    if (member < COMMUNITY_NODE_COUNT) {
      pulses.push({
        id: `pool-member-${l}`,
        from: l,
        to: member,
        duration: 3.2 + (l % 3) * 0.2,
        delay: 0.8 + l * 0.42,
      })
    }
  }
  for (let l = 0; l < COMMUNITY_LEADER_COUNT; l++) {
    const peer = (l + 2) % COMMUNITY_LEADER_COUNT
    pulses.push({
      id: `pool-peer-${l}-${peer}`,
      from: l,
      to: peer,
      duration: 3.6,
      delay: 1.2 + l * 0.35,
    })
  }
  return pulses
}

export const COMMUNITY_LINKS: readonly CommunityLinkDef[] = buildCommunityLinks()
export const COMMUNITY_POOL_PULSES: readonly CommunityPoolPulseDef[] = buildPoolPulses()

/** Core (-1) or node index for path endpoints. */
export function communityEndpointPosition(index: number): { x: number; y: number } {
  if (index < 0) return { ...COMMUNITY_CENTER }
  return communityNodePosition(index)
}

export function poolPulsePath(from: number, to: number): string {
  const a = communityEndpointPosition(from)
  const b = communityEndpointPosition(to)
  const mx = (a.x + b.x) / 2 + (b.y - a.y) * 0.09
  const my = (a.y + b.y) / 2 + (a.x - b.x) * 0.06
  return `M${a.x},${a.y} Q${mx},${my} ${b.x},${b.y}`
}

export function communityGrowthDelay(index: number): number {
  const def = communityNodeDef(index)
  return def.growthWave * 0.38 + (index % 5) * 0.08
}
