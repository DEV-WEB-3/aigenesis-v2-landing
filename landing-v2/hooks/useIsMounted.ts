'use client'

import { useEffect, useState } from 'react'

/** True only after client hydration — use to gate browser-only UI. */
export function useIsMounted(): boolean {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  return mounted
}
