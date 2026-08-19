'use client'

import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { EMISSION, INK } from '@/lib/design/tokens'

/**
 * EL EMISOR — de donde sale la energia que alimenta la pila.
 *
 * PIEZA APARTE porque hace un trabajo que ni el cristal ni la marca pueden
 * hacer: CONECTAR. Sin el, el nucleo flota sobre la maquina sin relacion con
 * ella y se lee como un adorno colocado encima. Con el, la columna nace de un
 * sitio concreto y toda la pila cuelga de ese punto.
 *
 * Son tres cosas y ninguna sobra:
 *   el punto      la fuente: el pixel mas brillante de la escena
 *   el cono       el haz abriendose hacia abajo, hacia el primer anillo
 *   la luz real   un `pointLight` que ILUMINA de verdad el cristal y los
 *                 anillos de arriba. Sin el, el resplandor seria pintura: se
 *                 veria brillar sin que nada a su alrededor se entere.
 */
export default function GenesisEmitter({
  radio,
  alcance,
  activo,
}: {
  radio: number
  /** Cuanto baja el haz hasta el primer anillo. */
  alcance: number
  activo: boolean
}) {
  const punto = useRef<THREE.Mesh>(null)
  const cono = useRef<THREE.Mesh>(null)

  useFrame((estado) => {
    if (!activo) return
    const t = estado.clock.elapsedTime
    // respiracion a 1,6 s: el unico elemento rapido de la maquina, porque es el
    // que marca que hay corriente
    const p = 1 + Math.sin(t * (Math.PI * 2) / 1.6) * 0.22
    if (punto.current) punto.current.scale.setScalar(p)
    if (cono.current) {
      const m = cono.current.material as THREE.MeshBasicMaterial
      m.opacity = 0.16 + Math.sin(t * (Math.PI * 2) / 4) * 0.06
    }
  })

  return (
    <group name="emisor" position={[0, -radio * 0.86, 0]}>
      <mesh ref={punto}>
        <sphereGeometry args={[radio * 0.1, 16, 16]} />
        <meshBasicMaterial color={INK.base} toneMapped={false} />
      </mesh>

      {/* el haz que se abre hacia el primer anillo */}
      <mesh ref={cono} position={[0, -alcance / 2, 0]}>
        <coneGeometry args={[radio * 0.5, alcance, 24, 1, true]} />
        <meshBasicMaterial
          color={EMISSION.cyan}
          transparent
          opacity={0.16}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      <pointLight color={EMISSION.cyan} intensity={14} distance={9} decay={2} />
    </group>
  )
}
