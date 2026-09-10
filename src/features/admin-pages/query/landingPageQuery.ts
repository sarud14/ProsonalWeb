import {
  assignLandingBlockOrders,
  normalizeLandingBlockOrders,
} from '@/constants/admin-pages'
import { omitClientIds } from '@/lib/admin/client-list'
import type { ClientLandingBlock } from '@/types/admin-pages.types'
import type { LandingBlock } from '@/types/site.types'

export function toClientBlocks(blocks: readonly LandingBlock[]): ClientLandingBlock[] {
  return normalizeLandingBlockOrders(blocks).map((block, index) => ({
    ...block,
    clientId: `${block.type}-${block.order}-${index}`,
  }))
}

export function toPersistableBlocks(
  blocks: readonly ClientLandingBlock[]
): LandingBlock[] {
  return assignLandingBlockOrders(omitClientIds(blocks))
}
