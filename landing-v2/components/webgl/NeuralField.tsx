'use client'

import { EMISSION } from '@/lib/design/tokens'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const COUNT = 150
const CONNECTION_DISTANCE = 1.5
const SPEED = 0.001

export default function NeuralField() {
  const pointsRef = useRef<THREE.Points>(null!)
  const linesRef  = useRef<THREE.LineSegments>(null!)

  // Textura circular suave — elimina los cuadrados pixelados
  const circleTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width  = 32
    canvas.height = 32
    const ctx = canvas.getContext('2d')!
    // Gradiente radial para bordes suaves
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 14)
    grad.addColorStop(0,   'rgba(255,255,255,1)')
    grad.addColorStop(0.6, 'rgba(255,255,255,0.8)')
    grad.addColorStop(1,   'rgba(255,255,255,0)')
    ctx.beginPath()
    ctx.arc(16, 16, 14, 0, Math.PI * 2)
    ctx.fillStyle = grad
    ctx.fill()
    return new THREE.CanvasTexture(canvas)
  }, [])

  const { positions, velocities, linePositions } = useMemo(() => {
    const positions     = new Float32Array(COUNT * 3)
    const velocities    = new Float32Array(COUNT * 3)
    const linePositions = new Float32Array(COUNT * COUNT * 6)

    for (let i = 0; i < COUNT; i++) {
      positions[i*3]   = (Math.random() - 0.5) * 12
      positions[i*3+1] = (Math.random() - 0.5) * 8
      positions[i*3+2] = (Math.random() - 0.5) * 6
      velocities[i*3]   = (Math.random() - 0.5) * SPEED
      velocities[i*3+1] = (Math.random() - 0.5) * SPEED
      velocities[i*3+2] = (Math.random() - 0.5) * SPEED * 0.5
    }
    return { positions, velocities, linePositions }
  }, [])

  const pointsGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geo
  }, [positions])

  const linesGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
    return geo
  }, [linePositions])

  useFrame(() => {
    const pts = pointsGeo.attributes.position.array as Float32Array

    for (let i = 0; i < COUNT; i++) {
      pts[i*3]   += velocities[i*3]
      pts[i*3+1] += velocities[i*3+1]
      pts[i*3+2] += velocities[i*3+2]
      if (Math.abs(pts[i*3])   > 6) velocities[i*3]   *= -1
      if (Math.abs(pts[i*3+1]) > 4) velocities[i*3+1] *= -1
      if (Math.abs(pts[i*3+2]) > 3) velocities[i*3+2] *= -1
    }
    pointsGeo.attributes.position.needsUpdate = true

    let lineIdx = 0
    const lp = linesGeo.attributes.position.array as Float32Array
    for (let i = 0; i < COUNT; i++) {
      for (let j = i + 1; j < COUNT; j++) {
        const dx = pts[i*3]   - pts[j*3]
        const dy = pts[i*3+1] - pts[j*3+1]
        const dz = pts[i*3+2] - pts[j*3+2]
        if (Math.sqrt(dx*dx + dy*dy + dz*dz) < CONNECTION_DISTANCE) {
          lp[lineIdx++] = pts[i*3];   lp[lineIdx++] = pts[i*3+1]; lp[lineIdx++] = pts[i*3+2]
          lp[lineIdx++] = pts[j*3];   lp[lineIdx++] = pts[j*3+1]; lp[lineIdx++] = pts[j*3+2]
        }
      }
    }
    linesGeo.attributes.position.needsUpdate = true
    linesGeo.setDrawRange(0, lineIdx / 3)
  })

  return (
    <group>
      {/* Puntos circulares suaves */}
      <points ref={pointsRef} geometry={pointsGeo}>
        <pointsMaterial
          color={EMISSION.cyan}
          size={0.025}          // tamaño uniforme
          sizeAttenuation
          transparent
          opacity={0.55}
          map={circleTexture}
          alphaTest={0.05}      // descarta esquinas transparentes → círculos perfectos
          depthWrite={false}
        />
      </points>

      {/* Líneas etéreas — casi invisibles, atmosféricas */}
      <lineSegments ref={linesRef} geometry={linesGeo}>
        <lineBasicMaterial
          color={EMISSION.cyan}
          transparent
          opacity={0.06}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  )
}
