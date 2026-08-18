'use client'

import { useEffect, useRef } from 'react'

/**
 * PARALAJE DE PUNTERO — la profundidad se demuestra moviendo, no dibujando.
 *
 * Un apilado de elipses aplanadas dice «esto es 3D» solo mientras nadie lo mira
 * fijo. Lo que lo vuelve creible es que los planos NO se muevan a la vez: el
 * nucleo al frente responde mas que los estratos, y el suelo del fondo responde
 * al reves. Eso es paralaje, y es la unica pista de profundidad que el ojo no
 * puede discutir.
 *
 * PUBLICA DOS VARIABLES, NO TRANSFORMS.
 * -------------------------------------
 * El gancho escribe `--arq-px` / `--arq-py` en el rango −1..1 y el CSS decide
 * cuanto se mueve cada plano. Asi el reparto de profundidad vive donde se ve
 * —la hoja de estilos— y no repartido por el JS; y sobre todo, no pisa los
 * `transform` que ya animan los estratos, que fue lo que me obligo a envolverlos
 * en capas propias.
 *
 * SE MIDE CONTRA LA SECCION, NO CONTRA EL SVG.
 * --------------------------------------------
 * El visual ocupa media seccion. Normalizando contra su propia caja, el paralaje
 * llega al tope en cuanto el puntero sale del dibujo y se queda pegado ahi
 * mientras el raton recorre la columna de texto. Contra la seccion entera el
 * recorrido es continuo de lado a lado.
 *
 * SOLO CON PUNTERO FINO Y SIN MOVIMIENTO REDUCIDO. En tactil no hay puntero que
 * seguir —el dedo esta o no esta—, y quien pidio menos movimiento no pidio
 * menos EXCEPTO este.
 */
export function usePointerParallax(
  ref: React.RefObject<SVGSVGElement | HTMLElement | null>
): void {
  const rafRef = useRef(0)

  useEffect(() => {
    const nodo = ref.current
    if (!nodo) return

    const win = nodo.ownerDocument.defaultView
    if (!win) return

    const fino = win.matchMedia('(hover: hover) and (pointer: fine)')
    const quieto = win.matchMedia('(prefers-reduced-motion: reduce)')
    if (!fino.matches || quieto.matches) return

    const zona = nodo.closest('section') ?? nodo.parentElement
    if (!zona) return

    let px = 0
    let py = 0

    const pintar = () => {
      nodo.style.setProperty('--arq-px', px.toFixed(3))
      nodo.style.setProperty('--arq-py', py.toFixed(3))
    }

    const alMover = (ev: PointerEvent) => {
      const caja = zona.getBoundingClientRect()
      if (caja.width <= 0 || caja.height <= 0) return
      // −1..1 desde el centro, recortado: fuera de la seccion no se sigue empujando
      px = Math.max(-1, Math.min(1, (ev.clientX - (caja.left + caja.width / 2)) / (caja.width / 2)))
      py = Math.max(-1, Math.min(1, (ev.clientY - (caja.top + caja.height / 2)) / (caja.height / 2)))
      // Un solo repintado por cuadro. `pointermove` dispara decenas de veces por
      // cuadro y escribir la variable en cada uno invalida el estilo otras tantas.
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(pintar)
    }

    /** Al salir vuelve al centro, no se queda torcido. */
    const alSalir = () => {
      px = 0
      py = 0
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(pintar)
    }

    zona.addEventListener('pointermove', alMover, { passive: true })
    zona.addEventListener('pointerleave', alSalir, { passive: true })

    return () => {
      cancelAnimationFrame(rafRef.current)
      zona.removeEventListener('pointermove', alMover)
      zona.removeEventListener('pointerleave', alSalir)
      nodo.style.removeProperty('--arq-px')
      nodo.style.removeProperty('--arq-py')
    }
  }, [ref])
}
