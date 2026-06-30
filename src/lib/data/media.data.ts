import 'server-only'

import { prisma } from '@/lib/db/client'

export const mediaData = {
  async getAll() {
    return prisma.mediaAsset.findMany({ orderBy: { createdAt: 'desc' } })
  },

  async getAllWithReferenceCounts() {
    return prisma.mediaAsset.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            workCovers: true,
            journalCovers: true,
            engineeringCovers: true,
          },
        },
      },
    })
  },

  async getById(id: string) {
    return prisma.mediaAsset.findUnique({ where: { id } })
  },

  async getByIdWithReferences(id: string) {
    return prisma.mediaAsset.findUnique({
      where: { id },
      include: {
        workCovers: { select: { id: true } },
        journalCovers: { select: { id: true } },
        engineeringCovers: { select: { id: true } },
      },
    })
  },

  async create(data: {
    url: string
    pathname: string
    alt: string
    mimeType: string
    width?: number | null
    height?: number | null
    sizeBytes?: number | null
    folder?: string
  }) {
    return prisma.mediaAsset.create({
      data: {
        ...data,
        width: data.width ?? null,
        height: data.height ?? null,
        sizeBytes: data.sizeBytes ?? null,
        folder: data.folder ?? 'uncategorized',
      },
    })
  },

  async updateAlt(id: string, alt: string) {
    return prisma.mediaAsset.update({
      where: { id },
      data: { alt },
    })
  },

  async delete(id: string) {
    return prisma.mediaAsset.delete({ where: { id } })
  },
}
