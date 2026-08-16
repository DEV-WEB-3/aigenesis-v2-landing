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
import { isMobileWidth } from '@/lib/viewport'

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
