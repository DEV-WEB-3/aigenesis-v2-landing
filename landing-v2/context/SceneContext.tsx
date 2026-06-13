'use client'

import { createContext, useContext, useRef, MutableRefObject } from 'react'

interface SceneContextValue {
  sectionIndexRef: MutableRefObject<number>
  scrollProgressRef: MutableRefObject<number>
  scrollToSectionRef: MutableRefObject<((index: number) => void) | null>
}

const SceneContext = createContext<SceneContextValue>({
  sectionIndexRef: { current: 0 },
  scrollProgressRef: { current: 0 },
  scrollToSectionRef: { current: null },
})

export function SceneProvider({ children }: { children: React.ReactNode }) {
  const sectionIndexRef = useRef(0)
  const scrollProgressRef = useRef(0)
  const scrollToSectionRef = useRef<((index: number) => void) | null>(null)

  return (
    <SceneContext.Provider value={{ sectionIndexRef, scrollProgressRef, scrollToSectionRef }}>
      {children}
    </SceneContext.Provider>
  )
}

export function useScene() {
  return useContext(SceneContext)
}
