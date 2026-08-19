'use client'

import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { VOID } from '@/lib/design/tokens'
import TechRingInterior from './TechRingInterior'
import {
  CAPAS_3D,
  TUBO_HUECO,
  TUBO_CANTO,
  texturaPared,
  texturaCorona,
  texturaEspecular,
  type Capa3D,
} from '@/lib/technology/techMachine3d'

/**
 * LOS CINCO ANILLOS — plataformas, no aros.
 *
 * MAPA DE MATERIALES, y cada uno esta donde esta por un motivo:
 *
 *   corona superior   METAL LIQUIDO. `metalness` casi 1 y `roughness` baja, con
 *                     el entorno de marca reflejandose encima. Es la unica
 *                     superficie de la pieza que mira hacia la luz, asi que es
 *                     la unica donde un reflejo se ve de verdad — ponerlo en la
 *                     pared lateral seria gastarlo donde no se aprecia.
 *   pared exterior    CRISTAL TINTADO. Translucida a proposito: es lo que deja
 *                     ver la maquinaria de dentro, y sin eso la transparencia
 *                     no significaria nada.
 *   pared interior    metal oscuro. Se ve por el hueco y es lo que da la
 *                     sensacion de TUBO en vez de silueta recortada.
 *   labios            NEON PURO (`MeshBasicMaterial`). Luz sin sombreado: es lo
 *                     que el bloom recoge, y lo que hace que el borde se vea
 *                     encendido en lugar de iluminado.
 *   maquinaria        metal mate con acento emisivo. Si brillara como la corona
 *                     competiria con ella y el interior se leeria como una
 *                     mancha.
 *
 * EL ORDEN DE PINTADO IMPORTA. La pared exterior es transparente y va con
 * `depthWrite: false`: si escribiera profundidad, taparia la maquinaria que
 * tiene detras y todo el trabajo de dejar ver el interior no serviria de nada.
 * Por eso interior (0) → pared interior (1) → corona (2) → pared exterior (3).
 */

