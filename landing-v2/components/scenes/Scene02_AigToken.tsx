'use client'

import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import {
  SceneWrapper, SectionLabel, GradientText, GradientButton,
  StatBlock, containerV, slideLeft, wordV,
} from '@/components/ui/SceneShared'

const STAKING_RATES = [
  { label: 'Año 1-2: 11%', active: true },
  { label: 'Año 3: 8%',    active: false },
  { label: 'Año 4: 6%',    active: false },
  { label: 'Año 5: 4%',    active: false },
  { label: 'Año 6+: 2%',   active: false },
]

interface Props { isActive?: boolean }

const Scene02_AigToken = forwardRef<HTMLElement, Props>(
  function Scene02_AigToken({ isActive = false }, ref) {
    return (
      <SceneWrapper ref={ref} isActive={isActive} motionKey="scene02">

        {/* Label */}
        <SectionLabel>Sección 02</SectionLabel>

        {/* Heading */}
        <motion.h2
          className="text-5xl font-bold leading-tight"
          style={{ fontFamily: 'var(--font-space-grotesk)', textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}
        >
          {['Artificial', 'Intelligence'].map((w, i) => (
            <motion.span key={i} variants={wordV} style={{ display: 'inline-block', marginRight: '0.3em', color: '#fff' }}>
              {w}
            </motion.span>
          ))}
          <br />
          <GradientText>Genesis Token.</GradientText>
        </motion.h2>

        {/* Párrafo */}
        <motion.p variants={slideLeft} className="text-lg leading-relaxed max-w-lg mt-2" style={{ color: '#94A3B8' }}>
          Token BEP-20 deflacionario con minería diaria por staking. El combustible que impulsa todo el ecosistema Genesis.
        </motion.p>

        {/* Stats 2×2 */}
        <motion.div variants={slideLeft} className="grid grid-cols-2 gap-6 mt-4">
          {[
            { to: 0,   suffix: '',    label: 'PRECIO',       static: '$0.0042' },
            { to: 111, suffix: 'M',   label: 'SUPPLY TOTAL', static: null },
            { to: 2847, suffix: '+',  label: 'HOLDERS',      static: null },
            { to: 0,   suffix: '',    label: 'NETWORK',      static: 'BSC' },
          ].map(({ to, suffix, label, static: staticVal }) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                {staticVal ? (
                  staticVal
                ) : (
                  <StatBlock to={to} suffix={suffix} label="" isActive={isActive} />
                )}
              </span>
              <span className="text-xs text-gray-500 uppercase tracking-wider">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* Staking rates */}
        <motion.div variants={slideLeft} className="mt-2">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Rendimiento por Staking</p>
          <div className="flex flex-wrap gap-2">
            {STAKING_RATES.map(({ label, active }) => (
              <span
                key={label}
                className="px-3 py-1 rounded-full text-xs"
                style={
                  active
                    ? { border: '1px solid rgba(233,30,139,0.5)', background: 'rgba(233,30,139,0.1)', color: '#fff' }
                    : { border: '1px solid rgba(139,92,246,0.3)', color: '#94A3B8' }
                }
              >
                {label}
              </span>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <GradientButton className="mt-2">Ver en BSCScan →</GradientButton>

      </SceneWrapper>
    )
  }
)

export default Scene02_AigToken
