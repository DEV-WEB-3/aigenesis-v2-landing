import type { Metadata } from 'next'
import { G1HeroC } from '@/components/g1/hero/G1HeroC'

export const metadata: Metadata = {
  title: 'G1 · Hero C (preview)',
  robots: { index: false, follow: false },
}

export default function G1HeroPreviewCPage() {
  return <G1HeroC />
}
