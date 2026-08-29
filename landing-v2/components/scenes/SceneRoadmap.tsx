'use client'

import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import OfficialDownloadButton from '@/components/cta/OfficialDownloadButton'
import RoadmapSectionBackdrop from '@/components/roadmap/RoadmapSectionBackdrop'
import RoadmapEvolutionPath from '@/components/roadmap/RoadmapEvolutionPath'
import RoadmapMilestoneList from '@/components/roadmap/RoadmapMilestoneList'
import { SectionHeader } from '@/components/ui/genesis'
import {
  SceneWrapper,
  slideLeft,
} from '@/components/ui/SceneShared'
import { useIdioma } from '@/context/IdiomaContext'
import { presentacionParaIdioma } from '@/lib/i18n/presentacion'

interface Props { isActive?: boolean }

const SceneRoadmap = forwardRef<HTMLElement, Props>(
  function SceneRoadmap({ isActive = false }, ref) {
    /*
     * EL PDF SIGUE AL IDIOMA DE LA PAGINA.
     *
     * Antes este boton apuntaba siempre al archivo español. Con la landing en
     * un solo idioma eso era correcto por definicion; con once deja de serlo
     * sin que nada avise — se lee la seccion en aleman, se pulsa un boton en
     * aleman y baja un PDF en español. El texto traducido y el enlace no es la
     * peor mezcla, porque el visitante confia en lo que acaba de leer.
     */
    const { idioma, t } = useIdioma()
    const pres = presentacionParaIdioma(idioma)

    return (
      <SceneWrapper
        ref={ref}
        isActive={isActive}
        motionKey="scene07"
        sectionId="roadmap"
        particleColumn
        className="roadmap-section-layout"
        sectionOverlay={<RoadmapSectionBackdrop />}
        particleSlot={<RoadmapEvolutionPath isActive={isActive} />}
      >

        <SectionHeader
          label="Roadmap"
          title="Nuestro"
          highlight="horizonte."
        />

        <motion.div variants={slideLeft} className="scene-roadmap-timeline">
          <RoadmapMilestoneList />
        </motion.div>

        <motion.div variants={slideLeft} className="scene-visual-mobile md:hidden" aria-hidden="true">
          <RoadmapEvolutionPath isActive={isActive} />
        </motion.div>

        <motion.div variants={slideLeft} className="flex flex-col items-start gap-2">
          <OfficialDownloadButton href={pres.archivo}>
            {`${t('Descargar plan de marketing')} · ${pres.nativo}`}
          </OfficialDownloadButton>
          {/*
            SE AVISA CUANDO LO QUE SE ENTREGA NO ES LA v5.0.

            Aleman, serbio y urdu todavia van con la version anterior, y el
            serbio pesa 227 MB. Quien pulsa merece saberlo ANTES, no
            descubrirlo con datos moviles. El aviso aparece solo en esos tres:
            en los otros ocho no hay nada que advertir y no se pinta nada.
          */}
          {pres.material === 'v1' ? (
            <span className="text-caption text-state-warning" dir="ltr">
              {t('Versión anterior (v1)')} · {pres.mb} MB
            </span>
          ) : null}
          {/*
            Y SE AVISA CUANDO EL PDF NO ESTA EN EL IDIOMA DE LA PAGINA.

            Coreano lee la landing en coreano y se descarga la presentacion en
            ingles, porque todavia no existe en coreano. Eso es aceptable — un
            texto que no entiendes del todo comunica mas que uno que no puedes
            leer — pero solo si se dice ANTES de pulsar. El nombre del idioma va
            en su propia lengua, que es como lo reconoce quien lo busca.
          */}
          {pres.material === 'pendiente' ? (
            <span className="text-caption text-state-warning" dir="ltr">
              {t('Todavía no disponible en tu idioma')} · {pres.nativo} · {pres.mb} MB
            </span>
          ) : null}
        </motion.div>

      </SceneWrapper>
    )
  }
)

export default SceneRoadmap
