import type { Metadata } from 'next'
import { ComunidadContent } from '@/components/g1/site/ComunidadContent'

/** Cáscara de servidor: sólo metadatos. Ver `ComunidadContent`. */
export const metadata: Metadata = {
  title: 'Comunidad G1 — SEED, eventos y liderazgo',
  description:
    'La comunidad de G1: formación (SEED), eventos y liderazgo. El punto de entrada por la comunidad Génesis. Material informativo.',
}

export default function ComunidadPage() {
  return <ComunidadContent />
}
