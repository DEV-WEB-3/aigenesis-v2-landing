'use client'

import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { SectionHeader, TrustBadge, Button } from '@/components/ui/genesis'
import { SceneWrapper, slideLeft, containerV } from '@/components/ui/SceneShared'
import InstitutionalMetrics from '@/components/ui/InstitutionalMetrics'
import { EXTERNAL_LINKS, ROUTES, sectionHref } from '@/lib/routes'
import TrustGenesisCore from '@/components/trust/TrustGenesisCore'
import { useTrustCoreLogoEditorMode } from '@/lib/trust/useTrustCoreLogoEditorMode'

interface Props {
  isActive?: boolean
}

/**
 * Los cuatro sellos, SIN descripción.
 *
 * POR QUE SE QUITARON LAS DESCRIPCIONES
 * -------------------------------------
 * Medido: con ellas, cada tarjeta media 300 px de alto y la rejilla entera 639,
 * el 64% del alto util de la seccion. La causa no es un fallo de CSS: la columna
 * de contenido son 428 px y la rejilla la parte en DOS de 207, asi que meter 113
 * caracteres en 207 px de ancho obliga a envolver seis veces. Es aritmetica.
 *
 * Pero el motivo de fondo no es el espacio, es que no aportaban. En una seccion
 * que se llama «Confianza», la senal es el SELLO —verificado, auditado, en
 * vivo— y el enlace que se puede comprobar. La descripcion era glosa del sello:
 * «Contratos inteligentes auditados y monitoreados con estandares de ingenieria
 * enterprise» no anade nada a la palabra «Auditado» que ya esta arriba.
 *
 * Lo premium aqui es PROBAR en vez de afirmar. Dos de estos cuatro llevan a
 * BSCScan y uno al whitepaper: eso es comprobable. Los adjetivos no.
 *
 * De paso se va el «2019» duplicado —estaba en la metrica «2019 · Fundado» y
 * otra vez dentro de la primera descripcion, a 300 px de distancia—.
 */
const TRUST_ITEMS = [
  { status: 'verified' as const, title: 'Ecosistema en BSC', href: ROUTES.BSCSCAN },
  { status: 'audited' as const, title: 'Smart Contracts', href: ROUTES.BSCSCAN },
  { status: 'live' as const, title: 'Comunidad Global' },
  {
    status: 'verified' as const,
    title: 'Transparencia Operativa',
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

      <InstitutionalMetrics isActive={isActive} />

      <motion.div variants={containerV} className="grid grid-cols-1 sm:grid-cols-2 gap-genesis-4">
        {TRUST_ITEMS.map((item) => (
          <motion.div key={item.title} variants={slideLeft}>
            <TrustBadge title={item.title} status={item.status} href={item.href} />
          </motion.div>
        ))}
      </motion.div>

      {/*
        AQUI HABIA UN BLOQUE «Compromiso institucional / Disenado para escala
        global», con este texto:

          «Arquitectura modular, cumplimiento progresivo y gobernanza tecnica
           alineada con estandares DeFi internacionales.»

        Ocupaba 201 px y no contiene un solo hecho: ni una cifra, ni un enlace,
        ni nada que un visitante pueda comprobar. Es exactamente el relleno
        corporativo que rompe el minimalismo — y en la seccion de CONFIANZA
        resta, porque una afirmacion que no se puede verificar puesta al lado de
        cuatro que si se pueden hace dudar de las cuatro.

        Lo que queda son hechos: cuatro metricas y cuatro sellos, dos de ellos
        enlazados a la cadena. Si algun dia hay algo comprobable que decir sobre
        cumplimiento o gobernanza —una auditoria firmada, un marco concreto—,
        ese si tiene sitio aqui.
      */}

      <motion.div variants={slideLeft}>
        <Button variant="secondary" size="md" href={sectionHref('ecosistema')}>
          Explorar el ecosistema →
        </Button>
      </motion.div>
    </SceneWrapper>
  )
})

export default SceneTrust
