import 'server-only'

import { prisma } from '@/lib/db/client'

export const pageData = {
  async getByKey(key: string) {
    return prisma.pageSection.findUnique({ where: { key } })
  },

  async upsert(key: string, data: object) {
    return prisma.pageSection.upsert({
      where: { key },
      update: { data },
      create: { key, data },
    })
  },
}
