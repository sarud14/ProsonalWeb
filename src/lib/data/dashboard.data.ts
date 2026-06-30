import 'server-only'

import {
  DASHBOARD_KIND_LABELS,
  DASHBOARD_RECENT_LIMIT,
} from '@/constants/dashboard'
import { prisma } from '@/lib/db/client'
import type {
  DashboardContentKind,
  DashboardData,
  DashboardRecentItem,
} from '@/types/dashboard.types'

function buildEditHref(kind: DashboardContentKind, id: string): string {
  switch (kind) {
    case 'work':
      return `/admin/work/${id}/edit`
    case 'journal':
      return `/admin/journal/${id}/edit`
    case 'engineering':
      return `/admin/engineering/${id}/edit`
  }
}

export const dashboardData = {
  async getData(): Promise<DashboardData> {
    const [work, journal, engineering, unreadCount] = await Promise.all([
      prisma.workCaseStudy.findMany({
        select: { id: true, title: true, status: true, updatedAt: true },
      }),
      prisma.journalPost.findMany({
        select: { id: true, title: true, status: true, updatedAt: true },
      }),
      prisma.engineeringNote.findMany({
        select: { id: true, title: true, status: true, updatedAt: true },
      }),
      prisma.contactMessage.count({
        where: { read: false, archived: false },
      }),
    ])

    const recents: DashboardRecentItem[] = [
      ...work.map((item) => ({ ...item, kind: 'work' as const })),
      ...journal.map((item) => ({ ...item, kind: 'journal' as const })),
      ...engineering.map((item) => ({ ...item, kind: 'engineering' as const })),
    ]
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, DASHBOARD_RECENT_LIMIT)
      .map((item) => ({
        kind: item.kind,
        kindLabel: DASHBOARD_KIND_LABELS[item.kind],
        title: item.title,
        status: item.status,
        editHref: buildEditHref(item.kind, item.id),
      }))

    return {
      recents,
      libraryStats: [
        { label: 'Work', value: work.length },
        { label: 'Journal', value: journal.length },
        { label: 'Engineering', value: engineering.length },
      ],
      unreadCount,
    }
  },
}
