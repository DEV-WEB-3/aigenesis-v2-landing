import type { Metadata } from 'next'
import { G1HeroA } from '@/components/g1/hero/G1HeroA'

export const metadata: Metadata = {
  title: 'G1 · Hero A (preview)',
  robots: { index: false, follow: false },
}

export default function G1HeroPreviewAPage() {
  return <G1HeroA />
}
