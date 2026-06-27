import 'server-only'

import { prisma } from '@/lib/db/client'

export const reactionData = {
  async getByContent(contentType: string, slug: string) {
    return prisma.postReaction.findMany({
      where: { contentType, slug },
      orderBy: { kind: 'asc' },
    })
  },

  async increment(contentType: string, slug: string, kind: string) {
    return prisma.postReaction.upsert({
      where: { contentType_slug_kind: { contentType, slug, kind } },
      update: { count: { increment: 1 } },
      create: { contentType, slug, kind, count: 1 },
    })
  },
}
