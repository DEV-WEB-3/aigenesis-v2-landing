'use client'

import { useT } from '@/context/IdiomaContext'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { construirEsferaDeMarca, CARAS_MARCA, ANGULO_CARA } from '@/lib/brand/brandSphere'
import { useBrandSphereGesture } from '@/lib/brand/useBrandSphereGesture'
import BrandSphereShell from './BrandSphereShell'
import type { HeroPerfTier } from '@/lib/hero-performance'

/**
 * Partículas POR CARA según el nivel del dispositivo.
 *
 * Se multiplica por tres (hay tres marcas), así que `high` dibuja 2.700 puntos.
 * Es un solo `Points` con una llamada de dibujo, así que el coste real está en
 * el relleno de píxeles, no en el número.
 */
const POR_CARA: Record<HeroPerfTier, number> = {
  high: 900,
  medium: 520,
  low: 0, // en `low` no se monta: se queda el orbe 2D
}

/**
 * 0.55 y no 0.95. A plena opacidad las particulas tapaban la barra de estado y
 * el lema, que pasan por delante de la esfera. Es un UMBRAL de energia
 * alrededor del logotipo, no una cortina: tiene que dejar leer lo que hay
 * detras.
 */
const OPACIDAD = 0.55

/**
 * Nube de partículas de las tres marcas sobre una esfera.
 *
 * `renderOrder`/`depthWrite` a false: las partículas de la cara trasera deben
 * verse a través de las de delante —es una nube, no un sólido—, y con escritura
 * de profundidad activada se ocultarían entre ellas según el orden de dibujo.
 */
function NubeDeMarca({
  porCara,
  radio,
  avanzar,
}: {
  porCara: number
  radio: number
  avanzar: (delta: number, ahora: number) => number
}) {
  const grupo = useRef<THREE.Group>(null)
  const { posiciones, colores } = useMemo(
    () => construirEsferaDeMarca(porCara, radio),
    [porCara, radio]
  )

  const geometria = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(posiciones, 3))
    g.setAttribute('color', new THREE.BufferAttribute(colores, 3))
    return g
  }, [posiciones, colores])

  useEffect(() => () => geometria.dispose(), [geometria])

  useFrame((_, delta) => {
    if (!grupo.current) return
    // El gesto decide el giro: rotacion automatica, inercia o encaje. Aqui solo
    // se aplica — el bucle no conoce el modo en el que esta.
    grupo.current.rotation.y = avanzar(delta, performance.now())
  })

  return (
    <group ref={grupo}>
      <points geometry={geometria} renderOrder={2}>
        <pointsMaterial
          size={radio * 0.038}
          sizeAttenuation
          vertexColors
          transparent
          opacity={OPACIDAD}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}

/**
 * Ajusta la cámara para que la esfera ocupe el encuadre sea cual sea el tamaño
 * del contenedor. Sin esto, en un contenedor bajo la esfera se sale por arriba.
 */
function EncuadrarEsfera({ radio }: { radio: number }) {
  const { camera, size } = useThree()

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera
    const aspecto = size.width / size.height
    /*
     * 1.42 y no 1.12. AQUI ESTA EL CORTE QUE SE VEIA EN LOS CUATRO LADOS.
     *
     * `objetivo` es cuanto del lienzo ocupa la esfera. Con 1.12 el circulo
     * llenaba el 93 % del lienzo — pero el resplandor Fresnel NO TERMINA en el
     * borde geometrico de la malla: se extiende mas alla, y ese halo quedaba
     * cortado por el borde del lienzo.
     *
     * Por eso mi medida anterior decia «cabe»: medi el radio de la MALLA (260
     * px en un lienzo de 560) y daba de sobra. Lo que no cabia era la LUZ.
     * Medido en el perfil horizontal a la altura del centro: luminancia 88 justo
     * dentro del borde y 190 justo fuera — el resplandor estaba vivo
     * exactamente donde el lienzo se acababa.
     *
     * Con 1.42 la esfera ocupa el 73 % y quedan ~75 px de margen por lado para
     * que el halo se apague solo. El tamano aparente se recupera agrandando el
     * contenedor en la hoja de estilos, no acercando la camara.
     */
    const objetivo = radio * 1.42
    const fovRad = (cam.fov * Math.PI) / 180
    const distV = objetivo / Math.tan(fovRad / 2)
    const distH = objetivo / (Math.tan(fovRad / 2) * aspecto)
    cam.position.set(0, 0, Math.max(distV, distH))
    cam.updateProjectionMatrix()
  }, [camera, size, radio])

  return null
}

