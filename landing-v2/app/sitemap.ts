import type { MetadataRoute } from 'next'
import { SITE_URL, PAGES } from '@/lib/routes'

/**
 * Metadatos de sitemap por página.
 *
 * POR QUE ESTA ASI
 * ----------------
 * Antes el sitemap era una lista escrita a mano: tres entradas, mientras que
 * `PAGES` ya tenía cuatro. El portal `/g11` se quedó fuera y ningún buscador
 * lo habría encontrado nunca. Es el mismo fallo de siempre —una copia del dato
 * que se separa del original— y no rompe nada, que es lo que lo hace difícil de
 * ver.
 *
 * `Record<keyof typeof PAGES, …>` lo convierte en un error de COMPILACIÓN:
 * añadir una página a `PAGES` sin decir aquí qué prioridad tiene deja de
 * compilar, nombrando la clave que falta. No hay que acordarse de nada.
 *
 * Probado quitando `g11` de este objeto:
 *   «Property 'g11' is missing in type … but required in type 'Record<…>'»
 */
const METADATOS: Record<
  keyof typeof PAGES,
  { changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }
> = {
  // La home es el recorrido entero: catorce secciones que se tocan a menudo.
  HOME: { changeFrequency: 'weekly', priority: 1 },
  // Material de comunidad: cambia cuando entran guías o idiomas nuevos.
  G11: { changeFrequency: 'monthly', priority: 0.7 },
  WHITEPAPER: { changeFrequency: 'monthly', priority: 0.6 },
  LEGAL: { changeFrequency: 'monthly', priority: 0.5 },
  // El centro de ayuda crece con cada corrección del corpus de soporte.
  SOPORTE: { changeFrequency: 'weekly', priority: 0.7 },
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL.replace(/\/$/, '')
  const now = new Date()

  return (Object.keys(METADATOS) as (keyof typeof PAGES)[]).map((clave) => ({
    url: `${base}${PAGES[clave]}`,
    lastModified: now,
    ...METADATOS[clave],
  }))
}
