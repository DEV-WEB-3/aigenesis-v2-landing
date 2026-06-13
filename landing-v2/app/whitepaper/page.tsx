import type { Metadata } from 'next'
import OfficialDownloadButton from '@/components/cta/OfficialDownloadButton'
import StaticPageShell from '@/components/layout/StaticPageShell'
import { EXTERNAL_LINKS, ROUTES } from '@/lib/routes'

export const metadata: Metadata = {
  title: 'Whitepaper — AiGenesis',
  description:
    'Documentación oficial del ecosistema AiGenesis. Descarga el whitepaper AiG Token.',
  alternates: { canonical: '/whitepaper' },
}

export default function WhitepaperPage() {
  return (
    <StaticPageShell title="Whitepaper">
      <p className="text-genesis-text font-medium">
        Documentación oficial del ecosistema AiGenesis.
      </p>
      <p>
        El whitepaper AiG Token describe la arquitectura del protocolo, tokenomics,
        pilares del ecosistema y marco de participación on-chain.
      </p>
      <div className="flex flex-wrap gap-3 pt-2">
        <OfficialDownloadButton href={EXTERNAL_LINKS.WHITEPAPER_PDF} variant="signature">
          Descargar Whitepaper (PDF)
        </OfficialDownloadButton>
        <OfficialDownloadButton href={ROUTES.BSCSCAN} variant="secondary">
          Ver contrato en BSCScan
        </OfficialDownloadButton>
      </div>
      <p className="text-caption text-genesis-ghost uppercase tracking-wider pt-4">
        Fuente oficial: aigtoken.io — sincronizado con aigenesis.io
      </p>
    </StaticPageShell>
  )
}