export interface BrandSphereProps {
  tier: HeroPerfTier
  /** Se pausa cuando el hero no está visible: no gastar GPU fuera de pantalla. */
  paused?: boolean
}

/**
 * LA ESFERA DE MARCA.
 *
 * QUE ES
 * Las tres marcas del ecosistema —Genesis, G-Pulse y Gevy— dibujadas como nubes
 * de partículas sobre una misma esfera, a 120° cada una. Gira sola y las va
 * revelando.
 *
 * POR QUE PARTICULAS Y NO TEXTURAS
 * Poner los logotipos como textura sobre una bola los deforma con el mapeado UV
 * y se leen como «impresos en una pelota». Con partículas cada punto se proyecta
 * a la superficie —proyección azimutal equidistante, ver `lib/brand/brandSphere`—
 * así que la silueta no se deforma y al girar se curva como algo que de verdad
 * está sobre una superficie curva.
 *
 * Y es además el lenguaje que este sitio YA habla: el sistema de partículas de
 * Trust dibuja el logotipo así desde antes que esto existiera. La transición
 * entre marcas no es un corte: es la nube recomponiéndose.
 *
 * COMO SE MONTA — Y POR QUE ASI
 * Va ENCIMA del orbe 2D, no en su lugar. Tres razones medidas:
 *
 *  1. El `<img>` del logotipo es el elemento LCP de la página. Si la esfera lo
 *     sustituyera, el mayor pintado pasaría a depender de que cargue Three
 *     —578 KB— y el LCP volvería a subir. Así el logotipo pinta primero, y la
 *     esfera materializa alrededor.
 *
 *  2. Si WebGL falla, no se pierde nada: debajo sigue el orbe de siempre.
 *
 *  3. En `low` no se monta en absoluto.
 *
 * El montaje espera a `requestIdleCallback` por el mismo motivo que el mundo
 * WebGL global: no competir con el primer pintado.
 */
/** Nombre visible de cada marca, para los indicadores y el lector de pantalla. */
const ROTULO: Record<(typeof CARAS_MARCA)[number], string> = {
  genesis: 'Genesis',
  gpulse: 'G-Pulse',
  gevy: 'Gevy',
}

