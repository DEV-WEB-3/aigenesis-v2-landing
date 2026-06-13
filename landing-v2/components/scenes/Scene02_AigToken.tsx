'use client'

import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { SectionHeader } from '@/components/ui/genesis'
import {
  SceneWrapper, GradientButton,
  StatBlock, containerV, slideLeft,
} from '@/components/ui/SceneShared'
import { ROUTES } from '@/lib/routes'
import { useTokenOrbitEditorMode } from '@/lib/token/useTokenOrbitEditorMode'
import TokenSectionBackdrop from '@/components/token/TokenSectionBackdrop'
import TokenOrbitalValueNetwork from '@/components/token/TokenOrbitalValueNetwork'

interface Props { isActive?: boolean }

const Scene02_AigToken = forwardRef<HTMLElement, Props>(
  function Scene02_AigToken({ isActive = false }, ref) {
    const editorMode = useTokenOrbitEditorMode()

    return (
      <SceneWrapper
        ref={ref}
        isActive={isActive}
        motionKey="scene02"
        sectionId="token"
        particleColumn
        className={`token-section-layout${editorMode ? ' token-section-layout--editor' : ''}`}
        sectionOverlay={<TokenSectionBackdrop visible={isActive} />}
        particleSlot={<TokenOrbitalValueNetwork isActive={isActive} variant="full" />}
      >
        <SectionHeader
          label="Sección 02"
          title="Artificial Intelligence"
          highlight="Genesis Token."
        />

        <motion.p variants={slideLeft} className="text-lg leading-relaxed max-w-lg mt-2 text-genesis-mist">
          Token BEP-20 deflacionario sobre BSC. El activo base que articula participación, utilidad y expansión del ecosistema Genesis.
        </motion.p>

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

        <motion.div variants={slideLeft} className="token-orbital-value-network-mobile md:hidden" aria-hidden="true">
          <TokenOrbitalValueNetwork isActive={isActive} variant="compact" />
        </motion.div>

        <GradientButton className="mt-2" href={ROUTES.BSCSCAN}>Ver en BSCScan →</GradientButton>
      </SceneWrapper>
    )
  }
)

export default Scene02_AigToken
