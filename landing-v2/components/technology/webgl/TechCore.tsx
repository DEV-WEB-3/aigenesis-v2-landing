'use client'

import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { EMISSION, INK, VOID } from '@/lib/design/tokens'
import { NUCLEO_Y, NUCLEO_R, texturaMarca, texturaDisco } from '@/lib/technology/techMachine3d'

/**
 * EL GENESIS CORE — cristal hexagonal con la marca dentro.
 *
 * POR QUE UN PRISMA Y NO UN HEXAGONO PLANO
 * ----------------------------------------
 * La referencia deja ver el CANTO del hexagono: hay una pieza con fondo, no una
 * silueta. Un poligono plano con un borde brillante se delata en cuanto tiene
 * algo detras, porque no ocluye nada. El prisma ocluye, recoge luz por las
 * caras laterales y proyecta el resplandor sobre los anillos de abajo.
 *
 * COMO SE TUMBA HACIA LA CAMARA, y por que NO con un giro en Z.
 *
 * El eje del cilindro nace en +Y. Para que el hexagono mire de frente hay que
 * llevarlo a +Z, y eso lo hace un giro de 90° en X y nada mas.
 *
 * El primer intento fue `[PI/2, 0, PI/2]`, pensando que el giro en Z orientaria
 * el hexagono. No: en el orden XYZ de three la Z se aplica PRIMERO y sobre el
 * mundo, asi que arrastra el eje a −X y el prisma acaba tumbado de lado. En
 * pantalla eso no se lee como «rotacion equivocada»: se lee como un rectangulo
 * morado donde deberia estar el nucleo, y estuvo asi en la primera captura.
 *
 * La punta arriba sale sola: `cylinderGeometry` pone su primer vertice en +Z, y
 * al girar 90° en X ese vertice baja a −Y — con simetria de orden 6, un vertice
 * abajo garantiza otro arriba.
 *
 * LA MARCA VA EN TEXTURA, dibujada en un lienzo, no como geometria. Setenta y
 * dos segmentos radiales con cuatro longitudes y un degradado por angulo serian
 * 72 mallas; como textura es un plano. Y como esta generada desde los tokens del
 * portal, su color no puede desviarse de la marca — un PNG exportado si.
 */
export default function TechCore({ activo }: { activo: boolean }) {
  const grupo = useRef<THREE.Group>(null)
  const marcaRef = useRef<THREE.Mesh>(null)

  const fondo = NUCLEO_R * 0.62

  const { marca, disco } = useMemo(() => {
    const mk = (c: HTMLCanvasElement | null) => {
      if (!c) return null
      const t = new THREE.CanvasTexture(c)
      t.colorSpace = THREE.SRGBColorSpace
      t.anisotropy = 4
      return t
    }
    return { marca: mk(texturaMarca()), disco: mk(texturaDisco()) }
  }, [])

  /* Geometria del prisma, compartida entre el cuerpo y sus aristas: son la
     MISMA forma, y calcularla dos veces solo abre la puerta a que se separen. */
  const prisma = useMemo(() => new THREE.CylinderGeometry(NUCLEO_R, NUCLEO_R, fondo * 2, 6), [fondo])
  const aristas = useMemo(() => new THREE.EdgesGeometry(prisma), [prisma])

  useFrame((estado, dt) => {
    if (!activo || !grupo.current) return
    // levitacion: 9,6 s de ciclo, el reloj mas lento de la maquina. El corazon
    // no corre.
    const t = estado.clock.elapsedTime
    grupo.current.position.y = NUCLEO_Y + Math.sin((t / 9.6) * Math.PI * 2) * 0.12
    if (marcaRef.current) marcaRef.current.rotation.z -= dt * 0.05
  })

  return (
    <group ref={grupo} position={[0, NUCLEO_Y, 0]} name="nucleo">
      {/* el cuerpo de cristal: oscuro y translucido, nunca opaco */}
      <mesh geometry={prisma} rotation={[Math.PI / 2, 0, 0]}>
        <meshPhysicalMaterial
          color={VOID.surface}
          roughness={0.16}
          metalness={0.35}
          clearcoat={1}
          clearcoatRoughness={0.12}
          transparent
          opacity={0.62}
          emissive={EMISSION.violetHi}
          emissiveIntensity={0.28}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* aristas encendidas: el armazon de la camara */}
      <lineSegments geometry={aristas} rotation={[Math.PI / 2, 0, 0]}>
        <lineBasicMaterial color={EMISSION.cyan} toneMapped={false} transparent opacity={0.9} />
      </lineSegments>

      {/*
        LA MARCA. Aditiva y ligeramente por delante de la cara frontal: dentro
        del cristal quedaria lavada por el material, y pegada a la cara
        pelearia en z con ella.
      */}
      <mesh ref={marcaRef} position={[0, 0, fondo + 0.02]}>
        <planeGeometry args={[NUCLEO_R * 1.62, NUCLEO_R * 1.62]} />
        <meshBasicMaterial
          map={marca ?? undefined}
          transparent
          toneMapped={false}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* y una copia detras, tenue: la marca se ve tambien por el reverso del
          cristal, que es lo que le da espesor a la camara */}
      <mesh position={[0, 0, -fondo - 0.02]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[NUCLEO_R * 1.5, NUCLEO_R * 1.5]} />
        <meshBasicMaterial
          map={marca ?? undefined}
          transparent
          opacity={0.3}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/*
        EL DISCO CON LA G. Mezcla NORMAL y por delante de los rayos: es lo unico
        de la pieza que no puede sumarse a la luz de detras, o deja de leerse.
      */}
      <mesh position={[0, 0, fondo + 0.06]}>
        <planeGeometry args={[NUCLEO_R * 0.56, NUCLEO_R * 0.56]} />
        <meshBasicMaterial map={disco ?? undefined} transparent toneMapped={false} depthWrite={false} />
      </mesh>
      <pointLight color={EMISSION.cyan} intensity={9} distance={11} decay={2} />
    </group>
  )
}
