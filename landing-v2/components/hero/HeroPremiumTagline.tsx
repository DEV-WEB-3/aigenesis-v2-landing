'use client'

import { EMISSION } from '@/lib/design/tokens'

import { motion } from 'framer-motion'

const TAGLINE_ITEMS = [
  { label: 'AI', dot: EMISSION.magenta },
  { label: 'Blockchain', dot: EMISSION.violet },
  { label: 'Marketplace', dot: EMISSION.blueHi },
  { label: 'Intelligence Network', dot: EMISSION.cyan },
] as const

interface HeroPremiumTaglineProps {
  delay?: number
}

export default function HeroPremiumTagline({ delay = 0.1 }: HeroPremiumTaglineProps) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.4, 0, 0.2, 1] }}
      className="hero-premium-tagline"
      aria-label="AI, Blockchain, Marketplace, Intelligence Network"
    >
      {TAGLINE_ITEMS.map((item, index) => (
        <span key={item.label} className="hero-premium-tagline__segment">
          {index > 0 && (
            <span
              className="hero-premium-tagline__dot"
              style={{ color: TAGLINE_ITEMS[index - 1].dot }}
              aria-hidden="true"
            >
              ·
            </span>
          )}
          <span>{item.label}</span>
        </span>
      ))}
    </motion.p>
  )
}
