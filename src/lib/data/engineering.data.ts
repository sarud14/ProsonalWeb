import 'server-only'

import { prisma } from '@/lib/db/client'

const ENGINEERING_INCLUDE = {
  coverImage: true,
} as const

export const engineeringData = {
  async getAll() {
    return prisma.engineeringNote.findMany({
      include: ENGINEERING_INCLUDE,
      orderBy: { sortOrder: 'asc' },
    })
  },

  async getAllPublished() {
    return prisma.engineeringNote.findMany({
      where: { status: 'PUBLISHED' },
      include: ENGINEERING_INCLUDE,
      orderBy: { sortOrder: 'asc' },
    })
  },

  async getById(id: string) {
    return prisma.engineeringNote.findUnique({
      where: { id },
      include: ENGINEERING_INCLUDE,
    })
  },

  async getBySlug(slug: string) {
    return prisma.engineeringNote.findUnique({
      where: { slug },
      include: ENGINEERING_INCLUDE,
    })
  },

  async create(data: {
    slug: string
    title: string
    type: 'ARCHITECTURE' | 'DECISIONS' | 'PERFORMANCE'
    summary: string
    noteDate: string
    readTime: string
    body: string
    sortOrder?: number
    coverImageId?: string | null
  }) {
    return prisma.engineeringNote.create({
      data: {
        ...data,
        sortOrder: data.sortOrder ?? 0,
      },
      include: ENGINEERING_INCLUDE,
    })
  },

  async update(
    id: string,
    data: {
      slug?: string
      title?: string
      type?: 'ARCHITECTURE' | 'DECISIONS' | 'PERFORMANCE'
      summary?: string
      noteDate?: string
      readTime?: string
      body?: string
      sortOrder?: number
      coverImageId?: string | null
    }
  ) {
    return prisma.engineeringNote.update({
      where: { id },
      data,
      include: ENGINEERING_INCLUDE,
    })
  },

  async delete(id: string) {
    return prisma.engineeringNote.delete({ where: { id } })
  },

  async publish(id: string) {
    return prisma.engineeringNote.update({
      where: { id },
      data: { status: 'PUBLISHED', publishedAt: new Date() },
    })
  },

  async unpublish(id: string) {
    return prisma.engineeringNote.update({
      where: { id },
      data: { status: 'DRAFT' },
    })
  },
}
