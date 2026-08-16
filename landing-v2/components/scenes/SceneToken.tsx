'use client'

import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { SectionHeader } from '@/components/ui/genesis'
import {
  SceneWrapper, GradientButton,
  StatBlock, containerV, slideLeft,
} from '@/components/ui/SceneShared'
import { ROUTES } from '@/lib/routes'
import { TOKEN_DISPLAY_METRICS } from '@/lib/institutionalMetrics'
import { useTokenOrbitEditorMode } from '@/lib/token/useTokenOrbitEditorMode'
import TokenSectionBackdrop from '@/components/token/TokenSectionBackdrop'
import TokenOrbitalValueNetwork from '@/components/token/TokenOrbitalValueNetwork'

interface Props { isActive?: boolean }

const SceneToken = forwardRef<HTMLElement, Props>(
  function SceneToken({ isActive = false }, ref) {
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
          label="Token"
          title="Artificial Intelligence"
          highlight="Genesis Token."
        />

        <motion.p variants={slideLeft} className="text-lg leading-relaxed max-w-lg mt-2 text-genesis-mist">
          Token BEP-20 deflacionario sobre BSC. El activo base que articula participación, utilidad y expansión del ecosistema Genesis.
        </motion.p>

        <motion.div variants={slideLeft} className="grid grid-cols-2 gap-6 mt-4">
          {TOKEN_DISPLAY_METRICS.map((metric) => (
            <div key={metric.label} className="flex flex-col gap-1">
              <span className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                {'static' in metric ? (
                  metric.static
                ) : (
                  <StatBlock to={metric.to} suffix={metric.suffix} label="" isActive={isActive} />
                )}
              </span>
              <span className="text-xs text-gray-500 uppercase tracking-wider">{metric.label}</span>
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

export default SceneToken
