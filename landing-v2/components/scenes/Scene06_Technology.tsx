'use client'

import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import {
  SceneWrapper, SectionLabel, GradientText, GradientButton,
  containerV, slideLeft, wordV,
} from '@/components/ui/SceneShared'

const TECH_STACK = [
  'BSC', 'Smart Contracts', 'Web3', 'MetaMask', 'Socket.IO',
  'Node.js', 'React', 'MongoDB', 'Redis', 'G-BRIDGE AI', 'Three.js',
]

const STATS = [
  { value: '99.9%',   label: 'UPTIME' },
  { value: '< 200ms', label: 'LATENCIA' },
  { value: '24/7',    label: 'MONITOREO' },
]

interface Props { isActive?: boolean }

const Scene06_Technology = forwardRef<HTMLElement, Props>(
  function Scene06_Technology({ isActive = false }, ref) {
    return (
      <SceneWrapper ref={ref} isActive={isActive} motionKey="scene06">

        <SectionLabel>Sección 06</SectionLabel>

        <motion.h2
          className="text-5xl font-bold leading-tight"
          style={{ fontFamily: 'var(--font-space-grotesk)', textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}
        >
          <motion.span variants={wordV} style={{ display: 'block', color: '#fff' }}>
            Ingeniería de
          </motion.span>
          <GradientText>vanguardia.</GradientText>
        </motion.h2>

        <motion.p variants={slideLeft} className="text-lg leading-relaxed max-w-lg" style={{ color: '#94A3B8' }}>
          Stack tecnológico de clase enterprise. Smart contracts auditados, infraestructura
          distribuida, y motor de inteligencia artificial propietario.
        </motion.p>

        {/* Tech stack badges */}
        <motion.div variants={slideLeft} className="flex flex-wrap gap-2 mt-2">
          {TECH_STACK.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1.5 rounded-full text-xs transition-all duration-200 cursor-default"
              style={{
                border: '1px solid rgba(139,92,246,0.30)',
                color: '#94A3B8',
                background: 'rgba(139,92,246,0.05)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(233,30,139,0.5)'
                e.currentTarget.style.color = '#fff'
                e.currentTarget.style.background = 'rgba(233,30,139,0.10)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(139,92,246,0.30)'
                e.currentTarget.style.color = '#94A3B8'
                e.currentTarget.style.background = 'rgba(139,92,246,0.05)'
              }}
            >
              {tech}
            </span>
          ))}
        </motion.div>

        {/* Contrato */}
        <motion.div variants={slideLeft} className="mt-2 flex flex-col gap-1">
          <span className="text-xs text-gray-500 uppercase tracking-widest">Smart Contract</span>
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono text-gray-400">0xC1F076...E2a4</span>
            <a
              href="#"
              className="text-xs transition-colors"
              style={{ color: '#E91E8B', pointerEvents: 'auto' }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
            >
              Verificar en BSCScan ↗
            </a>
          </div>
        </motion.div>

        {/* Stats estáticos */}
        <motion.div variants={slideLeft} className="flex gap-10 mt-2">
          {STATS.map(({ value, label }) => (
            <div key={label} className="flex flex-col gap-1">
              <span
                className="text-2xl font-bold text-white"
                style={{ fontFamily: 'var(--font-space-grotesk)' }}
              >
                {value}
              </span>
              <span className="text-xs text-gray-500 uppercase tracking-wider">{label}</span>
            </div>
          ))}
        </motion.div>

        <GradientButton className="mt-2">Ver Documentación →</GradientButton>

      </SceneWrapper>
    )
  }
)

export default Scene06_Technology
