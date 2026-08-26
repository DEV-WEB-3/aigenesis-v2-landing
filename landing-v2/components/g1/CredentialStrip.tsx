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

/**
 * FUERA «FSC Mauritius — Lic. GB21026474» (26-ago-2026). NO fue una decisión de
 * estilo: el número está REFUTADO en la fuente primaria.
 *
 * El aviso público de la Financial Services Commission de Mauricio del 27 de
 * marzo de 2024 dice que la licencia de Investment Dealer (Broker) nº GB21026474
 * era de **Pure North Markets Ltd** y que «stands terminated with effect from 18
 * March 2024». No es nuestra invención —TAG Markets lo publica como propio— pero
 * lo repetíamos aquí sin haberlo buscado en el registro del emisor, y esta franja
 * sale en el pie de TODAS las páginas de g1.
 *
 * Queda una hipótesis benigna sin cerrar: que Pure North se renombrara T.M.
 * Financials conservando la licencia. El aviso habla de entrega y terminación,
 * no de renombre. Se vuelve a poner el día que la alianza entregue el certificado
 * vigente a nombre de la entidad correcta, y no antes.
 *
 * LA REGLA QUE DEJA: una credencial de tercero se muestra CON su número sólo si
 * alguien la buscó en el registro del emisor. «Atribuido, no certificado» protege
 * de avalar algo cierto; no protege de publicar un número falso.
 */
const ALIANZA: Credential[] = [
  { label: 'Aitech One', issuer: 'comunidad / ecosistema' },
  { label: 'TAG Markets', issuer: 'bróker' },
  { label: 'Lloyd’s of London', issuer: 'fondo de cobertura' },
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
  /* EL PIE DECÍA «y enlaza a su fuente» Y NO HABÍA UN SOLO ENLACE. Los `href` se
     aplazaron a «F3» y nunca se pusieron: los seis elementos salían sin `href`,
     así que la frase afirmaba en producción algo que no ocurría. Se cambia por lo
     que la franja hace de verdad —mostrar lo declarado— y se remata pidiendo la
     verificación en el registro, que es lo único que resuelve de verdad y es lo
     que ya hace el corpus del asistente. */
  const pie = c('Génesis muestra estas credenciales de terceros tal como las declara cada entidad. No las certifica: verifícalas en el registro oficial correspondiente.')
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
