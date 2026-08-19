'use client'

import { useT } from '@/context/IdiomaContext'
import { EXTERNAL_LINKS } from '@/lib/routes'

const SOCIAL_ITEMS = [
  { label: 'Telegram', href: EXTERNAL_LINKS.TELEGRAM },
  { label: 'Discord', href: EXTERNAL_LINKS.DISCORD },
  { label: 'X', href: EXTERNAL_LINKS.X },
  { label: 'Instagram', href: EXTERNAL_LINKS.INSTAGRAM },
  { label: 'YouTube', href: EXTERNAL_LINKS.YOUTUBE },
] as const

interface SocialLinksProps {
  className?: string
}

export default function SocialLinks({ className = '' }: SocialLinksProps) {
  const t = useT()
  return (
    <nav
      aria-label={t('Redes sociales AiGenesis')}
      className={`institutional-footer__social ${className}`.trim()}
    >
      {SOCIAL_ITEMS.map((item) => (
        <a
          key={item.label}
          href={item.href}
          className="institutional-footer__social-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          {item.label}
        </a>
      ))}
    </nav>
  )
}
