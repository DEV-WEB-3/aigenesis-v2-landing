import type { ReactNode } from 'react'
import { G1Header } from '@/components/g1/site/G1Header'
import { G1Footer } from '@/components/g1/site/G1Footer'

/**
 * Layout de la WEB G1 (route group (site)): envuelve las páginas de contenido con
 * el header (marca + nav + iconos de portal) y el footer (sello G-TAG +
 * credenciales + descargo). NO envuelve los full-screen (narrativa, previews).
 */
export default function G1SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-genesis-void text-genesis-text">
      <G1Header />
      <main className="pt-16">{children}</main>
      <G1Footer />
    </div>
  )
}
