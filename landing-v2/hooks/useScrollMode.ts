'use client'

import { useEffect, useState } from 'react'
import { resolveScrollMode, type ScrollMode } from '@/lib/scroll/scrollMode'

export function useScrollMode(): ScrollMode {
  const [mode, setMode] = useState<ScrollMode>(() =>
    typeof window !== 'undefined' ? resolveScrollMode(window.innerWidth) : 'snap'
  )

  useEffect(() => {
    const update = () => setMode(resolveScrollMode(window.innerWidth))
    update()

    const desktopMq = window.matchMedia('(min-width: 1024px)')
    const tabletMq = window.matchMedia('(min-width: 768px)')

    desktopMq.addEventListener('change', update)
    tabletMq.addEventListener('change', update)
    window.addEventListener('resize', update, { passive: true })

    return () => {
      desktopMq.removeEventListener('change', update)
      tabletMq.removeEventListener('change', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return mode
}
