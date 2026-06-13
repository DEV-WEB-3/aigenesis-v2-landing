import type { Metadata } from 'next'
import StaticPageShell from '@/components/layout/StaticPageShell'
import { PAGES, SITE_URL } from '@/lib/routes'
import { OFFICIAL_SOCIAL } from '@/lib/official-links'

export const metadata: Metadata = {
  title: 'Legal — AiGenesis',
  description:
    'Información legal y de riesgos del ecosistema AiGenesis. Participación en activos digitales y tecnologías blockchain.',
  alternates: { canonical: '/legal' },
}

const LEGAL_DISCLAIMER =
  'AiGenesis involucra activos digitales y tecnologías blockchain. La participación puede implicar riesgos tecnológicos, regulatorios y de mercado. Ningún contenido debe interpretarse como garantía de rendimiento financiero.'

export default function LegalPage() {
  return (
    <StaticPageShell title="Información legal">
      <p>{LEGAL_DISCLAIMER}</p>
      <section id="privacy" className="flex flex-col gap-4">
        <h2 className="font-display text-heading text-genesis-text">Privacidad</h2>
        <p>
          AiGenesis trata los datos personales conforme a las prácticas descritas en esta
          documentación. Para consultas sobre privacidad, escríbenos a{' '}
          <a href={OFFICIAL_SOCIAL.EMAIL} className="text-genesis-ion hover:underline">
            tokenaig@aigenesis.io
          </a>
          . Política de privacidad completa pendiente de revisión legal.
        </p>
      </section>
      <section id="riesgos" className="flex flex-col gap-4">
        <h2 className="font-display text-heading text-genesis-text">Riesgos</h2>
        <p>
          Los activos digitales pueden experimentar alta volatilidad. Los protocolos blockchain
          pueden contener vulnerabilidades tecnológicas. Los marcos regulatorios varían por
          jurisdicción y pueden cambiar sin previo aviso.
        </p>
        <p>
          AiGenesis no proporciona asesoramiento financiero, legal ni fiscal. Consulte
          profesionales calificados antes de participar.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="font-display text-heading text-genesis-text">Contacto</h2>
        <p>
          Consultas legales o de cumplimiento:{' '}
          <a href={OFFICIAL_SOCIAL.EMAIL} className="text-genesis-ion hover:underline">
            tokenaig@aigenesis.io
          </a>
          . Sitio institucional:{' '}
          <a href={SITE_URL} className="text-genesis-ion hover:underline">
            {SITE_URL}
          </a>
          . Documentación adicional en{' '}
          <a href={PAGES.WHITEPAPER} className="text-genesis-ion hover:underline">
            whitepaper
          </a>
          .
        </p>
      </section>
      <p className="text-caption text-genesis-ghost uppercase tracking-wider pt-4">
        Borrador operativo — revisión legal pendiente antes de producción en dominio principal.
      </p>
    </StaticPageShell>
  )
}
