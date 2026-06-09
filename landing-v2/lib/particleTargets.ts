/**
 * Genera arrays de posiciones target para cada sección.
 * Todas retornan exactamente COUNT * 3 floats (x,y,z por partícula).
 */

export const PARTICLE_COUNT = 600

// ─── Helpers ────────────────────────────────────────────────────────────────

function randomOnSphere(r: number): [number, number, number] {
  const u     = Math.random()
  const v     = Math.random()
  const theta = 2 * Math.PI * u
  const phi   = Math.acos(2 * v - 1)
  return [
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi),
  ]
}

function randomInSphere(r: number): [number, number, number] {
  const pos = randomOnSphere(r * Math.cbrt(Math.random()))
  return pos
}

// ─── Section 0 — Hero: esfera Genesis ────────────────────────────────────────
export function genSphere(count: number, radius = 1.5): Float32Array {
  const out = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const [x, y, z] = randomOnSphere(radius * (0.85 + Math.random() * 0.3))
    out[i*3]   = x
    out[i*3+1] = y
    out[i*3+2] = z
  }
  return out
}

// ─── Section 1 — Ecosistema: 3 anillos concéntricos (átomo) ─────────────────
export function genAtom(count: number): Float32Array {
  const out    = new Float32Array(count * 3)
  const radii  = [0.6, 1.1, 1.7]
  const tilts  = [0, Math.PI / 6, -Math.PI / 5]  // inclinaciones distintas
  const perRing = Math.floor(count / 3)

  for (let ring = 0; ring < 3; ring++) {
    const r    = radii[ring]
    const tilt = tilts[ring]
    const base = ring * perRing
    const n    = ring < 2 ? perRing : count - base

    for (let i = 0; i < n; i++) {
      const angle = (i / n) * Math.PI * 2 + Math.random() * 0.15
      const jitter = (Math.random() - 0.5) * 0.08
      const x =  r * Math.cos(angle) + jitter
      const y = (r * Math.sin(angle) + jitter) * Math.cos(tilt)
      const z = (r * Math.sin(angle) + jitter) * Math.sin(tilt)
      out[(base + i)*3]   = x
      out[(base + i)*3+1] = y
      out[(base + i)*3+2] = z
    }
  }
  return out
}

// ─── Section 2 — AIG Token: moneda con 5 anillos concéntricos ───────────────
export function genCoin(count: number): Float32Array {
  const out = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const angle  = (i / count) * Math.PI * 2
    const ring   = Math.floor(Math.random() * 5)   // 5 anillos
    const radius = 0.3 + ring * 0.3                 // 0.3, 0.6, 0.9, 1.2, 1.5
    out[i*3]   = Math.cos(angle + ring * 0.2) * radius
    out[i*3+1] = Math.sin(angle + ring * 0.2) * radius
    out[i*3+2] = (Math.random() - 0.5) * 0.1        // casi plano
  }
  return out
}

// ─── Section 3 — GPulse: onda sinusoidal (2 ciclos) ────────────────────────
export function genPulseWave(count: number): Float32Array {
  const out = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 4           // 2 ciclos completos
    const x = (i / count) * 4 - 2                 // -2 → 2
    const y = Math.sin(t) * 0.8                   // amplitud 0.8
    const z = (Math.random() - 0.5) * 0.3
    out[i*3]   = x
    out[i*3+1] = y + (Math.random() - 0.5) * 0.05
    out[i*3+2] = z
  }
  return out
}

// ─── Section 4 — Gevy Shop: cubo wireframe ──────────────────────────────────
export function genCube(count: number): Float32Array {
  const out  = new Float32Array(count * 3)
  const size = 1.4
  const s    = size / 2
  // 12 aristas del cubo, distribuir partículas entre ellas
  const edges: Array<[[number,number,number],[number,number,number]]> = [
    [[-s,-s,-s],[ s,-s,-s]], [[ s,-s,-s],[ s, s,-s]], [[ s, s,-s],[-s, s,-s]], [[-s, s,-s],[-s,-s,-s]],
    [[-s,-s, s],[ s,-s, s]], [[ s,-s, s],[ s, s, s]], [[ s, s, s],[-s, s, s]], [[-s, s, s],[-s,-s, s]],
    [[-s,-s,-s],[-s,-s, s]], [[ s,-s,-s],[ s,-s, s]], [[ s, s,-s],[ s, s, s]], [[-s, s,-s],[-s, s, s]],
  ]
  const perEdge = Math.floor(count / edges.length)
  let idx = 0
  for (const [[ax,ay,az],[bx,by,bz]] of edges) {
    const n = idx + perEdge <= count ? perEdge : count - idx
    for (let i = 0; i < n; i++) {
      const t = i / perEdge
      out[idx*3]   = ax + (bx - ax) * t + (Math.random() - 0.5) * 0.04
      out[idx*3+1] = ay + (by - ay) * t + (Math.random() - 0.5) * 0.04
      out[idx*3+2] = az + (bz - az) * t + (Math.random() - 0.5) * 0.04
      idx++
      if (idx >= count) break
    }
    if (idx >= count) break
  }
  return out
}

