'use client'

import { EMISSION } from '@/lib/design/tokens'
import { alCambiarReproduccion, hayReproduccion } from '@/lib/reproduccionActiva'

import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import ParticleMorphSystem from './ParticleMorphSystem'
import PostEffects from './PostEffects'
import GenesisParticleControlPanel from '@/components/dev/GenesisParticleControlPanel'
import { AURA_ENTRIES } from './sectionAuras'
import { useScene } from '@/context/SceneContext'
import { useIsMounted } from '@/hooks/useIsMounted'
import { heroDebug } from '@/lib/hero-debug'
import { getSectionId } from '@/lib/routes'
import { isMobileWidth } from '@/lib/viewport'

/**
 * LA NUBE DE PARTICULAS NO SE PINTA.
 *
 * Decision del owner, y con un motivo que se ve en cuanto te lo senalan: sobre
 * las figuras de cada seccion quedaba un punado de puntos sueltos, grisaceos y
 * sin relacion con nada — ni con el nucleo, ni con las orbitas, ni con los
 * rotulos. No leen como polvo estelar: leen como suciedad en la pantalla.
 *
 * DONDE APARECIAN, y el dato confirma la observacion del owner («del booster
 * para abajo»). Contando particulas APARCADAS —las que el sistema esconde
 * mandandolas a (-120,-120,0)— en cada transicion:
 *
 *   ecosistema · token · mining    600 de 600 aparcadas -> invisibles
 *   booster                        216 aparcadas -> 384 A LA VISTA
 *   staking, gpulse, goracle...    visibles
 *
 * Exactamente desde booster. Las tres secciones anteriores dibujan su visual
 * con SVG y por eso alli no se notaba nada.
 *
 * QUE SE APAGA CON ESTO, dicho sin adornar, porque es bastante:
 *
 *   el linaje entre secciones — que la materia de cada seccion descendiera de
 *   la anterior en vez de aparecer de la nada
 *   el relevo del hero — la caida del logo en cuatro tiempos
 *   el material aditivo y el bloom — que las particulas fueran luz y no pintura
 *
 * Todo eso sigue en el codigo, correcto y medido; simplemente deja de verse. Si
 * la nube no convence, la maquinaria elegante que hay detras no la salva — y
 * apagarla es una decision de diseno legitima, no una perdida.
 *
 * Se apaga el LIENZO ENTERO, no solo los puntos: sin particulas, el canvas
 * renderiza tres luces sobre nada y mantiene vivo un contexto WebGL y una
 * pasada de post-proceso con bloom en cada cuadro. Las auras de seccion NO se
 * tocan: viven fuera del canvas, en DOM.
 *
 * La reversa es esta constante.
 */
const PINTAR_PARTICULAS = false

interface WorldCanvasInnerProps {
  /** Índice de la sección activa. Única entrada: lo demás se deriva de aquí. */
  sectionIndex: number
}

export default function WorldCanvasInner({ sectionIndex }: WorldCanvasInnerProps) {
  const activeSection = getSectionId(sectionIndex)
  const heroActive = activeSection === 'hero'

  /*
   * EL BUCLE SE PARA MIENTRAS SE REPRODUCE UN VIDEO.
   *
   * Medido: con el héroe pintando, el fotograma de la portada tarda 98,7 ms
   * —10 fps— y el video del asistente se queda clavado. En una página sin
   * héroe, 8,3 ms y el mismo video va fluido. Quien pulsa reproducir ya dijo
   * qué quiere mirar; el fondo animado pasa a ser lo que estorba.
   */
  const [videoEnCurso, setVideoEnCurso] = useState(false)
  useEffect(() => {
    const baja = alCambiarReproduccion(setVideoEnCurso)
    /*
     * Y ADEMÁS SE REVISA SOLO, cada segundo.
     *
     * Los otros dos lienzos son de Canvas 2D y preguntan en cada fotograma, así
     * que se recuperan gratis. Éste vive de una suscripción, y una suscripción
     * sólo se entera de lo que alguien le cuenta: si un video muriera sin que
     * nadie lo anuncie, este lienzo se quedaría apagado el resto de la sesión —
     * o sea, un rectángulo sin pintar detrás del contenido.
     *
     * Un intervalo de un segundo que consulta el estado real cuesta nada y
     * convierte «puede quedarse pegado» en «se despega solo en un segundo».
     */
    const reloj = window.setInterval(() => setVideoEnCurso(hayReproduccion()), 1000)
    return () => {
      baja()
      window.clearInterval(reloj)
    }
  }, [])

  const { sectionIndexRef, scrollProgressRef } = useScene()
  const prevHeroActive = useRef(heroActive)
  const mounted = useIsMounted()
  const showDevPanel = mounted && process.env.NODE_ENV !== 'production'
  /**
   * Perfil GL del dispositivo — se decide UNA vez, antes de crear el renderer.
   *
   * `antialias` y `powerPreference` son atributos del contexto WebGL: se fijan al
   * crearlo y no se pueden cambiar después. R3F lo dice en su propio código
   * ("Set up renderer (one time only!)"): sólo construye el renderer si aún no
   * existe, así que cambiar la prop `gl` más tarde no tiene ningún efecto.
   *
   * Antes esto arrancaba en `false` y se corregía en un `useEffect`, que corre
   * DESPUÉS del primer render. Para entonces el renderer ya estaba creado con
   * antialias activado y `high-performance` — justo lo contrario de lo que se
   * buscaba, y precisamente en los móviles donde más importa.
   *
   * Este componente sólo se carga con `dynamic(..., { ssr: false })`, así que
   * `window` existe ya en el primer render: leerlo aquí es seguro y no hay
   * desajuste de hidratación posible.
   *
   * Sin listener de `resize` a propósito: no serviría de nada (el contexto ya
   * está creado) y provocaría re-renders del árbol del canvas para nada.
   */
  const [mobileGl] = useState(
    () => typeof window !== 'undefined' && isMobileWidth(window.innerWidth)
  )

  useEffect(() => {
    if (prevHeroActive.current !== heroActive) {
      heroDebug('world-canvas-hero-active', {
        from: prevHeroActive.current,
        to: heroActive,
      })
      prevHeroActive.current = heroActive
    }
  }, [heroActive])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1,
        pointerEvents: heroActive ? 'none' : 'auto',
        opacity: heroActive ? 0 : 1,
        visibility: heroActive ? 'hidden' : 'visible',
        display: heroActive ? 'none' : 'block',
        transition: heroActive ? 'none' : 'opacity 0.5s ease',
      }}
    >
      {AURA_ENTRIES.map(([id, Aura]) => (
        <Aura key={id} visible={activeSection === id} />
      ))}
      {PINTAR_PARTICULAS ? (
      <Canvas
        frameloop={heroActive || videoEnCurso ? 'never' : 'always'}
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ antialias: !mobileGl, alpha: true, powerPreference: mobileGl ? 'low-power' : 'high-performance' }}
        style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', display: 'block' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={0.72} color={EMISSION.violet} />
        <pointLight position={[-5, -3, -2]} intensity={0.28} color={EMISSION.magenta} />
        <pointLight position={[0, 2, 4]} intensity={0.35} color={EMISSION.cyan} />

        <Suspense fallback={null}>
          <ParticleMorphSystem
            sectionIndexRef={sectionIndexRef}
            scrollProgressRef={scrollProgressRef}
            heroActive={heroActive}
          />
          <PostEffects heroActive={heroActive} />
        </Suspense>
      </Canvas>
      ) : null}
      {showDevPanel ? <GenesisParticleControlPanel /> : null}
    </div>
  )
}
