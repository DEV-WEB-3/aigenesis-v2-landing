import type { Metadata } from 'next'
import { G1HeroB } from '@/components/g1/hero/G1HeroB'

export const metadata: Metadata = {
  title: 'G1 · Hero B (preview)',
  robots: { index: false, follow: false },
}

export default function G1HeroPreviewBPage() {
  return <G1HeroB />
}
