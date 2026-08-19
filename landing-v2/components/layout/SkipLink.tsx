'use client'

import { useT } from '@/context/IdiomaContext'

export default function SkipLink() {
  const t = useT()
  return (
    <a href="#main-content" className="skip-link">
      {t('Saltar al contenido principal')}
    </a>
  )
}
