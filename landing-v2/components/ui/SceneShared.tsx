'use client'

import { useRef, useEffect, forwardRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { Button } from '@/components/ui/genesis'
import { useSectionEnterAnimation } from '@/hooks/useSectionEnterAnimation'
import { SectionVisualProvider } from '@/hooks/useSectionVisualActive'
import { useFitToBand } from '@/hooks/useFitToBand'
import GenesisOrbSignature, { type GenesisOrbPlacement } from '@/components/brand/GenesisOrbSignature'
import { HeadingLevel } from '@/components/ui/genesis/Heading'
import { LLEGADA_CONTENIDO_S, LLEGADA_CIFRA_S } from '@/lib/design/motion'

// ─── Variants compartidos ─────────────────────────────────────────────────────
/*
  LOS `exit` SE HAN QUITADO PORQUE NO PODIAN EJECUTARSE.

  Llevaban 0,25 · 0,22 · 0,2 s, tres duraciones fuera de la rejilla, en ramas
  inalcanzables. `AnimatePresence` envuelve `{shouldMountContent && ...}` y
  `shouldMountContent` es `entered || isActive`, con `entered` PEGAJOSO: el hook
  solo hace `setEntered(true)` y nunca lo revierte. El contenido, una vez
  montado, no se desmonta jamas — asi que nada sale nunca.

  Una rama que no puede ejecutarse es peor que ninguna: invita a razonar sobre
  un comportamiento que no existe, y ademas escondia tres valores sueltos donde
  ninguna guarda los buscaba.
*/
const ENTRADA = { duration: LLEGADA_CONTENIDO_S, ease: [0.4, 0, 0.2, 1] } as const

export const containerV = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.10, delayChildren: 0.05 } },
}
export const slideLeft = {
  hidden:  { opacity: 0, x: -50, filter: 'blur(6px)' },
  visible: { opacity: 1, x: 0,   filter: 'blur(0px)', transition: ENTRADA },
}
/** Text-safe entrance — no filter blur (mobile card readability) */
export const slideLeftCrisp = {
  hidden:  { opacity: 0, x: -28 },
  visible: { opacity: 1, x: 0, transition: ENTRADA },
}
export const wordV = {
  hidden:  { opacity: 0, y: 28, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0,  filter: 'blur(0px)', transition: ENTRADA },
}

// ─── SectionLabel — prefer SectionHeader; kept for legacy one-off labels ───────
export function SectionLabel({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.span variants={slideLeft} className={`label-section ${className}`.trim()}>
      {children}
    </motion.span>
  )
}

export type GradientTone = 'strong' | 'brand' | 'signature' | 'intelligence'

const gradientToneClass: Record<GradientTone, string> = {
  strong: 'text-gradient-genesis-strong',
  brand: 'text-gradient-genesis-strong',
  signature: 'text-gradient-genesis-strong',
  intelligence: 'text-gradient-genesis-strong',
}

// ─── GradientText — acento G-Pulse (referencia oficial Genesis) ───────────────
export function GradientText({
  children,
  tone = 'signature',
}: {
  children: React.ReactNode
  tone?: GradientTone
}) {
  return (
    <motion.span
      variants={wordV}
      className={`${gradientToneClass[tone]} block`}
    >
      {children}
    </motion.span>
  )
}

/** Headline estándar Genesis — mismo tratamiento que G-Pulse «tiempo real.» */
export function GenesisHeadline({
  lead,
  highlight,
  variant = 'default',
}: {
  lead: string
  highlight: string
  variant?: 'default' | 'cta'
}) {
  return (
    <motion.h2
      className={
        variant === 'cta'
          ? 'cta-final-headline text-[clamp(2.35rem,5.8vw,3.85rem)] font-bold leading-[1.08] font-display'
          : 'scene-headline text-5xl font-bold leading-tight font-display'
      }
      style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}
    >
      <motion.span variants={wordV} className="block text-genesis-text">
        {lead}
      </motion.span>
      <GradientText tone="signature">{highlight}</GradientText>
    </motion.h2>
  )
}

// ─── GradientButton — delega al Button primario del Design System ─────────────
export function GradientButton({
  children,
  className = '',
  href,
}: {
  children: React.ReactNode
  className?: string
  href?: string
}) {
  return (
    <motion.div variants={slideLeft} className="w-fit">
      <Button variant="primary" size="md" className={className} href={href}>
        {children}
      </Button>
    </motion.div>
  )
}

