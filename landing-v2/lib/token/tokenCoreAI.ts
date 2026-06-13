/**
 * Token Core center — AI neural emblem.
 * Hex frame · 3-layer network · synaptic links · central hub.
 */
type Rgb = readonly [number, number, number]

const TOKEN_META_STRIDE = 6
const TOKEN_ROLE_AI = 4

export const TOKEN_AI_SCALE = 1.02

export const TOKEN_AI_PART = {
  NODE: 0,
  LINK: 1,
  HEX: 2,
  SPARK: 3,
  HUB: 4,
} as const

const LAYERS = [
  { x: -0.5, nodes: [-0.32, -0.1, 0.1, 0.32] },
  { x: 0, nodes: [-0.38, -0.19, 0, 0.19, 0.38] },
  { x: 0.5, nodes: [-0.2, 0, 0.2] },
] as const

const SIG = {
  MAGENTA: [1, 0, 0.784] as Rgb,
  FUCHSIA: [1, 0.18, 0.859] as Rgb,
  PURPLE: [0.616, 0.302, 1] as Rgb,
  BLUE: [0.161, 0.384, 1] as Rgb,
  CYAN: [0, 0.961, 1] as Rgb,
} as const

function s(v: number): number {
  return v * TOKEN_AI_SCALE
}

function nodeCenter(layer: number, nodeIdx: number): [number, number, number] {
  const L = LAYERS[layer]
  if (!L) return [0, 0, 0]
  const y = L.nodes[nodeIdx] ?? 0
  return [s(L.x), s(y), 0]
}

function hexOutline(t: number): [number, number, number] {
  const r = s(0.66)
  const angle = t * Math.PI * 2 - Math.PI / 2
  return [Math.cos(angle) * r, Math.sin(angle) * r * 0.9, s(0.01) * Math.sin(angle * 2)]
}

function hubPoint(u: number, v: number): [number, number, number] {
  const r = s(0.055 + u * 0.07)
  const a = v * Math.PI * 2
  return [Math.cos(a) * r, Math.sin(a) * r * 0.85, s(0.008) * Math.sin(a * 2)]
}

type LinkDef = { fromLayer: number; fromNode: number; toLayer: number; toNode: number }

function buildLinks(): LinkDef[] {
  const links: LinkDef[] = []
  for (let i = 0; i < LAYERS[0].nodes.length; i++) {
    for (let j = 0; j < LAYERS[1].nodes.length; j++) {
      if ((i + j) % 2 === 0) links.push({ fromLayer: 0, fromNode: i, toLayer: 1, toNode: j })
    }
  }
  for (let i = 0; i < LAYERS[1].nodes.length; i++) {
    for (let j = 0; j < LAYERS[2].nodes.length; j++) {
      if ((i + j) % 2 === 0) links.push({ fromLayer: 1, fromNode: i, toLayer: 2, toNode: j })
    }
  }
  return links
}

const AI_LINKS = buildLinks()

function linkEndpoints(linkId: number): {
  ax: number
  ay: number
  az: number
  bx: number
  by: number
  bz: number
} {
  const link = AI_LINKS[linkId % AI_LINKS.length]
  const [ax, ay, az] = nodeCenter(link.fromLayer, link.fromNode)
  const [bx, by, bz] = nodeCenter(link.toLayer, link.toNode)
  return { ax, ay, az, bx, by, bz }
}

function write(
  out: Float32Array,
  idx: number,
  x: number,
  y: number,
  z: number,
  jitter = 0.008
): void {
  out[idx * 3] = x + (Math.random() - 0.5) * jitter
  out[idx * 3 + 1] = y + (Math.random() - 0.5) * jitter
  out[idx * 3 + 2] = z + (Math.random() - 0.5) * jitter * 0.5
}

function writeMeta(
  meta: Float32Array,
  idx: number,
  part: number,
  param: number,
  aux: number,
  phase: number,
  speed: number
): void {
  const bi = idx * TOKEN_META_STRIDE
  meta[bi] = TOKEN_ROLE_AI
  meta[bi + 1] = part
  meta[bi + 2] = param
  meta[bi + 3] = aux
  meta[bi + 4] = phase
  meta[bi + 5] = speed
}

