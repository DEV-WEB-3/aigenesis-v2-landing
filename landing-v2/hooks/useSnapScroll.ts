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
    (index: number, reason: string) => {
      const clamped = Math.max(0, Math.min(totalSections - 1, index))
      if (clamped === sectionIndexRef.current && !scrollAnimatingRef.current) return

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
          wheelLockedUntilRef.current = Date.now() + SNAP_SCROLL.WHEEL_LOCK_MS
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

    const onWheel = (e: WheelEvent) => {
      if (scrollAnimatingRef.current || Date.now() < wheelLockedUntilRef.current) {
        e.preventDefault()
        return
      }

      e.preventDefault()

      const delta =
        Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX

      if (Math.abs(delta) < 0.5) return

      wheelAccumRef.current += delta
      scheduleWheelAccumDecay()

      if (Math.abs(wheelAccumRef.current) < SNAP_SCROLL.SCROLL_THRESHOLD) return

      const direction = wheelAccumRef.current > 0 ? 1 : -1
      resetWheelAccum()

      const baseIndex =
        animTargetRef.current ?? sectionIndexRef.current
      const next = baseIndex + direction * SNAP_SCROLL.MAX_STEP
      if (next < 0 || next >= totalSections) return
      if (next === sectionIndexRef.current) return

      animateToSection(next, 'wheel')
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
        if (
          snapWheelEnabled &&
          (scrollAnimatingRef.current || Date.now() < wheelLockedUntilRef.current)
        ) {
          return
        }

        const map = ratioMapRef.current

        for (const entry of entries) {
          const idx = sectionEls.current.indexOf(entry.target as HTMLElement)
          if (idx === -1) continue
          map.set(idx, entry.isIntersecting ? entry.intersectionRatio : 0)
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
