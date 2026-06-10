'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { SceneProvider, useScene } from '@/context/SceneContext'
import { useSnapScroll } from '@/hooks/useSnapScroll'
import Navbar from '@/components/layout/Navbar'
import HeroSection from '@/components/sections/HeroSection'
import EcosystemSection from '@/components/sections/EcosystemSection'
import Scene02_AigToken  from '@/components/scenes/Scene02_AigToken'
import Scene03_GPulse    from '@/components/scenes/Scene03_GPulse'
import Scene04_GevyShop  from '@/components/scenes/Scene04_GevyShop'
import Scene05_Community from '@/components/scenes/Scene05_Community'
import Scene06_Technology from '@/components/scenes/Scene06_Technology'
import Scene07_Roadmap   from '@/components/scenes/Scene07_Roadmap'
import Scene08_CTA       from '@/components/scenes/Scene08_CTA'
import SectionProgressDots from '@/components/ui/SectionProgressDots'

const WorldCanvas = dynamic(
  () => import('@/components/webgl/WorldCanvas'),
  { ssr: false, loading: () => null }
)

const TOTAL_SECTIONS = 9

function PageContent() {
  const { sectionIndexRef, scrollProgressRef } = useScene()
  const { sectionIndex, registerSection, scrollToSection } = useSnapScroll(TOTAL_SECTIONS)

  useEffect(() => {
    sectionIndexRef.current   = sectionIndex
    scrollProgressRef.current = 0
  }, [sectionIndex, sectionIndexRef, scrollProgressRef])

  return (
    <>
      <WorldCanvas />
      <Navbar />
      <SectionProgressDots total={TOTAL_SECTIONS} current={sectionIndex} onDotClick={scrollToSection} />

      <main style={{
        position: 'fixed', inset: 0, zIndex: 2,
        overflowY: 'scroll', scrollSnapType: 'y mandatory',
        WebkitOverflowScrolling: 'touch',
      }}>
        <HeroSection       ref={registerSection(0)} isActive={sectionIndex === 0} />
        <EcosystemSection  ref={registerSection(1)} isActive={sectionIndex === 1} />
        <Scene02_AigToken  ref={registerSection(2)} isActive={sectionIndex === 2} />
        <Scene03_GPulse    ref={registerSection(3)} isActive={sectionIndex === 3} />
        <Scene04_GevyShop  ref={registerSection(4)} isActive={sectionIndex === 4} />
        <Scene05_Community ref={registerSection(5)} isActive={sectionIndex === 5} />
        <Scene06_Technology ref={registerSection(6)} isActive={sectionIndex === 6} />
        <Scene07_Roadmap   ref={registerSection(7)} isActive={sectionIndex === 7} />
        <Scene08_CTA       ref={registerSection(8)} isActive={sectionIndex === 8} />
      </main>
    </>
  )
}

export default function HomePage() {
  return (
    <SceneProvider>
      <PageContent />
    </SceneProvider>
  )
}
