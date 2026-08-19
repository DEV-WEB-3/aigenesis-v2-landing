'use client'

/*
 * ARMAZON DE LAS PAGINAS PROPIAS — y por que es cliente.
 *
 * Legal, whitepaper y g11 no son la portada: son paginas de servidor con su
 * propio `metadata`. Este armazon, en cambio, pinta cabecera y pie —los mismos
 * en las tres—, asi que traducirlo AQUI cubre seis textos por tres paginas con
 * una sola edicion. Para eso tiene que poder llamar a `useT`, y para eso tiene
 * que ser cliente. El `metadata` se queda arriba, en cada `page.tsx`, que sigue
 * siendo de servidor.
 *
 * LLEVA SELECTOR DE IDIOMA, y no lo llevaba. Estas paginas se comparten por
 * enlace directo —el PDF de g11 circula por Telegram— y quien llega asi no pasa
 * por la portada: heredaba el idioma del navegador y no tenia forma de
 * cambiarlo. Un portal que habla once lenguas y esconde el selector en una sola
 * pagina habla once lenguas a medias.
 */

import Link from 'next/link'
import SelectorIdioma from '@/components/i18n/SelectorIdioma'
import { useT } from '@/context/IdiomaContext'
import { GenesisOfficialLogo } from '@/components/brand'
import { PAGES } from '@/lib/routes'

interface StaticPageShellProps {
  title: string
  children: React.ReactNode
}

/*
 * El titulo se traduce ANTES de partirlo en palabras. Partir primero y traducir
 * despues traduciria «Comunidad» y «G11» por separado, que no es lo mismo que
 * traducir «Comunidad G11»: el degradado cae sobre la ULTIMA palabra, y cual es
 * la ultima depende del idioma.
 */
function StaticPageTitle({ title }: { title: string }) {
  const t = useT()
  const words = t(title).trim().split(/\s+/)
  if (words.length <= 1) {
    return <span className="text-gradient-genesis-strong">{t(title)}</span>
  }
  const last = words[words.length - 1]
  const lead = words.slice(0, -1).join(' ')
  return (
    <>
      <span className="text-genesis-text">{lead} </span>
      <span className="text-gradient-genesis-strong">{last}</span>
    </>
  )
}

export default function StaticPageShell({ title, children }: StaticPageShellProps) {
  const t = useT()
  return (
    <div className="static-page-shell">
      <div className="static-page-atmosphere" aria-hidden="true" />

      <header className="static-page-header px-6 py-5">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <Link
            href={PAGES.HOME}
            className="no-underline focus-ring-signature rounded-sm"
            aria-label={t('GENESIS — Inicio')}
          >
            <GenesisOfficialLogo size="sm" layout="horizontal" tone="color" />
          </Link>
          <div className="flex items-center gap-3">
            <SelectorIdioma />
            <Link
              href={PAGES.HOME}
              className="text-sm text-genesis-mist zona-toque hover:text-genesis-ion no-underline transition-colors focus-ring-genesis"
            >
              {t('Volver al inicio')}
            </Link>
          </div>
        </div>
      </header>

      <main id="main-content" className="static-page-main mx-auto max-w-3xl px-6 py-12">
        <h1 className="font-display text-display leading-tight mb-2">
          <StaticPageTitle title={title} />
        </h1>
        <div className="mb-8 h-px w-16 bg-gradient-genesis-strong rounded-full opacity-80" aria-hidden="true" />
        <div className="flex flex-col gap-6 text-body-lg text-genesis-mist leading-relaxed">
          {children}
        </div>
      </main>

      <footer className="static-page-footer px-6 py-8 mt-12">
        <div className="mx-auto max-w-3xl flex flex-wrap gap-4 text-sm text-genesis-ghost">
          <Link href={PAGES.LEGAL} className="zona-toque hover:text-genesis-ion no-underline transition-colors focus-ring-genesis">
            {t('Legal')}
          </Link>
          <Link href={PAGES.WHITEPAPER} className="zona-toque hover:text-genesis-ion no-underline transition-colors focus-ring-genesis">
            {t('Whitepaper')}
          </Link>
          <Link href={PAGES.HOME} className="zona-toque hover:text-genesis-ion no-underline transition-colors focus-ring-genesis">
            {t('Inicio')}
          </Link>
        </div>
      </footer>
    </div>
  )
}
