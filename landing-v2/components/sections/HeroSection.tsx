'use client'

import { useEffect, useState, useCallback, useRef, forwardRef } from 'react'
import type { CSSProperties } from 'react'
import HeroGenesisOrb from '@/components/hero/HeroGenesisOrb'
import HeroLivingField from '@/components/hero/HeroLivingField'
import HeroPremiumTagline from '@/components/hero/HeroPremiumTagline'
import { detectHeroPerfTier, type HeroPerfTier } from '@/lib/hero-performance'
import { ROUTES, sectionHref } from '@/lib/routes'

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
        /*
          `lg:min-h-screen` y no `lg:h-screen`. El hero tenia su propia cadena de
          clases, escrita aqui y no en `SceneWrapper`, asi que la correccion de
          las otras doce secciones NO le llegaba.

          Con altura fija mas `overflow: hidden`, en una ventana de 683 px el
          contenido medía 884 y los botones quedaban 149 px POR DEBAJO del borde,
          cortados. El techo de `52vh` del nucleo hace que ya quepa; esto es la
          red por si algun dia vuelve a no caber: crecer se ve mal, pero perder
          la llamada a la accion se ve peor.
        */
        /*
          El hero tampoco fija su altura con utilidades.

          Tenia `min-h-[100svh]` y `lg:min-h-screen`, y las dos miden la ventana
          ENTERA — sin descontar la barra que las tapa al engancharse. Medido:
          sobraba 95 px. Ahora lleva `home-section-fit` como las otras trece y
          la altura sale de un solo sitio.
        */
        /*
          SIN `pt-20 sm:pt-24`: el mismo doble conteo que tenia trust.

          Ese relleno existia para despejar la barra fija, pero
          `.home-section-fit` ya resta `--enganche-alto` del alto disponible, asi
          que la barra se contaba dos veces. Medido: contenido 574 px, relleno
          superior 96, seccion 680 contra un hueco de 607 — el contenido cabia y
          la seccion no.

          El relleno comun de las catorce lo pone `--section-fit-pad-y`.
        */
        className="home-section-fit relative flex w-full flex-col items-center justify-center px-4 sm:px-6 text-center"
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
            {/*
              Era un <p>, y el <h1> de la pagina era el logotipo. Ahora el <h1>
              es esto: lo que hace el producto, no como se llama. Mismas clases,
              asi que se ve exactamente igual —Tailwind neutraliza el tamano y el
              peso propios de h1— y sigue habiendo un solo h1 en la pagina.
            */}
            <h1 className="hero-subtitle font-body">
              Donde la Inteligencia Artificial y el Blockchain crean{' '}
              <span className="text-white font-medium">un universo en expansión</span>
            </h1>

            {/*
              El envoltorio lleva la entrada y las anclas el :hover, porque las
              dos escriben `transform`. `.hero-ui-stack` es una columna con
              `align-items: center`, asi que el envoltorio se ajusta al contenido
              y queda centrado igual: no cambia la maquetacion.

              LA ACCION PRIMARIA AHORA LLEVA AL PRODUCTO.
              El unico boton del hero era "Explora el Universo", que hace scroll
              a la seccion de confianza. Es decir: el sitio pedia la accion mas
              importante SOLO desde el nav, y el hero —lo primero que se ve—
              devolvia al visitante a la misma pagina.

              `ROUTES.REGISTER` y el rotulo "Crear cuenta" no son invencion mia:
              los usa ya el cajon movil del nav. El `target` externo lo resuelve
              el mismo criterio que aplica `Button` a cualquier enlace de fuera.

              Explorar no se pierde: baja a secundaria, que es su sitio.
            */}
            <div className="hero-entra hero-cta-row" style={entra(0.28)}>
              <a
                href={ROUTES.REGISTER}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-signature focus-ring-signature hero-cta inline-flex min-h-11 items-center justify-center rounded-full px-7 sm:px-8 py-3.5 text-sm sm:text-base font-semibold text-white no-underline font-display pointer-events-auto"
              >
                Crear cuenta
              </a>
              <a
                href={sectionHref('trust')}
                className="cta-secondary focus-ring-genesis hero-cta inline-flex min-h-11 items-center justify-center rounded-full px-7 sm:px-8 py-3.5 text-sm sm:text-base font-semibold no-underline font-display pointer-events-auto"
              >
                Explora el Universo
              </a>
            </div>
          </div>
        </div>

        {/*
          `pointer-events-none` y `z-[1]`, los dos por lo mismo.

          El indicador va `absolute bottom-8` y el contenido del hero, centrado,
          llega casi hasta abajo: a 1000 px de alto se solapaban 16 y a 900 son
          66. Como iba a `z-[2]` —igual que la pila de contenido— y aparece
          despues en el DOM, se pintaba ENCIMA de los botones. Y con
          `pointer-events` activos, robaba el clic: en el punto (789, 840),
          dentro del CTA, quien lo recibia era `DIV.hero-scroll-mouse`.

          Es un adorno `aria-hidden` sin ninguna interaccion propia, asi que ni
          debe recibir clics ni taparle nada a una accion. No es un fallo que
          trajera la segunda accion: el boton unico, centrado y de 213 px,
          cubria exactamente la misma franja.

          Queda pendiente de decision de diseno lo otro: en ventanas de 900 px
          el contenido del hero ocupa hasta 892, asi que el indicador no CABE.
          O se recorta el hero o el indicador sobra ahi; eso ya no es un arreglo.
        */}
        <div
          className="hero-entra-fundido pointer-events-none absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 z-[1] flex flex-col items-center gap-2"
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
