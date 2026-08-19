'use client'

import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { EMISSION, VOID, INK } from '@/lib/design/tokens'

/**
 * LA MARCA GENESIS — geometria de verdad, no una textura.
 *
 * POR QUE NO UNA TEXTURA, que es lo que habia
 * -------------------------------------------
 * Una textura plana dentro de un cristal se delata: no la refracta, no cambia
 * con el angulo y no recibe el filo de luz de las aristas. Se ve como una
 * calcomania PEGADA sobre el vidrio en vez de como algo que esta DENTRO.
 * Rayos, disco y letra como mallas se refractan de verdad al mirarlos a traves
 * del cristal, y ese es justo el efecto que se buscaba.
 *
 * LOS 72 RAYOS VAN EN UNA SOLA MALLA INSTANCIADA
 * ----------------------------------------------
 * Setenta y dos mallas sueltas serian 72 llamadas de dibujo para una pieza de
 * dos centimetros en pantalla. Instanciada es UNA, y el color de cada rayo viaja
 * por `instanceColor` — asi el degradado por angulo del logo se consigue sin 72
 * materiales.
 *
 * LA G SE CONSTRUYE, NO SE ESCRIBE
 * --------------------------------
 * Nada de `fillText` ni de fuentes: un arco de toro con hueco a la derecha, mas
 * un travesano. Es la misma forma en todos los navegadores, no espera a que
 * cargue un webfont y no depende de que la fuente exista.
 */

/** Espectro Genesis, recorrido por ANGULO — es un giro, no un degradado lineal. */
const ESPECTRO = [EMISSION.cyan, EMISSION.blueHi, EMISSION.violetHi, EMISSION.magenta, EMISSION.magentaHi]

