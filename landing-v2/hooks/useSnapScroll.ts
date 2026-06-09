'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

/**
 * Detecta la sección activa con IntersectionObserver.
 * Totalmente safe para SSR — no usa window/document en module scope.
 */
export function useSnapScroll(totalSections: number) {
  const [sectionIndex, setSectionIndex] = useState(0)
  const sectionIndexRef   = useRef(0)
  const scrollProgressRef = useRef(0)
  // Array de refs para cada sección — inicializado con nulls
  const sectionEls = useRef<(HTMLElement | null)[]>(
    Array.from({ length: totalSections }, () => null)
  )

  // Registra el elemento DOM de una sección
  const registerSection = useCallback(
    (index: number) =>
      (el: HTMLElement | null) => {
        sectionEls.current[index] = el
      },
    []
  )

  // Navegar programáticamente a una sección
  const scrollToSection = useCallback((index: number) => {
    const el = sectionEls.current[index]
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }, [])

  // IntersectionObserver — solo en el cliente, después de montar
  useEffect(() => {
    // Root = el main (scroll-snap container), no el viewport del body
    const root = document.querySelector('main') as HTMLElement | null

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const idx = sectionEls.current.indexOf(entry.target as HTMLElement)
            if (idx !== -1 && idx !== sectionIndexRef.current) {
              sectionIndexRef.current = idx
              scrollProgressRef.current = 0
              setSectionIndex(idx)
            }
          }
        }
      },
      {
        root,       // relativo al scroll container, no al viewport
        threshold: 0.5,
      }
    )

    sectionEls.current.forEach((el) => { if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [])

  return { sectionIndex, sectionIndexRef, scrollProgressRef, registerSection, scrollToSection }
}
