/**
 * Qué aura de fondo acompaña a cada sección.
 *
 * Son capas DOM (no van dentro del `<Canvas>`) que se encienden con la sección
 * activa. Antes cada una recibía su propio booleano — trece props que atravesaban
 * tres componentes sólo para transportar un número que ya existía.
 *
 * No todas las secciones tienen aura: `hero` y `ecosistema` no llevan, y por eso
 * el registro es parcial a propósito.
 */
import type { ComponentType } from 'react'
import type { SectionId } from '@/lib/routes'

import GenesisBackgroundAura from '@/components/trust/GenesisBackgroundAura'
import GenesisTokenCoreAura from '@/components/token/GenesisTokenCoreAura'
import GenesisMiningCoreAura from '@/components/mining/GenesisMiningCoreAura'
import GenesisBoosterAura from '@/components/booster/GenesisBoosterAura'
import GenesisStakingAura from '@/components/staking/GenesisStakingAura'
import GenesisGpulseAura from '@/components/gpulse/GenesisGpulseAura'
import GenesisGoracleAura from '@/components/goracle/GenesisGoracleAura'
import GenesisMarketplaceAura from '@/components/marketplace/GenesisMarketplaceAura'
import GenesisCommunityAura from '@/components/community/GenesisCommunityAura'
import GenesisTechnologyAura from '@/components/technology/GenesisTechnologyAura'
import GenesisRoadmapAura from '@/components/roadmap/GenesisRoadmapAura'
import GenesisPortalAura from '@/components/portal/GenesisPortalAura'

export type SectionAura = ComponentType<{ visible?: boolean }>

export const AURA_BY_SECTION: Partial<Record<SectionId, SectionAura>> = {
  trust: GenesisBackgroundAura,
  token: GenesisTokenCoreAura,
  mining: GenesisMiningCoreAura,
  booster: GenesisBoosterAura,
  staking: GenesisStakingAura,
  gpulse: GenesisGpulseAura,
  goracle: GenesisGoracleAura,
  marketplace: GenesisMarketplaceAura,
  comunidad: GenesisCommunityAura,
  technology: GenesisTechnologyAura,
  roadmap: GenesisRoadmapAura,
  cta: GenesisPortalAura,
}

/** Entradas estables para renderizar sin recrear el array en cada pintado. */
export const AURA_ENTRIES = Object.entries(AURA_BY_SECTION) as Array<
  [SectionId, SectionAura]
>