export default function GenesisMark({ radio, activo }: { radio: number; activo: boolean }) {
  /*
   * GIRAN LOS RAYOS, NO LA MARCA.
   *
   * Estaba rotando el grupo entero, y con el se iba la G: en cada cuadro la
   * letra aparecia inclinada un angulo distinto y dejaba de leerse como una G —
   * en la captura salia un simbolo de reciclaje. Una marca que gira deja de ser
   * una marca. El estallido si gira, porque es energia; la letra es identidad y
   * la identidad no se mueve.
   */
  const giroRayos = useRef<THREE.Group>(null)
  useFrame((_, dt) => {
    if (activo && giroRayos.current) giroRayos.current.rotation.z += dt * 0.045
  })

  /* 72 SEGMENTOS. Lo fija la hoja de componentes —«Rayos radiales 72
     segmentos»— y no es un capricho: con 48 el estallido tiene huecos y se lee
     como una rueda dentada; con 72 la corona es continua y se lee como emision. */
  const RAYOS = 72
  const rayosRef = useRef<THREE.InstancedMesh>(null)

  const colores = useMemo(
    () => ESPECTRO.map((c) => new THREE.Color(c)),
    []
  )

  useLayoutEffect(() => {
    const m = rayosRef.current
    if (!m) return
    const d = new THREE.Object3D()
    for (let i = 0; i < RAYOS; i++) {
      const a = (i / RAYOS) * Math.PI * 2
      /*
       * CUATRO LONGITUDES ALTERNAS. Con todos los rayos iguales el conjunto se
       * lee como una rueda dentada; la variacion es lo que lo convierte en una
       * emision. Es el mismo motivo por el que un destello real nunca es regular.
       */
      const largo = [1, 0.62, 0.86, 0.5, 0.94, 0.7][i % 6]! * radio * 0.88
      /*
       * Los rayos arrancan en 0,44 y no en 0,30. En el simbolo de la hoja el
       * disco blanco con la G ocupa el 40 % del diametro y los rayos empiezan
       * justo despues: naciendo antes, invaden el disco y la G pierde el aire
       * que la hace legible.
       */
      const r0 = radio * 0.44
      const rc = r0 + largo / 2
      d.position.set(Math.cos(a) * rc, Math.sin(a) * rc, 0)
      d.rotation.set(0, 0, a)
      d.scale.set(largo, i % 2 === 0 ? radio * 0.038 : radio * 0.022, 1)
      d.updateMatrix()
      m.setMatrixAt(i, d.matrix)
      // el color gira DOS vueltas por el espectro: asi el logo tiene los cuatro
      // colores de marca en cada mitad, como en el simbolo
      m.setColorAt(i, colores[Math.floor(((i / RAYOS) * colores.length * 2)) % colores.length]!)
    }
    m.instanceMatrix.needsUpdate = true
    if (m.instanceColor) m.instanceColor.needsUpdate = true
  }, [radio, colores])

  /*
   * LA CUNA. Los rayos de la hoja no son barras: son trapecios que se ENSANCHAN
   * hacia fuera, como los de un destello real. Con un `planeGeometry` todos
   * salen del mismo grosor y el conjunto se lee como una rueda dentada; con la
   * cuna, el borde exterior del estallido es continuo y el interior deja aire
   * alrededor del disco.
   *
   * Se construye una vez y la comparten las 72 instancias.
   */
  const cuna = useMemo(() => {
    const g = new THREE.BufferGeometry()
    // unidad: de x −0,5 (estrecho) a +0,5 (ancho); el instanciado la escala
    const v = new Float32Array([
      -0.5, -0.22, 0, 0.5, -0.5, 0, 0.5, 0.5, 0,
      -0.5, -0.22, 0, 0.5, 0.5, 0, -0.5, 0.22, 0,
    ])
    g.setAttribute('position', new THREE.BufferAttribute(v, 3))
    g.computeVertexNormals()
    return g
  }, [])

  /*
   * LA G — arco de 290° con el hueco a la derecha, y el travesano NACIENDO del
   * extremo inferior de ese hueco.
   *
   * El primer intento ponia el travesano a media altura, entre el centro y el
   * borde. No se leia como una G: se leia como un simbolo de reciclaje, porque
   * la barra quedaba desconectada de los dos extremos del arco y el ojo la
   * interpretaba como una flecha. En una G real el travesano ES la continuacion
   * del trazo — arranca donde el arco se corta y entra hacia el centro.
   *
   * Por eso su altura no se elige: se CALCULA a partir del angulo final del
   * arco. Si manana cambia la apertura del hueco, la barra la sigue sola.
   */
  const G = useMemo(() => {
    const Ra = radio * 0.26
    const grosor = radio * 0.072
    const apertura = 96 * (Math.PI / 180)      // hueco total, centrado en +X
    const barrido = Math.PI * 2 - apertura
    const arranque = apertura / 2

    const arco = new THREE.TorusGeometry(Ra, grosor / 2, 8, 64, barrido)
    arco.rotateZ(arranque)

    // extremo inferior del arco = donde empieza el travesano
    const finX = Math.cos(-arranque) * Ra
    const finY = Math.sin(-arranque) * Ra
    const dentro = Ra * 0.1
    return {
      arco,
      barra: {
        x: (finX + dentro) / 2,
        y: finY,
        w: finX - dentro,
        h: grosor,
      },
    }
  }, [radio])

  return (
    <group name="marca">
      {/* los rayos — lo unico que gira */}
      <group ref={giroRayos}>
        <instancedMesh ref={rayosRef} args={[undefined, undefined, RAYOS]} frustumCulled={false} renderOrder={1}>
          <primitive object={cuna} attach="geometry" />
          <meshBasicMaterial toneMapped={false} transparent opacity={0.95} side={THREE.DoubleSide} />
        </instancedMesh>
      </group>

      {/*
        DISCO BLANCO CON LA G OSCURA — la variante «Completo» de la hoja.
        Es la inversion de lo que yo tenia (G clara sobre disco oscuro) y no da
        igual: dentro de un cubo translucido y rodeado de 72 rayos encendidos,
        una letra clara compite con todo lo que la rodea. Un disco blanco macizo
        es la unica mancha OPACA de la pieza, y por eso el ojo va ahi primero —
        que es exactamente lo que tiene que hacer una marca.
      */}
      <mesh position={[0, 0, 0.006]} renderOrder={2}>
        <circleGeometry args={[radio * 0.42, 56]} />
        <meshBasicMaterial color={INK.base} toneMapped={false} />
      </mesh>

      {/* la G, recortada en oscuro sobre el disco */}
      <group position={[0, 0, 0.012]} renderOrder={3}>
        <mesh geometry={G.arco}>
          <meshBasicMaterial color={VOID.black} toneMapped={false} />
        </mesh>
        <mesh position={[G.barra.x, G.barra.y, 0]}>
          <boxGeometry args={[G.barra.w, G.barra.h, radio * 0.03]} />
          <meshBasicMaterial color={VOID.black} toneMapped={false} />
        </mesh>
      </group>

      {/*
        PARTICULA DE ENERGIA. La hoja la lista como pieza propia («Nucleo central ·
        Particula de energia») y va DETRAS del disco: se ve como un resplandor que
        escapa por el borde blanco, no como un punto encima de la letra.
      */}
      <mesh position={[0, 0, -0.02]} renderOrder={1}>
        <circleGeometry args={[radio * 0.62, 32]} />
        <meshBasicMaterial
          color={EMISSION.magentaHi}
          transparent
          opacity={0.4}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
