'use client'

import { useEffect, useState } from 'react'

function isTrustLogoEditorUrl(): boolean {
  if (typeof window === 'undefined') return false
  const params = new URLSearchParams(window.location.search)
  if (params.has('trust-logo-edit')) return true
  const hash = window.location.hash
  return hash.includes('trust-logo-edit')
}

/** Dev tool — add `?trust-logo-edit=1#trust` to move/resize the Genesis logo freely. */
export function useTrustCoreLogoEditorMode(): boolean {
  const [active, setActive] = useState(false)

  useEffect(() => {
    const sync = () => setActive(isTrustLogoEditorUrl())
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
