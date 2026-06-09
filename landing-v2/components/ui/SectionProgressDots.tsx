'use client'

import { motion } from 'framer-motion'

const SECTION_LABELS = [
  'Hero',
  'Ecosistema',
  'AIG Token',
  'GPulse',
  'Gevy Shop',
  'Comunidad',
  'Tech',
  'Roadmap',
  'Inicio',
]

interface SectionProgressDotsProps {
  total: number
  current: number
  onDotClick: (index: number) => void
}

export default function SectionProgressDots({
  total,
  current,
  onDotClick,
}: SectionProgressDotsProps) {
  return (
    <nav
      aria-label="Navegación de secciones"
      style={{
        position: 'fixed',
        right: 24,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        pointerEvents: 'auto',
      }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onDotClick(i)}
          aria-label={SECTION_LABELS[i] ?? `Sección ${i + 1}`}
          title={SECTION_LABELS[i] ?? `Sección ${i + 1}`}
          style={{
            padding: 0,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 20,
            height: 20,
          }}
        >
          <motion.span
            animate={
              i === current
                ? { scale: 1, backgroundColor: '#E91E8B', boxShadow: '0 0 8px rgba(233,30,139,0.6)' }
                : { scale: 0.7, backgroundColor: 'rgba(255,255,255,0.2)', boxShadow: 'none' }
            }
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{
              display: 'block',
              width: 8,
              height: 8,
              borderRadius: '50%',
            }}
          />
        </button>
      ))}

      {/* Línea conectora entre dots */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 10,
          bottom: 10,
          width: 1,
          background: 'rgba(255,255,255,0.08)',
          transform: 'translateX(-50%)',
          zIndex: -1,
        }}
      />
    </nav>
  )
}
