/**
 * Qué componente pinta cada sección.
 *
 * Antes esta correspondencia estaba implícita en el ORDEN en que se escribían
 * los componentes dentro de `page.tsx`, con el índice repetido a mano en cada
 * línea (`registerSection(7)`, `isActive={sectionIndex === 7}`). Eran 29 índices
 * sueltos por el repo y cuatro archivos que había que editar a la vez para
 * añadir una sección.
 *
 * Aquí la correspondencia es explícita y está tipada contra `SectionId`: si se
 * añade una sección a `routes.ts` y no se registra su escena, TypeScript lo
 * dice. El orden ya no vive aquí — vive en `routes.ts`, y sólo allí.
 *
 * Nota sobre los nombres `SceneNN_`: la numeración de los archivos dejó de
 * corresponder a su posición hace tiempo (hay dos Scene03, dos Scene04, dos
 * Scene05 y dos Scene08). Se respetan tal cual para no mezclar el renombrado
 * con este cambio; la tabla de abajo es ahora la referencia fiable.
 */
import type { ForwardRefExoticComponent, RefAttributes } from 'react'
import type { SectionId } from '@/lib/routes'

import HeroSection from '@/components/sections/HeroSection'
import EcosystemSection from '@/components/sections/EcosystemSection'
import Scene01_Trust from '@/components/scenes/Scene01_Trust'
import Scene02_AigToken from '@/components/scenes/Scene02_AigToken'
import Scene03_Mining from '@/components/scenes/Scene03_Mining'
import Scene04_Booster from '@/components/scenes/Scene04_Booster'
import Scene05_Staking from '@/components/scenes/Scene05_Staking'
import Scene03_GPulse from '@/components/scenes/Scene03_GPulse'
import Scene08_GOracle from '@/components/scenes/Scene08_GOracle'
import Scene04_GevyShop from '@/components/scenes/Scene04_GevyShop'
import Scene05_Community from '@/components/scenes/Scene05_Community'
import Scene06_Technology from '@/components/scenes/Scene06_Technology'
import Scene07_Roadmap from '@/components/scenes/Scene07_Roadmap'
import Scene08_CTA from '@/components/scenes/Scene08_CTA'

export type SectionSceneProps = { isActive?: boolean }

export type SectionScene = ForwardRefExoticComponent<
  SectionSceneProps & RefAttributes<HTMLElement>
>

/** Registro completo. `Record` obliga a cubrir TODAS las secciones. */
export const SCENE_BY_SECTION: Record<SectionId, SectionScene> = {
  hero: HeroSection,
  trust: Scene01_Trust,
  ecosistema: EcosystemSection,
  token: Scene02_AigToken,
  mining: Scene03_Mining,
  booster: Scene04_Booster,
  staking: Scene05_Staking,
  gpulse: Scene03_GPulse,
  goracle: Scene08_GOracle,
  marketplace: Scene04_GevyShop,
  comunidad: Scene05_Community,
  technology: Scene06_Technology,
  roadmap: Scene07_Roadmap,
  cta: Scene08_CTA,
}
