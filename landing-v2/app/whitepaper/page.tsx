import type { Metadata } from 'next'
import StaticPageShell from '@/components/layout/StaticPageShell'
import WhitepaperContenido from './WhitepaperContenido'

export const metadata: Metadata = {
  title: 'Whitepaper — AiGenesis',
  description:
    'Documentación oficial del ecosistema AiGenesis: contrato AIG verificado en BNB Smart Chain, suministro, comunidad y whitepaper AiG Token.',
  alternates: { canonical: '/whitepaper' },
}

/* El `metadata` sigue en español a propósito: ver la nota en `app/g11/page.tsx`. */
export default function WhitepaperPage() {
  return (
    <StaticPageShell title="Whitepaper">
      <WhitepaperContenido />
    </StaticPageShell>
  )
}
