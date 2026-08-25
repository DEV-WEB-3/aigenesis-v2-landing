'use client'

import { useCorpus } from '@/hooks/useCorpus'
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
 * SE TRADUCE DESDE EL 25-AGO-2026. Antes iba en español a propósito «por ser
 * contenido sensible». El razonamiento se invirtió: la línea que más importa
 * aquí es «Génesis muestra estas credenciales de terceros y no las certifica»,
 * y esa frase existe justamente para que la lea quien podría malinterpretar la
 * presencia de un logo. En un idioma que no entiende, no la lee.
 *
 * LOS NOMBRES PROPIOS NO SE TRADUCEN: «Lloyd's of London», «FSC Mauritius»,
 * «TAG Markets» son entidades, no texto. Lo que se traduce es lo que las
 * describe —el papel de cada una— y el descargo. Traducir el nombre de un
 * licenciante haría imposible verificarlo, que es justo lo contrario de para
 * lo que está.
 *
 * Los enlaces `href` se completan en F3 con las URLs oficiales verificadas.
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
  const c = useCorpus()
  const titulo = c('Respaldo — según la documentación oficial de cada entidad')
  const pie = c('Génesis muestra estas credenciales de terceros y enlaza a su fuente. No las certifica.')
  const rotulo = c('Credenciales de la alianza')

  const cuerpo = (
    <>
      <p
        lang={titulo.lang}
        className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-genesis-mist"
      >
        {titulo.texto}
      </p>
      <ul className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
        {/* `cred` y no `c`: `c` es el traductor de este componente, y usarlo
            también como variable del bucle lo tapaba dentro del `map`. */}
        {items.map((cred, i) => {
          const emisor = c(cred.issuer)
          const inner = (
            <span className="flex items-baseline gap-1.5">
              {/* El NOMBRE de la entidad no se traduce: es lo que permite
                  verificarla en su registro. */}
              <span className="text-[12.5px] font-semibold text-genesis-text transition-colors group-hover:text-genesis-cyan">
                {cred.label}
              </span>
              <span lang={emisor.lang} className="font-mono text-[10px] text-genesis-mist">
                {emisor.texto}
              </span>
            </span>
          )
          return (
            <li key={cred.label} className="flex items-center gap-x-5">
              {i > 0 ? <span aria-hidden className="h-3 w-px" style={{ background: `${G1.cyan}24` }} /> : null}
              {cred.href ? (
                <a href={cred.href} target="_blank" rel="noopener noreferrer" className="group block">{inner}</a>
              ) : (
                inner
              )}
            </li>
          )
        })}
      </ul>
      <p lang={pie.lang} className="mt-4 font-mono text-[10px] leading-relaxed text-genesis-ghost">
        {pie.texto}
      </p>
    </>
  )

  if (bare) {
    return (
      <div aria-label={rotulo.texto} className={className}>
        {cuerpo}
      </div>
    )
  }

  return (
    <section
      aria-label={rotulo.texto}
      className={`rounded-3xl border p-6 ${className}`}
      style={{ borderColor: `${G1.cyan}16`, background: 'rgba(255,255,255,0.02)' }}
    >
      {cuerpo}
    </section>
  )
}
