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
 * Los archivos de escena se llamaban `SceneNN_Algo`, con un número que dejó de
 * corresponder a su posición hacía tiempo: había dos `Scene03`, dos `Scene04`,
 * dos `Scene05` y dos `Scene08`. Un número en el nombre es una copia del orden,
 * y el orden ya vive en `routes.ts` — así que la copia sólo podía envejecer mal.
 * Ahora cada escena se llama por lo que ES, no por dónde estaba.
 */
import type { ForwardRefExoticComponent, RefAttributes } from 'react'
import type { SectionId } from '@/lib/routes'

import HeroSection from '@/components/sections/HeroSection'
import EcosystemSection from '@/components/sections/EcosystemSection'
import SceneTrust from '@/components/scenes/SceneTrust'
import SceneToken from '@/components/scenes/SceneToken'
import SceneMining from '@/components/scenes/SceneMining'
import SceneBooster from '@/components/scenes/SceneBooster'
import SceneStaking from '@/components/scenes/SceneStaking'
import SceneGPulse from '@/components/scenes/SceneGPulse'
import SceneGOracle from '@/components/scenes/SceneGOracle'
import SceneMarketplace from '@/components/scenes/SceneMarketplace'
import SceneCommunity from '@/components/scenes/SceneCommunity'
import SceneTechnology from '@/components/scenes/SceneTechnology'
import SceneRoadmap from '@/components/scenes/SceneRoadmap'
import SceneCTA from '@/components/scenes/SceneCTA'

export type SectionSceneProps = { isActive?: boolean }

export type SectionScene = ForwardRefExoticComponent<
  SectionSceneProps & RefAttributes<HTMLElement>
>

/** Registro completo. `Record` obliga a cubrir TODAS las secciones. */
export const SCENE_BY_SECTION: Record<SectionId, SectionScene> = {
  hero: HeroSection,
  trust: SceneTrust,
  ecosistema: EcosystemSection,
  token: SceneToken,
  mining: SceneMining,
  booster: SceneBooster,
  staking: SceneStaking,
  gpulse: SceneGPulse,
  goracle: SceneGOracle,
  marketplace: SceneMarketplace,
  comunidad: SceneCommunity,
  technology: SceneTechnology,
  roadmap: SceneRoadmap,
  cta: SceneCTA,
}
