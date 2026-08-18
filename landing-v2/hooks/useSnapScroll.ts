'use client'

import { useEffect, useRef, useState, useCallback, type MutableRefObject } from 'react'
import { heroDebug } from '@/lib/hero-debug'
import { resolveNavigationTarget } from '@/lib/routes'
import { easeInOutCubic, SNAP_SCROLL } from '@/lib/scroll/snapScrollConfig'
import { isSnapScrollMode, type ScrollMode } from '@/lib/scroll/scrollMode'

function readInitialSectionIndex(): number {
  if (typeof window === 'undefined') return 0
  const id = window.location.hash.replace(/^#/, '')
  if (!id) return 0
  return resolveNavigationTarget(id)?.sectionIndex ?? 0
}

type ScrollEase = (t: number) => number

function smoothScrollToSection(
  root: HTMLElement,
  target: HTMLElement,
  duration: number,
  ease: ScrollEase,
  onComplete?: () => void
): (() => void) | void {
  const rootRect = root.getBoundingClientRect()
  const targetRect = target.getBoundingClientRect()
  const start = root.scrollTop
  const end = start + (targetRect.top - rootRect.top)

  if (Math.abs(end - start) < 2) {
    onComplete?.()
    return
  }

  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (reduceMotion) {
    root.scrollTop = end
    onComplete?.()
    return
  }

  const t0 = performance.now()
  let raf = 0

  const step = (now: number) => {
    const p = Math.min((now - t0) / duration, 1)
    root.scrollTop = start + (end - start) * ease(p)
    if (p < 1) {
      raf = requestAnimationFrame(step)
    } else {
      onComplete?.()
    }
  }

  raf = requestAnimationFrame(step)

  return () => {
    if (raf) cancelAnimationFrame(raf)
  }
}

function scrollSectionIntoView(el: HTMLElement, behavior: ScrollBehavior = 'smooth') {
  el.scrollIntoView({ behavior, block: 'start' })
}

/**
 * Refs que el hook escribe. Si se le pasan desde fuera (el SceneContext), escribe
 * directamente en ellas en vez de mantener copias propias.
 *
 * Antes había TRES `scrollProgressRef` distintos —uno en el contexto, otro aquí y
 * otro en `useSectionScroll`— y el único que llegaba al sistema de partículas
 * jamás recibía otra cosa que 0.
 */
export type SnapScrollTargets = {
  sectionIndexRef?: MutableRefObject<number>
  scrollProgressRef?: MutableRefObject<number>
}

/**
 * Snap scroll — wheel threshold on desktop; proximity/natural on smaller viewports.
 */
export function useSnapScroll(
  totalSections: number,
  scrollMode: ScrollMode,
  targets?: SnapScrollTargets
) {
  const [sectionIndex, setSectionIndex] = useState(0)
  const ownSectionIndexRef = useRef(0)
  const ownScrollProgressRef = useRef(0)
  const sectionIndexRef = targets?.sectionIndexRef ?? ownSectionIndexRef
  const scrollProgressRef = targets?.scrollProgressRef ?? ownScrollProgressRef
  const progressRafRef = useRef(0)
  const ratioMapRef = useRef<Map<number, number>>(new Map())
  const lastRatioLogRef = useRef(0)
  const sectionEls = useRef<(HTMLElement | null)[]>(
    Array.from({ length: totalSections }, () => null)
  )

  const scrollAnimatingRef = useRef(false)
  const animTargetRef = useRef<number | null>(null)
  const wheelLockedUntilRef = useRef(0)
  const wheelAccumRef = useRef(0)
  const wheelAccumTimerRef = useRef<number | null>(null)
  /**
   * LA INTENCION QUE LLEGA MIENTRAS SE ESTA MOVIENDO NO SE TIRA, SE ENCOLA.
   *
   * Un salto dura 950 ms y despues queda una cola de bloqueo. En toda esa
   * ventana los eventos de rueda se descartaban EN SILENCIO. Medido tras
   * recortar la cola de 750 a 250 ms, seguian perdiendose los ticks a los 500 y
   * a los 800 ms — que es justo cuando alguien da el segundo giro.
   *
   * Descartar era la decision correcta para la COLA DE UNA PASADA de trackpad,
   * que sigue emitiendo eventos decrecientes despues de levantar los dedos. Pero
   * no distingue esa cola de un gesto nuevo y deliberado.
   *
   * Los separa el momento: la inercia llega pegada al gesto, y un giro nuevo
   * llega mas tarde. Solo se encola lo que aparece pasada la mitad del
   * desplazamiento, y solo un paso.
   */
  const pendienteRef = useRef(0)
  const animInicioRef = useRef(0)
  const pendienteDrenajeRef = useRef<number | null>(null)
  /** Marca de tiempo del ultimo evento de rueda, para medir el hueco entre gestos. */
  const ultimoWheelRef = useRef(0)
  /*
   * `animateToSection` necesita poder llamarse a si misma al terminar, para
   * ejecutar el salto encolado. No puede hacerlo directamente dentro de su
   * propio `useCallback` —todavia no existe cuando se define—, asi que se
   * guarda en un ref que se mantiene al dia justo despues.
   */
  const animateToSectionRef = useRef<
    ((index: number, reason: string, desde?: number) => void) | null
  >(null)
  const cancelScrollRef = useRef<(() => void) | void>(undefined)
  const snapWheelEnabled = isSnapScrollMode(scrollMode)

  const registerSection = useCallback(
    (index: number) =>
      (el: HTMLElement | null) => {
        sectionEls.current[index] = el
      },
    []
  )

  const applySectionIndex = useCallback((next: number, meta: Record<string, unknown>) => {
    if (next === sectionIndexRef.current) return
    heroDebug('section-change', {
      from: sectionIndexRef.current,
      to: next,
      ...meta,
    })
    sectionIndexRef.current = next
    scrollProgressRef.current = 0
    setSectionIndex(next)
  }, [])

  const animateToSection = useCallback(
    /**
     * `desde` — de donde se parte DE VERDAD, cuando quien llama lo sabe.
     *
     * La guarda de abajo cancelaba el movimiento comparando con
     * `sectionIndexRef.current`, que es el mismo indice recordado que causaba
     * el brinco: si el lector pasivo de scroll ya consideraba activa la
     * seccion siguiente —cosa que pasa estando al final de una seccion alta—,
     * la rueda pedia ir justo ahi y la guarda lo cancelaba por «ya estas».
     *
     * El resultado era una rueda que no hacia nada. Medido: dos de tres saltos
     * desde el borde inferior de una seccion alta no se movian.
     *
     * Quien lee la posicion real de la pantalla la pasa por aqui; quien no,
     * sigue usando el recordado como antes.
     */
    (index: number, reason: string, desde?: number) => {
      const clamped = Math.max(0, Math.min(totalSections - 1, index))
      const origen = desde ?? sectionIndexRef.current
      if (clamped === origen && !scrollAnimatingRef.current) return

      const root = document.querySelector('main') as HTMLElement | null
      const el = sectionEls.current[clamped]
      if (!root || !el) return

      if (!snapWheelEnabled) {
        scrollSectionIntoView(el, reason === 'initial-hash' ? 'auto' : 'smooth')
        applySectionIndex(clamped, { reason })
        return
      }

      cancelScrollRef.current?.()
      scrollAnimatingRef.current = true
      animInicioRef.current = Date.now()
      animTargetRef.current = clamped
      wheelLockedUntilRef.current = Date.now() + SNAP_SCROLL.WHEEL_LOCK_MS
      wheelAccumRef.current = 0
      root.classList.add('home-snap-main--animating')

      cancelScrollRef.current = smoothScrollToSection(
        root,
        el,
        SNAP_SCROLL.SCROLL_DURATION_MS,
        easeInOutCubic,
        () => {
          const target = animTargetRef.current
          animTargetRef.current = null
          cancelScrollRef.current = undefined

          if (target !== null) {
            applySectionIndex(target, { reason })
          }

          root.classList.remove('home-snap-main--animating')
          scrollAnimatingRef.current = false
          /*
           * BLOQUEO CORTO al TERMINAR, no otro de 750 ms.
           *
           * Durante la animacion ya bloquea `scrollAnimatingRef`, asi que este
           * se sumaba entero a los 950 ms del desplazamiento: 1700 ms en los
           * que cada tick se descartaba EN SILENCIO. Un segundo tick deliberado
           * —lo normal a los 300-600 ms— desaparecia, y el usuario volvia a
           * girar la rueda. De ahi «a veces hace falta rodar dos veces».
           *
           * Sigue haciendo falta algo: una pasada larga de trackpad emite
           * eventos durante un segundo largo y encadenaria varias secciones.
           * Pero eso lo corta la COLA de la inercia, no un gesto nuevo.
           */
          wheelLockedUntilRef.current = Date.now() + SNAP_SCROLL.WHEEL_LOCK_TAIL_MS

          /*
           * Lo que el usuario pidio mientras esto se movia se ejecuta ahora, en
           * vez de haberse perdido. Un solo paso: encadenar varios convertiria
           * un gesto largo en un viaje de cinco secciones.
           *
           * Se drena DOS veces, y la segunda no es redundante. Un tick que llega
           * cuando la animacion ya termino pero sigue corriendo la cola de
           * bloqueo se encolaba sin que quedara nadie para ejecutarlo: la
           * intencion se guardaba y moria ahi. Medido, era una franja estrecha
           * pero real —fallaba a los 900 ms y funcionaba a los 700 y a los
           * 1200—, y desde fuera se ve como «esta vez ha hecho falta girar otra
           * vez», que es justo lo que se venia a arreglar.
           */
          const drenar = () => {
            const pendiente = pendienteRef.current
            pendienteRef.current = 0
            if (target === null) return
            if (Math.abs(pendiente) < SNAP_SCROLL.SCROLL_THRESHOLD) return
            const siguiente = target + (pendiente > 0 ? 1 : -1)
            if (siguiente < 0 || siguiente >= totalSections) return
            wheelLockedUntilRef.current = 0
            animateToSectionRef.current?.(siguiente, 'wheel-encolado', target)
          }

          drenar()
          if (pendienteDrenajeRef.current !== null) {
            window.clearTimeout(pendienteDrenajeRef.current)
          }
          pendienteDrenajeRef.current = window.setTimeout(() => {
            pendienteDrenajeRef.current = null
            if (!scrollAnimatingRef.current) drenar()
          }, SNAP_SCROLL.WHEEL_LOCK_TAIL_MS + 20)
        }
      )

      heroDebug('section-scroll-start', {
        from: sectionIndexRef.current,
        to: clamped,
        reason,
      })
    },
    [applySectionIndex, snapWheelEnabled, totalSections]
  )

  animateToSectionRef.current = animateToSection

  const scrollToSection = useCallback(
    (index: number) => {
      animateToSection(index, 'programmatic')
    },
    [animateToSection]
  )

  useEffect(() => {
    return () => {
      cancelScrollRef.current?.()
      cancelScrollRef.current = undefined
      scrollAnimatingRef.current = false
      animTargetRef.current = null
      if (wheelAccumTimerRef.current !== null) {
        window.clearTimeout(wheelAccumTimerRef.current)
      }
      if (pendienteDrenajeRef.current !== null) {
        window.clearTimeout(pendienteDrenajeRef.current)
        pendienteDrenajeRef.current = null
      }
      pendienteRef.current = 0
      document.querySelector('main')?.classList.remove('home-snap-main--animating')
    }
  }, [])

  useEffect(() => {
    const fromHash = readInitialSectionIndex()
    if (fromHash !== sectionIndexRef.current) {
      applySectionIndex(fromHash, { reason: 'initial-hash' })
      requestAnimationFrame(() => scrollToSection(fromHash))
    }
  }, [applySectionIndex, scrollToSection])

  /**
   * Progreso REAL dentro de la sección actual.
   *
   * 0 = el borde superior de la sección está alineado con el viewport.
   * 1 = ya se ha recorrido su alto entero (o sea, la siguiente está entrando).
   * Negativo = se está volviendo hacia la sección anterior.
   *
   * Se escribe en un ref, nunca en estado: esto cambia en cada fotograma y
   * pasarlo por React re-renderizaría el árbol entero del canvas 60 veces por
   * segundo. El consumidor (el sistema de partículas) lee el ref dentro de su
   * propio `useFrame`.
   *
   * La lectura va coalescida en un `requestAnimationFrame`: el evento `scroll`
   * se dispara muchas veces por fotograma y `offsetTop`/`scrollTop` fuerzan
   * layout, así que sin esto se recalcularía varias veces para pintar una.
   */
  useEffect(() => {
    const root = document.querySelector('main') as HTMLElement | null
    if (!root) return

    /*
     * Geometría de las secciones, CACHEADA.
     *
     * `offsetTop` y `offsetHeight` fuerzan un layout síncrono si los estilos
     * están invalidados — y con React repintando el árbol cada fotograma, lo
     * están casi siempre. Leerlos en cada evento de scroll (14 secciones × 2
     * propiedades) provoca layout thrashing: una traza con la CPU frenada 6×
     * lo delató como el mayor coste de reflow de la página.
     *
     * Pero esta geometría sólo cambia cuando cambia el layout, no cuando se
     * hace scroll. Se mide una vez, se reutiliza, y se invalida al redimensionar.
     */
    let geometry: Array<{ top: number; height: number }> = []

    const measure = () => {
      geometry = sectionEls.current.map((el) => ({
        top: el?.offsetTop ?? 0,
        height: el?.offsetHeight ?? root.clientHeight,
      }))
    }

    const read = () => {
      progressRafRef.current = 0
      if (geometry.length === 0) measure()

      // Única lectura de layout por fotograma.
      const y = root.scrollTop

      /*
       * La sección se deduce de la GEOMETRÍA, no de `sectionIndexRef`.
       *
       * El índice lo decide un IntersectionObserver por umbrales de ratio, así
       * que durante una transición puede ir por delante o por detrás de dónde
       * está realmente el scroll. Midiendo contra el índice salían valores como
       * -1 (posición de una sección medida contra el origen de la siguiente):
       * aritméticamente correctos y semánticamente basura.
       *
       * Derivándolo de la posición, el valor siempre describe dónde está el
       * usuario y queda acotado a 0..1 por construcción.
       */
      let idx = 0
      for (let i = 0; i < geometry.length; i++) {
        if (geometry[i].top <= y + 1) idx = i
        else break
      }

      const slot = geometry[idx]
      if (!slot || slot.height <= 0) return

      scrollProgressRef.current = Math.max(0, Math.min(1, (y - slot.top) / slot.height))

      if (process.env.NODE_ENV !== 'production') {
        // Sonda de desarrollo: permite comprobar desde la consola que el
        // progreso es real y no el 0 permanente que era antes.
        ;(window as Window & { __GENESIS_SCROLL_PROGRESS__?: number })
          .__GENESIS_SCROLL_PROGRESS__ = scrollProgressRef.current
      }
    }

    const onScroll = () => {
      if (!progressRafRef.current) {
        progressRafRef.current = requestAnimationFrame(read)
      }
    }

    /** Al cambiar el layout la caché deja de valer: se vuelve a medir. */
    const onResize = () => {
      measure()
      onScroll()
    }

    measure()
    read()
    root.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })

    /*
     * Las secciones se registran por ref DESPUÉS del primer render, y sus altos
     * dependen de fuentes e imágenes que aún pueden estar cargando. Un
     * ResizeObserver recoge esos cambios sin sondear.
     *
     * Se observa el contenedor Y cada sección: el contenedor sólo avisa de
     * cambios en su propia caja, no de que una sección de dentro haya crecido —
     * que es justo lo que desplaza los `offsetTop` de todas las siguientes.
     *
     * No hay riesgo de bucle: `measure()` sólo lee, nunca escribe estilos.
     */
    const ro =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onResize) : null
    if (ro) {
      ro.observe(root)
      for (const el of sectionEls.current) if (el) ro.observe(el)
    }

    return () => {
      root.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      ro?.disconnect()
      if (progressRafRef.current) cancelAnimationFrame(progressRafRef.current)
      progressRafRef.current = 0
    }
  }, [scrollProgressRef, sectionIndexRef])

  useEffect(() => {
    if (!snapWheelEnabled) return

    const root = document.querySelector('main') as HTMLElement | null
    if (!root) return

    const resetWheelAccum = () => {
      wheelAccumRef.current = 0
      if (wheelAccumTimerRef.current !== null) {
        window.clearTimeout(wheelAccumTimerRef.current)
        wheelAccumTimerRef.current = null
      }
    }

    const scheduleWheelAccumDecay = () => {
      if (wheelAccumTimerRef.current !== null) {
        window.clearTimeout(wheelAccumTimerRef.current)
      }
      wheelAccumTimerRef.current = window.setTimeout(() => {
        wheelAccumRef.current = 0
        wheelAccumTimerRef.current = null
      }, SNAP_SCROLL.TRACKPAD_ACCUM_WINDOW_MS)
    }

    /**
     * DE QUE SECCION SE PARTE — leido de la PANTALLA, no recordado.
     *
     * Aqui estaba el brinco. El codigo anterior partia de
     * `animTargetRef.current ?? sectionIndexRef.current`, o sea de un indice
     * GUARDADO. Ese indice se actualiza cuando termina una animacion de salto,
     * pero el usuario tiene otras formas de moverse —teclado, barra de scroll,
     * un ancla, el propio enganche del navegador— y ninguna lo actualiza.
     *
     * Con el indice desincronizado, un solo giro de rueda te lleva a
     * `guardado + 1`. Si quedo en 1, apareces en la SECCION 2 vengas de donde
     * vengas. Eso es exactamente el sintoma: «brinca a la pagina 2».
     *
     * Leyendo la posicion real, el gesto es siempre relativo a lo que hay
     * delante y el fallo no puede reaparecer: no queda ningun estado que
     * desincronizar.
     */
    const indiceVisible = (): number => {
      // La seccion cuyo borde superior esta mas cerca de donde acaba la barra:
      // ese es el punto donde el enganche deja cada seccion al llegar.
      let mejor = 0
      let mejorD = Number.POSITIVE_INFINITY
      for (let i = 0; i < sectionEls.current.length; i++) {
        const el = sectionEls.current[i]
        if (!el) continue
        const d = Math.abs(el.getBoundingClientRect().top - SNAP_SCROLL.ENGANCHE_ALTO)
        if (d < mejorD) {
          mejorD = d
          mejor = i
        }
      }
      return mejor
    }

    const onWheel = (e: WheelEvent) => {
      const delta =
        Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX

      if (scrollAnimatingRef.current || Date.now() < wheelLockedUntilRef.current) {
        e.preventDefault()
        /*
         * QUE SEPARA UN GIRO NUEVO DE LA INERCIA: EL HUECO, NO EL MOMENTO.
         *
         * El primer intento uso «pasada la mitad del recorrido». Medido, tiraba
         * el segundo tick a los 400 ms —un ritmo de giro completamente normal—
         * mientras lo aceptaba a los 600. El corte por reloj no distingue lo que
         * tiene que distinguir.
         *
         * La cola de una pasada de trackpad es un chorro CONTINUO: eventos cada
         * ~16 ms que van decreciendo. Un giro deliberado de rueda es un evento
         * suelto con un hueco delante. Mirar el hueco separa las dos cosas por
         * lo que de verdad las diferencia, y no depende de cuanto dure la
         * animacion.
         */
        const ahora = Date.now()
        const hueco = ahora - ultimoWheelRef.current
        ultimoWheelRef.current = ahora
        if (hueco > SNAP_SCROLL.GESTO_NUEVO_MS && Math.abs(delta) >= 0.5) {
          if (pendienteRef.current !== 0 && Math.sign(pendienteRef.current) !== Math.sign(delta)) {
            pendienteRef.current = 0
          }
          pendienteRef.current += delta
        }
        return
      }

      ultimoWheelRef.current = Date.now()

      if (Math.abs(delta) < 0.5) return

      const direccion = delta > 0 ? 1 : -1
      const actual = indiceVisible()

      /**
       * CAMBIAR DE SENTIDO EMPIEZA EL GESTO DE CERO.
       *
       * El acumulador SUMABA sin mirar el signo. Bajando por una seccion alta
       * llegaba a valer varios cientos; al querer subir, el primer tick restaba
       * —digamos -100 sobre +200— y quedaba en +100: por encima del umbral pero
       * con el signo contrario, asi que no saltaba. Hacian falta tres o cuatro
       * ticks solo para cruzar el cero.
       *
       * Es el caso que reporto el owner: «al llegar al fondo, queriendo subir,
       * hay que hacer dos acciones». Cuanto mas hubieras bajado, mas ticks
       * costaba volver.
       *
       * Un cambio de sentido es un gesto NUEVO. Lo acumulado antes describe una
       * intencion que ya no existe.
       */
      if (wheelAccumRef.current !== 0 && Math.sign(wheelAccumRef.current) !== direccion) {
        wheelAccumRef.current = 0
      }

      /**
       * EL ACUMULADOR SE ALIMENTA SIEMPRE, tambien mientras el navegador
       * desplaza por dentro de una seccion alta.
       *
       * Antes se hacia `resetWheelAccum()` al ceder el evento al scroll nativo,
       * y eso convertia en DOS gestos lo que el usuario hace como uno: el tick
       * que termina de recorrer la seccion dejaba el acumulador a cero, asi que
       * el salto necesitaba otro tick entero desde el principio.
       *
       * Con las medidas de este portal el efecto era permanente, no ocasional:
       * el hueco visible son 539 px y LAS CATORCE secciones lo exceden —de +39
       * en roadmap a +252 en booster—, asi que esta rama se tomaba siempre y el
       * minimo estructural eran dos ticks por seccion.
       *
       * Alimentandolo aqui, recorrer la seccion y saltar a la siguiente son el
       * mismo gesto continuo. Si el usuario se para, el decaimiento lo vacia
       * solo y el siguiente gesto vuelve a empezar de cero.
       */
      wheelAccumRef.current += delta
      scheduleWheelAccumDecay()

      /**
       * SI LA SECCION NO CABE, LA RUEDA LA RECORRE ANTES DE SALTAR.
       *
       * El codigo anterior hacia `preventDefault()` en TODOS los eventos de
       * rueda, sin excepcion. Consecuencia: la rueda no desplazaba nunca de
       * forma nativa y lo unico que podia hacer era saltar de seccion entera.
       *
       * En una seccion mas alta que el hueco visible —booster mide 791 px con
       * 539 visibles— eso deja el resto del contenido INALCANZABLE con la
       * rueda. Es un fallo que no se ve midiendo con `scrollTop` desde codigo,
       * porque ese camino no pasa por aqui.
       *
       * Ahora, si queda contenido en la direccion del gesto, el evento se deja
       * pasar y el navegador desplaza como siempre. Solo cuando se llega al
       * borde de la seccion se toma el control y se salta a la siguiente.
       */
      const el = sectionEls.current[actual]
      if (el) {
        const r = el.getBoundingClientRect()
        const tope = SNAP_SCROLL.ENGANCHE_ALTO
        const hueco = root.clientHeight - tope
        const noCabe = r.height > hueco + SNAP_SCROLL.HOLGURA_ALTO
        if (noCabe) {
          /*
           * NO ES «QUEDA ALGO», ES «QUEDA MAS DE LO QUE ESTE TICK RECORRE».
           *
           * La condicion anterior era booleana —queda algo, aunque sea 1 px— y
           * eso producia el fallo del final de la pagina. Al llegar al fondo,
           * `cta` no puede alinearse con el enganche porque el scroller ya esta
           * en su maximo: su borde superior vale 0 y nunca 76. Con la condicion
           * booleana `quedaArriba` era CIERTA para siempre, asi que la rueda
           * cedia al scroll nativo indefinidamente y no saltaba jamas. Habia que
           * subir a mano esos 76 px antes de que un tick sirviera de algo — el
           * «al llegar al fondo, para subir hacen falta dos acciones».
           *
           * Comparar contra `Math.abs(delta)` se calibra solo: si lo que queda
           * cabe en el propio tick, ese tick se lo comeria entero de todas
           * formas, asi que mas vale saltar. Y no hace falta saber cuanto mide
           * una muesca en el raton de cada cual, que cambia por dispositivo y
           * por sistema.
           */
          const resta = direccion > 0 ? r.bottom - root.clientHeight : tope - r.top
          const merecePasada = Math.max(SNAP_SCROLL.HOLGURA_ALTO, Math.abs(delta))
          if (resta > merecePasada) {
            // sin reset: lo recorrido cuenta para el salto que viene despues
            return
          }
        }
      }

      e.preventDefault()

      if (Math.abs(wheelAccumRef.current) < SNAP_SCROLL.SCROLL_THRESHOLD) return

      resetWheelAccum()

      const next = actual + direccion * SNAP_SCROLL.MAX_STEP
      if (next < 0 || next >= totalSections) return

      animateToSection(next, 'wheel', actual)
    }

    root.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      root.removeEventListener('wheel', onWheel)
      resetWheelAccum()
    }
  }, [animateToSection, snapWheelEnabled, totalSections])

  useEffect(() => {
    const root = document.querySelector('main') as HTMLElement | null

    const heroLeaveRatio = snapWheelEnabled ? 0.56 : 0.35
    const heroReturnRatio = snapWheelEnabled ? 0.44 : 0.28
    const switchRatio = snapWheelEnabled ? 0.48 : 0.32
    const heroMinForLeave = snapWheelEnabled ? 0.18 : 0.08

    const observer = new IntersectionObserver(
      (entries) => {
        const map = ratioMapRef.current

        /*
         * EL MAPA SE ACTUALIZA SIEMPRE. SOLO LA DECISION SE APLAZA.
         *
         * Aqui estaba el punto fucsia de la barra marcando la seccion 1 estando
         * en la 7. Reproducido y medido en produccion: la barra senalaba el punto
         * 0 en gpulse, comunidad y technology.
         *
         * El `return` por bloqueo estaba ANTES de escribir el mapa, asi que
         * durante la animacion y su cola —mas de un segundo— las entradas del
         * observador se DESCARTABAN. Y los cruces de umbral del hero al salir de
         * pantalla caen justo en esa ventana: `map.get(0)` se quedaba congelado
         * en un valor alto y, una vez fuera de vista, el observador ya no vuelve
         * a informar de el nunca, porque no cruza mas umbrales.
         *
         * Con ese valor rancio, cualquier evaluacion posterior entraba por
         *
         *   heroRatio >= heroReturnRatio && heroRatio >= bestRatio - 0.06
         *
         * y aplicaba `return-hero`. De ahi que apareciera «de booster para
         * abajo»: hacen falta varios saltos para que a la ventana de bloqueo le
         * toque tragarse la ultima actualizacion del hero.
         *
         * Medir el ratio y DECIDIR con el son dos cosas distintas. Aplazar la
         * medicion no aplaza nada: la pierde.
         */
        for (const entry of entries) {
          const idx = sectionEls.current.indexOf(entry.target as HTMLElement)
          if (idx === -1) continue
          map.set(idx, entry.isIntersecting ? entry.intersectionRatio : 0)
        }

        if (
          snapWheelEnabled &&
          (scrollAnimatingRef.current || Date.now() < wheelLockedUntilRef.current)
        ) {
          return
        }

        let bestIdx = 0
        let bestRatio = 0
        map.forEach((ratio, idx) => {
          if (ratio > bestRatio) {
            bestRatio = ratio
            bestIdx = idx
          }
        })

        const heroRatio = map.get(0) ?? 0
        const current = sectionIndexRef.current

        const now = Date.now()
        if (now - lastRatioLogRef.current > 800) {
          lastRatioLogRef.current = now
          heroDebug('section-ratios', {
            current,
            bestIdx,
            bestRatio: Number(bestRatio.toFixed(3)),
            heroRatio: Number(heroRatio.toFixed(3)),
            scrollMode,
            map: Object.fromEntries(
              Array.from(map.entries()).map(([k, v]) => [k, Number(v.toFixed(3))])
            ),
          })
        }

        if (current === 0) {
          if (bestIdx !== 0 && bestRatio >= heroLeaveRatio && heroRatio < heroMinForLeave) {
            applySectionIndex(bestIdx, { reason: 'leave-hero', bestRatio, heroRatio })
          }
          return
        }

        if (heroRatio >= heroReturnRatio && heroRatio >= bestRatio - 0.06) {
          applySectionIndex(0, { reason: 'return-hero', bestRatio, heroRatio })
          return
        }

        if (bestRatio >= switchRatio && bestIdx !== current) {
          applySectionIndex(bestIdx, { reason: 'switch', bestRatio, heroRatio })
        }
      },
      {
        root,
        threshold: Array.from({ length: 21 }, (_, i) => i / 20),
      }
    )

    sectionEls.current.forEach((el) => {
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [applySectionIndex, scrollMode, snapWheelEnabled])

  return { sectionIndex, sectionIndexRef, scrollProgressRef, registerSection, scrollToSection }
}
