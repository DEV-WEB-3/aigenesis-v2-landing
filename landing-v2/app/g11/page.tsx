import type { Metadata } from 'next'
import StaticPageShell from '@/components/layout/StaticPageShell'
import G11Contenido from './G11Contenido'

export const metadata: Metadata = {
  title: 'Comunidad G11 — AiGenesis',
  description:
    'Material oficial de la Comunidad G11: guías de registro y minería, presentaciones corporativas en ocho idiomas y canales oficiales.',
  alternates: { canonical: '/g11' },
}

/**
 * EL `metadata` SE QUEDA EN ESPAÑOL, y es deliberado.
 *
 * Lo que ve un buscador —y lo que se pinta al compartir el enlace— lo genera el
 * servidor, que no sabe en qué idioma va a leer quien todavía no ha llegado. El
 * idioma se elige en el cliente, después. Traducir esto de verdad no es un
 * `t()`: es servir la página bajo `/en/g11`, `/de/g11`… con su URL propia, que
 * es lo único que un buscador puede indexar por separado.
 *
 * Es una decisión de arquitectura de rutas, no de traducción, y va aparte.
 * Mientras tanto el título del navegador está en español y el CONTENIDO en el
 * idioma del visitante — que es la mitad que le sirve para algo.
 */
export default function G11Page() {
  return (
    <StaticPageShell title="Comunidad G11">
      <G11Contenido />
    </StaticPageShell>
  )
}
