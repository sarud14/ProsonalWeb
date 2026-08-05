import { NextResponse } from 'next/server'

import { env } from '@/env'
import { handleKeepAlive } from '@/lib/cron/keep-alive'
import { prisma } from '@/lib/db/client'
import type { KeepAliveJsonResponse } from '@/types/keep-alive.types'

export const dynamic = 'force-dynamic'

async function pingDatabase(): Promise<void> {
  await prisma.$queryRaw`SELECT 1`
}

export async function GET(request: Request): Promise<NextResponse<KeepAliveJsonResponse | string>> {
  const result = await handleKeepAlive(request.headers.get('authorization'), {
    cronSecret: env.cronSecret,
    pingDatabase,
    now: () => new Date(),
  })

  if (typeof result.body === 'string') {
    return new NextResponse(result.body, { status: result.status })
  }

  return NextResponse.json(result.body, { status: result.status })
}
