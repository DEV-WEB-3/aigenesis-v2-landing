'use client'

import { createContext, useContext } from 'react'

const SectionVisualContext = createContext<boolean | null>(null)

export function SectionVisualProvider({
  visualActive,
  children,
}: {
  visualActive: boolean
  children: React.ReactNode
}) {
  return (
    <SectionVisualContext.Provider value={visualActive}>
      {children}
    </SectionVisualContext.Provider>
  )
}

/** entered || isActive on mobile natural scroll; isActive on desktop snap. */
export function useSectionVisualActive(fallbackIsActive: boolean): boolean {
  const ctx = useContext(SectionVisualContext)
  return ctx ?? fallbackIsActive
}
