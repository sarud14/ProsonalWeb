import 'server-only'

import { prisma } from '@/lib/db/client'

const JOURNAL_INCLUDE = {
  coverImage: true,
} as const

export const journalData = {
  async getAll() {
    return prisma.journalPost.findMany({
      include: JOURNAL_INCLUDE,
      orderBy: { sortOrder: 'asc' },
    })
  },

  async getAllPublished() {
    return prisma.journalPost.findMany({
      where: { status: 'PUBLISHED' },
      include: JOURNAL_INCLUDE,
      orderBy: { sortOrder: 'asc' },
    })
  },

  async getById(id: string) {
    return prisma.journalPost.findUnique({
      where: { id },
      include: JOURNAL_INCLUDE,
    })
  },

  async getBySlug(slug: string) {
    return prisma.journalPost.findUnique({
      where: { slug },
      include: JOURNAL_INCLUDE,
    })
  },

  async create(data: {
    slug: string
    title: string
    excerpt: string
    body: string
    tag: string
    readTime: string
    pull?: string | null
    sortOrder?: number
    coverImageId?: string | null
  }) {
    return prisma.journalPost.create({
      data: {
        ...data,
        sortOrder: data.sortOrder ?? 0,
        pull: data.pull ?? null,
      },
      include: JOURNAL_INCLUDE,
    })
  },

  async update(
    id: string,
    data: {
      slug?: string
      title?: string
      excerpt?: string
      body?: string
      tag?: string
      readTime?: string
      pull?: string | null
      sortOrder?: number
      coverImageId?: string | null
    }
  ) {
    return prisma.journalPost.update({
      where: { id },
      data,
      include: JOURNAL_INCLUDE,
    })
  },

  async delete(id: string) {
    return prisma.journalPost.delete({ where: { id } })
  },

  async publish(id: string) {
    return prisma.journalPost.update({
      where: { id },
      data: { status: 'PUBLISHED', publishedAt: new Date() },
    })
  },

  async unpublish(id: string) {
    return prisma.journalPost.update({
      where: { id },
      data: { status: 'DRAFT' },
    })
  },
}
