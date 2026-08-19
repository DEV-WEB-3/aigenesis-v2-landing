import { VOID } from '@/lib/design/tokens'
import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, Inter, IBM_Plex_Mono } from 'next/font/google'
import { SITE_URL } from '@/lib/routes'
import { IdiomaProvider } from '@/context/IdiomaContext'
import SkipLink from '@/components/layout/SkipLink'
import { WALLET_EXTENSION_GUARD_SCRIPT } from '@/components/layout/WalletExtensionGuard'
import SiteAnalytics from '@/components/analytics/SiteAnalytics'
import StructuredData from '@/components/seo/StructuredData'
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

/**
 * Título y descripción EN ESPAÑOL, igual que el contenido.
 *
 * Estaban en inglés mientras el documento declaraba `lang="es"` y la ficha
 * social `og:locale: es_ES`. Tres señales, dos idiomas: el buscador recibía una
 * contradicción y un lector de pantalla leía inglés con fonética española.
 * La página es española —navegación, titulares y cuerpo— así que lo que sobraba
 * era el inglés de los metadatos, no el `lang`.
 *
 * REVISAR: esto es texto de marketing y es lo primero que se ve en Google y al
 * compartir el enlace. La traducción es fiel al original inglés, pero la
 * redacción final es decisión del dueño.
 */
const siteTitle = 'AiGenesis — Ecosistema de IA, Blockchain y Marketplace'
const siteDescription =
  'AiGenesis es un ecosistema de nueva generación que combina inteligencia artificial, infraestructura blockchain, activos digitales, utilidad de marketplace y expansión de comunidad global.'

/** OG: SVG institucional (PNG derivado en /og-image.png cuando se exporte) */
const OG_IMAGE_SVG = '/og-image.svg'
const OG_IMAGE_PNG = '/og-image.png'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: siteTitle,
  description: siteDescription,
  keywords: [
    'AiGenesis',
    'inteligencia artificial',
    'blockchain',
    'marketplace',
    'activos digitales',
    'criptomonedas',
    'BSC',
    'Web3',
    'token AIG',
    'artificial intelligence',
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
  themeColor: VOID.black,
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
        <StructuredData />
        <script
          dangerouslySetInnerHTML={{ __html: WALLET_EXTENSION_GUARD_SCRIPT }}
        />
        {process.env.NODE_ENV === 'development' && (
          <script src="/dev-chunk-recovery.js" defer />
        )}
      </head>
      <body className="font-body bg-genesis-base text-genesis-text antialiased min-h-screen">
        <SkipLink />
        {/*
          EL PROVEEDOR ENVUELVE TODO EL CUERPO, no solo la landing.

          `dir="rtl"` invierte la maquetacion del documento entero —margenes
          logicos, orden de flex, lado de las barras de desplazamiento—, asi que
          quien lo decide tiene que estar por encima de todo lo que se maqueta.
          Y las paginas sueltas —legal, whitepaper, g11— comparten cabecera y
          pie: si el proveedor solo cubriera la portada, el idioma se perderia
          al navegar a cualquiera de ellas.
        */}
        <IdiomaProvider>{children}</IdiomaProvider>
        <SiteAnalytics />
      </body>
    </html>
  )
}
