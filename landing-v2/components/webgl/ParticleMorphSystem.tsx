'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { buildAllTargets, PARTICLE_COUNT } from '@/lib/particleTargets'

interface ParticleMorphSystemProps {
  /** Ref compartido con el scroll hook — se lee cada frame, sin re-renders */
  sectionIndexRef: React.MutableRefObject<number>
  scrollProgressRef: React.MutableRefObject<number>
}

// Velocidad de lerp base — más alto = más rápido pero menos suave
const LERP_SPEED = 0.032

// Textura circular suave para los puntos
function makeCircleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 64; canvas.height = 64
  const ctx = canvas.getContext('2d')!
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 28)
  grad.addColorStop(0,   'rgba(255,255,255,1)')
  grad.addColorStop(0.5, 'rgba(255,255,255,0.85)')
  grad.addColorStop(1,   'rgba(255,255,255,0)')
  ctx.beginPath()
  ctx.arc(32, 32, 28, 0, Math.PI * 2)
  ctx.fillStyle = grad
  ctx.fill()
  return new THREE.CanvasTexture(canvas)
}

export default function ParticleMorphSystem({
  sectionIndexRef,
  scrollProgressRef,
}: ParticleMorphSystemProps) {
  const pointsRef = useRef<THREE.Points>(null!)

  // Generar todos los targets una sola vez (en el cliente)
  const allTargets = useMemo(() => buildAllTargets(), [])

  // Posiciones actuales — interpoladas en useFrame
  const currentPositions = useMemo(
    () => new Float32Array(allTargets[0]),  // clonar sección 0 como estado inicial
    [allTargets]
  )

  // Textura circular
  const circleTexture = useMemo(() => makeCircleTexture(), [])

  // Vertex colors: 50% violet #8B5CF6 · 30% magenta #E91E8B · 20% cyan #00E5FF
  const vertexColors = useMemo(() => {
    const colors = new Float32Array(PARTICLE_COUNT * 3)
    const palette = [
      // 50% violet
      { r: 0.545, g: 0.361, b: 0.965, weight: 0.50 },
      // 30% magenta
      { r: 0.914, g: 0.118, b: 0.545, weight: 0.80 },
      // 20% cyan
      { r: 0.0,   g: 0.898, b: 1.0,   weight: 1.00 },
    ]
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const r = Math.random()
      const c = r < 0.50 ? palette[0] : r < 0.80 ? palette[1] : palette[2]
      colors[i*3]   = c.r
      colors[i*3+1] = c.g
      colors[i*3+2] = c.b
    }
    return colors
  }, [])

  // BufferGeometry con posición + color
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3))
    geo.setAttribute('color',    new THREE.BufferAttribute(vertexColors, 3))
    return geo
  }, [currentPositions, vertexColors])

  // Índice de sección anterior para detectar cambios
  const prevSectionRef = useRef(0)

  useFrame(({ clock }) => {
    if (!pointsRef.current) return

    const sectionIdx = sectionIndexRef.current
    const target     = allTargets[Math.min(sectionIdx, allTargets.length - 1)]
    const pos        = geometry.attributes.position.array as Float32Array

    // Velocidad de lerp adaptativa: más rápido en transición, más lento al llegar
    // Detectar si acaba de cambiar de sección
    if (prevSectionRef.current !== sectionIdx) {
      prevSectionRef.current = sectionIdx
    }

    // Lerp cada partícula hacia el target
    let maxDelta = 0
    for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
      const delta = (target[i] - pos[i]) * LERP_SPEED
      pos[i] += delta
      if (Math.abs(delta) > maxDelta) maxDelta = Math.abs(delta)
    }

    geometry.attributes.position.needsUpdate = true

    // Breathing sutil en escala — solo en hero (sección 0)
    const t = clock.getElapsedTime()
    if (sectionIdx === 0) {
      const breathe = 1 + Math.sin(t * 0.35) * 0.02
      pointsRef.current.scale.setScalar(breathe)
    } else {
      // Suavemente volver a escala 1
      const s = pointsRef.current.scale.x
      pointsRef.current.scale.setScalar(s + (1 - s) * 0.05)
    }

    // Rotación muy lenta — solo en hero
    if (sectionIdx === 0) {
      pointsRef.current.rotation.y += 0.0006
      pointsRef.current.rotation.x += 0.0002
    } else {
      // Frenar la rotación
      pointsRef.current.rotation.y *= 0.995
      pointsRef.current.rotation.x *= 0.995
    }
  })

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.028}
        sizeAttenuation
        transparent
        opacity={0.80}
        map={circleTexture}
        alphaTest={0.05}
        vertexColors={true}
        depthWrite={false}
      />
    </points>
  )
}
