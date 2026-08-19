'use client'

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { EMISSION } from '@/lib/design/tokens'
import TechRings from './TechRings'
import TechCore from './TechCore'
import TechColumnFloor from './TechColumnFloor'
import EntornoGenesis from './EntornoGenesis'
import {
  CAPAS_3D,
  CAMARA,
  TUBO_CANTO,
  NUCLEO_Y,
  posicionCamara,
} from '@/lib/technology/techMachine3d'

export interface Ancla {
  id: string
  /** Centro del frente del anillo, en % de la caja del lienzo. */
  frente: { x: number; y: number }
  izq: { x: number; y: number }
  der: { x: number; y: number }
}

/**
 * LAS ANCLAS — el puente entre el 3D y el texto.
 *
 * Los rotulos y las lecturas viven en DOM, pero tienen que colgar de piezas que
 * viven en la escena. En vez de adivinar posiciones con porcentajes calibrados a
 * mano —que se rompen al primer cambio de camara o de proporcion—, se PROYECTAN
 * los puntos reales con la misma camara que dibuja la escena. Si manana se mueve
 * la camara, los rotulos la siguen solos.
 *
 * Se recalcula al montar y al cambiar de tamano, NO en cada cuadro: la camara no
 * se mueve, asi que proyectar sesenta veces por segundo daria siempre el mismo
 * numero a cambio de trabajo real.
 */
/**
 * EL TAMANO SE LE DICTA A R3F. No se le deja medir.
 *
 * EL PROBLEMA, MEDIDO: la seccion aplica `zoom: 0.93` para que su contenido
 * quepa en la ventana. R3F mide el hueco con `getBoundingClientRect()` —que ya
 * devuelve la medida CON el zoom aplicado, 696 px— y la escribe como estilo en
 * linea del lienzo. El navegador vuelve a aplicarle el zoom a ese estilo, y el
 * lienzo acaba midiendo 648 px dentro de un hueco de 696. Dos consecuencias:
 *
 *   la maquina se dibuja un 7 % mas pequena que su sitio, con una banda muerta
 *   los porcentajes proyectados —que son del LIENZO— se aplican sobre el
 *   overlay, que si ocupa el hueco entero: los rotulos salen desplazados
 *
 * No es un fallo de R3F ni del zoom: es que las dos cosas miden en espacios
 * distintos. Fijandolo aqui, el lienzo, el overlay y la proyeccion comparten
 * una sola caja. El CSS remata con `!important` para que el estilo en linea que
 * R3F reescribe en cada `setSize` no vuelva a meter la medida equivocada.
 */
function AjustarTamano() {
  const gl = useThree((e) => e.gl)
  const setSize = useThree((e) => e.setSize)

  useLayoutEffect(() => {
    const padre = gl.domElement.parentElement
    if (!padre) return
    const aplicar = () => {
      const b = padre.getBoundingClientRect()
      if (b.width < 2 || b.height < 2) return
      setSize(b.width, b.height)
    }
    aplicar()
    const ro = new ResizeObserver(aplicar)
    ro.observe(padre)
    window.addEventListener('resize', aplicar, { passive: true })
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', aplicar)
    }
  }, [gl, setSize])

  return null
}

function Anclas({ onAnclas }: { onAnclas: (a: Ancla[]) => void }) {
  const camera = useThree((e) => e.camera)
  const ancho = useThree((e) => e.size.width)
  const alto = useThree((e) => e.size.height)

  useLayoutEffect(() => {
    /*
     * LA CAMARA SE COLOCA AQUI, no en `onCreated`, y las matrices se fuerzan
     * antes de proyectar. Esto no es ceremonia: `project()` usa
     * `matrixWorldInverse`, que three SOLO recalcula al renderizar. Colocando la
     * camara en `onCreated` y proyectando en un efecto, la proyeccion salia con
     * la matriz identidad — medido: los rotulos aparecian entre el 9 % y el 61 %
     * de la altura cuando la maquina ocupaba del 20 % al 80 %, o sea pegados al
     * anillo equivocado.
     *
     * Un rotulo sobre la capa que no es no se lee como un fallo de calculo: se
     * lee como que la seccion miente sobre su propia arquitectura.
     */
    const cam = camera as THREE.PerspectiveCamera
    const [px, py, pz] = posicionCamara()
    cam.position.set(px, py, pz)
    cam.lookAt(0, CAMARA.objetivoY, 0)
    cam.updateProjectionMatrix()
    cam.updateMatrixWorld(true)

    const v = new THREE.Vector3()
    const proy = (x: number, y: number, z: number) => {
      v.set(x, y, z).project(cam)
      return { x: (v.x * 0.5 + 0.5) * 100, y: (-v.y * 0.5 + 0.5) * 100 }
    }
    onAnclas(
      CAPAS_3D.map((c) => ({
        id: c.id,
        // el frente del labio superior: donde en la referencia va la placa
        frente: proy(0, c.y + TUBO_CANTO / 2, c.re),
        izq: proy(-c.re, c.y, 0),
        der: proy(c.re, c.y, 0),
      }))
    )
  }, [camera, ancho, alto, onAnclas])

  return null
}