function Anillo({ capa, activo }: { capa: Capa3D; activo: boolean }) {
  const ri = capa.re * TUBO_HUECO
  const alto = TUBO_CANTO
  const coronaRef = useRef<THREE.Mesh>(null)

  const { pared, corona, especular } = useMemo(() => {
    const mk = (c: HTMLCanvasElement | null, envolver = false) => {
      if (!c) return null
      const t = new THREE.CanvasTexture(c)
      t.colorSpace = THREE.SRGBColorSpace
      if (envolver) {
        t.wrapS = THREE.RepeatWrapping
        t.wrapT = THREE.ClampToEdgeWrapping
      }
      t.anisotropy = 4
      return t
    }
    return {
      pared: mk(texturaPared(capa.orden, capa.color), true),
      corona: mk(texturaCorona(capa.orden, capa.color)),
      especular: mk(texturaEspecular(), true),
    }
  }, [capa.orden, capa.color])

  /*
   * Solo gira la CORONA, y muy despacio. Si girara el anillo entero, las
   * ventanillas del canto se moverian con el y la pieza pareceria suelta sobre
   * su eje; girando solo la cara superior se lee como un disco operando dentro
   * de un bastidor fijo. La infraestructura no corre.
   */
  useFrame((_, dt) => {
    if (!activo || !coronaRef.current) return
    coronaRef.current.rotation.z += dt * (capa.orden % 2 === 0 ? 0.012 : -0.009)
  })

  return (
    <group position={[0, capa.y, 0]} name={`capa-${capa.id}`}>
      {/* ── la maquinaria: lo primero, para que quede DETRAS del cristal ── */}
      <group renderOrder={0}>
        <TechRingInterior capa={capa} activo={activo} />
      </group>

      {/* pared interior — el volumen. Se ve por el hueco. */}
      <mesh renderOrder={1}>
        <cylinderGeometry args={[ri, ri, alto, 96, 1, true]} />
        <meshStandardMaterial
          color={VOID.black}
          roughness={0.42}
          metalness={0.75}
          emissive={capa.colorAlt}
          emissiveMap={pared ?? undefined}
          emissiveIntensity={0.62}
          envMapIntensity={0.7}
          side={THREE.BackSide}
        />
      </mesh>

      {/* corona: METAL LIQUIDO, la cara que recoge el entorno */}
      <mesh ref={coronaRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, alto / 2, 0]} renderOrder={2}>
        <ringGeometry args={[ri, capa.re, 96, 1]} />
        {/*
          La corona es la superficie que mira a la luz, asi que es la que decide
          si el anillo pesa. En grises, con `metalness` 0,96 salia casi negra:
          un metal puro sin nada brillante enfrente no tiene difuso que mostrar,
          solo reflejo — y el reflejo de un entorno oscuro es oscuro. Bajando a
          0,78 recupera componente difusa y la banda superior se ve, que es
          exactamente lo que la referencia tiene y a mi me faltaba.
        */}
        <meshPhysicalMaterial
          color={VOID.raised}
          roughness={0.16}
          metalness={0.78}
          clearcoat={1}
          clearcoatRoughness={0.08}
          envMapIntensity={1.9}
          emissive={capa.color}
          emissiveMap={corona ?? undefined}
          emissiveIntensity={1.7}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* suelo del anillo: se ve poco, pero sin el el tubo es hueco por abajo */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -alto / 2, 0]} renderOrder={1}>
        <ringGeometry args={[ri, capa.re, 64, 1]} />
        <meshStandardMaterial color={VOID.black} roughness={0.85} metalness={0.35} side={THREE.DoubleSide} />
      </mesh>

      {/* pared exterior — CRISTAL. Va la ultima y sin escribir profundidad. */}
      <mesh renderOrder={3}>
        <cylinderGeometry args={[capa.re, capa.re, alto, 96, 1, true]} />
        <meshPhysicalMaterial
          color={VOID.base}
          transparent
          /* 0,62 y no 0,46: con demasiada transparencia el anillo deja de
             pesar y vuelve a leerse como un aro. El cristal tiene que dejar
             INTUIR el interior, no mostrarlo entero. */
          opacity={0.62}
          roughness={0.1}
          metalness={0.15}
          clearcoat={1}
          clearcoatRoughness={0.05}
          envMapIntensity={1.5}
          emissive={capa.color}
          emissiveMap={pared ?? undefined}
          emissiveIntensity={1.15}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/*
        EL REALCE ESPECULAR — un anillo bajo, pegado al borde superior de la
        pared, con la banda de luz que NO da la vuelta. Es aditivo y va delante
        del cristal: es luz REFLEJADA sobre la superficie, no luz emitida por
        ella, y por eso se suma a lo que ya hay en vez de sustituirlo.

        Es el detalle que separa «cilindro de color» de «pieza metalica bajo un
        foco», y cuesta una malla de 64 caras por anillo.
      */}
      <mesh position={[0, alto * 0.34, 0]} renderOrder={5}>
        <cylinderGeometry args={[capa.re * 1.001, capa.re * 1.001, alto * 0.3, 64, 1, true]} />
        <meshBasicMaterial
          map={especular ?? undefined}
          transparent
          opacity={0.55}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/*
        LOS LABIOS. Cuatro toros finos —borde exterior y borde del hueco, arriba
        y abajo—, en luz pura. Es el rasgo mas caracteristico de la referencia y
        el mas barato: cuatro mallas de 128 caras.
      */}
      {([
        [capa.re, alto / 2, 0.026, 1],
        [capa.re, -alto / 2, 0.02, 0.5],
        [ri, alto / 2, 0.019, 0.8],
        [ri, -alto / 2, 0.015, 0.38],
      ] as const).map(([r, y, grosor, intensidad], i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={6}>
          <torusGeometry args={[r, grosor, 8, 128]} />
          <meshBasicMaterial color={capa.color} toneMapped={false} transparent opacity={intensidad} />
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
