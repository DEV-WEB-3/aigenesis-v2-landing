'use client'

import { useEffect, useState } from 'react'
import {
  getTrustCoreLogoLayout,
  subscribeTrustCoreLogoLayout,
  type TrustCoreLogoLayout,
} from './trustCoreLogoLayoutStore'

export function useTrustCoreLogoLayout(): TrustCoreLogoLayout {
  const [layout, setLayout] = useState<TrustCoreLogoLayout>(() => getTrustCoreLogoLayout())

  useEffect(() => subscribeTrustCoreLogoLayout(() => setLayout(getTrustCoreLogoLayout())), [])

  return layout
}
