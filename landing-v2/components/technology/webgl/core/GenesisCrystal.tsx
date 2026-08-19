'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { EMISSION, VOID } from '@/lib/design/tokens'

/**
 * EL CUBO CRISTALINO — la camara de contencion del Genesis Core.
 *
 * ES UN CUBO, NO UN PRISMA HEXAGONAL. La hoja de componentes lo dice literal
 * («Cubo cristalino», «CUBO CENTRAL») y la vista wireframe lo confirma: se ven
 * TRES caras. Lo que despista es la vista frontal, donde un cubo en isometrica
 * recorta exactamente un hexagono — y por eso yo habia construido un hexagono,
 * que es la silueta correcta con la geometria equivocada. La diferencia importa:
 * el hexagono es plano y el cubo tiene tres caras que reciben luz distinta, que
 * es de donde sale el volumen.
 *
 * POR QUE `transparent + opacity` Y NO `transmission`, pese a que la hoja pide 0,9
 * ---------------------------------------------------------------------------
 * Medido: con `transmission` el cubo salia NEGRO y el simbolo no se veia. No es
 * un ajuste mal puesto — es una limitacion de three: la transmision muestrea el
 * buffer de OPACOS, asi que no refracta objetos transparentes ni emisivos de la
 * misma pasada. El simbolo, que es justo eso, desaparecia detras del cristal.
 *
 * Con mezcla alfa normal el simbolo se ve a traves del cubo, que es el requisito
 * innegociable: la marca es lo unico de la pieza que tiene que leerse siempre.
 * El resto del vocabulario de vidrio —bisel, `clearcoat`, `iridescence` a 1,0 y
 * reflejo del entorno— se conserva entero, y es lo que hace el trabajo visual.
 *
 * BISEL, y no aristas vivas. Una arista de radio cero no tiene superficie donde
 * la luz resbale, asi que no produce el filo brillante que delata al vidrio. El
 * bisel crea esa banda estrecha en cada canto.
 */
export default function GenesisCrystal({ radio }: { radio: number }) {
  const geo = useMemo(() => {
    /*
     * MEDIA ARISTA = 0,82 del radio nominal, y sale de geometria: la silueta de
     * un cubo en isometrica es un hexagono de radio `lado * raiz(2)`. Con 1,42
     * la silueta salia en 2,0 —el doble de lo previsto— y el nucleo se comia el
     * anillo de aplicaciones. Con 0,82 la silueta cae en 1,16, que es la
     * proporcion que marca la hoja: 1,0x el cubo contra 1,6x el anillo base.
     */
    const lado = radio * 0.82
    const forma = new THREE.Shape()
    forma.moveTo(-lado, -lado)
    forma.lineTo(lado, -lado)
    forma.lineTo(lado, lado)
    forma.lineTo(-lado, lado)
    forma.closePath()

    const g = new THREE.ExtrudeGeometry(forma, {
      depth: lado * 2,
      bevelEnabled: true,
      bevelThickness: radio * 0.09,
      bevelSize: radio * 0.07,
      bevelSegments: 2,
      curveSegments: 1,
    })
    g.translate(0, 0, -lado)
    g.computeVertexNormals()
    return g
  }, [radio])

  const aristas = useMemo(() => new THREE.EdgesGeometry(geo, 20), [geo])

  /*
   * GIRO ISOMETRICO. 35,26° en X (el `atan(1/raiz2)` de la isometrica real) y
   * 45° en Y: es la orientacion exacta con la que un cubo muestra sus tres
   * caras iguales y su silueta es un hexagono regular. Cualquier otro par de
   * angulos da un cubo «en escorzo», que se lee como un error de encuadre.
   */
  const giro: [number, number, number] = [Math.atan(1 / Math.SQRT2), Math.PI / 4, 0]

  return (
    <group name="cubo-cristalino" rotation={giro}>
      <mesh geometry={geo} renderOrder={4}>
        <meshPhysicalMaterial
          color={VOID.surface}
          transparent
          opacity={0.28}
          roughness={0.06}
          metalness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.03}
          /* holografico: la hoja pide iridiscencia 1,0 y es lo que le da el
             tornasol que separa «cristal» de «plastico transparente» */
          iridescence={1}
          iridescenceIOR={1.34}
          iridescenceThicknessRange={[120, 460]}
          envMapIntensity={2.2}
          emissive={EMISSION.violetHi}
          emissiveIntensity={0.16}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/*
        EL FILO. El bisel da el reflejo fisico; esta linea da el borde ENCENDIDO.
        Hacen falta las dos: sin bisel la linea flota, sin linea el bisel se
        apaga contra un fondo oscuro.
      */}
      <lineSegments geometry={aristas} renderOrder={6}>
        <lineBasicMaterial color={EMISSION.cyan} toneMapped={false} transparent opacity={0.92} />
      </lineSegments>
      {/*
        SEGUNDO FILO, magenta y ligeramente mayor. En la referencia las aristas
        del cubo no son de un solo color: el canto superior tira a cian y el
        inferior a magenta. Con una sola linea el cubo se lee como un alambre
        monocromo; con dos apenas desplazadas aparece una franja cromatica en el
        borde, que es lo que hace que el vidrio parezca DISPERSAR la luz.
      */}
      <lineSegments geometry={aristas} scale={1.022} renderOrder={5}>
        <lineBasicMaterial color={EMISSION.magenta} toneMapped={false} transparent opacity={0.42} />
      </lineSegments>
    </group>
  )
}
