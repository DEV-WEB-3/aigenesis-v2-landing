'use client'

import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { SectionHeader, TrustBadge, Card, Button } from '@/components/ui/genesis'
import { SceneWrapper, slideLeft, containerV } from '@/components/ui/SceneShared'
import InstitutionalMetrics from '@/components/ui/InstitutionalMetrics'
import { EXTERNAL_LINKS, ROUTES, sectionHref } from '@/lib/routes'
import TrustGenesisCore from '@/components/trust/TrustGenesisCore'
import { useTrustCoreLogoEditorMode } from '@/lib/trust/useTrustCoreLogoEditorMode'

interface Props {
  isActive?: boolean
}

const TRUST_ITEMS = [
  {
    status: 'verified' as const,
    title: 'Ecosistema en BSC',
    description: 'Infraestructura desplegada en Binance Smart Chain con operación continua desde 2019.',
    href: ROUTES.BSCSCAN,
  },
  {
    status: 'audited' as const,
    title: 'Smart Contracts',
    description: 'Contratos inteligentes auditados y monitoreados con estándares de ingeniería enterprise.',
    href: ROUTES.BSCSCAN,
  },
  {
    status: 'live' as const,
    title: 'Comunidad Global',
    description: 'Red activa con presencia internacional y participación distribuida en el ecosistema.',
  },
  {
    status: 'verified' as const,
    title: 'Transparencia Operativa',
    description: 'Métricas públicas, documentación accesible y trazabilidad on-chain de activos clave.',
    href: EXTERNAL_LINKS.WHITEPAPER_PDF,
  },
]

const SceneTrust = forwardRef<HTMLElement, Props>(function SceneTrust(
  { isActive = false },
  ref
) {
  const logoEditorMode = useTrustCoreLogoEditorMode()

  return (
    <SceneWrapper
      ref={ref}
      isActive={isActive}
      motionKey="scene01-trust"
      sectionId="trust"
      particleColumn
      className={`trust-section-layout${logoEditorMode ? ' trust-section-layout--logo-editor' : ''}`}
      particleSlot={<TrustGenesisCore isActive={isActive} editorMode={logoEditorMode} />}
    >
      <SectionHeader
        label="Confianza"
        title="Infraestructura verificable"
        highlight="antes del producto."
        description="AiGenesis prioriza transparencia, seguridad técnica y trazabilidad on-chain. Conoce los pilares que sostienen el ecosistema antes de explorar sus productos."
      />

      <InstitutionalMetrics isActive={isActive} className="mt-1" />

      <motion.div variants={containerV} className="grid grid-cols-1 sm:grid-cols-2 gap-genesis-4 mt-2">
        {TRUST_ITEMS.map((item) => (
          <motion.div key={item.title} variants={slideLeft}>
            <TrustBadge
              title={item.title}
              description={item.description}
              status={item.status}
              href={item.href}
            />
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={slideLeft} className="mt-2">
        <Card
          variant="trust"
          label="Compromiso institucional"
          title="Diseñado para escala global"
          description="Arquitectura modular, cumplimiento progresivo y gobernanza técnica alineada con estándares DeFi internacionales."
          hover={false}
        />
      </motion.div>

      <motion.div variants={slideLeft} className="mt-2">
        <Button variant="secondary" size="md" href={sectionHref('ecosistema')}>
          Explorar el ecosistema →
        </Button>
      </motion.div>
    </SceneWrapper>
  )
})

export default SceneTrust
