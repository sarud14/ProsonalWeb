import 'server-only'

import { prisma } from '@/lib/db/client'

const WORK_INCLUDE = {
  domains: true,
  coverImage: true,
} as const

export const workData = {
  async getAll() {
    return prisma.workCaseStudy.findMany({
      include: WORK_INCLUDE,
      orderBy: { sortOrder: 'asc' },
    })
  },

  async getAllPublished() {
    return prisma.workCaseStudy.findMany({
      where: { status: 'PUBLISHED' },
      include: WORK_INCLUDE,
      orderBy: { sortOrder: 'asc' },
    })
  },

  async getById(id: string) {
    return prisma.workCaseStudy.findUnique({
      where: { id },
      include: WORK_INCLUDE,
    })
  },

  async getBySlug(slug: string) {
    return prisma.workCaseStudy.findUnique({
      where: { slug },
      include: WORK_INCLUDE,
    })
  },

  async create(data: {
    slug: string
    title: string
    role: string
    tagline: string
    metric: string
    metricLabel: string
    year: string
    stack: string[]
    context: string
    problem: string
    constraints: string
    architecture: string
    decisions: string
    impact: string
    body: string
    sortOrder?: number
    coverImageId?: string | null
    domainLabels: string[]
  }) {
    const { domainLabels, ...rest } = data
    return prisma.workCaseStudy.create({
      data: {
        ...rest,
        sortOrder: rest.sortOrder ?? 0,
        domains: { connect: domainLabels.map((label) => ({ label })) },
      },
      include: WORK_INCLUDE,
    })
  },

  async update(
    id: string,
    data: {
      slug?: string
      title?: string
      role?: string
      tagline?: string
      metric?: string
      metricLabel?: string
      year?: string
      stack?: string[]
      context?: string
      problem?: string
      constraints?: string
      architecture?: string
      decisions?: string
      impact?: string
      body?: string
      sortOrder?: number
      coverImageId?: string | null
      domainLabels?: string[]
    }
  ) {
    const { domainLabels, ...rest } = data
    return prisma.workCaseStudy.update({
      where: { id },
      data: {
        ...rest,
        ...(domainLabels !== undefined && {
          domains: { set: domainLabels.map((label) => ({ label })) },
        }),
      },
      include: WORK_INCLUDE,
    })
  },

  async delete(id: string) {
    return prisma.workCaseStudy.delete({ where: { id } })
  },

  async publish(id: string) {
    return prisma.workCaseStudy.update({
      where: { id },
      data: { status: 'PUBLISHED', publishedAt: new Date() },
    })
  },

  async unpublish(id: string) {
    return prisma.workCaseStudy.update({
      where: { id },
      data: { status: 'DRAFT' },
    })
  },
}
