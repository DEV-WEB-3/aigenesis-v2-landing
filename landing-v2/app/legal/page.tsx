import type { Metadata } from 'next'
import StaticPageShell from '@/components/layout/StaticPageShell'
import LegalContenido from './LegalContenido'

export const metadata: Metadata = {
  title: 'Legal — AiGenesis',
  description:
    'Información legal y de riesgos del ecosistema AiGenesis. Participación en activos digitales y tecnologías blockchain.',
  alternates: { canonical: '/legal' },
}

/* El `metadata` sigue en español a propósito: ver la nota en `app/g11/page.tsx`. */
export default function LegalPage() {
  return (
    <StaticPageShell title="Información legal">
      <LegalContenido />
    </StaticPageShell>
  )
}