export function fillTokenCoreAI(
  out: Float32Array,
  meta: Float32Array,
  idx: number,
  n: number
): number {
  const nNode = Math.floor(n * 0.38)
  const nLink = Math.floor(n * 0.34)
  const nHex = Math.floor(n * 0.14)
  const nSpark = Math.floor(n * 0.08)
  const nHub = n - nNode - nLink - nHex - nSpark

  const nodeCenters: Array<{ layer: number; node: number }> = []
  for (let layer = 0; layer < LAYERS.length; layer++) {
    for (let node = 0; node < LAYERS[layer].nodes.length; node++) {
      nodeCenters.push({ layer, node })
    }
  }

  const perNode = Math.max(3, Math.floor(nNode / nodeCenters.length))
  for (const { layer, node } of nodeCenters) {
    const [cx, cy, cz] = nodeCenter(layer, node)
    for (let p = 0; p < perNode && idx < out.length / 3; p++) {
      const ang = (p / perNode) * Math.PI * 2 + Math.random() * 0.4
      const r = s(0.028 + Math.random() * 0.022)
      write(out, idx, cx + Math.cos(ang) * r, cy + Math.sin(ang) * r * 0.9, cz, 0.006)
      writeMeta(meta, idx, TOKEN_AI_PART.NODE, layer, node, Math.random() * Math.PI * 2, 0.28)
      idx++
    }
  }

  const perLink = Math.max(2, Math.floor(nLink / AI_LINKS.length))
  for (let lid = 0; lid < AI_LINKS.length; lid++) {
    for (let p = 0; p < perLink && idx < out.length / 3; p++) {
      const t = (p + Math.random() * 0.15) / Math.max(1, perLink)
      const { ax, ay, az, bx, by, bz } = linkEndpoints(lid)
      write(out, idx, ax + (bx - ax) * t, ay + (by - ay) * t, az + (bz - az) * t, 0.005)
      writeMeta(meta, idx, TOKEN_AI_PART.LINK, t, lid, Math.random() * Math.PI * 2, 0.38 + (lid % 4) * 0.04)
      idx++
    }
  }

  for (let i = 0; i < nHex; i++) {
    const t = i / Math.max(1, nHex - 1)
    const [x, y, z] = hexOutline(t)
    write(out, idx, x, y, z, 0.007)
    writeMeta(meta, idx, TOKEN_AI_PART.HEX, t, 0, Math.random() * Math.PI * 2, 0.18)
    idx++
  }

  for (let i = 0; i < nSpark; i++) {
    const pick = nodeCenters[i % nodeCenters.length]
    const [cx, cy, cz] = nodeCenter(pick.layer, pick.node)
    write(out, idx, cx, cy, cz + s(0.02), 0.004)
    writeMeta(meta, idx, TOKEN_AI_PART.SPARK, pick.layer, pick.node, Math.random() * Math.PI * 2, 0.52)
    idx++
  }

  for (let i = 0; i < nHub; i++) {
    const [x, y, z] = hubPoint(Math.random(), Math.random())
    write(out, idx, x, y, z, 0.005)
    writeMeta(meta, idx, TOKEN_AI_PART.HUB, Math.random(), 0, Math.random() * Math.PI * 2, 0.32)
    idx++
  }

  return idx
}

function aiNeuralPulse(t: number, phase: number, speed: number): number {
  const wave = (t * (0.42 + speed * 0.12) + phase * 0.2) % 1
  return Math.max(0, 1 - Math.abs(wave - 0.5) * 3.4) ** 2
}

