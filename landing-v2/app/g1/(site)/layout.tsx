import type { ReactNode } from 'react'
import { G1Header } from '@/components/g1/site/G1Header'
import { G1Footer } from '@/components/g1/site/G1Footer'
import { G1SiteBackground } from '@/components/g1/site/G1SiteBackground'

/**
 * Layout de la WEB G1 (route group (site)). Monta el FONDO WEBGL persistente una
 * sola vez (no se re-monta al navegar entre páginas) → el fondo es continuo en
 * toda la web. Sobre él: velo de legibilidad, header glass, contenido (z-10) y
 * footer. La narrativa (home) es la intro que le entrega el relevo a este fondo.
 */
export default function G1SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-genesis-void text-genesis-text">
      {/* fondo WebGL persistente (z-0) */}
      <G1SiteBackground />

      {/* velo de legibilidad sobre el fondo (z-1) */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{ background: 'radial-gradient(120% 92% at 50% 28%, transparent 52%, rgba(2,4,10,.5) 84%, rgba(2,4,10,.74) 100%)' }}
      />

      <G1Header />
      <main className="relative z-10 pt-16">{children}</main>
      <div className="relative z-10">
        <G1Footer />
      </div>
    </div>
  )
}