// ─── Section 5 — Comunidad: red de nodos ────────────────────────────────────
export function genNodeNetwork(count: number): Float32Array {
  const out    = new Float32Array(count * 3)
  const nodes  = 14
  const cx: number[] = []
  const cy: number[] = []
  const cz: number[] = []

  // Posicionar nodos centrales en esfera grande
  for (let n = 0; n < nodes; n++) {
    const [x, y, z] = randomOnSphere(1.8)
    cx.push(x); cy.push(y); cz.push(z)
  }

  const perNode = Math.floor(count / nodes)
  for (let n = 0; n < nodes; n++) {
    const base = n * perNode
    const num  = n < nodes - 1 ? perNode : count - base
    for (let i = 0; i < num; i++) {
      const spread = 0.2
      out[(base+i)*3]   = cx[n] + (Math.random()-0.5)*spread
      out[(base+i)*3+1] = cy[n] + (Math.random()-0.5)*spread
      out[(base+i)*3+2] = cz[n] + (Math.random()-0.5)*spread
    }
  }
  return out
}

// ─── Section 6 — Tech: hexágono ─────────────────────────────────────────────
export function genHexagon(count: number): Float32Array {
  const out  = new Float32Array(count * 3)
  const sides = 6
  const perSide = Math.floor(count / sides)

  for (let s = 0; s < sides; s++) {
    const a1 = (s / sides) * Math.PI * 2
    const a2 = ((s + 1) / sides) * Math.PI * 2
    const r  = 1.6
    const ax = r * Math.cos(a1), ay = r * Math.sin(a1)
    const bx = r * Math.cos(a2), by = r * Math.sin(a2)
    const n  = s < sides - 1 ? perSide : count - s * perSide
    for (let i = 0; i < n; i++) {
      const t = i / perSide
      out[(s*perSide+i)*3]   = ax + (bx-ax)*t + (Math.random()-0.5)*0.05
      out[(s*perSide+i)*3+1] = ay + (by-ay)*t + (Math.random()-0.5)*0.05
      out[(s*perSide+i)*3+2] = (Math.random()-0.5)*0.2
    }
  }
  return out
}

// ─── Section 7 — Roadmap: timeline vertical ──────────────────────────────────
export function genTimeline(count: number): Float32Array {
  const out       = new Float32Array(count * 3)
  const milestones = 5
  const lineN     = Math.floor(count * 0.4)
  const nodeN     = count - lineN

  // Línea vertical central
  for (let i = 0; i < lineN; i++) {
    out[i*3]   = (Math.random()-0.5)*0.05
    out[i*3+1] = (i / lineN) * 4 - 2
    out[i*3+2] = (Math.random()-0.5)*0.05
  }

  // Clusters en los hitos
  const perNode = Math.floor(nodeN / milestones)
  for (let m = 0; m < milestones; m++) {
    const yCenter = (m / (milestones-1)) * 4 - 2
    const n       = m < milestones-1 ? perNode : nodeN - m*perNode
    for (let i = 0; i < n; i++) {
      const b = lineN + m*perNode + i
      const r = Math.random() * 0.35
      const a = Math.random() * Math.PI * 2
      out[b*3]   = r * Math.cos(a)
      out[b*3+1] = yCenter + (Math.random()-0.5)*0.1
      out[b*3+2] = r * Math.sin(a)
    }
  }
  return out
}

