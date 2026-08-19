'use client'

import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { EMISSION } from '@/lib/design/tokens'
import { NUCLEO_Y, NUCLEO_R, CAPA_CIMA } from '@/lib/technology/techMachine3d'
import GenesisCrystal from './core/GenesisCrystal'
import GenesisMark from './core/GenesisMark'
import GenesisEmitter from './core/GenesisEmitter'
import GenesisBase from './core/GenesisBase'

/**
 * EL GENESIS CORE — compone tres piezas, no las mezcla.
 *
 *   GenesisCrystal   el cubo cristalino biselado, en isometrica
 *   GenesisMark      el estallido radial de 72 segmentos y la G, en geometria
 *   GenesisBase      el anillo de energia y el disco base
 *   GenesisEmitter   la fuente y el haz que conecta con la pila
 *
 * ESTE ARCHIVO NO DIBUJA NADA. Solo decide DONDE va cada pieza y como se
 * mueven. Es lo que permite que el cristal sea exactamente un cristal y la
 * marca exactamente una marca: si compartieran malla tendrian que compartir
 * material, y entonces o el vidrio deja de refractar o la marca deja de emitir.
 *
 * LA MARCA SE VE A TRAVES DEL CUBO. Va en el plano medio y se dibuja despues,
 * con el cubo sin escribir profundidad: el resultado es un simbolo contenido
 * dentro del vidrio, que es lo que pide la hoja de componentes. El orden esta
 * explicado abajo, donde se monta.
 */
export default function TechCore({ activo }: { activo: boolean }) {
  const grupo = useRef<THREE.Group>(null)
  const marca = useRef<THREE.Group>(null)
  const cuerpo = useRef<THREE.Group>(null)

  useFrame((estado) => {
    if (!activo) return
    const t = estado.clock.elapsedTime
    // levitacion a 9,6 s — el reloj mas lento de la maquina: el corazon no corre
    if (grupo.current) {
      grupo.current.position.y = NUCLEO_Y + Math.sin((t / 9.6) * Math.PI * 2) * 0.1
    }
    /*
     * EL CRISTAL Y LA MARCA SE MUEVEN A DISTINTO RITMO. Girando juntos serian
     * una sola pieza y el cristal dejaria de leerse como algo que CONTIENE; el
     * desfase entre los dos es lo que hace que la refraccion cambie y que se
     * perciba espesor entre ellos.
     */
    /* El balanceo es de 0,1 rad y no de 0,32: mas que eso saca al cubo de la
       isometrica y su silueta deja de ser un hexagono regular — se lee como un
       cubo mal encuadrado, no como un cubo girando. */
    if (cuerpo.current) cuerpo.current.rotation.y = Math.sin((t / 32) * Math.PI * 2) * 0.1
  })

  return (
    <group ref={grupo} position={[0, NUCLEO_Y, 0]} name="nucleo">
      {/*
        EL ORDEN IMPORTA Y NO ES EL INTUITIVO. La marca se dibuja DESPUES del
        cubo, no dentro: el cubo va con `depthWrite: false` y `renderOrder` 4, la
        marca con 5 y las aristas con 6. Asi la marca se ve a traves del cristal
        —que es el efecto— sin que el material del cubo la borre.

        Dibujandola antes desaparecia: era lo que pasaba con `transmission`, que
        muestrea solo el buffer de opacos y por eso se comia el simbolo entero.
      */}
      <group ref={cuerpo}>
        <GenesisCrystal radio={NUCLEO_R} />
      </group>
      <group ref={marca} renderOrder={5}>
        <GenesisMark radio={NUCLEO_R * 0.84} activo={activo} />
      </group>

      <GenesisBase radio={NUCLEO_R} activo={activo} />

      <GenesisEmitter
        radio={NUCLEO_R}
        alcance={NUCLEO_Y - CAPA_CIMA.y - NUCLEO_R * 0.4}
        activo={activo}
      />

      {/*
        HALO CORTO. Con radio 2,4 y esfera se veia una CUPULA morada tapando el
        anillo de aplicaciones — un halo que oculta la maquina no es un halo, es
        una mancha. A 1,45 el derrame se queda pegado al cubo, que es lo que
        hace: dice que la pieza emite, no que hay niebla.
      */}
      <mesh renderOrder={0}>
        <sphereGeometry args={[NUCLEO_R * 1.45, 20, 20]} />
        <meshBasicMaterial
          color={EMISSION.violetHi}
          transparent
          opacity={0.05}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  )
}
