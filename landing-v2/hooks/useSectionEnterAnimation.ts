'use client'

import { useEffect, useRef, useState } from 'react'
import { useScrollMode } from '@/hooks/useScrollMode'

/**
 * Desktop/tablet: mount + animate only when isActive (snap flow).
 * Mobile natural scroll: always mount; animate once when section enters viewport.
 */
export function useSectionEnterAnimation(isActive: boolean) {
  const scrollMode = useScrollMode()
  const isNaturalScroll = scrollMode === 'natural'
  const sectionRef = useRef<HTMLElement | null>(null)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    if (!isNaturalScroll) return
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
          setEntered(true)
        }
      },
      { threshold: [0, 0.1, 0.22, 0.4], rootMargin: '-10% 0px -12% 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [isNaturalScroll])

  useEffect(() => {
    if (!isNaturalScroll && isActive) setEntered(true)
  }, [isActive, isNaturalScroll])

  return {
    isNaturalScroll,
    sectionRef,
    shouldMountContent: isNaturalScroll ? true : isActive,
    shouldAnimate: isNaturalScroll ? entered || isActive : isActive,
  }
}