// ─── Section 5 override — Comunidad: red de nodos con clusters y conexiones ──
export function genNetwork(count: number): Float32Array {
  const out   = new Float32Array(count * 3)
  const nodes = 15
  const nx: number[] = [], ny: number[] = [], nz: number[] = []

  for (let n = 0; n < nodes; n++) {
    nx.push((Math.random() - 0.5) * 3)
    ny.push((Math.random() - 0.5) * 2.5)
    nz.push((Math.random() - 0.5) * 1.5)
  }

  const perNode = Math.floor(count * 0.4 / nodes)
  let idx = 0

  for (let n = 0; n < nodes && idx < count; n++) {
    for (let p = 0; p < perNode && idx < count; p++) {
      out[idx*3]   = nx[n] + (Math.random() - 0.5) * 0.15
      out[idx*3+1] = ny[n] + (Math.random() - 0.5) * 0.15
      out[idx*3+2] = nz[n] + (Math.random() - 0.5) * 0.15
      idx++
    }
  }
  // Conexiones entre nodos aleatorios
  while (idx < count) {
    const a = Math.floor(Math.random() * nodes)
    const b = Math.floor(Math.random() * nodes)
    const t = Math.random()
    out[idx*3]   = nx[a] + (nx[b] - nx[a]) * t
    out[idx*3+1] = ny[a] + (ny[b] - ny[a]) * t
    out[idx*3+2] = nz[a] + (nz[b] - nz[a]) * t
    idx++
  }
  return out
}

// ─── Section 6 — Tech: honeycomb hexagonal ───────────────────────────────────
export function genHoneycomb(count: number): Float32Array {
  const out     = new Float32Array(count * 3)
  const hexSize = 0.4
  const cols = 5, rows = 4
  let idx = 0

  for (let row = 0; row < rows && idx < count; row++) {
    for (let col = 0; col < cols && idx < count; col++) {
      const offsetX = (row % 2) * hexSize * 0.866
      const cx = col * hexSize * 1.732 + offsetX - 2
      const cy = row * hexSize * 1.5 - 1

      // 6 vértices
      for (let v = 0; v < 6 && idx < count; v++) {
        const angle = (v / 6) * Math.PI * 2
        out[idx*3]   = cx + Math.cos(angle) * hexSize
        out[idx*3+1] = cy + Math.sin(angle) * hexSize
        out[idx*3+2] = (Math.random() - 0.5) * 0.2
        idx++
      }
      // Aristas entre vértices
      for (let v = 0; v < 6 && idx < count; v++) {
        const a1 = (v / 6) * Math.PI * 2
        const a2 = ((v + 1) / 6) * Math.PI * 2
        const t  = Math.random()
        out[idx*3]   = cx + (Math.cos(a1) * (1-t) + Math.cos(a2) * t) * hexSize
        out[idx*3+1] = cy + (Math.sin(a1) * (1-t) + Math.sin(a2) * t) * hexSize
        out[idx*3+2] = (Math.random() - 0.5) * 0.1
        idx++
      }
    }
  }
  while (idx < count) {
    out[idx*3]   = (Math.random() - 0.5) * 3.5
    out[idx*3+1] = (Math.random() - 0.5) * 2.5
    out[idx*3+2] = (Math.random() - 0.5) * 0.3
    idx++
  }
  return out
}

// ─── Section 7 — Roadmap: línea vertical + clusters en nodos ─────────────────
export function genRoadmapLine(count: number): Float32Array {
  const out        = new Float32Array(count * 3)
  const nodes      = 7
  const lineHeight = 3.5
  let idx = 0

  const linePoints = Math.floor(count * 0.3)
  for (let i = 0; i < linePoints && idx < count; i++) {
    out[idx*3]   = (Math.random() - 0.5) * 0.05
    out[idx*3+1] = (i / linePoints) * lineHeight - lineHeight / 2
    out[idx*3+2] = (Math.random() - 0.5) * 0.05
    idx++
  }

  const perNode = Math.floor(count * 0.7 / nodes)
  for (let n = 0; n < nodes && idx < count; n++) {
    const nodeY = (n / (nodes - 1)) * lineHeight - lineHeight / 2
    for (let p = 0; p < perNode && idx < count; p++) {
      const angle  = Math.random() * Math.PI * 2
      const radius = Math.random() * 0.25
      out[idx*3]   = Math.cos(angle) * radius
      out[idx*3+1] = nodeY + (Math.random() - 0.5) * 0.1
      out[idx*3+2] = Math.sin(angle) * radius
      idx++
    }
  }
  return out
}

// ─── Tabla completa — 9 escenas (0-8) ───────────────────────────────────────
export function buildAllTargets(): Float32Array[] {
  const C = PARTICLE_COUNT
  return [
    genSphere(C),       // 0 — Hero
    genAtom(C),         // 1 — Ecosistema
    genCoin(C),         // 2 — AIG Token
    genPulseWave(C),    // 3 — GPulse
    genCube(C),         // 4 — Gevy Shop
    genNetwork(C),      // 5 — Comunidad
    genHoneycomb(C),    // 6 — Tech
    genRoadmapLine(C),  // 7 — Roadmap
    genSphere(C),       // 8 — CTA final (regresa a esfera)
  ]
}
