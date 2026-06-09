'use client'

import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

export default function PostEffects() {
  return (
    <EffectComposer>
      <Bloom
        luminanceThreshold={0.92}
        luminanceSmoothing={0.5}
        intensity={0.4}
        blendFunction={BlendFunction.ADD}
        mipmapBlur
      />
      <Vignette
        offset={0.3}
        darkness={0.5}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  )
}
