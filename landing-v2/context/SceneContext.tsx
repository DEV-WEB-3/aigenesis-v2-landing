'use client'

import { createContext, useContext, useRef, MutableRefObject } from 'react'

interface SceneContextValue {
  sectionIndexRef:   MutableRefObject<number>
  scrollProgressRef: MutableRefObject<number>
}

const SceneContext = createContext<SceneContextValue>({
  sectionIndexRef:   { current: 0 },
  scrollProgressRef: { current: 0 },
})

export function SceneProvider({ children }: { children: React.ReactNode }) {
  const sectionIndexRef   = useRef(0)
  const scrollProgressRef = useRef(0)
  return (
    <SceneContext.Provider value={{ sectionIndexRef, scrollProgressRef }}>
      {children}
    </SceneContext.Provider>
  )
}

export function useScene() {
  return useContext(SceneContext)
}
