/**
 * Datos estructurados (JSON-LD).
 *
 * No habia ninguno en todo el repo. Para un proyecto con marca, redes y
 * whitepaper, esto es lo que decide si el buscador muestra una ficha rica —con
 * logo, enlaces sociales y nombre de organizacion— o una sola linea de texto.
 *
 * Se alimenta de `lib/official-links.ts`, que ya era la fuente unica de los
 * enlaces oficiales: asi no aparece aqui una segunda copia de las URLs que
 * pueda quedarse vieja.
 */
import { OFFICIAL_SOCIAL } from '@/lib/official-links'
import { SITE_URL } from '@/lib/routes'

const ORGANIZATION_ID = `${SITE_URL}/#organization`
const WEBSITE_ID = `${SITE_URL}/#website`

/** Perfiles publicos. Se excluye el `mailto:`, que no es un perfil. */
const socialProfiles = Object.entries(OFFICIAL_SOCIAL)
  .filter(([key]) => key !== 'EMAIL')
  .map(([, url]) => url)

const graph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': ORGANIZATION_ID,
      name: 'AiGenesis',
      url: SITE_URL,
      email: OFFICIAL_SOCIAL.EMAIL.replace('mailto:', ''),
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/brand/genesis-symbol-512.png`,
      },
      sameAs: socialProfiles,
    },
    {
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      url: SITE_URL,
      name: 'AiGenesis',
      inLanguage: 'es-ES',
      publisher: { '@id': ORGANIZATION_ID },
    },
  ],
}

/**
 * `<` se escapa a `<` a proposito: sin eso, una cadena que contuviera
 * `</script>` cerraria la etiqueta y el resto del JSON se interpretaria como
 * HTML. Es la unica forma segura de inyectar JSON dentro de un <script>.
 */
const json = JSON.stringify(graph).replace(/</g, '\\u003c')

export default function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  )
}
