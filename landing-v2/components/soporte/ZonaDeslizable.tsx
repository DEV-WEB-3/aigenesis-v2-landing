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
      <div ref={contRef} className={`h-full overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}>
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
