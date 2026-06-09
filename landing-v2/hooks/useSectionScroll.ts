'use client'

import { useEffect, useRef } from 'react'

/**
 * Detecta la sección activa basada en scroll position.
 * Retorna un ref (no state) para no causar re-renders del canvas.
 * El canvas lee sectionIndexRef.current en cada frame.
 *
 * @param totalSections - número total de secciones (cada una 100vh)
 */
export function useSectionScroll(totalSections: number) {
  const sectionIndexRef = useRef<number>(0)
  const scrollProgressRef = useRef<number>(0) // 0.0 → 1.0 dentro de la sección actual

  useEffect(() => {
    const onScroll = () => {
      const scrollY   = window.scrollY
      const vh        = window.innerHeight
      const totalH    = vh * totalSections

      // Índice de sección (0-based)
      const raw     = scrollY / vh
      const idx     = Math.floor(raw)
      const progress = raw - idx  // 0.0 → 1.0 dentro de la sección

      sectionIndexRef.current    = Math.min(Math.max(idx, 0), totalSections - 1)
      scrollProgressRef.current  = Math.min(Math.max(progress, 0), 1)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll() // inicial
    return () => window.removeEventListener('scroll', onScroll)
  }, [totalSections])

  return { sectionIndexRef, scrollProgressRef }
}
