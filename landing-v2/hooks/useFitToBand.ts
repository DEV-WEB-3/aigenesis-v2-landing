'use client'

import { useEffect, useRef } from 'react'
import { SNAP_SCROLL } from '@/lib/scroll/snapScrollConfig'

/**
 * AJUSTE AUTOMATICO AL HUECO — mide y escala, en vez de adivinar por tramos.
 *
 * POR QUE HACIA FALTA
 * -------------------
 * La escala de densidad por variables (`--fit-gap-*`, `--fit-card-pad`) ya
 * comprimia con el alto de ventana, pero es un `clamp` y llega a su SUELO. En
 * una ventana de 683 px —hueco util 607— doce secciones seguian sobrando entre
 * 32 y 143 px con todas las variables ya en su minimo. Un `clamp` en el suelo no
 * comprime mas por mucho que siga bajando la pantalla.
 *
 * Y un escalon por `@media (max-height: ...)` tampoco lo resuelve: adivina el
 * tamano de la pantalla, no MIDE cuanto ocupa el contenido, que es el dato que
 * de verdad decide si cabe. Dos secciones a la misma altura de ventana necesitan
 * factores distintos porque tienen contenidos distintos.
 *
 * QUE HACE
 * --------
 * Lee el alto REAL de la pila de contenido y el hueco disponible bajo la barra,
 * y publica un factor `--fit-escala` que el CSS aplica. Continuo, sin tabla de
 * tamanos, y distinto por seccion porque cada una mide lo suyo.
 *
 * POR QUE `zoom` Y NO `transform: scale`
 * --------------------------------------
 * `transform` encoge lo PINTADO y deja la altura de la caja intacta: la seccion
 * seguiria midiendo lo mismo y no habriamos resuelto nada, solo dibujado mas
 * pequeno dentro del mismo hueco. `zoom` participa en el reflujo, asi que
 * encoger reduce de verdad el alto ocupado. Ademas evita el desenfoque de texto
 * de las escalas fraccionarias.
 *
 * EL SUELO ES DELIBERADO
 * ----------------------
 * Nunca baja de `ESCALA_MINIMA`. Por debajo de eso el texto deja de leerse
 * comodamente, y una seccion ilegible que «cabe» es peor que una legible que
 * crece: crecer ya esta previsto —la seccion se recorre con la rueda y eso esta
 * verificado—. Si una seccion toca el suelo, el problema es de CONTENIDO y hay
 * que decidirlo, no esconderlo encogiendo.
 */
const ESCALA_MINIMA = 0.82

/** Margen libre que se respeta arriba y abajo dentro del hueco. */
const MARGEN_LIBRE = 12

export function useFitToBand(
  ref: React.RefObject<HTMLElement | null>,
  activo: boolean
): void {
  const rafRef = useRef(0)

  useEffect(() => {
    const seccion = ref.current
    if (!seccion || !activo) return

    /*
     * SE MIDE EL MARCO, NO LA PILA DE TEXTO.
     *
     * El primer intento escalaba solo `.scene-content-stack`, y en la mitad de
     * las secciones no servia de nada: medido, trust, token, gpulse, marketplace
     * y technology daban factor 1,00 —su texto cabia de sobra— y aun asi la
     * seccion sobraba entre 33 y 66 px, porque quien fija su altura es el
     * VISUAL, no el texto. En gpulse el texto mide 374 y el hueco del visual 526.
     *
     * Escalando el marco entero se adaptan las dos columnas a la vez, que es lo
     * que hace falta para que la seccion quepa.
     */
    const marco = seccion.querySelector<HTMLElement>('.scene-content-frame')
    if (!marco) return

    const medirYAjustar = () => {
      /*
       * Se mide SIN escala. Con el `zoom` puesto, `scrollHeight` devuelve el
       * alto ya encogido y el calculo se realimentaria: cada pasada encogeria un
       * poco mas hasta el suelo. Hay que volver a 1, leer, y aplicar.
       */
      marco.style.setProperty('--fit-escala', '1')
      const natural = marco.scrollHeight

      /*
       * EL RELLENO DE LA SECCION SE DESCUENTA, y no es un detalle menor.
       *
       * Escalar el marco no reduce el `padding` de la seccion que lo contiene, y
       * ese relleno puede ser la mitad del problema: medido, trust tiene
       * `padding-top: 144px` y su marco mide 512 — o sea que el marco CABE de
       * sobra y aun asi la seccion sobraba 66 px. El gancho devolvia 1,00 con
       * toda la razon, porque estaba comparando contra un hueco que no era el
       * suyo.
       *
       * Descontandolo, el factor se calcula contra el sitio que el marco tiene
       * DE VERDAD.
       */
      const cs = getComputedStyle(seccion)
      const relleno =
        (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0)

      const hueco =
        (seccion.ownerDocument.defaultView?.innerHeight ?? 0) -
        SNAP_SCROLL.ENGANCHE_ALTO -
        MARGEN_LIBRE * 2 -
        relleno

      if (natural <= 0 || hueco <= 0) return

      const bruto = hueco / natural
      /*
       * Se TRUNCA a centesimas, no se redondea.
       *
       * Con `toFixed`, que redondea al mas cercano, el factor podia quedar por
       * ENCIMA del necesario y la seccion se pasaba un pixel o dos. Medido: seis
       * secciones sobraban exactamente +1 o +2 px con el ajuste ya aplicado, que
       * es la firma del redondeo y no de falta de sitio. Truncando, el factor
       * nunca supera lo que cabe.
       *
       * Centesimas y no mas precision para que un pixel de diferencia en el
       * reflujo no dispare un ajuste nuevo y el observador entre en bucle
       * consigo mismo.
       */
      const factor = Math.min(1, Math.max(ESCALA_MINIMA, Math.floor(bruto * 100) / 100))
      const texto = factor.toFixed(2)
      marco.style.setProperty('--fit-escala', texto)
      seccion.dataset.fitEscala = texto
      seccion.dataset.fitTocaSuelo = factor <= ESCALA_MINIMA ? '1' : '0'
    }

    const programar = () => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(medirYAjustar)
    }

    programar()

    /*
     * El observador vigila el MARCO, no la ventana: el contenido tambien cambia
     * de alto sin que la ventana se mueva —al montarse una tarjeta, al cargar
     * una fuente— y esos casos hay que atenderlos igual.
     */
    const ro = new ResizeObserver(programar)
    ro.observe(marco)
    window.addEventListener('resize', programar, { passive: true })

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
      window.removeEventListener('resize', programar)
      marco.style.removeProperty('--fit-escala')
    }
  }, [ref, activo])
}
