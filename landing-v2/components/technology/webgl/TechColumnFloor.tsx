'use client'

import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { EMISSION, INK } from '@/lib/design/tokens'
import {
  CAPAS_3D,
  NUCLEO_Y,
  SUELO_Y,
  CAPA_BASE,
  texturaSuelo,
  texturaColumna,
} from '@/lib/technology/techMachine3d'

/**
 * LA COLUMNA DE ENERGIA Y LA PLACA BASE.
 *
 * Van juntas porque son las dos piezas que ATRAVIESAN la maquina en vez de
 * pertenecer a una capa: la columna la recorre de abajo arriba y la placa la
 * sostiene. Separarlas en dos archivos solo repartiria las mismas constantes.
 *
 * LA COLUMNA SON TRES CILINDROS CONCENTRICOS, no uno. El fino da la nitidez, el
 * medio el color y el ancho el volumen del aire iluminado. Con uno solo se ve
 * una linea; con tres se ve un HAZ, que es lo que hay en la referencia. Los tres
 * son aditivos: la luz se suma, no se pinta encima.
 *
 * LA PLACA es un plano con textura, no geometria. Setenta y dos trazas con
 * quiebro y sus terminales serian cientos de mallas para algo que vive al fondo,
 * a opacidad baja y nunca se mira de cerca.
 */
export default function TechColumnFloor({ activo }: { activo: boolean }) {
  const alto = NUCLEO_Y - SUELO_Y
  const centroY = (NUCLEO_Y + SUELO_Y) / 2

  const { suelo, columna } = useMemo(() => {
    const mk = (c: HTMLCanvasElement | null) => {
      if (!c) return null
      const t = new THREE.CanvasTexture(c)
      t.colorSpace = THREE.SRGBColorSpace
      t.anisotropy = 4
      return t
    }
    return { suelo: mk(texturaSuelo()), columna: mk(texturaColumna()) }
  }, [])

  /*
   * LOS PAQUETES. Uno por tramo entre capas, mas uno que BAJA.
   *
   * El que baja no es decoracion: sin el, el sistema es una flecha —todo sube y
   * nada contesta—, que es un diagrama de flujo y no una maquina. Aparece una
   * vez cada dos vueltas y recorre el trazo en un tercio del ciclo; el resto del
   * tiempo esta apagado.
   */
  const paquetes = useRef<THREE.InstancedMesh>(null)
  const TRAMOS = CAPAS_3D.length - 1
  const TOTAL = TRAMOS + 1
  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((estado) => {
    if (!activo || !paquetes.current) return
    const t = estado.clock.elapsedTime

    for (let i = 0; i < TRAMOS; i++) {
      const desde = CAPAS_3D[i]!.y
      const hasta = CAPAS_3D[i + 1]!.y
      // 8 s de recorrido y arranque repartido: misma duracion, distinto
      // retardo. Es como se separan elementos IGUALES en todo el portal.
      const f = ((t / 8) + i / TRAMOS) % 1
      dummy.position.set(0, desde + (hasta - desde) * f, 0)
      const s = 0.055 + Math.sin(f * Math.PI) * 0.03
      dummy.scale.setScalar(s / 0.06)
      dummy.updateMatrix()
      paquetes.current.setMatrixAt(i, dummy.matrix)
    }

    // el que baja: 16 s de ciclo, visible solo el primer 18 %
    const fb = (t / 16) % 1
    const visible = fb < 0.18
    dummy.position.set(0, visible ? NUCLEO_Y - (NUCLEO_Y - CAPA_BASE.y) * (fb / 0.18) : -999, 0)
    dummy.scale.setScalar(visible ? 1.15 : 0.001)
    dummy.updateMatrix()
    paquetes.current.setMatrixAt(TRAMOS, dummy.matrix)

    paquetes.current.instanceMatrix.needsUpdate = true
  })

  return (
    <group name="columna-y-suelo">
      {/* haz fino: la nitidez */}
      <mesh position={[0, centroY, 0]}>
        <cylinderGeometry args={[0.045, 0.045, alto, 12, 1, true]} />
        <meshBasicMaterial
          map={columna ?? undefined}
          toneMapped={false}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* cuerpo: el color */}
      <mesh position={[0, centroY, 0]}>
        <cylinderGeometry args={[0.1, 0.1, alto, 16, 1, true]} />
        <meshBasicMaterial
          map={columna ?? undefined}
          toneMapped={false}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* aura: el aire iluminado alrededor */}
      <mesh position={[0, centroY, 0]}>
        <cylinderGeometry args={[0.26, 0.26, alto, 16, 1, true]} />
        <meshBasicMaterial
          map={columna ?? undefined}
          toneMapped={false}
          transparent
          opacity={0.07}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/*
        Los paquetes van en UNA malla instanciada. Seis esferas sueltas serian
        seis draw calls y seis materiales; instanciadas son una y uno, y la
        animacion se resuelve escribiendo matrices en vez de tocando el arbol de
        React sesenta veces por segundo.
      */}
      <instancedMesh ref={paquetes} args={[undefined, undefined, TOTAL]} frustumCulled={false}>
        <sphereGeometry args={[0.06, 10, 10]} />
        <meshBasicMaterial color={INK.base} toneMapped={false} />
      </instancedMesh>

      {/*
        LA PLACA BASE. Radio 6,6 y no 10,5: medida sobre la referencia, la placa
        llega a 1,48 veces el ancho del anillo de backend. Con 10,5 se comia el
        encuadre y la maquina parecia pequena encima de una alfombra.
      */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, SUELO_Y, 0]}>
        <circleGeometry args={[6.6, 96]} />
        <meshBasicMaterial
          map={suelo ?? undefined}
          transparent
          opacity={0.8}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* halo bajo la maquina: el derrame de luz sobre la placa */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, SUELO_Y + 0.02, 0]}>
        <circleGeometry args={[CAPA_BASE.re * 1.5, 48]} />
        <meshBasicMaterial
          color={EMISSION.violetHi}
          transparent
          opacity={0.09}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
