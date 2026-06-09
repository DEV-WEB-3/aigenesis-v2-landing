'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import GenesisOrb from './GenesisOrb'
import ParticleMorphSystem from './ParticleMorphSystem'
import PostEffects from './PostEffects'
import { useScene } from '@/context/SceneContext'

export default function WorldCanvasInner() {
  const { sectionIndexRef, scrollProgressRef } = useScene()

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1,
        pointerEvents: 'auto',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={0.8} color="#8B5CF6" />
        <pointLight position={[-5, -3, -2]} intensity={0.4} color="#E91E8B" />

        <Suspense fallback={null}>
          <GenesisOrb sectionIndexRef={sectionIndexRef} />
          <ParticleMorphSystem
            sectionIndexRef={sectionIndexRef}
            scrollProgressRef={scrollProgressRef}
          />
          <PostEffects />
        </Suspense>
      </Canvas>
    </div>
  )
}
