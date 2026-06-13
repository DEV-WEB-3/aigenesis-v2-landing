import type { MetadataRoute } from 'next'
import { SITE_URL, PAGES } from '@/lib/routes'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL.replace(/\/$/, '')
  const now = new Date()

  return [
    {
      url: `${base}${PAGES.HOME}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${base}${PAGES.LEGAL}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${base}${PAGES.WHITEPAPER}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]
}
