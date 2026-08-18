'use client'

import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { SectionHeader, Card, GenesisStatBlock, Button } from '@/components/ui/genesis'
import { SceneWrapper, slideLeft, containerV } from '@/components/ui/SceneShared'
import { EXTERNAL_LINKS } from '@/lib/routes'
import BoosterSectionBackdrop from '@/components/booster/BoosterSectionBackdrop'
import BoosterQuantumAccelerator from '@/components/booster/BoosterQuantumAccelerator'

interface Props {
  isActive?: boolean
}

/**
 * LAS TRES CAPAS — en paralelo, no una debajo de otra.
 *
 * DISPOSICION. Iban apiladas en una columna y median 456 px de los 728 de la
 * seccion, que es lo que la dejaba sin caber en ninguna ventana. Pero es que
 * ademas apilarlas las cuenta mal: son tres capas PARALELAS del mismo
 * acelerador, no tres pasos sucesivos, y una columna vertical se lee como una
 * secuencia. En rejilla de tres se leen como lo que son y ocupan un tercio.
 *
 * COPIA. Las descripciones anteriores describian el mecanismo en abstracto
 * —«punto de entrada al acelerador con requisitos de protocolo definidos»— y
 * costaban dos lineas cada una sin decir nada que el titulo no dijera ya. Ahora
 * cada una afirma UNA cosa concreta y verificable, en la misma forma verbal, de
 * modo que las tres se leen de un vistazo y se comparan entre si.
 *
 * Lo que NO se toca es la negacion: «progresion, no captacion». Es la afirmacion
 * mas delicada de la seccion y la que la separa de un esquema piramidal;
 * acortar por ahi seria ahorrar palabras en el unico sitio donde no se debe.
 */
const BOOSTER_LAYERS = [
  { label: 'Capa I', title: 'Activación', description: 'Entras cumpliendo requisitos publicados.' },
  { label: 'Capa II', title: 'Multiplicador', description: 'El factor sube con la participación sostenida.' },
  { label: 'Capa III', title: 'Progresión', description: 'Niveles con umbrales y condiciones a la vista.' },
]

const SceneBooster = forwardRef<HTMLElement, Props>(function SceneBooster(
  { isActive = false },
  ref
) {
  return (
    <SceneWrapper
      ref={ref}
      isActive={isActive}
      motionKey="scene04-booster"
      sectionId="booster"
      wideStack
      particleColumn
      className="booster-section-layout"
      sectionOverlay={<BoosterSectionBackdrop />}
      particleSlot={<BoosterQuantumAccelerator isActive={isActive} />}
    >
      <SectionHeader
        label="Booster"
        title="Acelerador de crecimiento"
        highlight="del ecosistema."
        description="Capas y multiplicadores definidos que amplifican la participación en el protocolo. Progresión por permanencia — no un esquema de captación."
      />

      <motion.div variants={containerV} className="booster-layers-grid">
        {BOOSTER_LAYERS.map((layer) => (
          <motion.div key={layer.title} variants={slideLeft}>
            <Card
              variant="product"
              label={layer.label}
              title={layer.title}
              description={layer.description}
            />
          </motion.div>
        ))}
      </motion.div>

        <motion.div variants={slideLeft} className="flex flex-wrap gap-x-8 gap-y-2">
        <GenesisStatBlock value="3" label="Capas activas" mono />
        <GenesisStatBlock value="Progresivo" label="Modelo" />
        <GenesisStatBlock value="Protocolo" label="Gobernanza" />
      </motion.div>

      <motion.div variants={slideLeft} className="scene-visual-mobile md:hidden" aria-hidden="true">
        <BoosterQuantumAccelerator isActive={isActive} />
      </motion.div>

      <motion.div variants={slideLeft}>
        <Button variant="secondary" size="md" href={EXTERNAL_LINKS.BOOSTER}>
          Conocer Booster
        </Button>
      </motion.div>
    </SceneWrapper>
  )
})

export default SceneBooster
