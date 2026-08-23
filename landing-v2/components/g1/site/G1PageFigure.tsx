'use client'

import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import { G1 } from '@/lib/design/g1'

/**
 * G1 PAGE FIGURE — la MASA de partículas con forma, una por página (Capa 2). Es
 * el hero-motif: aparece como fondo del encabezado, sobre el tema. Cada variante
 * es una figura distinta (fusión, constelación, flujo, enjambre, retícula).
 * CPU Points ligeros (no el GPGPU pesado del hero) + sprite cristal + bloom.
 */
export type FigureVariant = 'fuse' | 'constellation' | 'flow' | 'swarm' | 'grid'

const C = {
  violet: new THREE.Color(G1.violet),
  cyan: new THREE.Color(G1.cyan),
  amber: new THREE.Color(G1.amber),
  magenta: new THREE.Color(G1.magenta),
  blue: new THREE.Color(G1.blue),
}

function makeSprite(): THREE.CanvasTexture {
  const S = 64
  const c = document.createElement('canvas'); c.width = S; c.height = S
  const g = c.getContext('2d')!
  const rg = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2)
  rg.addColorStop(0, 'rgba(255,255,255,1)')
  rg.addColorStop(0.25, 'rgba(255,255,255,0.7)')
  rg.addColorStop(0.55, 'rgba(255,255,255,0.14)')
  rg.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = rg; g.fillRect(0, 0, S, S)
  const t = new THREE.CanvasTexture(c); t.needsUpdate = true; return t
}

type Built = {
  positions: Float32Array
  colors: Float32Array
  base: Float32Array
  seeds: Float32Array
  lines: Float32Array | null
}

