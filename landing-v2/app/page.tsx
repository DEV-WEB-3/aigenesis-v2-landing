'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { SceneProvider, useScene } from '@/context/SceneContext'
import { useSnapScroll } from '@/hooks/useSnapScroll'
import { SNAP_SCROLL } from '@/lib/scroll/snapScrollConfig'
import { TOTAL_SECTIONS, resolveNavigationTarget } from '@/lib/routes'
import Navbar from '@/components/layout/Navbar'
import HeroSection from '@/components/sections/HeroSection'
import Scene01_Trust from '@/components/scenes/Scene01_Trust'
import EcosystemSection from '@/components/sections/EcosystemSection'
import Scene02_AigToken from '@/components/scenes/Scene02_AigToken'
import Scene03_Mining from '@/components/scenes/Scene03_Mining'
import Scene04_Booster from '@/components/scenes/Scene04_Booster'
import Scene05_Staking from '@/components/scenes/Scene05_Staking'
import Scene03_GPulse from '@/components/scenes/Scene03_GPulse'
import Scene08_GOracle from '@/components/scenes/Scene08_GOracle'
import Scene04_GevyShop from '@/components/scenes/Scene04_GevyShop'
import Scene05_Community from '@/components/scenes/Scene05_Community'
import Scene06_Technology from '@/components/scenes/Scene06_Technology'
import Scene07_Roadmap from '@/components/scenes/Scene07_Roadmap'
import Scene08_CTA from '@/components/scenes/Scene08_CTA'
import SectionProgressDots from '@/components/ui/SectionProgressDots'

const WorldCanvas = dynamic(
  () => import('@/components/webgl/WorldCanvas'),
  { ssr: false, loading: () => null }
)

function PageContent() {
  const { sectionIndexRef, scrollProgressRef, scrollToSectionRef } = useScene()
  const { sectionIndex, registerSection, scrollToSection } = useSnapScroll(TOTAL_SECTIONS)
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
          behavior === 'auto' ? 100 : SNAP_SCROLL.SCROLL_DURATION_MS + 80
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
  }, [scrollToSection])

  return (
    <div className="home-snap-root fixed inset-0 h-screen w-screen overflow-hidden">
      <WorldCanvas
        heroActive={sectionIndex === 0}
        trustActive={sectionIndex === 1}
        tokenActive={sectionIndex === 3}
        miningActive={sectionIndex === 4}
        boosterActive={sectionIndex === 5}
        stakingActive={sectionIndex === 6}
        gpulseActive={sectionIndex === 7}
        goracleActive={sectionIndex === 8}
        marketplaceActive={sectionIndex === 9}
        communityActive={sectionIndex === 10}
        technologyActive={sectionIndex === 11}
        roadmapActive={sectionIndex === 12}
        ctaActive={sectionIndex === 13}
      />
      <Navbar />
      <SectionProgressDots total={TOTAL_SECTIONS} current={sectionIndex} onDotClick={scrollToSection} />

      <main
        id="main-content"
        className="home-snap-main"
        style={{
          position: 'fixed', inset: 0, zIndex: 2,
        }}
      >
        <HeroSection        ref={registerSection(0)}  isActive={sectionIndex === 0} />
        <Scene01_Trust      ref={registerSection(1)}  isActive={sectionIndex === 1} />
        <EcosystemSection   ref={registerSection(2)}  isActive={sectionIndex === 2} />
        <Scene02_AigToken   ref={registerSection(3)}  isActive={sectionIndex === 3} />
        <Scene03_Mining     ref={registerSection(4)}  isActive={sectionIndex === 4} />
        <Scene04_Booster    ref={registerSection(5)}  isActive={sectionIndex === 5} />
        <Scene05_Staking    ref={registerSection(6)}  isActive={sectionIndex === 6} />
        <Scene03_GPulse     ref={registerSection(7)}  isActive={sectionIndex === 7} />
        <Scene08_GOracle    ref={registerSection(8)}  isActive={sectionIndex === 8} />
        <Scene04_GevyShop   ref={registerSection(9)}  isActive={sectionIndex === 9} />
        <Scene05_Community  ref={registerSection(10)} isActive={sectionIndex === 10} />
        <Scene06_Technology ref={registerSection(11)} isActive={sectionIndex === 11} />
        <Scene07_Roadmap    ref={registerSection(12)} isActive={sectionIndex === 12} />
        <Scene08_CTA        ref={registerSection(13)} isActive={sectionIndex === 13} />
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
