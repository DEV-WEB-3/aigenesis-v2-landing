'use client'

import { useEffect, useState, useCallback, useRef, forwardRef } from 'react'
import type { CSSProperties } from 'react'
import HeroGenesisOrb from '@/components/hero/HeroGenesisOrb'
import HeroLivingField from '@/components/hero/HeroLivingField'
import HeroPremiumTagline from '@/components/hero/HeroPremiumTagline'
import { detectHeroPerfTier, type HeroPerfTier } from '@/lib/hero-performance'
import { sectionHref } from '@/lib/routes'

/**
 * Retardo de entrada, para la animacion CSS de `.hero-entra`.
 *
 * Esto era `variants` + `custom` de framer-motion, lo que dejaba el hero entero
 * con `opacity: 0` en el HTML del servidor: el texto no aparecia hasta que
 * hidrataba React. El LCP de la pagina es justamente `.hero-subtitle`, asi que
 * el mayor coste de pintado lo pagaba el visitante esperando a JavaScript.
 *
 * Los tiempos son los mismos de antes; lo unico que cambia es quien los ejecuta.
 */
const entra = (retardo: number, opciones?: { desde?: number; duracion?: number }) =>
  ({
    '--hero-entra-retardo': `${retardo}s`,
    ...(opciones?.desde !== undefined ? { '--hero-entra-desde': `${opciones.desde}px` } : {}),
    ...(opciones?.duracion !== undefined ? { '--hero-entra-dur': `${opciones.duracion}s` } : {}),
  }) as CSSProperties

function UtcClock() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const update = () => {
      const n = new Date()
      setTime(
        `${n.getUTCHours().toString().padStart(2,'0')}:${n.getUTCMinutes().toString().padStart(2,'0')}:${n.getUTCSeconds().toString().padStart(2,'0')} UTC`
      )
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])
  return <span suppressHydrationWarning>{time}</span>
}

interface HeroSectionProps {
  isActive?: boolean
}

const HeroSection = forwardRef<HTMLElement, HeroSectionProps>(
  function HeroSection({ isActive: _isActive = true }, ref) {
    const [tier, setTier] = useState<HeroPerfTier>('medium')
    const tierLockedRef = useRef(false)

    useEffect(() => {
      if (tierLockedRef.current) return
      tierLockedRef.current = true
      setTier(detectHeroPerfTier())
    }, [])

    const setRefs = useCallback(
      (node: HTMLElement | null) => {
        if (typeof ref === 'function') ref(node)
        else if (ref) ref.current = node
      },
      [ref]
    )

    return (
      <section
        ref={setRefs}
        id="hero"
        className="relative flex min-h-[100svh] w-full flex-col items-center justify-center px-4 sm:px-6 pt-20 sm:pt-24 text-center lg:h-screen"
        style={{
          pointerEvents: 'auto',
          overflow: 'hidden',
        }}
      >
        <HeroLivingField tier={tier} />

        {/* UI siempre montado — evita desmontar logo/orb por flicker de isActive */}
        <div className="hero-content-shell relative z-[2] flex w-full flex-col items-center">
          <div className="hero-status-bar hero-entra" style={entra(0)}>
            <span>EST. 2019</span>
            <span className="text-genesis-core opacity-50">·</span>
            <span>GENESIS AI</span>
            <span className="text-genesis-core opacity-50">·</span>
            <UtcClock />
            <span className="text-genesis-core opacity-50">·</span>
            <span>BSC</span>
            <span className="text-genesis-core opacity-50">·</span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-1.5 w-1.5 rounded-full animate-pulse bg-genesis-fuchsia" />
              LIVE
            </span>
            <span className="text-genesis-core opacity-50">·</span>
            <span>V2.0</span>
          </div>

          <div className="hero-nucleus-stage hero-entra" style={entra(0.06)}>
            <HeroGenesisOrb tier={tier} />
          </div>

          <HeroPremiumTagline delay={0.12} />

          <div className="hero-ui-stack hero-entra" style={entra(0.14)}>
            <p className="hero-subtitle font-body">
              Donde la Inteligencia Artificial y el Blockchain crean{' '}
              <span className="text-white font-medium">un universo en expansión</span>
            </p>

            {/*
              El envoltorio lleva la entrada y el ancla el :hover, porque las dos
              escriben `transform`. `.hero-ui-stack` es una columna con
              `align-items: center`, asi que el envoltorio se ajusta al contenido
              y queda centrado igual: no cambia la maquetacion.
            */}
            <div className="hero-entra" style={entra(0.28)}>
              <a
                href={sectionHref('trust')}
                className="cta-signature focus-ring-signature hero-cta inline-flex min-h-11 items-center justify-center rounded-full px-7 sm:px-8 py-3.5 text-sm sm:text-base font-semibold text-white no-underline font-display pointer-events-auto"
              >
                Explora el Universo
              </a>
            </div>
          </div>
        </div>

        <div
          className="hero-entra-fundido absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 z-[2] flex flex-col items-center gap-2"
          style={entra(1.2, { duracion: 0.8 })}
        >
          <div className="hero-scroll-mouse" aria-hidden="true">
            <span className="hero-scroll-dot" />
          </div>
        </div>
      </section>
    )
  }
)

export default HeroSection
