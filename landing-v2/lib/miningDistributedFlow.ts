/**
 * Mining section — WebGL targets + stardust API.
 */
export const MINING_SECTION_INDEX = 4

export {
  buildMiningStardustColors,
  genMiningStardustField as genGenesisMiningCore,
  genMiningStardustField as genMiningDistributedFlow,
  genMiningStardustField as genGenesisTokenMark,
  genMiningStardustField as genMiningGenesisTokenMark,
  getMiningStardustMeta as getMiningFlowMeta,
  MINING_STARDUST_INTENSITY,
  MINING_STARDUST_META_STRIDE,
  MINING_STARDUST_META_STRIDE as MINING_META_STRIDE,
  computeMiningStardustFrame,
  scatterMiningStardust as scatterMiningDispersed,
} from '@/lib/mining/miningStardustFlow'

/** Subtle point size — background stardust behind constellation DOM. */
export const MINING_POINT_SIZE_MULT = 1.18
