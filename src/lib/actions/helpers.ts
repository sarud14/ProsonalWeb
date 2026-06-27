import 'server-only'

import { prisma } from '@/lib/db/client'
import { requireAdminSession } from '@/lib/auth/session'

export { requireAdminSession }

export async function createRevision(
  contentType: string,
  contentId: string,
  snapshot: unknown
): Promise<void> {
  await prisma.contentRevision.create({
    data: {
      contentType,
      contentId,
      snapshot: snapshot as object,
    },
  })
}