function build(variant: FigureVariant, count: number): Built {
  const base = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const seeds = new Float32Array(count)
  let lines: Float32Array | null = null
  const tmp = new THREE.Color()

  const setCol = (i: number, col: THREE.Color) => { colors[i * 3] = col.r; colors[i * 3 + 1] = col.g; colors[i * 3 + 2] = col.b }

  if (variant === 'fuse') {
    // 3 masas (violeta/cian/ámbar) alrededor del centro
    const cols = [C.violet, C.cyan, C.amber]
    const centers = [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((a) => [Math.cos(a) * 1.5, Math.sin(a) * 1.5])
    for (let i = 0; i < count; i++) {
      const g = i % 3
      const [cx, cy] = centers[g]!
      const r = Math.pow(Math.random(), 0.6) * 0.7
      const a = Math.random() * Math.PI * 2
      const z = (Math.random() - 0.5) * 0.6
      base[i * 3] = cx + Math.cos(a) * r
      base[i * 3 + 1] = cy + Math.sin(a) * r
      base[i * 3 + 2] = z
      setCol(i, cols[g]!)
      seeds[i] = Math.random()
    }
  } else if (variant === 'constellation') {
    // nodos + puntos + líneas de conexión
    const N = Math.min(46, Math.floor(count / 40))
    const nodes: number[][] = []
    for (let n = 0; n < N; n++) {
      const a = Math.random() * Math.PI * 2
      const r = 0.4 + Math.pow(Math.random(), 0.7) * 1.8
      nodes.push([Math.cos(a) * r * 1.4, Math.sin(a) * r * 0.9, (Math.random() - 0.5) * 0.8])
    }
    for (let i = 0; i < count; i++) {
      const node = nodes[i % N]!
      const near = i < N
      const jr = near ? 0 : 0.05 + Math.random() * 0.18
      const a = Math.random() * Math.PI * 2
      base[i * 3] = node[0]! + Math.cos(a) * jr
      base[i * 3 + 1] = node[1]! + Math.sin(a) * jr
      base[i * 3 + 2] = node[2]! + (Math.random() - 0.5) * 0.05
      tmp.copy(C.cyan).lerp(C.violet, (node[0]! + 2.5) / 5)
      setCol(i, tmp)
      seeds[i] = Math.random()
    }
    // líneas entre nodos cercanos
    const segs: number[] = []
    for (let a = 0; a < N; a++) for (let b = a + 1; b < N; b++) {
      const dx = nodes[a]![0]! - nodes[b]![0]!, dy = nodes[a]![1]! - nodes[b]![1]!, dz = nodes[a]![2]! - nodes[b]![2]!
      if (Math.hypot(dx, dy, dz) < 0.95) segs.push(...nodes[a]!, ...nodes[b]!)
    }
    lines = new Float32Array(segs)
  } else if (variant === 'flow') {
    // 3 bandas horizontales (los 3 pasos) que fluyen
    const cols = [C.violet, C.cyan, C.amber]
    for (let i = 0; i < count; i++) {
      const band = i % 3
      base[i * 3] = (Math.random() - 0.5) * 5
      base[i * 3 + 1] = (band - 1) * 0.8 + (Math.random() - 0.5) * 0.3
      base[i * 3 + 2] = (Math.random() - 0.5) * 0.5
      setCol(i, cols[band]!)
      seeds[i] = Math.random()
    }
  } else if (variant === 'swarm') {
    // enjambre cohesionado alrededor del centro
    for (let i = 0; i < count; i++) {
      const r = Math.pow(Math.random(), 0.5) * 1.5
      const a = Math.random() * Math.PI * 2
      const p = Math.acos(2 * Math.random() - 1)
      base[i * 3] = Math.cos(a) * Math.sin(p) * r * 1.3
      base[i * 3 + 1] = Math.sin(a) * Math.sin(p) * r * 0.9
      base[i * 3 + 2] = Math.cos(p) * r * 0.6
      tmp.copy(C.amber).lerp(C.magenta, Math.random())
      setCol(i, tmp)
      seeds[i] = Math.random()
    }
  } else {
    // grid — retícula calma en perspectiva (techo/ola)
    const cols = Math.ceil(Math.sqrt(count * 1.7))
    const rows = Math.ceil(count / cols)
    let idx = 0
    for (let y = 0; y < rows && idx < count; y++) for (let x = 0; x < cols && idx < count; x++, idx++) {
      base[idx * 3] = (x / (cols - 1) - 0.5) * 5
      base[idx * 3 + 1] = (y / (rows - 1) - 0.5) * 2.4
      base[idx * 3 + 2] = 0
      tmp.copy(C.cyan).lerp(C.blue, y / rows)
      setCol(idx, tmp)
      seeds[idx] = Math.random()
    }
  }

  return { positions: base.slice(), colors, base, seeds, lines }
}

function FigureParticles({ variant, count }: { variant: FigureVariant; count: number }) {
  const pts = useRef<THREE.Points>(null)
  const grp = useRef<THREE.Group>(null)
  const sprite = useMemo(() => (typeof document !== 'undefined' ? makeSprite() : null), [])
  useEffect(() => () => sprite?.dispose(), [sprite])
  const { positions, colors, base, seeds, lines } = useMemo(() => build(variant, count), [variant, count])

  useFrame((s, dt) => {
    const t = s.clock.elapsedTime
    const geo = pts.current?.geometry
    if (geo) {
      const arr = (geo.attributes.position as THREE.BufferAttribute).array as Float32Array
      for (let i = 0; i < count; i++) {
        const b = i * 3
        const sd = seeds[i]!
        if (variant === 'fuse') {
          // convergen y se separan (fusión que respira)
          const k = 0.5 + 0.5 * Math.sin(t * 0.5)
          arr[b] = base[b]! * (1 - k * 0.72)
          arr[b + 1] = base[b + 1]! * (1 - k * 0.72)
          arr[b + 2] = base[b + 2]! + Math.sin(t + sd * 6.28) * 0.05
        } else if (variant === 'flow') {
          // fluye a la derecha y envuelve
          let x = base[b]! + ((t * 0.5 + sd * 5) % 5)
          if (x > 2.5) x -= 5
          arr[b] = x
          arr[b + 1] = base[b + 1]! + Math.sin(t * 0.8 + x) * 0.06
          arr[b + 2] = base[b + 2]!
        } else if (variant === 'swarm') {
          const ph = sd * 6.28
          arr[b] = base[b]! + Math.sin(t * 0.6 + ph) * 0.12
          arr[b + 1] = base[b + 1]! + Math.cos(t * 0.5 + ph * 1.3) * 0.12
          arr[b + 2] = base[b + 2]! + Math.sin(t * 0.4 + ph * 0.7) * 0.1
        } else if (variant === 'grid') {
          // ola suave en z (techo)
          arr[b] = base[b]!
          arr[b + 1] = base[b + 1]!
          arr[b + 2] = Math.sin(base[b]! * 1.1 + t * 0.7) * 0.22 + Math.cos(base[b + 1]! * 1.4 + t * 0.5) * 0.12
        } else {
          // constellation — leve respiración
          arr[b] = base[b]! + Math.sin(t * 0.4 + sd * 6.28) * 0.03
          arr[b + 1] = base[b + 1]! + Math.cos(t * 0.35 + sd * 6.28) * 0.03
          arr[b + 2] = base[b + 2]!
        }
      }
      ;(geo.attributes.position as THREE.BufferAttribute).needsUpdate = true
    }
    if (grp.current) {
      const spin = variant === 'constellation' || variant === 'swarm' ? 0.05 : variant === 'grid' ? 0 : 0.02
      grp.current.rotation.y = Math.sin(t * 0.15) * 0.25 + t * spin * 0.2
      grp.current.rotation.x = variant === 'grid' ? -0.5 : Math.sin(t * 0.12) * 0.08
    }
  })

  return (
    <group ref={grp}>
      <points ref={pts}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} count={count} />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          map={sprite ?? undefined}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0.9}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      {lines ? (
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[lines, 3]} count={lines.length / 3} />
          </bufferGeometry>
          <lineBasicMaterial color={G1.cyan} transparent opacity={0.14} blending={THREE.AdditiveBlending} depthWrite={false} />
        </lineSegments>
      ) : null}
    </group>
  )
}

function figCount(variant: FigureVariant): number {
  if (typeof window === 'undefined') return 2600
  const w = window.innerWidth
  const base = w < 640 ? 1600 : w < 1100 ? 2600 : 3600
  return variant === 'grid' ? Math.floor(base * 0.7) : base
}

export function G1PageFigure({ variant, className }: { variant: FigureVariant; className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 ${className ?? ''}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 55 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <FigureParticles variant={variant} count={figCount(variant)} />
        <EffectComposer>
          <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.45} intensity={0.5} blendFunction={BlendFunction.ADD} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
