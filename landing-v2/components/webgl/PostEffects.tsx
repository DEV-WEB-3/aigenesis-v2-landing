'use client'

import { useEffect, useState } from 'react'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { isMobileWidth } from '@/lib/viewport'

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
    // Aquí el listener SÍ sirve: los parámetros del bloom son reactivos, a
    // diferencia de los atributos del contexto WebGL en WorldCanvasInner.
    const sync = () => setMobile(isMobileWidth(window.innerWidth))
    sync()
    window.addEventListener('resize', sync)
    return () => window.removeEventListener('resize', sync)
  }, [])

  if (heroActive) return null

  const bloomIntensity = pureDebug ? 0 : mobile ? 0.22 : 0.42

  return (
    <EffectComposer>
      {/*
        EL BLOOM ESTABA CONFIGURADO Y NO TOCABA NADA.

        `luminanceThreshold: 0.92` significa que solo florece lo que pasa del
        92 % de luminancia. Una particula pintada a opacidad 0,78 con un color
        de la rampa de marca NUNCA llega ahi — asi que el efecto existia, se
        calculaba en cada cuadro y no producia un solo pixel de resplandor.

        Con el umbral en 0,58 la luz de las particulas si florece, y al sumarse
        (blending aditivo) los cumulos se encienden solos. Eso es lo que separa
        una nube de puntos de una nube de LUZ.

        En movil el umbral se queda mas alto y la intensidad mas baja: el bloom
        con mipmap es de lo mas caro del cuadro.
      */}
      <Bloom
        luminanceThreshold={mobile ? 0.72 : 0.58}
        luminanceSmoothing={0.42}
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