export function computeTokenAIPosition(
  meta: Float32Array,
  i: number,
  t: number,
  motion: number
): [number, number, number] {
  const mi = i * TOKEN_META_STRIDE
  const part = meta[mi + 1]
  const param = meta[mi + 2]
  const aux = meta[mi + 3]
  const phase = meta[mi + 4]
  const speed = meta[mi + 5]
  const breathe = Math.sin(t * 0.22 + phase) * s(0.003) * motion

  if (part === TOKEN_AI_PART.NODE) {
    const layer = Math.floor(param)
    const node = Math.floor(aux)
    const [cx, cy, cz] = nodeCenter(layer, node)
    const pulse = 1 + Math.sin(t * 0.9 + phase) * 0.018 * motion
    return [cx * pulse, cy * pulse + breathe, cz + s(0.012) * Math.sin(t * 0.5 + phase)]
  }

  if (part === TOKEN_AI_PART.LINK) {
    const { ax, ay, az, bx, by, bz } = linkEndpoints(aux)
    const pulse = aiNeuralPulse(t, phase, speed)
    const travel = (param + pulse * 0.22) % 1
    return [
      ax + (bx - ax) * travel,
      ay + (by - ay) * travel + breathe * 0.5,
      az + (bz - az) * travel + s(0.008) * Math.sin(travel * Math.PI),
    ]
  }

  if (part === TOKEN_AI_PART.HEX) {
    const [x, y, z] = hexOutline(param + t * 0.015)
    return [x, y + breathe * 0.4, z]
  }

  if (part === TOKEN_AI_PART.SPARK) {
    const layer = Math.floor(param)
    const node = Math.floor(aux)
    const [cx, cy, cz] = nodeCenter(layer, node)
    const flash = aiNeuralPulse(t, phase, speed) * s(0.018) * motion
    return [cx + flash, cy + breathe, cz + s(0.022)]
  }

  const hubPulse = 1 + Math.sin(t * 0.65 + phase) * 0.04 * motion
  const [x, y, z] = hubPoint(param, aux)
  return [x * hubPulse, y * hubPulse + breathe, z]
}

function lerpRgb(a: Rgb, b: Rgb, t: number): Rgb {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
}

export function tokenAiNeonColor(part: number, slot = 0, t = 0, phase = 0): Rgb {
  const pulse = 0.9 + Math.sin(t * 1.4 + phase) * 0.1

  if (part === TOKEN_AI_PART.HUB) {
    const c = lerpRgb(SIG.MAGENTA, SIG.FUCHSIA, 0.45)
    return [c[0] * 1.24 * pulse, c[1] * 1.16 * pulse, c[2] * 1.22 * pulse]
  }
  if (part === TOKEN_AI_PART.SPARK) {
    const c = lerpRgb(SIG.CYAN, SIG.FUCHSIA, 0.5 + Math.sin(t * 2.8 + phase) * 0.3)
    return [c[0] * 1.28 * pulse, c[1] * 1.2 * pulse, c[2] * 1.26 * pulse]
  }
  if (part === TOKEN_AI_PART.LINK) {
    const c = lerpRgb(SIG.PURPLE, SIG.BLUE, 0.35 + (slot % 5) * 0.08)
    return [c[0] * 1.1 * pulse, c[1] * 1.06 * pulse, c[2] * 1.16 * pulse]
  }
  if (part === TOKEN_AI_PART.HEX) {
    const c = lerpRgb(SIG.CYAN, SIG.BLUE, 0.55)
    return [c[0] * 1.14 * pulse, c[1] * 1.12 * pulse, c[2] * 1.2 * pulse]
  }
  const layer = slot % 3
  const c =
    layer === 0
      ? lerpRgb(SIG.CYAN, SIG.BLUE, 0.4)
      : layer === 1
        ? lerpRgb(SIG.PURPLE, SIG.FUCHSIA, 0.45)
        : lerpRgb(SIG.FUCHSIA, SIG.MAGENTA, 0.35)
  return [c[0] * 1.18 * pulse, c[1] * 1.14 * pulse, c[2] * 1.2 * pulse]
}

export function amplifyTokenNeon(r: number, g: number, b: number, t: number, phase: number): [number, number, number] {
  const pulse = 1 + Math.sin(t * 1.1 + phase * 0.7) * 0.1
  const sat = 1.14
  const avg = (r + g + b) / 3
  let nr = avg + (r - avg) * sat
  let ng = avg + (g - avg) * sat
  let nb = avg + (b - avg) * sat
  nr *= pulse
  ng *= pulse
  nb *= pulse
  return [Math.min(0.96, nr), Math.min(0.96, ng), Math.min(0.96, nb)]
}
