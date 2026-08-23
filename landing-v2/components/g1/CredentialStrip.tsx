import { G1 } from '@/lib/design/g1'

/**
 * CREDENTIAL STRIP — la franja de credenciales de la alianza.
 *
 * REGLA (decisión del owner): se ATRIBUYEN a la documentación oficial de cada
 * entidad y se ENLAZAN a la fuente. Génesis las MUESTRA porque son Aitech y TAG
 * quienes ofrecen las herramientas; Génesis NUNCA las certifica. El pie lo dice
 * literal para que no quede ambigüedad legal.
 *
 * ESTÉTICA (decisión del owner, ago-2026): el respaldo es un PIE de confianza,
 * no un cartel. Antes eran chips de borde brillante que gritaban al final de
 * cada página y rompían la armonía premium. Ahora las entidades van INLINE, en
 * tono contenido, separadas por hairlines — presencia sin alarma. `bare` lo deja
 * sin caja para vivir dentro del cristal de cumplimiento del footer.
 *
 * En español a propósito (contenido sensible). Los enlaces `href` se completan
 * en F3 con las URLs oficiales verificadas.
 */
type Credential = { label: string; issuer: string; href?: string }

const ALIANZA: Credential[] = [
  { label: 'Aitech One', issuer: 'comunidad / ecosistema' },
  { label: 'TAG Markets', issuer: 'bróker' },
  { label: 'Lloyd’s of London', issuer: 'fondo de cobertura' },
  { label: 'FSC Mauritius', issuer: 'Lic. GB21026474' },
  { label: 'DASP · El Salvador', issuer: 'exchange (Bit1)' },
  { label: 'MSB · Canadá', issuer: 'exchange (Bit1)' },
]

export function CredentialStrip({
  items = ALIANZA,
  className = '',
  bare = false,
}: {
  items?: Credential[]
  className?: string
  /** Sin caja propia — para embeberlo dentro del cristal del footer. */
  bare?: boolean
}) {
  const cuerpo = (
    <>
      <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-genesis-mist">
        Respaldo — según la documentación oficial de cada entidad
      </p>
      <ul className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
        {items.map((c, i) => {
          const inner = (
            <span className="flex items-baseline gap-1.5">
              <span className="text-[12.5px] font-semibold text-genesis-text transition-colors group-hover:text-genesis-cyan">{c.label}</span>
              <span className="font-mono text-[10px] text-genesis-mist">{c.issuer}</span>
            </span>
          )
          return (
            <li key={c.label} className="flex items-center gap-x-5">
              {i > 0 ? <span aria-hidden className="h-3 w-px" style={{ background: `${G1.cyan}24` }} /> : null}
              {c.href ? (
                <a href={c.href} target="_blank" rel="noopener noreferrer" className="group block">{inner}</a>
              ) : (
                inner
              )}
            </li>
          )
        })}
      </ul>
      <p className="mt-4 font-mono text-[10px] leading-relaxed text-genesis-ghost">
        Génesis muestra estas credenciales de terceros y enlaza a su fuente. No las certifica.
      </p>
    </>
  )

  if (bare) {
    return (
      <div lang="es" aria-label="Credenciales de la alianza" className={className}>
        {cuerpo}
      </div>
    )
  }

  return (
    <section
      lang="es"
      aria-label="Credenciales de la alianza"
      className={`rounded-3xl border p-6 ${className}`}
      style={{ borderColor: `${G1.cyan}16`, background: 'rgba(255,255,255,0.02)' }}
    >
      {cuerpo}
    </section>
  )
}
