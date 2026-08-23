import type { Metadata } from 'next'
import { G1HeroGpgpu } from '@/components/g1/hero/G1HeroGpgpu'

export const metadata: Metadata = {
  title: 'G1 · Hero GPGPU (preview)',
  robots: { index: false, follow: false },
}

export default function G1HeroPreviewGpgpuPage() {
  return <G1HeroGpgpu />
}