// ─── Feature item "/01 Texto" ─────────────────────────────────────────────────
/**
 * Ficha de característica.
 *
 * `num` PASA A SER OPCIONAL, y por una razón que no es de código.
 *
 * Un número de orden promete una secuencia: primero esto, después aquello. En
 * Marketplace rotulaba «/01 Catálogo · /02 Pago · /03 Tracking · /04 Envío», que
 * no es una secuencia sino una lista de características — no hay un orden que
 * seguir. Era decoración disfrazada de información, y el lector paga el coste de
 * intentar entender un orden que no existe.
 *
 * Sin `num`, la ficha usa un punto de viñeta: marca el elemento sin prometer
 * nada. Cuando la lista SÍ sea una secuencia —pasos de un proceso, fases— el
 * número vuelve a tener sentido y se pasa.
 */
export function FeatureItem({
  num,
  text,
  glass = false,
}: {
  num?: string
  text: string
  glass?: boolean
}) {
  return (
    <motion.div
      variants={slideLeft}
      className={glass ? 'glass-info-item flex items-start gap-3' : 'flex items-start gap-3'}
    >
      {num ? (
        <span className="font-mono font-bold text-lg leading-tight text-gradient-genesis-strong">
          {num}
        </span>
      ) : (
        <span
          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-genesis-strong"
          aria-hidden="true"
        />
      )}
      <span className="text-sm text-genesis-mist leading-tight pt-0.5">{text}</span>
    </motion.div>
  )
}

// ─── AnimatedCounter (GSAP) ───────────────────────────────────────────────────
export function AnimatedCounter({
  to, suffix = '', isActive, decimals = 0,
}: {
  to: number; suffix?: string; isActive: boolean; decimals?: number
}) {
  const ref = useRef<HTMLSpanElement>(null!)
  const animated = useRef(false)

  useEffect(() => {
    if (!isActive || animated.current) return
    animated.current = true
    const obj = { val: 0 }
    const tween = gsap.to(obj, {
      val: to, duration: LLEGADA_CIFRA_S, delay: 0.4, ease: 'power2.out',
      onUpdate: () => {
        if (ref.current) ref.current.textContent = obj.val.toFixed(decimals) + suffix
      },
    })
    return () => {
      tween.kill()
      animated.current = false
    }
  }, [isActive, to, suffix, decimals])

  useEffect(() => {
    if (!isActive) {
      gsap.killTweensOf(ref.current)
      animated.current = false
      if (ref.current) ref.current.textContent = '0' + suffix
    }
  }, [isActive, suffix])

  return <span ref={ref}>0{suffix}</span>
}

// ─── StatBlock (animado — API legacy para scenes) ─────────────────────────────
export function StatBlock({ to, suffix, label, isActive, decimals = 0 }: {
  to: number; suffix: string; label: string; isActive: boolean; decimals?: number
}) {
  return (
    <motion.div variants={slideLeft} className="flex flex-col gap-1">
      <span className="font-display text-2xl font-bold text-genesis-text">
        <AnimatedCounter to={to} suffix={suffix} isActive={isActive} decimals={decimals} />
      </span>
      <span className="text-caption text-genesis-ghost uppercase tracking-wider">{label}</span>
    </motion.div>
  )
}

