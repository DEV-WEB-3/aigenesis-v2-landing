'use client'

import dynamic from 'next/dynamic'

const WorldCanvasInner = dynamic(() => import('./WorldCanvasInner'), {
  ssr: false,
  loading: () => null,
})

export default function WorldCanvas() {
  return <WorldCanvasInner />
}
