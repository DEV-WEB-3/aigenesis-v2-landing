import type { ReactNode } from 'react'
import { G1Header } from '@/components/g1/site/G1Header'
import { G1Footer } from '@/components/g1/site/G1Footer'
import { G1SiteTheme } from '@/components/g1/site/G1SiteTheme'
import AsistenteFlotante from '@/components/soporte/AsistenteFlotante'

/**
 * Layout de la WEB G1 (route group (site)). Monta el TEMA DE FONDO persistente
 * (Capa 1: gradiente + luces/sombras + humo, sin partículas) una sola vez → el
 * mundo es continuo en toda la web, no se re-monta al navegar. Sobre él: header
 * glass, contenido (z-10) y footer. Las partículas vuelven como masas por página.
 */
export default function G1SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-genesis-void text-genesis-text">
      {/* TEMA de fondo persistente (z-0) */}
      <G1SiteTheme />

      <G1Header />
      <main className="relative z-10 pt-16">{children}</main>
      <div className="relative z-10">
        <G1Footer />
      </div>

      {/* Asistente flotante — el mismo mensajero de aigenesis.io; ayuda al usuario
          en toda la web G1. Cerebro client-side (responder sobre el corpus). */}
      <AsistenteFlotante />
    </div>
  )
}
