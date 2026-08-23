import type { Metadata } from 'next'
import { G1Narrative } from '@/components/g1/scenes/G1Narrative'

export const metadata: Metadata = {
  title: 'G1 · Narrativa (preview)',
  robots: { index: false, follow: false },
}

export default function G1NarrativaPage() {
  return <G1Narrative />
}
