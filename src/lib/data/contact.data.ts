import 'server-only'

import { prisma } from '@/lib/db/client'

export const contactData = {
  async getAll() {
    return prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    })
  },

  async getUnread() {
    return prisma.contactMessage.findMany({
      where: { read: false, archived: false },
      orderBy: { createdAt: 'desc' },
    })
  },

  async getById(id: string) {
    return prisma.contactMessage.findUnique({ where: { id } })
  },

  async create(data: { name: string; email: string; message: string }) {
    return prisma.contactMessage.create({ data })
  },

  async markRead(id: string) {
    return prisma.contactMessage.update({
      where: { id },
      data: { read: true },
    })
  },

  async archive(id: string) {
    return prisma.contactMessage.update({
      where: { id },
      data: { archived: true },
    })
  },

  async delete(id: string) {
    return prisma.contactMessage.delete({ where: { id } })
  },
}
