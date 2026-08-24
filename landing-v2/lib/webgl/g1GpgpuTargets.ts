import * as THREE from 'three'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js'
import { G1 } from '@/lib/design/g1'

/**
 * Objetivos del campo GPGPU de G1, empaquetados en arrays RGBA (xyz + seed) del
 * tamaño de la textura de simulación (SIZE·SIZE partículas). Cada "estado"
 * (orbe volumétrico, wordmark G1, campo/cielo) es un array que se sube a la
 * textura `uTarget` de la simulación; las partículas fluyen hacia él en GPU.
 */

export const HERO_HALF = 1.55

/**
 * Ancho en MUNDO del lockup del logo. El plano del logo 3D y la silueta de
 * partículas usan EXACTAMENTE este valor y el mismo mapeo → convergen sin
 * divergencia (cada partícula cae sobre el téxel del logo).
 */
export const LOGO_WORLD_W = 3.5

const C_VIOLET = new THREE.Color(G1.violet)
const C_CYAN = new THREE.Color(G1.cyan)
const C_AMBER = new THREE.Color(G1.amber)
function rampG1(u: number, out: THREE.Color) {
  if (u < 0.5) out.copy(C_VIOLET).lerp(C_CYAN, u * 2)
  else out.copy(C_CYAN).lerp(C_AMBER, (u - 0.5) * 2)
  return out
}

/** Resolución de la simulación por dispositivo (SIZE² partículas). */
export function gpgpuSize(): number {
  if (typeof window === 'undefined') return 192
  const w = window.innerWidth
  return w < 640 ? 96 : w < 1100 ? 144 : 192 // 9k / 20k / 36k (fluidez sin perder densidad visible)
}

function orbXYZ(n: number, R: number): Float32Array {
  const geo = new THREE.IcosahedronGeometry(R, 6)
  const mesh = new THREE.Mesh(geo)
  const sampler = new MeshSurfaceSampler(mesh).build()
  const out = new Float32Array(n * 3)
  const p = new THREE.Vector3()
  const nrm = new THREE.Vector3()
  for (let i = 0; i < n; i++) {
    sampler.sample(p, nrm)
    const noise = Math.sin(p.x * 4.1 + p.y * 5.3) * Math.cos(p.z * 4.7) * 0.09 * R
    p.addScaledVector(nrm, noise)
    out[i * 3] = p.x
    out[i * 3 + 1] = p.y
    out[i * 3 + 2] = p.z * 0.8
  }
  geo.dispose()
  return out
}

function textXYZ(text: string, n: number, half: number, seeds: Float32Array): Float32Array {
  const out = new Float32Array(n * 3)
  if (typeof document === 'undefined') return out
  const W = 440, H = 220
  const c = document.createElement('canvas'); c.width = W; c.height = H
  const g = c.getContext('2d')!
  g.fillStyle = 'white'; g.textAlign = 'center'; g.textBaseline = 'middle'
  g.font = '800 172px "Space Grotesk", system-ui, sans-serif'
  g.fillText(text, W / 2, H / 2 + 8)
  const d = g.getImageData(0, 0, W, H).data
  const px: number[] = []
  for (let y = 0; y < H; y += 1) for (let x = 0; x < W; x += 1) if (d[(y * W + x) * 4 + 3]! > 128) px.push(x, y)
  const m = px.length / 2 || 1
  const sx = (half * 2) / W
  for (let i = 0; i < n; i++) {
    const j = (i % m) * 2
    out[i * 3] = (px[j]! - W / 2) * sx
    out[i * 3 + 1] = -(px[j + 1]! - H / 2) * sx
    out[i * 3 + 2] = (seeds[i]! - 0.5) * 0.5 // grosor
  }
  return out
}

function fieldXYZ(n: number, half: number): Float32Array {
  const out = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2
    const r = (0.2 + Math.pow(Math.random(), 0.5) * 1.8) * half
    out[i * 3] = Math.cos(a) * r * 1.4
    out[i * 3 + 1] = Math.sin(a) * r * 0.95
    out[i * 3 + 2] = (Math.random() - 0.5) * 2.2
  }
  return out
}

