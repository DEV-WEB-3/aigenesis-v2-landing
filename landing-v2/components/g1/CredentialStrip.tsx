/**
 * CREDENTIAL STRIP — la franja de credenciales de la alianza.
 *
 * REGLA (decisión del owner): se ATRIBUYEN a la documentación oficial de cada
 * entidad y se ENLAZAN a la fuente. Génesis las MUESTRA porque son Aitech y TAG
 * quienes ofrecen las herramientas; Génesis NUNCA las certifica. El pie lo dice
 * literal para que no quede ambigüedad legal.
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
}: {
  items?: Credential[]
  className?: string
}) {
  return (
    <section
      lang="es"
      aria-label="Credenciales de la alianza"
      className={`rounded-2xl border border-genesis-ghost/60 bg-genesis-surface/40 p-5 ${className}`}
    >
      <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-genesis-mist">
        Respaldo — según la documentación oficial de cada entidad
      </p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {items.map((c) => {
          const chip = (
            <span className="flex items-baseline gap-2 rounded-lg border border-genesis-ghost/60 bg-white/[0.03] px-3 py-2 transition-colors group-hover:border-genesis-cyan">
              <span className="text-[13px] font-semibold text-genesis-text">{c.label}</span>
              <span className="font-mono text-[10px] text-genesis-mist">{c.issuer}</span>
            </span>
          )
          return (
            <li key={c.label}>
              {c.href ? (
                <a
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  {chip}
                </a>
              ) : (
                chip
              )}
            </li>
          )
        })}
      </ul>
      <p className="mt-3 font-mono text-[10px] leading-relaxed text-genesis-ghost">
        Génesis muestra estas credenciales de terceros y enlaza a su fuente. No las certifica.
      </p>
    </section>
  )
}
