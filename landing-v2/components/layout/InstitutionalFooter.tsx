'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import SocialLinks from '@/components/layout/SocialLinks'
import { EXTERNAL_LINKS, PAGES, ROUTES } from '@/lib/routes'

const FOOTER_LINKS = [
  { label: 'Legal', href: PAGES.LEGAL },
  { label: 'Whitepaper', href: PAGES.WHITEPAPER },
  { label: 'Contact', href: ROUTES.CONTACT },
  { label: 'BSC Explorer', href: EXTERNAL_LINKS.BSCSCAN_CONTRACT, external: true },
  { label: 'Privacy', href: `${PAGES.LEGAL}#privacy` },
] as const

const LEGAL_DISCLAIMER =
  'AiGenesis involucra activos digitales y tecnologías blockchain. La participación puede implicar riesgos tecnológicos, regulatorios y de mercado. Ningún contenido debe interpretarse como garantía de rendimiento financiero.'

interface InstitutionalFooterProps {
  className?: string
}

export default function InstitutionalFooter({ className = '' }: InstitutionalFooterProps) {
  return (
    <motion.footer
      id="legal"
      className={`institutional-footer ${className}`.trim()}
      aria-label="Pie de página institucional"
    >
      <div className="institutional-footer__watermark" aria-hidden="true">
        <Image
          src="/brand/genesis-symbol-512.png"
          alt=""
          width={320}
          height={320}
          className="institutional-footer__watermark-img"
          priority={false}
        />
      </div>

      <div className="institutional-footer__inner">
        <div className="institutional-footer__brand">
          <p className="institutional-footer__name font-display">AiGenesis</p>
          <p className="institutional-footer__tagline">
            Artificial Intelligence + Blockchain Infrastructure
          </p>
        </div>

        <SocialLinks />

        <nav aria-label="Enlaces institucionales" className="institutional-footer__nav">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="institutional-footer__link"
              {...('external' in link && link.external
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <p className="institutional-footer__copyright">
          © 2026 AiGenesis. All rights reserved.
        </p>

        <p className="institutional-footer__disclaimer">{LEGAL_DISCLAIMER}</p>
      </div>
    </motion.footer>
  )
}
