'use client'

import dynamic from 'next/dynamic'

const WorldCanvasInner = dynamic(() => import('./WorldCanvasInner'), {
  ssr: false,
  loading: () => null,
})

interface WorldCanvasProps {
  heroActive?: boolean
  trustActive?: boolean
  tokenActive?: boolean
  miningActive?: boolean
  boosterActive?: boolean
  stakingActive?: boolean
  gpulseActive?: boolean
  goracleActive?: boolean
  marketplaceActive?: boolean
  communityActive?: boolean
  technologyActive?: boolean
  roadmapActive?: boolean
  ctaActive?: boolean
}

export default function WorldCanvas({
  heroActive = false,
  trustActive = false,
  tokenActive = false,
  miningActive = false,
  boosterActive = false,
  stakingActive = false,
  gpulseActive = false,
  goracleActive = false,
  marketplaceActive = false,
  communityActive = false,
  technologyActive = false,
  roadmapActive = false,
  ctaActive = false,
}: WorldCanvasProps) {
  return (
    <WorldCanvasInner
      heroActive={heroActive}
      trustActive={trustActive}
      tokenActive={tokenActive}
      miningActive={miningActive}
      boosterActive={boosterActive}
      stakingActive={stakingActive}
      gpulseActive={gpulseActive}
      goracleActive={goracleActive}
      marketplaceActive={marketplaceActive}
      communityActive={communityActive}
      technologyActive={technologyActive}
      roadmapActive={roadmapActive}
      ctaActive={ctaActive}
    />
  )
}
