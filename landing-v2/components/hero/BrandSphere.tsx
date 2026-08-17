'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { construirEsferaDeMarca, CARAS_MARCA, ANGULO_CARA } from '@/lib/brand/brandSphere'
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

/** Vuelta completa, en segundos. Las tres marcas se revelan solas en ese tiempo. */
const PERIODO_S = 26

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
  giroRef,
}: {
  porCara: number
  radio: number
  giroRef: React.MutableRefObject<number>
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
    giroRef.current += (delta * Math.PI * 2) / PERIODO_S
    grupo.current.rotation.y = giroRef.current
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
    // margen para que el resplandor no toque el borde
    // 1.12 y no 1.5: con 1.5 la esfera solo llenaba dos tercios del lienzo y,
    // sumado al recorte del logotipo por delante, apenas quedaba anillo visible.
    const objetivo = radio * 1.12
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
export default function BrandSphere({ tier, paused = false }: BrandSphereProps) {
  const [listo, setListo] = useState(false)
  const giroRef = useRef(0)
  const porCara = POR_CARA[tier]

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
    <div className="brand-sphere" aria-hidden="true">
      <Canvas
        frameloop={paused ? 'never' : 'always'}
        camera={{ position: [0, 0, 3.2], fov: 50 }}
        gl={{ antialias: tier === 'high', alpha: true, powerPreference: 'low-power' }}
        dpr={[1, tier === 'high' ? 2 : 1.5]}
      >
        <EncuadrarEsfera radio={1} />
        <NubeDeMarca porCara={porCara} radio={1} giroRef={giroRef} />
      </Canvas>
    </div>
  )
}

export { CARAS_MARCA, ANGULO_CARA }
