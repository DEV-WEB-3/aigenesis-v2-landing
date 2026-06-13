'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { heroDebug } from '@/lib/hero-debug'
import { resolveNavigationTarget } from '@/lib/routes'
import { easeInOutCubic, SNAP_SCROLL } from '@/lib/scroll/snapScrollConfig'

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

/**
 * Snap scroll — wheel threshold, smooth glide, sectionIndex synced on transition end.
 */
export function useSnapScroll(totalSections: number) {
  const [sectionIndex, setSectionIndex] = useState(0)
  const sectionIndexRef = useRef(0)
  const scrollProgressRef = useRef(0)
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
    [applySectionIndex, totalSections]
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

  useEffect(() => {
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
  }, [animateToSection, totalSections])

  useEffect(() => {
    const root = document.querySelector('main') as HTMLElement | null

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          scrollAnimatingRef.current ||
          Date.now() < wheelLockedUntilRef.current
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
            map: Object.fromEntries(
              Array.from(map.entries()).map(([k, v]) => [k, Number(v.toFixed(3))])
            ),
          })
        }

        if (current === 0) {
          if (bestIdx !== 0 && bestRatio >= 0.56 && heroRatio < 0.18) {
            applySectionIndex(bestIdx, { reason: 'leave-hero', bestRatio, heroRatio })
          }
          return
        }

        if (heroRatio >= 0.44 && heroRatio >= bestRatio - 0.06) {
          applySectionIndex(0, { reason: 'return-hero', bestRatio, heroRatio })
          return
        }

        if (bestRatio >= 0.48 && bestIdx !== current) {
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
  }, [applySectionIndex])

  return { sectionIndex, sectionIndexRef, scrollProgressRef, registerSection, scrollToSection }
}
