import type { Metadata } from 'next'
import OfficialDownloadButton from '@/components/cta/OfficialDownloadButton'
import StaticPageShell from '@/components/layout/StaticPageShell'
import { EXTERNAL_LINKS, ROUTES } from '@/lib/routes'
import { AIG_TOKEN_CONTRACT } from '@/lib/official-links'

export const metadata: Metadata = {
  title: 'Whitepaper — AiGenesis',
  description:
    'Documentación oficial del ecosistema AiGenesis: contrato AIG verificado en BNB Smart Chain, suministro, comunidad y whitepaper AiG Token.',
  alternates: { canonical: '/whitepaper' },
}

/**
 * Hechos comprobables en cadena, medidos el 16-ago-2026 sobre el contrato
 * oficial. Van AQUÍ, en HTML, y no dentro del PDF, por dos razones:
 *
 *  1. La página tenía dos frases y dos botones. Quien llegaba buscando datos
 *     tenía que descargar 1,5 MB para ver si le servían.
 *  2. El texto del PDF NO es extraíble —seis fuentes embebidas y sólo dos con
 *     mapa Unicode, más 23 imágenes—, así que un buscador no lee nada de lo
 *     que hay dentro. Todo lo que quede sólo en el PDF es invisible.
 */
const HECHOS = [
  { valor: '111.000.000', etiqueta: 'Suministro total AIG' },
  { valor: '15.000+', etiqueta: 'Holders en cadena' },
  { valor: 'BEP-20', etiqueta: 'BNB Smart Chain' },
  { valor: 'Verificado', etiqueta: 'Código del contrato' },
] as const

export default function WhitepaperPage() {
  return (
    <StaticPageShell title="Whitepaper">
      <p className="text-genesis-text font-medium">
        Documentación oficial del ecosistema AiGenesis.
      </p>
      <p>
        El whitepaper AiG Token describe la arquitectura del protocolo, los tokenomics, los
        pilares del ecosistema y el marco de participación on-chain.
      </p>

      <section aria-label="Datos verificables en cadena" className="pt-2">
        <h2 className="text-caption text-genesis-ghost uppercase tracking-wider mb-3">
          Verificable en cadena
        </h2>
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-5 m-0">
          {HECHOS.map((h) => (
            <div key={h.etiqueta} className="flex flex-col gap-1">
              <dt className="sr-only">{h.etiqueta}</dt>
              <dd className="m-0 font-display text-xl sm:text-2xl font-bold text-genesis-text">
                {h.valor}
              </dd>
              <span className="text-caption text-genesis-ghost uppercase tracking-wider">
                {h.etiqueta}
              </span>
            </div>
          ))}
        </dl>

        <p className="text-caption text-genesis-ghost pt-4 break-all">
          Contrato: <code className="text-genesis-ion">{AIG_TOKEN_CONTRACT}</code>
        </p>
      </section>

      <div className="flex flex-wrap gap-3 pt-2">
        <OfficialDownloadButton href={EXTERNAL_LINKS.WHITEPAPER_PDF} variant="signature">
          Descargar Whitepaper (PDF)
        </OfficialDownloadButton>
        <OfficialDownloadButton href={ROUTES.BSCSCAN} variant="secondary">
          Ver contrato en BSCScan
        </OfficialDownloadButton>
      </div>

      {/*
        El documento, leíble sin salir de la página. `<object>` y no `<iframe>`
        porque trae respaldo propio: en un móvil que no sabe pintar PDF en línea
        —que son casi todos— se muestra el contenido de dentro en vez de un
        recuadro en blanco.

        Se oculta en pantallas pequeñas a propósito: incrustar 1,5 MB donde no
        se va a poder leer es gastar el dato de alguien a cambio de nada. Ahí
        queda el botón de descarga, que sí funciona.
      */}
      <div className="hidden md:block pt-4">
        <object
          data={EXTERNAL_LINKS.WHITEPAPER_PDF}
          type="application/pdf"
          className="w-full rounded-xl border border-hairline bg-genesis-base"
          style={{ height: 'min(78vh, 900px)' }}
          aria-label="Whitepaper AiG Token, documento PDF"
        >
          <p className="p-6">
            Tu navegador no puede mostrar el PDF aquí.{' '}
            <a href={EXTERNAL_LINKS.WHITEPAPER_PDF} className="text-genesis-ion">
              Descárgalo para leerlo
            </a>
            .
          </p>
        </object>
      </div>

      <p className="text-caption text-genesis-ghost uppercase tracking-wider pt-4">
        AiG Token · Whitepaper oficial v1.1 · Febrero 2024
      </p>
    </StaticPageShell>
  )
}
