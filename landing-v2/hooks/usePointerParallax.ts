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

    /*
     * LA CAJA SE CACHEA. NO se mide en cada `pointermove`.
     *
     * Medido con una traza del navegador: leer `getBoundingClientRect()` dentro
     * del manejador provoca un REFLUJO FORZADO en cada evento. `pointermove`
     * dispara decenas de veces por cuadro, y cada lectura obliga al navegador a
     * recalcular la maquetacion que las animaciones acaban de invalidar. Es el
     * patron clasico de layout thrashing, y aqui lo pagaba una seccion con 500
     * nodos.
     *
     * La caja solo cambia al redimensionar o al desplazarse; ahi se refresca, y
     * no una vez por movimiento del raton.
     */
    let cajaX = 0
    let cajaY = 0
    let semiAncho = 0
    let semiAlto = 0

    const medirZona = () => {
      const c = zona.getBoundingClientRect()
      semiAncho = c.width / 2
      semiAlto = c.height / 2
      cajaX = c.left + semiAncho
      cajaY = c.top + semiAlto
    }

    const pintar = () => {
      nodo.style.setProperty('--arq-px', px.toFixed(3))
      nodo.style.setProperty('--arq-py', py.toFixed(3))
    }

    const alMover = (ev: PointerEvent) => {
      if (semiAncho <= 0 || semiAlto <= 0) return
      // −1..1 desde el centro, recortado: fuera de la seccion no se sigue empujando
      px = Math.max(-1, Math.min(1, (ev.clientX - cajaX) / semiAncho))
      py = Math.max(-1, Math.min(1, (ev.clientY - cajaY) / semiAlto))
      // Un solo repintado por cuadro: escribir la variable en cada evento
      // invalidaria el estilo decenas de veces por cuadro.
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

    medirZona()
    zona.addEventListener('pointermove', alMover, { passive: true })
    zona.addEventListener('pointerleave', alSalir, { passive: true })
    win.addEventListener('resize', medirZona, { passive: true })
    /*
     * El desplazamiento tambien mueve la caja, y el portal se recorre por
     * secciones: sin esto, el paralaje seguiria midiendo contra la posicion que
     * la seccion tenia dos pantallas atras. Va en captura porque el contenedor
     * que desplaza no es la ventana.
     */
    win.addEventListener('scroll', medirZona, { passive: true, capture: true })

    return () => {
      cancelAnimationFrame(rafRef.current)
      zona.removeEventListener('pointermove', alMover)
      zona.removeEventListener('pointerleave', alSalir)
      win.removeEventListener('resize', medirZona)
      win.removeEventListener('scroll', medirZona, true)
      nodo.style.removeProperty('--arq-px')
      nodo.style.removeProperty('--arq-py')
    }
  }, [ref])
}
