'use client'

import { useT } from '@/context/IdiomaContext'
import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { SectionHeader } from '@/components/ui/genesis'
import {
  SceneWrapper, GradientButton,
  StatBlock, FeatureItem, containerV, slideLeft,
} from '@/components/ui/SceneShared'
import { ROUTES } from '@/lib/routes'
import { COMMUNITY_STATS } from '@/lib/institutionalMetrics'
import CommunitySectionBackdrop from '@/components/community/CommunitySectionBackdrop'
import CommunityGenesisNetwork from '@/components/community/CommunityGenesisNetwork'

interface Props { isActive?: boolean }

const SceneCommunity = forwardRef<HTMLElement, Props>(
  function SceneCommunity({ isActive = false }, ref) {
    const t = useT()
    return (
      <SceneWrapper
        ref={ref}
        isActive={isActive}
        motionKey="scene05"
        sectionId="comunidad"
        particleColumn
        className="community-section-layout"
        sectionOverlay={<CommunitySectionBackdrop />}
        particleSlot={<CommunityGenesisNetwork isActive={isActive} />}
      >

        <SectionHeader
          label="Comunidad"
          title="Crece con"
          highlight="quienes crecen."
        />

        {/*
          «BONO DIRECTO» Y «RED BINARIA» SALEN DEL TEXTO. Decision del owner.

          POR QUE IMPORTA, mas alla de la palabra: «bono directo» y «bono
          binario» son el vocabulario estandar de los planes de compensacion de
          marketing multinivel. Quien los reconoce, reconoce ese mundo — y lo
          primero que hace es preguntarse si esto es un esquema de captacion. La
          seccion de Booster ya se defiende de eso explicitamente («Progresion
          por permanencia — no un esquema de captacion»), asi que el portal
          estaba negando en una seccion lo que afirmaba con el lexico en otra.

          QUE LOS SUSTITUYE. El mecanismo real son dos ACELERADORES DE MINADO:
          uno se activa por incorporacion directa y otro por el crecimiento del
          equipo. «Acelerador» ya es vocabulario del portal —Booster es un
          acelerador de crecimiento— y describe lo que la cosa HACE: multiplica
          una participacion que ya existe. «Bono» describe lo que se cobra, que
          es justo la lectura que no interesa.

          Se dice «de minado» y no solo «acelerador» para que no se confunda con
          el producto Booster, que es otra cosa y vive dos secciones antes.
        */}
        <motion.p variants={slideLeft} className="text-lg leading-relaxed max-w-lg text-genesis-mist">
          {t(
            'Comunidad global G11 con reglas de participación publicadas. Dos aceleradores de minado —directo y de red— y fondos globales para los rangos más activos.'
          )}
        </motion.p>

        <motion.div variants={containerV} className="grid grid-cols-2 gap-4">
          <FeatureItem glass text="Acelerador directo 8-11%" />
          <FeatureItem glass text="Acelerador de red" />
          <FeatureItem glass text="Global Pool Top Ranks" />
          <FeatureItem glass text="Liderazgo Progresivo" />
        </motion.div>

        <motion.div variants={slideLeft} className="flex gap-10">
          {COMMUNITY_STATS.map((stat) => (
            <StatBlock key={stat.label} {...stat} isActive={isActive} />
          ))}
        </motion.div>

        <motion.div variants={slideLeft} className="scene-visual-mobile md:hidden" aria-hidden="true">
          <CommunityGenesisNetwork isActive={isActive} />
        </motion.div>

        <GradientButton href={ROUTES.REGISTER}>Únete a la Comunidad →</GradientButton>

      </SceneWrapper>
    )
  }
)

export default SceneCommunity