/**
 * LA MAQUINA GENESIS — escena WebGL.
 *
 * ILUMINACION EN CUATRO PIEZAS, cada una con su trabajo:
 *
 *   ambiente violeta   levanta las sombras sin aplanar; es el color del espacio
 *   clave cian         viene de arriba-izquierda y define el labio de cada anillo
 *   relleno magenta    a la derecha, para que el lado oscuro no sea negro
 *   contra azul        por detras, separa la maquina del fondo de la seccion
 *
 * El bloom NO sustituye al material: los cuerpos estan iluminados de verdad y el
 * bloom solo recoge lo que ya emite —labios, columna, nucleo—. Usarlo como
 * sustituto es lo que produce el aspecto de «plastico con brillo pegado».
 *
 * `frameloop` se apaga cuando la seccion no esta a la vista. Es la diferencia
 * entre una seccion que cuesta un lienzo animado permanente y una que cuesta
 * cero mientras el visitante mira otra cosa.
 */
export default function TechMachineCanvas({
  activo,
  onAnclas,
  calidad,
}: {
  activo: boolean
  onAnclas: (a: Ancla[]) => void
  calidad: 'alta' | 'media'
}) {
  const camPos = useMemo(() => posicionCamara(), [])

  return (
    <Canvas
      frameloop={activo ? 'always' : 'never'}
      dpr={calidad === 'alta' ? [1, 2] : [1, 1.5]}
      camera={{ position: camPos, fov: CAMARA.fov, near: 0.1, far: 120 }}
      gl={{
        antialias: calidad === 'alta',
        alpha: true,
        powerPreference: calidad === 'alta' ? 'high-performance' : 'low-power',
        /*
         * ACES filmico y no lineal. Con luces de intensidad alta sobre
         * materiales metalicos, el mapeo lineal satura a blanco puro y se pierde
         * el color de marca justo en los reflejos, que es donde mas se nota.
         */
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
    >
      {/*
        EL ENTORNO VA PRIMERO. Sin el, los materiales con `transmission` y
        `clearcoat` no tienen nada que reflejar y devuelven negro: el cristal
        sale plano y la tentacion es taparlo con mas bloom, que es exactamente
        lo contrario de lo que hace falta.
      */}
      <EntornoGenesis />

      {/*
        ILUMINACION LOCALIZADA, no uniforme. Cada luz tiene un trabajo y un
        sitio; iluminar toda la escena por igual aplana las superficies curvas y
        es justo lo que hace que una pieza 3D parezca un dibujo.
      */}
      <ambientLight intensity={0.22} color={EMISSION.violet} />
      {/* clave cian, desde arriba-izquierda: define el labio de cada anillo */}
      <directionalLight position={[-6, 13, 8]} intensity={1.5} color={EMISSION.cyan} />
      {/* magenta a la altura de IA — la capa que le da nombre al color */}
      <pointLight position={[5.5, CAPAS_3D[2]!.y, 5]} intensity={22} distance={16} decay={2} color={EMISSION.magenta} />
      {/* violeta abajo, entre blockchain y backend */}
      <pointLight position={[-5.5, CAPAS_3D[1]!.y, 4.5]} intensity={17} distance={16} decay={2} color={EMISSION.violetHi} />
      {/* azul de contra, por detras: separa la maquina del fondo de la seccion */}
      <pointLight position={[0, CAPAS_3D[3]!.y, -8]} intensity={16} distance={22} decay={2} color={EMISSION.blueHi} />
      {/* la columna ilumina de verdad lo que tiene alrededor */}
      <pointLight position={[0, CAPAS_3D[2]!.y, 0]} intensity={9} distance={9} decay={2} color={EMISSION.cyan} />

      <TechColumnFloor activo={activo} />
      <TechRings activo={activo} />
      <TechCore activo={activo} />

      <AjustarTamano />
      <Anclas onAnclas={onAnclas} />

      {/*
        Un solo efecto. Cada pasada extra es una copia del framebuffer por
        cuadro; el vinetado y el resto de la rejilla ya los pone la seccion en
        DOM, donde cuestan cero.
      */}
      <EffectComposer multisampling={calidad === 'alta' ? 4 : 0}>
        {/*
          BLOOM CONTENIDO. El umbral sube de 0,16 a 0,42 para que solo florezcan
          los EMISORES —labios, columna, nucleo, marca— y no las superficies
          iluminadas.
          La prueba es apagarlo: si sin bloom la maquina deja de verse premium,
          el problema esta en los materiales y taparlo con resplandor solo
          convierte la pieza en un contorno de neon. Con la corona en metal
          reflejando el entorno y la pared en cristal, la forma se sostiene sola.
        */}
        <Bloom
          mipmapBlur
          intensity={calidad === 'alta' ? 0.62 : 0.48}
          luminanceThreshold={0.42}
          luminanceSmoothing={0.3}
          radius={0.62}
        />
      </EffectComposer>
    </Canvas>
  )
}

/**
 * ¿HAY WEBGL?
 *
 * Se pregunta creando un contexto de verdad y tirandolo, no mirando si existe
 * `window.WebGLRenderingContext`: esa constante existe en navegadores que luego
 * NO conceden el contexto —driver en lista negra, aceleracion desactivada,
 * demasiados contextos vivos—. Preguntar por la constante da un si que despues
 * es un lienzo en blanco, y un lienzo en blanco es peor que la version SVG.
 */
export function useHayWebGL(): boolean | null {
  const [hay, setHay] = useState<boolean | null>(null)
  const hecho = useRef(false)

  const comprobar = useCallback(() => {
    if (hecho.current) return
    hecho.current = true
    try {
      const c = document.createElement('canvas')
      const gl = c.getContext('webgl2') ?? c.getContext('webgl')
      setHay(Boolean(gl))
      const perder = (gl as WebGLRenderingContext | null)?.getExtension('WEBGL_lose_context')
      perder?.loseContext()
    } catch {
      setHay(false)
    }
  }, [])

  useEffect(() => {
    comprobar()
  }, [comprobar])

  return hay
}
