import Link from 'next/link'
import { GenesisOfficialLogo } from '@/components/brand'
import { PAGES } from '@/lib/routes'

interface StaticPageShellProps {
  title: string
  children: React.ReactNode
}

function StaticPageTitle({ title }: { title: string }) {
  const words = title.trim().split(/\s+/)
  if (words.length <= 1) {
    return <span className="text-gradient-genesis-strong">{title}</span>
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
  return (
    <div className="static-page-shell">
      <div className="static-page-atmosphere" aria-hidden="true" />

      <header className="static-page-header px-6 py-5">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <Link
            href={PAGES.HOME}
            className="no-underline focus-ring-signature rounded-sm"
            aria-label="GENESIS — Inicio"
          >
            <GenesisOfficialLogo size="sm" layout="horizontal" tone="color" />
          </Link>
          <Link
            href={PAGES.HOME}
            className="text-sm text-genesis-mist hover:text-genesis-ion no-underline transition-colors focus-ring-genesis"
          >
            Volver al inicio
          </Link>
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
          <Link href={PAGES.LEGAL} className="hover:text-genesis-ion no-underline transition-colors focus-ring-genesis">
            Legal
          </Link>
          <Link href={PAGES.WHITEPAPER} className="hover:text-genesis-ion no-underline transition-colors focus-ring-genesis">
            Whitepaper
          </Link>
          <Link href={PAGES.HOME} className="hover:text-genesis-ion no-underline transition-colors focus-ring-genesis">
            Inicio
          </Link>
        </div>
      </footer>
    </div>
  )
}
