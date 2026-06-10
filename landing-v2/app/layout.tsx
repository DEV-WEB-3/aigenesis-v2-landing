import type { Metadata } from 'next'
import { Space_Grotesk, Inter } from 'next/font/google'
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

export const metadata: Metadata = {
  title: 'AiGenesis — Universo Inteligente',
  description:
    'Donde la Inteligencia Artificial y el Blockchain crean un universo en expansión. Ecosistema DeFi de próxima generación sobre Binance Smart Chain.',
  keywords: ['AI', 'blockchain', 'DeFi', 'BSC', 'crypto', 'AiGenesis'],
  openGraph: {
    title: 'AiGenesis — Universo Inteligente',
    description: 'Donde la IA y el Blockchain crean un universo en expansión.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body
        className="font-body bg-genesis-base text-white antialiased"
        style={{ backgroundColor: '#0A0E14', overflow: 'hidden', height: '100vh' }}
      >
        {children}
      </body>
    </html>
  )
}
