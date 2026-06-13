import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, Inter, IBM_Plex_Mono } from 'next/font/google'
import { SITE_URL } from '@/lib/routes'
import SkipLink from '@/components/layout/SkipLink'
import { WALLET_EXTENSION_GUARD_SCRIPT } from '@/components/layout/WalletExtensionGuard'
import SiteAnalytics from '@/components/analytics/SiteAnalytics'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500'],
})

const siteTitle = 'AiGenesis — AI, Blockchain & Marketplace Ecosystem'
const siteDescription =
  'AiGenesis is a next-generation ecosystem combining artificial intelligence, blockchain infrastructure, digital assets, marketplace utility and global community expansion.'

/** OG: SVG institucional (PNG derivado en /og-image.png cuando se exporte) */
const OG_IMAGE_SVG = '/og-image.svg'
const OG_IMAGE_PNG = '/og-image.png'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: siteTitle,
  description: siteDescription,
  keywords: [
    'AI',
    'artificial intelligence',
    'blockchain',
    'marketplace',
    'digital assets',
    'BSC',
    'AiGenesis',
    'Web3',
    'intelligence network',
  ],
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    type: 'website',
    locale: 'es_ES',
    url: '/',
    siteName: 'AiGenesis',
    images: [
      {
        url: OG_IMAGE_PNG,
        width: 1200,
        height: 630,
        alt: 'AiGenesis — AI, Blockchain & Marketplace Ecosystem',
      },
      {
        url: OG_IMAGE_SVG,
        width: 1200,
        height: 630,
        alt: 'AiGenesis — AI, Blockchain & Marketplace Ecosystem',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: [OG_IMAGE_PNG, OG_IMAGE_SVG],
    // PLACEHOLDER: añadir creator/@aigenesis cuando esté confirmado
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
  authors: [{ name: 'AiGenesis' }],
  category: 'technology',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#050510',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="es"
      className={`${spaceGrotesk.variable} ${inter.variable} ${ibmPlexMono.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: WALLET_EXTENSION_GUARD_SCRIPT }}
        />
        {process.env.NODE_ENV === 'development' && (
          <script src="/dev-chunk-recovery.js" defer />
        )}
      </head>
      <body className="font-body bg-genesis-base text-genesis-text antialiased min-h-screen">
        <SkipLink />
        {children}
        <SiteAnalytics />
      </body>
    </html>
  )
}
