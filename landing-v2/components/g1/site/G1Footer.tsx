import Link from 'next/link'
import { G1, G1_GRADIENT } from '@/lib/design/g1'
import { DisclaimerBar } from '../DisclaimerBar'
import { CredentialStrip } from '../CredentialStrip'

/**
 * G1 FOOTER — sello de la alianza (G-TAG), franja de credenciales atribuidas
 * (reutiliza CredentialStrip), navegación, accesos a portales y el descargo.
 */

const NAV = [
  { href: '/g1/que-es-g1', label: 'Qué es G1' },
  { href: '/g1/como-funciona', label: 'Cómo funciona' },
  { href: '/g1/ecosistema', label: 'Ecosistema' },
  { href: '/g1/comunidad', label: 'Comunidad' },
  { href: '/g1/faq', label: 'FAQ' },
]

export function G1Footer() {
  return (
    <footer className="relative border-t border-genesis-line/40 bg-genesis-void" style={{ borderColor: `${G1.cyan}1a` }}>
      <div className="mx-auto max-w-6xl px-[clamp(16px,4vw,40px)] py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* marca + sello */}
          <div>
            <div className="flex items-center gap-2.5">
              <span
                className="grid h-9 w-9 place-items-center rounded-[9px] font-display text-[16px] font-extrabold text-genesis-void"
                style={{ background: G1_GRADIENT, boxShadow: `0 0 22px -6px ${G1.violet}` }}
              >
                G1
              </span>
              <span className="font-display text-[16px] font-bold tracking-tight text-genesis-text">G1</span>
            </div>
            <p className="mt-4 max-w-[42ch] text-[14px] leading-relaxed text-genesis-mist">
              La marca de la alianza. Comunidad Génesis con las herramientas de Aitech y TAG:
              trading, exchange y tarjeta cripto, con la usabilidad del AiG&nbsp;Token.
            </p>
            <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: G1.amber }}>
              Sello G‑TAG · Génesis × Aitech × TAG
            </p>
          </div>

          {/* navegación */}
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-genesis-mist">Explorar</p>
            <ul className="mt-4 space-y-2.5">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="text-[14px] text-genesis-text hover:underline">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* portales */}
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-genesis-mist">Portales</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a href="https://genesis.ibportal.io" target="_blank" rel="noopener noreferrer" className="text-[14px] text-genesis-text hover:underline">
                  Portal IBO ↗
                </a>
              </li>
              <li>
                <a href="https://g-pulse.aigenesis.io" target="_blank" rel="noopener noreferrer" className="text-[14px] text-genesis-text hover:underline">
                  G‑Pulse ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* credenciales atribuidas */}
        <div className="mt-12">
          <CredentialStrip />
        </div>

        {/* descargo + copyright */}
        <div className="mt-10 border-t border-genesis-line/30 pt-6" style={{ borderColor: `${G1.cyan}14` }}>
          <DisclaimerBar />
          <p className="mt-4 font-mono text-[11px] tracking-[0.05em] text-genesis-mist">
            © {'2026'} G1 · Génesis. Material informativo. Las credenciales de terceros se
            presentan según su documentación oficial y deben verificarse en la fuente.
          </p>
        </div>
      </div>
    </footer>
  )
}
