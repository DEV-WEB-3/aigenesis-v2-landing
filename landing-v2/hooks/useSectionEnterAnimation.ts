'use client'

import { useEffect, useRef, useState } from 'react'
import { useScrollMode } from '@/hooks/useScrollMode'

/**
 * Cuándo se monta el contenido de una sección y cuándo se anima.
 *
 * LO QUE HABÍA
 * ------------
 *   shouldMountContent: isNaturalScroll ? true : isActive
 *
 * Fuera del scroll natural, sólo la sección ACTIVA estaba en el DOM. Medido: en
 * escritorio había 1 de 14 secciones montada en cualquier instante. Un rastreador
 * o un lector de pantalla veía una sección de catorce, y el coste de cristal se
 * duplicaba en cada transición porque la saliente y la entrante coexistían.
 *
 * LO QUE HACE AHORA
 * -----------------
 * El contenido se monta cuando la sección entra en pantalla y SE QUEDA. Es lo
 * que ya hacía el móvil, y es lo correcto: desmontar para ahorrar memoria no
 * compensa cuando el precio es que el documento no exista.
 *
 * Se conserva la distinción entre MONTAR y ANIMAR. Son cosas distintas: el
 * contenido puede estar en el documento sin haber entrado todavía, que es
 * exactamente lo que permite animarlo cuando llega su turno.
 */
export function useSectionEnterAnimation(isActive: boolean) {
  const scrollMode = useScrollMode()
  const isNaturalScroll = scrollMode === 'natural'
  const sectionRef = useRef<HTMLElement | null>(null)
  const [entered, setEntered] = useState(false)

  /*
   * El observador corre en TODOS los modos, no sólo en el natural. Antes estaba
   * condicionado a `isNaturalScroll`, así que en escritorio nunca se enteraba de
   * que una sección había entrado y todo dependía del índice activo.
   */
  useEffect(() => {
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
  }, [])

  /** La sección activa cuenta como entrada aunque el observador aún no lo vea. */
  useEffect(() => {
    if (isActive) setEntered(true)
  }, [isActive])

  return {
    isNaturalScroll,
    sectionRef,
    /** Una vez dentro del documento, se queda. */
    shouldMountContent: entered || isActive,
    shouldAnimate: entered || isActive,
  }
}
