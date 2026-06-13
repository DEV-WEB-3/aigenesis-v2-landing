import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/routes'

export default function robots(): MetadataRoute.Robots {
  const base = SITE_URL.replace(/\/$/, '')

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}
