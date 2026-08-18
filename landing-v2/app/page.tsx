'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { SceneProvider, useScene } from '@/context/SceneContext'
import { useSnapScroll } from '@/hooks/useSnapScroll'
import { useScrollMode } from '@/hooks/useScrollMode'
import { SNAP_SCROLL } from '@/lib/scroll/snapScrollConfig'
import { SECTIONS, TOTAL_SECTIONS, resolveNavigationTarget } from '@/lib/routes'
import { SCENE_BY_SECTION } from '@/components/sceneRegistry'
import Navbar from '@/components/layout/Navbar'
import SectionProgressDots from '@/components/ui/SectionProgressDots'
import { WebGLBoundary, soportaWebGL } from '@/components/webgl/WebGLBoundary'
import StaticWorldFallback from '@/components/webgl/StaticWorldFallback'

/**
 * El canvas se carga sólo en cliente. Antes esto pasaba por un
 * `components/webgl/WorldCanvas.tsx` que no hacía más que volver a envolver el
 * mismo `dynamic(ssr:false)` y reenviar trece props — se ha eliminado.
 */
const WorldCanvas = dynamic(
  () => import('@/components/webgl/WorldCanvasInner'),
  { ssr: false, loading: () => null }
)

/**
 * El canvas, con red debajo.
 *
 * DOS DEFENSAS, porque hay dos formas distintas de fallar:
 *
 *  1. El dispositivo no puede crear un contexto WebGL. Se pregunta ANTES de
 *     montar nada, así no se paga el coste de intentarlo ni se ensucia la
 *     consola.
 *  2. El contexto se crea pero algo revienta después —un shader que el driver
 *     rechaza, memoria agotada, el contexto perdido—. Eso sólo lo caza una
 *     barrera de error.
 *
 * Comprobar sólo lo primero deja fuera todo el segundo grupo, que es el que da
 * los fallos raros de los que nadie informa.
 *
 * El respaldo NO va dentro de la barrera: si el propio respaldo fallara, la
 * barrera no tendría a qué caer.
 */
function MundoVisual({ sectionIndex }: { sectionIndex: number }) {
  /*
   * LA DECISION SE TOMA DESPUES DE MONTAR, no durante el render.
   *
   * La primera version usaba `useState(soportaWebGL)`, que parece razonable y
   * rompe la hidratacion: el servidor no tiene `window`, asi que devuelve
   * `false` y renderiza el respaldo; el cliente devuelve `true` en su PRIMER
   * render y pinta el canvas. Dos arboles distintos, y React descarta el HTML
   * del servidor entero (errores #418 y #423 en produccion).
   *
   * Es el mismo fallo que ya arreglamos en `useScrollMode`, cometido otra vez a
   * las pocas horas. Se ve razonable justo porque parece defensivo.
   *
   * `null` = todavia no se sabe. Se pinta el respaldo, que es lo que emite el
   * servidor: primer render identico en ambos lados. En cuanto el efecto
   * resuelve, se cambia al canvas — y eso ya es una actualizacion de estado
   * normal, que React si aplica.
   */
  const [hayWebGL, setHayWebGL] = useState<boolean | null>(null)

  /*
   * SE ESPERA A QUE EL HILO PRINCIPAL ESTE OCIOSO.
   *
   * Montar aqui dispara la importacion dinamica del canvas, que arrastra 578 KB
   * de Three.js. Medido sobre el build de produccion a 390 px con 4x de freno de
   * CPU y Slow 4G:
   *
   *   primer pintado con contenido  1268 ms
   *   LCP (el parrafo del hero)     3504 ms
   *
   * La animacion de entrada del hero esta pensada para revelar ese parrafo unas
   * 0,82 s despues de la hidratacion —a los ~1970 ms— asi que sobraba 1,5 s. Ese
   * sobrante es Three.js analizandose y compitiendo por el hilo justo mientras
   * la animacion deberia estar corriendo.
   *
   * `requestIdleCallback` cede el turno al pintado del hero sin retrasar nada
   * mas: el `timeout` garantiza que el mundo entra igual aunque el navegador
   * nunca declare un hueco ocioso, y el respaldo estatico —que ya es lo que se
   * pintaba en este intervalo— cubre la espera.
   *
   * NO cambia lo que se ve: cambia CUANDO empieza a competir.
   */
  useEffect(() => {
    const arranca = () => setHayWebGL(soportaWebGL())
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(arranca, { timeout: 2500 })
      return () => window.cancelIdleCallback(id)
    }
    // Safari no lo trae: un turno suelto basta para no pelear con el pintado
    const id = window.setTimeout(arranca, 200)
    return () => window.clearTimeout(id)
  }, [])

  if (hayWebGL !== true) return <StaticWorldFallback />

  return (
    <WebGLBoundary fallback={<StaticWorldFallback />}>
      <WorldCanvas sectionIndex={sectionIndex} />
    </WebGLBoundary>
  )
}