// ─── SceneWrapper ─────────────────────────────────────────────────────────────
interface SceneWrapperProps {
  isActive: boolean
  children: React.ReactNode
  motionKey: string
  sectionId?: string
  /** Secciones con cards densas — ancho extra solo en xl+ */
  wideStack?: boolean
  /** Reserva columna derecha para star dust WebGL (Trust, Staking…) */
  particleColumn?: boolean
  /** Visual DOM en columna de partículas (canvas, símbolos) */
  particleSlot?: React.ReactNode
  /** Capas de fondo a nivel sección (detrás del grid) */
  sectionOverlay?: React.ReactNode
  /** Genesis Orb reutilizado como firma visual de fondo */
  orbSignature?: GenesisOrbPlacement
}
export const SceneWrapper = forwardRef<HTMLElement, SceneWrapperProps & { className?: string }>(
  function SceneWrapper(
    {
      isActive,
      children,
      motionKey,
      sectionId,
      wideStack = false,
      particleColumn = false,
      particleSlot,
      sectionOverlay,
      orbSignature,
      className = '',
    },
    ref
  ) {
    const {
      isNaturalScroll,
      sectionRef,
      shouldMountContent,
      shouldAnimate,
    } = useSectionEnterAnimation(isActive)

    const setSectionRef = useCallback(
      (node: HTMLElement | null) => {
        sectionRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) ref.current = node
      },
      [ref, sectionRef]
    )

    const contentStack = (
      <motion.div
        key={motionKey}
        variants={containerV}
        initial="hidden"
        // Sin `exit`: el contenido ya no se desmonta en ningún modo, así que no
        // hay salida que animar.
        animate={shouldAnimate ? 'visible' : 'hidden'}
        className={`scene-content-stack flex flex-col gap-4 lg:max-w-[27rem] lg:justify-self-end lg:pr-1${wideStack ? ' scene-content-stack--wide' : ''}`}
      >
        {/*
          Una sección está un escalón por debajo del título de la página, así que
          su cabecera es h2 y las tarjetas de dentro, h3. El nivel no se escribe
          en ningún sitio: sale de este anidamiento.
        */}
        <HeadingLevel>{children}</HeadingLevel>
      </motion.div>
    )

    /*
     * El ajuste automatico solo tiene sentido donde el hueco manda: en el modo
     * de paginas. En scroll natural la pagina fluye y encoger no aporta nada.
     */
    /*
     * `shouldMountContent` va en la condicion, y no es un detalle.
     *
     * La pila de contenido NO existe hasta que la seccion entra en pantalla. Si
     * el gancho arranca antes, `querySelector('.scene-content-stack')` devuelve
     * null, sale, y NO VUELVE A INTENTARLO porque sus dependencias no han
     * cambiado. Medido: cero secciones con factor aplicado, con el gancho
     * conectado y `zoom` soportado.
     *
     * Pasandolo aqui, el efecto se vuelve a ejecutar en cuanto el contenido
     * aparece, que es cuando hay algo que medir.
     */
    useFitToBand(sectionRef, !isNaturalScroll && shouldMountContent)

    return (
      <SectionVisualProvider visualActive={shouldAnimate}>
        <section
          ref={setSectionRef}
          id={sectionId}
          /*
           * `lg:min-h-screen` y NO `lg:h-screen`.
           *
           * `h-screen` fija `height: 100vh`, y con `overflow-hidden` al lado
           * una seccion cuyo contenido pidiera mas lo perdia sin remedio.
           * Medido en la ventana real de un portatil a zoom 100 % (1914x683):
           * Booster necesitaba 808 px y se le recortaban 190 —93 arriba y 97
           * abajo—. Y ademas ganaba a la regla `min-height` de la hoja de
           * estilos, porque `h-screen` fija `height` y eso manda sobre un
           * minimo.
           *
           * Con `min-h-screen` la seccion mide el alto de ventana COMO MINIMO y
           * crece si hace falta. El `overflow-hidden` se conserva: sigue
           * haciendo falta para recortar las capas decorativas de fondo, que
           * SI se salen a proposito.
           *
           * PERO LA ALTURA YA NO SE FIJA AQUI. `lg:min-h-screen` vale 100dvh, y
           * eso NO descuenta los 76 px que tapa la barra al engancharse: medido
           * en las catorce, todas sobraban exactamente ese margen. No era el
           * contenido, era la construccion.
           *
           * Ahora manda `.home-section-fit`, que resta `--enganche-alto`. La
           * utilidad se quita en vez de intentar ganarle: Tailwind vive en una
           * capa POSTERIOR, asi que gana a la hoja pase lo que pase con la
           * especificidad, y pelearse con eso solo produce reglas cada vez mas
           * largas que siguen perdiendo.
           */
          className={`home-section-fit relative w-full flex items-center overflow-visible lg:overflow-hidden ${className}`}
          style={{ pointerEvents: 'auto' }}
        >
          {sectionOverlay}
          {orbSignature ? (
            <GenesisOrbSignature placement={orbSignature} isActive={isActive} />
          ) : null}
          <div className="scene-content-frame w-full max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 lg:grid lg:grid-cols-2 lg:gap-6 lg:items-center">
            {/*
              Antes había aquí dos ramas: en scroll natural el contenido se
              montaba y se quedaba; en el resto iba envuelto en
              `AnimatePresence mode="wait"`, que lo desmontaba al dejar de ser la
              sección activa. Esa rama es la que dejaba 1 de 14 secciones en el
              DOM en escritorio.

              Ahora el contenido persiste en todos los modos, así que
              `AnimatePresence` no tenía nada que hacer: no queda nada que salga.
              Una rama que no puede ejecutarse es peor que ninguna, porque invita
              a razonar sobre un comportamiento que ya no existe.
            */}
            {shouldMountContent ? contentStack : null}
            <div
              className={`scene-particle-gutter ${
                particleColumn
                  ? sectionId === 'trust'
                    ? 'scene-particle-gutter--featured scene-particle-gutter--trust-mobile md:block'
                    : 'scene-particle-gutter--featured hidden md:block'
                  : 'hidden lg:block'
              }`}
              aria-hidden="true"
            >
              {particleSlot}
            </div>
          </div>
        </section>
      </SectionVisualProvider>
    )
  }
)
