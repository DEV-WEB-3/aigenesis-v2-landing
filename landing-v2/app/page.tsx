'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { SceneProvider, useScene } from '@/context/SceneContext'
import { useSnapScroll } from '@/hooks/useSnapScroll'
import { useScrollMode } from '@/hooks/useScrollMode'
import { SNAP_SCROLL } from '@/lib/scroll/snapScrollConfig'
import { SECTIONS, TOTAL_SECTIONS, resolveNavigationTarget } from '@/lib/routes'
import { SCENE_BY_SECTION } from '@/components/sceneRegistry'
import Navbar from '@/components/layout/Navbar'
import SectionProgressDots from '@/components/ui/SectionProgressDots'

/**
 * El canvas se carga sólo en cliente. Antes esto pasaba por un
 * `components/webgl/WorldCanvas.tsx` que no hacía más que volver a envolver el
 * mismo `dynamic(ssr:false)` y reenviar trece props — se ha eliminado.
 */
const WorldCanvas = dynamic(
  () => import('@/components/webgl/WorldCanvasInner'),
  { ssr: false, loading: () => null }
)

function PageContent() {
  const { sectionIndexRef, scrollProgressRef, scrollToSectionRef } = useScene()
  const scrollMode = useScrollMode()
  const { sectionIndex, registerSection, scrollToSection } = useSnapScroll(TOTAL_SECTIONS, scrollMode)
  const legalScrollTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    sectionIndexRef.current = sectionIndex
    scrollProgressRef.current = 0
  }, [sectionIndex, sectionIndexRef, scrollProgressRef])

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
      <WorldCanvas sectionIndex={sectionIndex} />
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
