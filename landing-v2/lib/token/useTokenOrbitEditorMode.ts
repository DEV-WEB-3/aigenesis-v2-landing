'use client'

import { useEffect, useState } from 'react'

function isOrbitEditorUrl(): boolean {
  if (typeof window === 'undefined') return false
  const params = new URLSearchParams(window.location.search)
  if (params.has('orbit-edit')) return true
  const hash = window.location.hash
  return hash.includes('orbit-edit')
}

/** Dev tool — add `?orbit-edit=1` or `#token-orbit-edit` to place orbits with the mouse. */
export function useTokenOrbitEditorMode(): boolean {
  const [active, setActive] = useState(false)

  useEffect(() => {
    const sync = () => setActive(isOrbitEditorUrl())
    sync()
    window.addEventListener('hashchange', sync)
    window.addEventListener('popstate', sync)
    return () => {
      window.removeEventListener('hashchange', sync)
      window.removeEventListener('popstate', sync)
    }
  }, [])

  return active
}
