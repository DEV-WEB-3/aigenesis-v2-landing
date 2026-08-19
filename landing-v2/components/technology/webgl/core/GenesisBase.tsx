'use client'

import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { EMISSION } from '@/lib/design/tokens'

/**
 * ANILLO DE ENERGIA Y DISCO BASE — la plataforma sobre la que flota el cubo.
 *
 * Los pide la hoja de componentes por su nombre («Anillo de energia», «Disco
 * base») y con sus proporciones: anillo 1,6x el ancho del cubo, disco 2,0x,
 * altura del anillo 0,2x.
 *
 * QUE APORTAN, que no es decoracion: el cubo suspendido sin nada debajo no
 * tiene DONDE estar. Estas dos piezas le dan cota y suelo — el anillo dice a que
 * altura flota y el disco dice sobre que. Es la misma funcion que cumple la
 * sombra de un objeto real, resuelta con luz en vez de con sombra, que es lo que
 * corresponde a una pieza que no se apoya en nada.
 */
export default function GenesisBase({
  radio,
  activo,
}: {
  radio: number
  activo: boolean
}) {
  const aro = useRef<THREE.Mesh>(null)
  const disco = useRef<THREE.Mesh>(null)

  useFrame((estado) => {
    if (!activo) return
    const t = estado.clock.elapsedTime
    // el aro gira despacio y el disco respira: dos ritmos, no uno, para que la
    // base no se lea como una sola pieza pegada al cubo
    if (aro.current) aro.current.rotation.z = t * 0.12
    if (disco.current) {
      const m = disco.current.material as THREE.MeshBasicMaterial
      m.opacity = 0.13 + Math.sin((t / 4) * Math.PI * 2) * 0.05
    }
  })

  return (
    <group name="base-del-nucleo" position={[0, -radio * 1.24, 0]}>
      {/* disco base: 2,0x el ancho del cubo */}
      <mesh ref={disco} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radio * 2, 64]} />
        <meshBasicMaterial
          color={EMISSION.violetHi}
          transparent
          opacity={0.13}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* anillo de energia: 1,6x, y es el que marca la cota */}
      <mesh ref={aro} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[radio * 1.42, radio * 1.6, 64]} />
        <meshBasicMaterial
          color={EMISSION.cyan}
          transparent
          opacity={0.55}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* aro interior fino: el segundo escalon de la base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[radio * 0.86, radio * 0.93, 48]} />
        <meshBasicMaterial
          color={EMISSION.magenta}
          transparent
          opacity={0.65}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}
