import 'server-only'

import { prisma } from '@/lib/db/client'

export const taxonomyData = {
  async getAll() {
    return prisma.domain.findMany({ orderBy: { sortOrder: 'asc' } })
  },

  async getById(id: string) {
    return prisma.domain.findUnique({ where: { id } })
  },

  async getByIdWithWorks(id: string) {
    return prisma.domain.findUnique({
      where: { id },
      include: { works: { select: { id: true } } },
    })
  },

  async create(data: { label: string; sortOrder?: number }) {
    return prisma.domain.create({
      data: { label: data.label, sortOrder: data.sortOrder ?? 0 },
    })
  },

  async update(id: string, data: { label?: string; sortOrder?: number }) {
    return prisma.domain.update({ where: { id }, data })
  },

  async delete(id: string) {
    return prisma.domain.delete({ where: { id } })
  },
}
