'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { G1 } from '@/lib/design/g1'

/**
 * G1 GLASS CRYSTAL — el «vidrio real» de la variante B (máximo GPU premium).
 * Un cristal facetado con `MeshTransmissionMaterial` (refracción + aberración
 * cromática) que refracta las partículas de detrás. Late hacia adentro durante
 * los holds sólidos (escala↑) y se retrae en las transiciones. Luces de marca
 * propias para que el cristal capte color. El logo legible lo aporta el
 * `GlassLogo` HTML encima (B = cristal 3D + logo legible).
 */
export function G1GlassCrystal({ active }: { active: 'genesis' | 'g1' | null }) {
  const ref = useRef<THREE.Mesh>(null)
  const tmp = useMemo(() => new THREE.Vector3(), [])
  useFrame((_s, dt) => {
    const m = ref.current
    if (!m) return
    const target = active ? 0.92 : 0.0001
    const k = 1 - Math.pow(0.025, dt)
    tmp.setScalar(target)
    m.scale.lerp(tmp, k)
    m.rotation.y += dt * 0.28
    m.rotation.x += dt * 0.12
  })
  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[3, 3, 4]} intensity={18} color={G1.violet} />
      <pointLight position={[-3, -2, 3]} intensity={14} color={G1.cyan} />
      <pointLight position={[0, 2, 5]} intensity={10} color={G1.amber} />
      <Float speed={1.3} rotationIntensity={0.35} floatIntensity={0.55}>
        <mesh ref={ref} scale={0.0001}>
          <icosahedronGeometry args={[0.82, 0]} />
          <MeshTransmissionMaterial
            transmission={1}
            thickness={0.55}
            roughness={0.06}
            ior={1.35}
            chromaticAberration={0.42}
            anisotropicBlur={0.2}
            distortion={0.25}
            distortionScale={0.35}
            temporalDistortion={0.2}
            color={new THREE.Color(G1.cyan)}
            attenuationColor={new THREE.Color(G1.violet)}
            attenuationDistance={1.2}
          />
        </mesh>
      </Float>
    </>
  )
}