export default function BrandSphere({ tier, paused = false }: BrandSphereProps) {
  const t = useT()
  const [listo, setListo] = useState(false)
  const [caraActiva, setCaraActiva] = useState(0)
  const porCara = POR_CARA[tier]
  const { avanzar, alBajar, irACara } = useBrandSphereGesture(setCaraActiva)

  useEffect(() => {
    if (porCara === 0) return
    const arranca = () => setListo(true)
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(arranca, { timeout: 2200 })
      return () => window.cancelIdleCallback(id)
    }
    const id = window.setTimeout(arranca, 220)
    return () => window.clearTimeout(id)
  }, [porCara])

  if (porCara === 0 || !listo) return null

  return (
    <>
      {/*
        `pointer-events: auto` SOLO aqui, y `touch-action: pan-y` en la hoja de
        estilos: un gesto vertical tiene que seguir desplazando la pagina. Robar
        el scroll es la forma mas rapida de que alguien no pueda salir de la
        seccion.

        Sin `aria-hidden`: la esfera ya no es decoracion, es un control. Lleva
        `role="group"` con su nombre y lo que anuncia es la MARCA que esta al
        frente, no el angulo — que es lo unico que le importa a quien no la ve.
      */}
      <div
        className="brand-sphere"
        role="group"
        aria-label={t('Marcas del ecosistema')}
        onPointerDown={(e) => alBajar(e.nativeEvent)}
      >
        <Canvas
          frameloop={paused ? 'never' : 'always'}
          camera={{ position: [0, 0, 3.2], fov: 50 }}
          gl={{ antialias: tier === 'high', alpha: true, powerPreference: 'low-power' }}
          dpr={[1, tier === 'high' ? 2 : 1.5]}
        >
          <EncuadrarEsfera radio={1} />
          {/*
            El umbral va DENTRO del mismo lienzo que la nube: un solo contexto
            WebGL, y el shell se compone con las particulas sin una pasada extra.
            En `medium` va a media intensidad — el Fresnel es barato pero el
            relleno de pixeles no es gratis en una GPU integrada.
          */}
          <BrandSphereShell radio={1} intensidad={tier === 'high' ? 1 : 0.55} />
          <NubeDeMarca porCara={porCara} radio={1} avanzar={avanzar} />
        </Canvas>
      </div>

      {/*
        LOS INDICADORES SON EL CONTROL ACCESIBLE, no un adorno.

        Arrastrar es un gesto que no todo el mundo puede hacer, y ademas no se
        descubre solo. Estos tres botones hacen lo mismo, se alcanzan con el
        teclado y dicen a donde llevan. La esfera gira sola de todas formas, asi
        que nadie DEPENDE de ellos — pero quien quiera ir a una marca concreta
        puede.
      */}
      {/*
        Los indicadores viven FUERA del nucleo: dentro caian en y=519 y el lema
        empieza en 525, asi que se solapaban con el texto y el logotipo estatico
        los tapaba. `position: fixed` respecto al hero via `.hero-content-shell`
        no servia —el nucleo tiene su propio contexto—, asi que se sacan aqui y
        la hoja de estilos los ancla al pie del nucleo con sitio propio.
      */}
      {/*
        EL ROTULO NOMBRA LA MARCA QUE ESTA AL FRENTE.

        La esfera revela Genesis, G-Pulse y Gevy — la historia del proyecto en
        una imagen. Pero el texto del hero hablaba solo en abstracto, asi que
        cuando la esfera mostraba Gevy el visitante veia un logotipo que NO
        APARECIA por ningun lado en la pagina. La imagen prometia concrecion y
        la palabra devolvia abstraccion.

        El estado ya sabia cual esta al frente —lo usaban los indicadores y la
        region viva para lectores de pantalla—. Solo faltaba mostrarselo a quien
        si ve.

        `key` fuerza el remontaje al cambiar de marca: sin el, React reutiliza el
        nodo y la animacion de entrada no se reproduce.
      */}
      {/*
        Rotulo y puntos en UNA sola pila.
        Iban anclados por separado al mismo borde del nucleo, asi que cada
        ajuste movia los dos y acababan solapados —medido: -3 px entre ellos—.
        Agrupados, el hueco lo decide un `gap` y no dos calculos que se pisan.
      */}
      <div className="brand-sphere-controles">
        {/*
          EL ROTULO CALLA CUANDO LA MARCA AL FRENTE ES GENESIS.

          El logotipo estatico ya dice GENESIS en grande, justo encima. Repetirlo
          en pequeño doce pixeles mas abajo no informa de nada: es ruido, y de
          los que se notan.

          Para G-Pulse y Gevy si aporta, porque son las dos marcas que el
          visitante NO reconoce todavia — que es justo el problema que este
          rotulo existe para resolver.
        */}
        <span
          key={caraActiva}
          className={`brand-sphere-rotulo${caraActiva === 0 ? ' brand-sphere-rotulo--oculto' : ''}`}
        >
          {ROTULO[CARAS_MARCA[caraActiva]]}
        </span>

        <div className="brand-sphere-dots">
        {CARAS_MARCA.map((cara, i) => (
          <button
            key={cara}
            type="button"
            className={`brand-sphere-dot${i === caraActiva ? ' brand-sphere-dot--activo' : ''}`}
            aria-label={`${t('Ver')} ${ROTULO[cara]}`}
            aria-current={i === caraActiva ? 'true' : undefined}
              onClick={() => irACara(i)}
            />
          ))}
        </div>
      </div>

      {/* Cambia poco y sin interrumpir: `polite` es lo correcto aqui. */}
      <span className="sr-only" aria-live="polite">
        {ROTULO[CARAS_MARCA[caraActiva]]}
      </span>
    </>
  )
}

export { CARAS_MARCA, ANGULO_CARA }
