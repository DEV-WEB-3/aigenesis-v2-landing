import type { Metadata } from 'next'
import { G1Act0 } from '@/components/g1/scenes/G1Act0'

export const metadata: Metadata = {
  title: 'G1 · Acto 0 — el cielo (preview)',
  robots: { index: false, follow: false },
}

export default function G1Act0Page() {
  return <G1Act0 />
}
