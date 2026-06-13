'use client'

import { Button } from '@/components/ui/genesis'

interface OfficialDownloadButtonProps {
  href: string
  children: React.ReactNode
  className?: string
  variant?: 'primary' | 'secondary' | 'signature'
  size?: 'sm' | 'md' | 'lg'
}

/** CTA de descarga — PDFs oficiales (whitepaper, plan de marketing). */
export default function OfficialDownloadButton({
  href,
  children,
  className = '',
  variant = 'secondary',
  size = 'md',
}: OfficialDownloadButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </Button>
  )
}
