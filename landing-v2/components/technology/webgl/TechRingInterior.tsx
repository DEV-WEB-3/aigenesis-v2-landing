'use client'

import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { INK } from '@/lib/design/tokens'
import { TUBO_HUECO, TUBO_CANTO, type Capa3D } from '@/lib/technology/techMachine3d'

/**
 * LA MAQUINARIA DENTRO DE CADA ANILLO.
 *
 * ES LO QUE JUSTIFICA QUE LA PARED SEA DE CRISTAL. Un anillo translucido con
 * nada dentro no se lee como cristal: se lee como un aro mal pintado. La
 * transparencia solo significa algo cuando hay ALGO que ver a traves de ella, y
 * esto es ese algo.
 *
 * LA PRUEBA QUE TIENE QUE PASAR: tapar el rotulo y seguir sabiendo cual es cual.
 * Por eso cada capa usa un LENGUAJE DE FORMA propio y no el mismo motivo en
 * cinco colores — el color refuerza la identidad, no la sostiene, y alguien que
 * no distinga cian de magenta tiene que poder distinguir las capas igual:
 *
 *   backend          bloques de servicio, anchos y bajos
 *   infraestructura  racks verticales por parejas — redundancia
 *   ia               nodos sueltos a distintas alturas — una nube, no una fila
 *   blockchain       cubos iguales encadenados — orden
 *   aplicaciones     laminas finas y anchas — pantallas
 *
 * TODO VA EN UNA MALLA INSTANCIADA POR CAPA. Veinticuatro piezas sueltas serian
 * 24 llamadas de dibujo por anillo y 120 en total, para elementos de dos
 * pixeles. Instanciadas son cinco llamadas.
 */

interface Props {
  capa: Capa3D
  activo: boolean
}

/** Cuantas piezas y con que forma trabaja cada subsistema. */
const PERFIL: Record<string, { n: number; caja: [number, number, number]; esfera?: boolean }> = {
  backend: { n: 26, caja: [0.2, 0.16, 0.12] },
  infraestructura: { n: 24, caja: [0.11, 0.3, 0.11] },
  ia: { n: 30, caja: [0.075, 0.075, 0.075], esfera: true },
  blockchain: { n: 22, caja: [0.15, 0.15, 0.15] },
  aplicaciones: { n: 24, caja: [0.28, 0.15, 0.035] },
}

function semilla(i: number, sal: number): number {
  const x = Math.sin(i * 91.7 + sal * 47.3) * 43758.5453
  return x - Math.floor(x)
}

export default function TechRingInterior({ capa, activo }: Props) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const perfil = PERFIL[capa.id]!
  const ri = capa.re * TUBO_HUECO
  const alto = TUBO_CANTO

  const color = useMemo(() => new THREE.Color(capa.colorAlt), [capa.colorAlt])
  const claro = useMemo(() => new THREE.Color(INK.base), [])

  useLayoutEffect(() => {
    const m = ref.current
    if (!m) return
    const d = new THREE.Object3D()
    const n = perfil.n

    for (let i = 0; i < n; i++) {
      /*
       * Se colocan EN LA CORONA, entre el hueco y el borde exterior: es el unico
       * sitio donde hay material que las contenga. Puestas en el hueco flotarian
       * en el aire y la lectura seria «hay basura dentro del aro».
       */
      const a = (i / n) * Math.PI * 2 + semilla(i, capa.orden) * 0.06
      const r = ri + (capa.re - ri) * (0.28 + semilla(i, capa.orden + 5) * 0.5)
      const escalaY =
        capa.id === 'infraestructura'
          ? 0.7 + semilla(i, capa.orden + 9) * 0.9
          : capa.id === 'ia'
            ? 1
            : 0.65 + semilla(i, capa.orden + 9) * 0.7

      const yBase = -alto * 0.5 + (perfil.caja[1] * escalaY) / 2
      const y =
        capa.id === 'ia'
          ? -alto * 0.35 + semilla(i, capa.orden + 13) * alto * 0.75
          : yBase

      d.position.set(Math.cos(a) * r, y, Math.sin(a) * r)
      // las piezas MIRAN AL CENTRO: alineadas con el eje del mundo se verian
      // como un enjambre; alineadas con el radio se ven montadas en el bastidor
      d.rotation.set(0, -a, 0)
      d.scale.set(1, escalaY, 1)
      d.updateMatrix()
      m.setMatrixAt(i, d.matrix)
      // una de cada cinco encendida en blanco: un modulo con TODAS las luces
      // puestas se lee como guirnalda, no como sistema
      m.setColorAt(i, semilla(i, capa.orden + 21) > 0.8 ? claro : color)
    }
    m.instanceMatrix.needsUpdate = true
    if (m.instanceColor) m.instanceColor.needsUpdate = true
  }, [capa, perfil, ri, alto, color, claro])

  /*
   * SOLO LA CAPA DE IA SE MUEVE POR DENTRO, y a proposito: es la unica cuyo
   * trabajo es CALCULAR. Si las cinco tuvieran piezas moviendose, el interior
   * seria ruido; moviendose una sola, esa una se distingue de las otras cuatro
   * sin necesidad de leer su rotulo.
   */
  useFrame((estado) => {
    if (!activo || capa.id !== 'ia' || !ref.current) return
    const t = estado.clock.elapsedTime
    const m = ref.current
    const d = new THREE.Object3D()
    const n = perfil.n
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2
      const r = ri + (capa.re - ri) * (0.28 + semilla(i, capa.orden + 5) * 0.5)
      const fase = t / capa.latido + semilla(i, capa.orden + 13)
      d.position.set(
        Math.cos(a) * r,
        -alto * 0.35 + ((fase % 1) * alto * 0.8),
        Math.sin(a) * r
      )
      d.rotation.set(0, -a, 0)
      const s = 0.6 + Math.sin(fase * Math.PI * 2) * 0.45
      d.scale.setScalar(Math.max(0.15, s))
      d.updateMatrix()
      m.setMatrixAt(i, d.matrix)
    }
    m.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, perfil.n]} frustumCulled={false}>
      {perfil.esfera ? (
        <sphereGeometry args={[perfil.caja[0], 8, 8]} />
      ) : (
        <boxGeometry args={perfil.caja} />
      )}
      <meshStandardMaterial
        roughness={0.3}
        metalness={0.5}
        emissive={capa.colorAlt}
        emissiveIntensity={0.9}
        toneMapped
      />
    </instancedMesh>
  )
}
