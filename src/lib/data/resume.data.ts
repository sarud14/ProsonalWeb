import 'server-only'

import type { Prisma } from '@prisma/client'

import { prisma } from '@/lib/db/client'

const PROFILE_INCLUDE = {
  experiences: { orderBy: { sortOrder: 'asc' as const } },
  education: { orderBy: { sortOrder: 'asc' as const } },
  languages: { orderBy: { sortOrder: 'asc' as const } },
  selectedWork: {
    orderBy: { sortOrder: 'asc' as const },
    include: { work: true },
  },
} as const

export const resumeData = {
  async getProfile() {
    return prisma.resumeProfile.findFirst({ include: PROFILE_INCLUDE })
  },

  async updateProfile(id: string, data: Prisma.ResumeProfileUpdateInput) {
    return prisma.resumeProfile.update({ where: { id }, data })
  },

  async createProfile(data: {
    name: string
    role: string
    contactLine: string
    skills?: string[]
    coreTools?: string[]
  }) {
    return prisma.resumeProfile.create({ data })
  },

  async createExperience(data: {
    profileId: string
    title: string
    org: string
    period: string
    bullets: string[]
    sortOrder?: number
  }) {
    return prisma.resumeExperience.create({
      data: { ...data, sortOrder: data.sortOrder ?? 0 },
    })
  },

  async updateExperience(
    id: string,
    data: {
      title?: string
      org?: string
      period?: string
      bullets?: string[]
      sortOrder?: number
    }
  ) {
    return prisma.resumeExperience.update({ where: { id }, data })
  },

  async deleteExperience(id: string) {
    return prisma.resumeExperience.delete({ where: { id } })
  },

  async createEducation(data: {
    profileId: string
    title: string
    note: string
    period: string
    sortOrder?: number
  }) {
    return prisma.resumeEducation.create({
      data: { ...data, sortOrder: data.sortOrder ?? 0 },
    })
  },

  async updateEducation(
    id: string,
    data: {
      title?: string
      note?: string
      period?: string
      sortOrder?: number
    }
  ) {
    return prisma.resumeEducation.update({ where: { id }, data })
  },

  async deleteEducation(id: string) {
    return prisma.resumeEducation.delete({ where: { id } })
  },

  async createLanguage(data: {
    profileId: string
    name: string
    level: string
    sortOrder?: number
  }) {
    return prisma.resumeLanguage.create({
      data: { ...data, sortOrder: data.sortOrder ?? 0 },
    })
  },

  async updateLanguage(
    id: string,
    data: { name?: string; level?: string; sortOrder?: number }
  ) {
    return prisma.resumeLanguage.update({ where: { id }, data })
  },

  async deleteLanguage(id: string) {
    return prisma.resumeLanguage.delete({ where: { id } })
  },

  async createSelectedWork(data: {
    profileId: string
    workId: string
    noteOverride?: string | null
    sortOrder?: number
  }) {
    return prisma.resumeSelectedWork.create({
      data: {
        ...data,
        noteOverride: data.noteOverride ?? null,
        sortOrder: data.sortOrder ?? 0,
      },
    })
  },

  async updateSelectedWork(
    id: string,
    data: {
      noteOverride?: string | null
      sortOrder?: number
    }
  ) {
    return prisma.resumeSelectedWork.update({ where: { id }, data })
  },

  async deleteSelectedWork(id: string) {
    return prisma.resumeSelectedWork.delete({ where: { id } })
  },
}
