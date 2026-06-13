'use client'

import { motion } from 'framer-motion'
import { slideLeft } from '@/components/ui/SceneShared'

const TAGLINE_ITEMS = [
  { label: 'AI', dot: '#E91E8B' },
  { label: 'Blockchain', dot: '#6E56CF' },
  { label: 'Marketplace', dot: '#3D8BFF' },
  { label: 'Intelligence Network', dot: '#22D3EE' },
] as const

export default function CtaBrandSignature() {
  return (
    <motion.div variants={slideLeft} className="cta-brand-signature">
      <p className="cta-brand-signature__name font-display">AiGenesis</p>
      <p
        className="cta-brand-signature__tagline"
        aria-label="AI, Blockchain, Marketplace, Intelligence Network"
      >
        {TAGLINE_ITEMS.map((item, index) => (
          <span key={item.label} className="cta-brand-signature__segment">
            {index > 0 && (
              <span
                className="cta-brand-signature__dot"
                style={{ color: TAGLINE_ITEMS[index - 1].dot }}
                aria-hidden="true"
              >
                ·
              </span>
            )}
            <span>{item.label}</span>
          </span>
        ))}
      </p>
    </motion.div>
  )
}