/**
 * Muestrea la SILUETA de una imagen del logo (alfa) y la mapea al MISMO plano
 * mundo que dibuja el plano del logo 3D. Devuelve el target RGBA listo para la
 * textura `uTarget`. La ecuación de mapeo es idéntica a la del plano → alineación
 * milimétrica garantizada por construcción.
 */
export function sampleLogoSilhouette(
  img: CanvasImageSource & { width?: number; height?: number; naturalWidth?: number; naturalHeight?: number },
  size: number,
  seeds: Float32Array
): Float32Array | null {
  if (typeof document === 'undefined') return null
  const W = (img.naturalWidth ?? img.width) as number
  const H = (img.naturalHeight ?? img.height) as number
  if (!W || !H) return null
  const c = document.createElement('canvas'); c.width = W; c.height = H
  const g = c.getContext('2d')!
  g.drawImage(img, 0, 0)
  const d = g.getImageData(0, 0, W, H).data
  const px: number[] = []
  for (let y = 0; y < H; y += 1) for (let x = 0; x < W; x += 1) if (d[(y * W + x) * 4 + 3]! > 90) px.push(x, y)
  const m = px.length / 2 || 1
  const count = size * size
  const sx = LOGO_WORLD_W / W // misma escala en X e Y → aspecto exacto del logo
  const xyz = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    // distribuye las partículas por TODA la silueta (no solo los primeros m
    // píxeles): con más píxeles que partículas, i%m dejaba medio logo vacío.
    const j = (Math.floor((i / count) * m) % m) * 2
    xyz[i * 3] = (px[j]! - W / 2) * sx
    xyz[i * 3 + 1] = -(px[j + 1]! - H / 2) * sx
    xyz[i * 3 + 2] = (seeds[i]! - 0.5) * 0.32 // grosor volumétrico del polvo
  }
  return packRGBA(size, xyz, seeds, count)
}

/** Empaqueta xyz(+seed) en RGBA del tamaño SIZE²; texeles sin partícula se ocultan lejos. */
function packRGBA(size: number, xyz: Float32Array, seeds: Float32Array, count: number): Float32Array {
  const out = new Float32Array(size * size * 4)
  for (let i = 0; i < size * size; i++) {
    if (i < count) {
      out[i * 4] = xyz[i * 3]!
      out[i * 4 + 1] = xyz[i * 3 + 1]!
      out[i * 4 + 2] = xyz[i * 3 + 2]!
      out[i * 4 + 3] = seeds[i]!
    } else {
      out[i * 4] = 9999; out[i * 4 + 1] = 9999; out[i * 4 + 2] = 9999; out[i * 4 + 3] = 0
    }
  }
  return out
}

export type GpgpuData = {
  size: number
  count: number
  init: Float32Array
  orb: Float32Array
  g1: Float32Array
  field: Float32Array
  colors: Float32Array // RGB por partícula (count·3)
  refs: Float32Array // uv por partícula (count·2)
  seeds: Float32Array // count
}

export function buildGpgpuData(size: number): GpgpuData {
  const count = size * size
  const seeds = new Float32Array(count)
  for (let i = 0; i < count; i++) seeds[i] = Math.random()

  const orb = orbXYZ(count, HERO_HALF * 0.98)
  const g1 = textXYZ('G1', count, HERO_HALF * 1.05, seeds)
  const field = fieldXYZ(count, HERO_HALF)

  const colors = new Float32Array(count * 3)
  const refs = new Float32Array(count * 2)
  const tmp = new THREE.Color()
  for (let i = 0; i < count; i++) {
    const ang = Math.atan2(orb[i * 3 + 1]!, orb[i * 3]!)
    rampG1((ang + Math.PI) / (Math.PI * 2), tmp)
    colors[i * 3] = tmp.r; colors[i * 3 + 1] = tmp.g; colors[i * 3 + 2] = tmp.b
    refs[i * 2] = (i % size) / size
    refs[i * 2 + 1] = Math.floor(i / size) / size
  }

  return {
    size,
    count,
    init: packRGBA(size, field, seeds, count),
    orb: packRGBA(size, orb, seeds, count),
    g1: packRGBA(size, g1, seeds, count),
    field: packRGBA(size, field, seeds, count),
    colors,
    refs,
    seeds,
  }
}
