import type { Metadata } from 'next'
import { G1Hero } from '@/components/g1/G1Hero'

/*
 * PREVIEW DEL HERO G1 (F2) — noindex.
 * Ruta de trabajo para ver el hero WebGL aislado antes de armar la home (F3).
 */
export const metadata: Metadata = {
  title: 'G1 · Hero (preview)',
  robots: { index: false, follow: false },
}

export default function G1HeroPreviewPage() {
  return <G1Hero />
}
