'use client'

/*
 * ZONA DESLIZABLE CON BARRA DE FIRMA.
 *
 * ═════════════════════════════════════════════════════════════════════════
 * POR QUÉ EXISTE, MEDIDO Y NO SUPUESTO (20-ago-2026):
 *
 * En Chrome con las barras «overlay» de Windows 11,
 * `offsetWidth - clientWidth === 0`: los estilos `::-webkit-scrollbar` se
 * IGNORAN por completo, y `scrollbar-color` (el estándar) sólo admite un
 * color plano — el pulgar salía violeta, no con la firma. Un degradado
 * nativo es imposible ahí.
 *
 * Así que la presencia de desplazamiento la dibujamos nosotros: carril
 * oscuro casi invisible y pulgar con la firma de la marca, idéntico en todos
 * los navegadores. La nativa se oculta en esta zona — DOS pulgares a la vez
 * eran ruido visual (señalado por el owner en la maqueta).
 *
 * La prueba de humo para el futuro: si `offsetWidth - clientWidth` da 0 en
 * un contenedor con scroll, el navegador va por overlay y todo el CSS de
 * scrollbar nativo es letra muerta.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { useCallback, useEffect, useRef, useState } from 'react'

interface ZonaDeslizableProps {
  className?: string
  children: React.ReactNode
}

export default function ZonaDeslizable({ className = '', children }: ZonaDeslizableProps) {
  const contRef = useRef<HTMLDivElement>(null)
  const [barra, setBarra] = useState<{ alto: number; top: number } | null>(null)

  const pintar = useCallback(() => {
    const c = contRef.current
    if (!c) return
    const total = c.scrollHeight
    const visto = c.clientHeight
    if (total <= visto + 2) {
      setBarra(null)
      return
    }
    const carril = visto - 8
    const alto = Math.max(24, (visto / total) * carril)
    const top = 4 + (c.scrollTop / (total - visto)) * (carril - alto)
    setBarra({ alto, top })
  }, [])

  useEffect(() => {
    const c = contRef.current
    if (!c) return
    pintar()
    c.addEventListener('scroll', pintar, { passive: true })
    /* El contenido cambia (turnos nuevos, vistas): ambos observadores repintan. */
    const mo = new MutationObserver(pintar)
    mo.observe(c, { childList: true, subtree: true })
    const ro = new ResizeObserver(pintar)
    ro.observe(c)
    return () => {
      c.removeEventListener('scroll', pintar)
      mo.disconnect()
      ro.disconnect()
    }
  }, [pintar])

  return (
    <div className="relative min-h-0 flex-1">
      {/*
       * `data-lenis-prevent` — SIN ESTO EL PANEL NO SE DESLIZA EN G1.
       *
       * La web de G1 usa Lenis con `smoothWheel`, que intercepta la rueda del
       * ratón en TODA la página para animar el desplazamiento él mismo. Un
       * contenedor con `overflow-y-auto` dentro nunca llega a recibir el evento:
       * el asistente se queda clavado mientras la página de detrás se mueve.
       *
       * Y sólo pasaba en G1, que es donde vive la narrativa —y con ella Lenis—,
       * así que en el resto del sitio el mismo componente funcionaba y el fallo
       * parecía cosa de una página concreta.
       *
       * El atributo es la salida oficial de Lenis (1.3.x) para contenedores
       * anidados: al verlo en un ancestro del objetivo del evento, se aparta y
       * deja que el navegador desplace de forma nativa.
       */}
      <div
        ref={contRef}
        data-lenis-prevent
        className={`h-full overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
      >
        {children}
      </div>
      {barra ? (
        <div aria-hidden className="pointer-events-none absolute inset-y-1 right-0.5 w-1">
          <div className="absolute inset-0 rounded-full bg-genesis-text/5" />
          <div
            className="absolute right-0 w-1 rounded-full bg-gradient-genesis-signature opacity-90"
            style={{ height: barra.alto, top: barra.top }}
          />
        </div>
      ) : null}
    </div>
  )
}