function PageContent() {
  const { sectionIndexRef, scrollProgressRef, scrollToSectionRef } = useScene()
  const scrollMode = useScrollMode()
  /**
   * El hook escribe DIRECTAMENTE en los refs del contexto. Antes mantenía copias
   * propias y aquí se sincronizaban a mano poniendo el progreso a 0 en cada
   * cambio de sección — que era la única escritura que recibía en toda la app.
   */
  const { sectionIndex, registerSection, scrollToSection } = useSnapScroll(
    TOTAL_SECTIONS,
    scrollMode,
    { sectionIndexRef, scrollProgressRef }
  )
  const legalScrollTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    scrollToSectionRef.current = scrollToSection
  }, [scrollToSection, scrollToSectionRef])

  useEffect(() => {
    const navigateToTarget = (id: string, behavior: ScrollBehavior = 'smooth') => {
      const target = resolveNavigationTarget(id)
      if (!target) return
      scrollToSection(target.sectionIndex)
      if (target.anchorId) {
        if (legalScrollTimeoutRef.current !== null) {
          window.clearTimeout(legalScrollTimeoutRef.current)
        }
        const delayMs =
          scrollMode === 'natural'
            ? behavior === 'auto'
              ? 80
              : 320
            : behavior === 'auto'
              ? 100
              : SNAP_SCROLL.SCROLL_DURATION_MS + 80
        legalScrollTimeoutRef.current = window.setTimeout(() => {
          legalScrollTimeoutRef.current = null
          document.getElementById(target.anchorId!)?.scrollIntoView({ behavior, block: 'center' })
        }, delayMs)
      }
    }

    if (window.location.hash) {
      const id = window.location.hash.replace(/^#/, '')
      requestAnimationFrame(() => navigateToTarget(id, 'auto'))
    }

    const onHashChange = () => {
      const id = window.location.hash.replace(/^#/, '')
      if (id) navigateToTarget(id)
    }
    window.addEventListener('hashchange', onHashChange)

    const onDocumentClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!anchor) return
      const href = anchor.getAttribute('href')
      if (!href || href === '#') return
      const id = href.slice(1)
      const target = resolveNavigationTarget(id)
      if (!target) return
      e.preventDefault()
      navigateToTarget(id)
      window.history.replaceState(null, '', href)
    }

    document.addEventListener('click', onDocumentClick)
    return () => {
      window.removeEventListener('hashchange', onHashChange)
      document.removeEventListener('click', onDocumentClick)
      if (legalScrollTimeoutRef.current !== null) {
        window.clearTimeout(legalScrollTimeoutRef.current)
      }
    }
  }, [scrollToSection, scrollMode])

  return (
    <div className="home-snap-root fixed inset-0 h-screen w-screen overflow-hidden">
      <MundoVisual sectionIndex={sectionIndex} />
      <Navbar />
      <SectionProgressDots total={TOTAL_SECTIONS} current={sectionIndex} onDotClick={scrollToSection} />

      <main
        id="main-content"
        className="home-snap-main"
        data-scroll-mode={scrollMode}
        style={{
          position: 'fixed', inset: 0, zIndex: 2,
        }}
      >
        {SECTIONS.map((section) => {
          const Scene = SCENE_BY_SECTION[section.id]
          return (
            <Scene
              key={section.id}
              ref={registerSection(section.index)}
              isActive={sectionIndex === section.index}
            />
          )
        })}
      </main>
    </div>
  )
}

export default function HomePage() {
  return (
    <SceneProvider>
      <PageContent />
    </SceneProvider>
  )
}
