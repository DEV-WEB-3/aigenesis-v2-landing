import type { Metadata } from 'next'
import StaticPageShell from '@/components/layout/StaticPageShell'
import SoporteContenido from './SoporteContenido'

export const metadata: Metadata = {
  title: 'Centro de ayuda — AiGenesis',
  description:
    'Preguntas frecuentes del ecosistema AiGenesis: Genesis, G-Pulse y Gevy. Acceso, holding, reclamos, P2P y la tienda, con respuestas verificadas.',
  alternates: { canonical: '/soporte' },
}

/* El `metadata` sigue en español a propósito: ver la nota en `app/g11/page.tsx`. */
export default function SoportePage() {
  return (
    <StaticPageShell title="Centro de ayuda">
      <SoporteContenido />
    </StaticPageShell>
  )
}
