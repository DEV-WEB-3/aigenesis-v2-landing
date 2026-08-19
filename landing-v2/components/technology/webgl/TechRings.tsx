'use client'

import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { VOID } from '@/lib/design/tokens'
import { useFrame } from '@react-three/fiber'
import {
  CAPAS_3D,
  TUBO_HUECO,
  TUBO_ALTO,
  texturaPared,
  texturaCorona,
  type Capa3D,
} from '@/lib/technology/techMachine3d'

/**
 * LOS CINCO ANILLOS.
 *
 * CADA UNO ES UN TUBO, no un disco. Cinco mallas por anillo, y ninguna sobra:
 *
 *   pared exterior   el canto lleno de ventanillas — la densidad
 *   pared interior   se ve A TRAVES del hueco — el volumen
 *   corona           la cara superior, con sus sectores
 *   labio superior   toro emisivo: el borde encendido de la referencia
 *   labio interior   el mismo tratamiento en el borde del hueco
 *
 * La pared interior es la pieza que mas trabaja y la que menos se nota que
 * esta: sin ella el agujero es un vacio negro y el anillo vuelve a leerse como
 * una silueta recortada. Va con `side: BackSide` porque se mira desde dentro —
 * la cara que da al eje es la de detras del cilindro.
 *
 * LA DENSIDAD VA EN TEXTURA, NO EN GEOMETRIA. La referencia tiene decenas de
 * ventanillas por anillo; como mallas serian miles de nodos y otros tantos
 * draw calls. Como mapa emisivo son cero nodos, un material y una textura que
 * ademas escala sola con la distancia.
 *
 * Los labios son `MeshBasicMaterial`: luz pura, sin sombreado. Es lo que hace
 * que el bloom los recoja y que el borde se vea ENCENDIDO en vez de iluminado.
 */

function Anillo({ capa, activo }: { capa: Capa3D; activo: boolean }) {
  const ri = capa.re * TUBO_HUECO
  const alto = capa.re * TUBO_ALTO

  const grupo = useRef<THREE.Group>(null)
  const coronaRef = useRef<THREE.Mesh>(null)

  const { pared, corona } = useMemo(() => {
    const mk = (c: HTMLCanvasElement | null, repetir?: [number, number]) => {
      if (!c) return null
      const t = new THREE.CanvasTexture(c)
      t.colorSpace = THREE.SRGBColorSpace
      if (repetir) {
        t.wrapS = THREE.RepeatWrapping
        t.wrapT = THREE.ClampToEdgeWrapping
        t.repeat.set(repetir[0], repetir[1])
      }
      t.anisotropy = 4
      return t
    }
    return {
      pared: mk(texturaPared(capa.orden, capa.color), [1, 1]),
      corona: mk(texturaCorona(capa.orden, capa.color)),
    }
  }, [capa.orden, capa.color])

  /*
   * LA DERIVA DE LA CORONA. Muy lenta y solo en la cara superior: la
   * infraestructura no corre. Si girara el anillo entero, las ventanillas del
   * canto se moverian con el y la pieza pareceria suelta sobre su eje en vez de
   * montada; girando solo la corona se lee como un disco operando DENTRO de un
   * bastidor fijo.
   */
  useFrame((_, dt) => {
    if (!activo || !coronaRef.current) return
    coronaRef.current.rotation.z += dt * (capa.orden % 2 === 0 ? 0.014 : -0.011)
  })

  return (
    <group ref={grupo} position={[0, capa.y, 0]} name={`capa-${capa.id}`}>
      {/* pared exterior — la densidad */}
      <mesh>
        <cylinderGeometry args={[capa.re, capa.re, alto, 96, 1, true]} />
        <meshStandardMaterial
          color={VOID.base}
          roughness={0.34}
          metalness={0.75}
          emissive={capa.color}
          emissiveMap={pared ?? undefined}
          emissiveIntensity={1.55}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* pared interior — el volumen. Se ve por el hueco. */}
      <mesh>
        <cylinderGeometry args={[ri, ri, alto, 96, 1, true]} />
        <meshStandardMaterial
          color={VOID.black}
          roughness={0.5}
          metalness={0.6}
          emissive={capa.colorAlt}
          emissiveMap={pared ?? undefined}
          emissiveIntensity={0.8}
          side={THREE.BackSide}
        />
      </mesh>

      {/* corona superior */}
      <mesh ref={coronaRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, alto / 2, 0]}>
        <ringGeometry args={[ri, capa.re, 96, 1]} />
        <meshStandardMaterial
          color={VOID.base}
          roughness={0.28}
          metalness={0.85}
          emissive={capa.color}
          emissiveMap={corona ?? undefined}
          emissiveIntensity={1.25}
          side={THREE.DoubleSide}
          transparent
        />
      </mesh>

      {/* suelo del anillo: se ve poco, pero sin el el tubo es translucido */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -alto / 2, 0]}>
        <ringGeometry args={[ri, capa.re, 64, 1]} />
        <meshStandardMaterial color={VOID.black} roughness={0.9} metalness={0.2} side={THREE.DoubleSide} />
      </mesh>

      {/*
        LOS LABIOS. Cuatro toros finos: el borde exterior y el del hueco, arriba
        y abajo. Son luz pura —`MeshBasicMaterial`—, asi que el bloom los recoge
        y el anillo se ve ENCENDIDO por el canto. Es el rasgo mas caracteristico
        de la referencia y el mas barato de todos: cuatro mallas de 128 caras.
      */}
      {([
        [capa.re, alto / 2, 0.028, 1],
        [capa.re, -alto / 2, 0.022, 0.55],
        [ri, alto / 2, 0.02, 0.75],
        [ri, -alto / 2, 0.016, 0.4],
      ] as const).map(([r, y, grosor, intensidad], i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[r, grosor, 8, 128]} />
          <meshBasicMaterial
            color={capa.color}
            toneMapped={false}
            transparent
            opacity={intensidad}
          />
        </mesh>
      ))}
    </group>
  )
}

export default function TechRings({ activo }: { activo: boolean }) {
  return (
    <group name="anillos">
      {CAPAS_3D.map((capa) => (
        <Anillo key={capa.id} capa={capa} activo={activo} />
      ))}
    </group>
  )
}
