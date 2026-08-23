'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { G1 } from '@/lib/design/g1'

/**
 * ACTO 0 — EL CIELO. Campo ambiente de partículas de distintos tamaños y foco
 * (sensación de profundidad / depth-of-field) con deriva orgánica tipo curl.
 * Las cercanas se ven grandes y suaves (bokeh); las lejanas, pequeñas y tenues.
 * Es la apertura del relato: de aquí nacen los orbes.
 */

const C_VIOLET = new THREE.Color(G1.violet)
const C_CYAN = new THREE.Color(G1.cyan)
const C_AMBER = new THREE.Color(G1.amber)
const C_MAGENTA = new THREE.Color(G1.magenta)
const C_BLUE = new THREE.Color(G1.blue)
const PALETTE = [C_VIOLET, C_CYAN, C_AMBER, C_MAGENTA, C_BLUE]

/** Sprite bokeh: núcleo brillante + halo muy suave → grande = fuera de foco. */
function makeBokeh(): THREE.CanvasTexture {
  const S = 64
  const c = document.createElement('canvas'); c.width = S; c.height = S
  const g = c.getContext('2d')!
  const rg = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2)
  rg.addColorStop(0, 'rgba(255,255,255,1)')
  rg.addColorStop(0.25, 'rgba(255,255,255,0.55)')
  rg.addColorStop(0.6, 'rgba(255,255,255,0.12)')
  rg.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = rg
  g.fillRect(0, 0, S, S)
  const t = new THREE.CanvasTexture(c); t.needsUpdate = true; return t
}

export function G1ParticleSky({
  count = 7000,
  parallax = true,
  progressRef,
}: {
  count?: number
  parallax?: boolean
  /** Si se pasa, el cielo se atenúa detrás de los orbes y vuelve en la disolución. */
  progressRef?: { current: number }
}) {
  const pts = useRef<THREE.Points>(null)
  const grp = useRef<THREE.Group>(null)
  const sprite = useMemo(() => (typeof document !== 'undefined' ? makeBokeh() : null), [])
  useEffect(() => () => sprite?.dispose(), [sprite])

  const { positions, base, colors, seeds } = useMemo(() => {
    const base = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const seeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      base[i * 3] = (Math.random() - 0.5) * 14 // x: -7..7
      base[i * 3 + 1] = (Math.random() - 0.5) * 9 // y: -4.5..4.5
      base[i * 3 + 2] = -7 + Math.random() * 8.5 // z: -7..1.5 (profundidad)
      const col = PALETTE[Math.floor(Math.random() * PALETTE.length)]!
      // mezcla ligera hacia blanco para variedad de "temperatura"
      const w = Math.pow(Math.random(), 3) * 0.5
      colors[i * 3] = col.r + (1 - col.r) * w
      colors[i * 3 + 1] = col.g + (1 - col.g) * w
      colors[i * 3 + 2] = col.b + (1 - col.b) * w
      seeds[i] = Math.random()
    }
    return { positions: base.slice(), base, colors, seeds }
  }, [count])

  const uTime = useRef({ value: 0 })
  const onBeforeCompile = useMemo(
    () => (shader: THREE.WebGLProgramParametersWithUniforms) => {
      shader.uniforms.uTime = uTime.current
      shader.vertexShader =
        'attribute float aSeed;\nattribute float aScale;\nvarying float vTw;\nvarying float vDepth;\nuniform float uTime;\n' +
        shader.vertexShader.replace(
          'gl_PointSize = size;',
          'float tw = 0.55 + 0.45 * sin(uTime * 1.6 + aSeed * 6.2831853);\n' +
            'vTw = tw;\n' +
            'vDepth = clamp((mvPosition.z + 8.0) / 9.0, 0.0, 1.0);\n' +
            'gl_PointSize = size * aScale * (0.6 + 0.6 * tw);'
        )
      shader.fragmentShader =
        'varying float vTw;\nvarying float vDepth;\n' +
        shader.fragmentShader.replace(
          '#include <color_fragment>',
          '#include <color_fragment>\n  diffuseColor.rgb *= (0.55 + 0.75 * vTw) * (0.35 + 0.85 * vDepth);'
        )
    },
    []
  )

  const scales = useMemo(() => {
    const s = new Float32Array(count)
    for (let i = 0; i < count; i++) s[i] = 0.4 + Math.pow(Math.random(), 3) * 3.4 // cola: pocas grandes (bokeh)
    return s
  }, [count])

  useFrame((s, dt) => {
    const geo = pts.current?.geometry
    if (geo) {
      const arr = (geo.attributes.position as THREE.BufferAttribute).array as Float32Array
      const t = s.clock.elapsedTime
      for (let i = 0; i < count; i++) {
        const b = i * 3
        const ph = seeds[i]! * 6.2831853
        arr[b] = base[b]! + Math.sin(t * 0.18 + ph) * 0.32
        arr[b + 1] = base[b + 1]! + Math.cos(t * 0.15 + ph * 1.3) * 0.28
        arr[b + 2] = base[b + 2]! + Math.sin(t * 0.12 + ph * 0.7) * 0.22
      }
      ;(geo.attributes.position as THREE.BufferAttribute).needsUpdate = true
    }
    uTime.current.value = s.clock.elapsedTime
    // fade por scroll: protagonista en el cielo (Acto 0) y la disolución; tenue detrás de los orbes
    const skyMat = pts.current?.material as THREE.PointsMaterial | undefined
    if (skyMat && progressRef) {
      const p = progressRef.current
      const target = p < 0.12 ? 0.9 : p > 0.84 ? 0.7 : 0.24
      skyMat.opacity += (target - skyMat.opacity) * (1 - Math.pow(0.03, dt))
    }
    if (grp.current && parallax) {
      grp.current.rotation.y += (s.pointer.x * 0.06 - grp.current.rotation.y) * 0.03
      grp.current.rotation.x += (-s.pointer.y * 0.04 - grp.current.rotation.x) * 0.03
    }
  })

  return (
    <group ref={grp}>
      <points ref={pts}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} count={count} />
          <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} count={count} />
          <bufferAttribute attach="attributes-aScale" args={[scales, 1]} count={count} />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          map={sprite ?? undefined}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0.9}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          onBeforeCompile={onBeforeCompile}
        />
      </points>
    </group>
  )
}
