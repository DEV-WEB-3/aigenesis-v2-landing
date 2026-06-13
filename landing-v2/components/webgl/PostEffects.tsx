'use client'

import { useEffect, useState } from 'react'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

function isPureColorDebug(): boolean {
  if (typeof window === 'undefined') return false
  return Boolean(
    (window as Window & { __GENESIS_PURE_COLOR_DEBUG__?: boolean }).__GENESIS_PURE_COLOR_DEBUG__
  )
}

interface PostEffectsProps {
  heroActive?: boolean
}

export default function PostEffects({ heroActive = false }: PostEffectsProps) {
  const pureDebug = isPureColorDebug()
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const sync = () => setMobile(window.innerWidth < 768)
    sync()
    window.addEventListener('resize', sync)
    return () => window.removeEventListener('resize', sync)
  }, [])

  if (heroActive) return null

  const bloomIntensity = pureDebug ? 0 : mobile ? 0.1 : 0.18

  return (
    <EffectComposer>
      <Bloom
        luminanceThreshold={mobile ? 0.95 : 0.92}
        luminanceSmoothing={0.62}
        intensity={bloomIntensity}
        blendFunction={BlendFunction.ADD}
        mipmapBlur={!mobile}
      />
      <Vignette
        offset={0.3}
        darkness={mobile ? 0.42 : 0.5}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  )
}
