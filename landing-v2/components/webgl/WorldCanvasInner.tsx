'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import ParticleMorphSystem from './ParticleMorphSystem'
import PostEffects from './PostEffects'
import GenesisBackgroundAura from '@/components/trust/GenesisBackgroundAura'
import GenesisTokenCoreAura from '@/components/token/GenesisTokenCoreAura'
import GenesisMiningCoreAura from '@/components/mining/GenesisMiningCoreAura'
import GenesisBoosterAura from '@/components/booster/GenesisBoosterAura'
import GenesisStakingAura from '@/components/staking/GenesisStakingAura'
import GenesisGpulseAura from '@/components/gpulse/GenesisGpulseAura'
import GenesisGoracleAura from '@/components/goracle/GenesisGoracleAura'
import GenesisMarketplaceAura from '@/components/marketplace/GenesisMarketplaceAura'
import GenesisCommunityAura from '@/components/community/GenesisCommunityAura'
import GenesisTechnologyAura from '@/components/technology/GenesisTechnologyAura'
import GenesisRoadmapAura from '@/components/roadmap/GenesisRoadmapAura'
import GenesisPortalAura from '@/components/portal/GenesisPortalAura'
import GenesisParticleControlPanel from '@/components/dev/GenesisParticleControlPanel'
import { useScene } from '@/context/SceneContext'
import { useIsMounted } from '@/hooks/useIsMounted'
import { heroDebug } from '@/lib/hero-debug'

interface WorldCanvasInnerProps {
  heroActive?: boolean
  trustActive?: boolean
  tokenActive?: boolean
  miningActive?: boolean
  boosterActive?: boolean
  stakingActive?: boolean
  gpulseActive?: boolean
  goracleActive?: boolean
  marketplaceActive?: boolean
  communityActive?: boolean
  technologyActive?: boolean
  roadmapActive?: boolean
  ctaActive?: boolean
}

export default function WorldCanvasInner({
  heroActive = false,
  trustActive = false,
  tokenActive = false,
  miningActive = false,
  boosterActive = false,
  stakingActive = false,
  gpulseActive = false,
  goracleActive = false,
  marketplaceActive = false,
  communityActive = false,
  technologyActive = false,
  roadmapActive = false,
  ctaActive = false,
}: WorldCanvasInnerProps) {
  const { sectionIndexRef, scrollProgressRef } = useScene()
  const prevHeroActive = useRef(heroActive)
  const mounted = useIsMounted()
  const showDevPanel = mounted && process.env.NODE_ENV !== 'production'
  const [mobileGl, setMobileGl] = useState(false)

  useEffect(() => {
    const sync = () => setMobileGl(window.innerWidth < 768)
    sync()
    window.addEventListener('resize', sync)
    return () => window.removeEventListener('resize', sync)
  }, [])

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
      <GenesisBackgroundAura visible={trustActive && !heroActive} />
      <GenesisTokenCoreAura visible={tokenActive && !heroActive} />
      <GenesisMiningCoreAura visible={miningActive && !heroActive} />
      <GenesisBoosterAura visible={boosterActive && !heroActive} />
      <GenesisStakingAura visible={stakingActive && !heroActive} />
      <GenesisGpulseAura visible={gpulseActive && !heroActive} />
      <GenesisGoracleAura visible={goracleActive && !heroActive} />
      <GenesisMarketplaceAura visible={marketplaceActive && !heroActive} />
      <GenesisCommunityAura visible={communityActive && !heroActive} />
      <GenesisTechnologyAura visible={technologyActive && !heroActive} />
      <GenesisRoadmapAura visible={roadmapActive && !heroActive} />
      <GenesisPortalAura visible={ctaActive && !heroActive} />
      <Canvas
        frameloop={heroActive ? 'never' : 'always'}
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ antialias: !mobileGl, alpha: true, powerPreference: mobileGl ? 'low-power' : 'high-performance' }}
        style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', display: 'block' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={0.72} color="#6E56CF" />
        <pointLight position={[-5, -3, -2]} intensity={0.28} color="#E91E8B" />
        <pointLight position={[0, 2, 4]} intensity={0.35} color="#22D3EE" />

        <Suspense fallback={null}>
          <ParticleMorphSystem
            sectionIndexRef={sectionIndexRef}
            scrollProgressRef={scrollProgressRef}
            heroActive={heroActive}
          />
          <PostEffects heroActive={heroActive} />
        </Suspense>
      </Canvas>
      {showDevPanel ? <GenesisParticleControlPanel /> : null}
    </div>
  )
}
