import { NextResponse } from 'next/server'

import {
  env,
  isAuthConfigured,
  isGithubAuthConfigured,
  isGoogleAuthConfigured,
} from '@/env'
import { isBlobConfigured } from '@/lib/media/upload'
import type { HealthCheckResponse, HealthDatabaseStatus } from '@/types/health.types'

export const dynamic = 'force-dynamic'

async function getDatabaseStatus(): Promise<HealthDatabaseStatus> {
  if (env.databaseUrl.length === 0) return 'skipped'

  try {
    const { prisma } = await import('@/lib/db/client')
    await prisma.$queryRaw`SELECT 1`
    return 'connected'
  } catch {
    return 'error'
  }
}

export async function GET(): Promise<NextResponse<HealthCheckResponse>> {
  const database = await getDatabaseStatus()

  const ok =
    env.contentSource === 'mdx' ? database !== 'error' : database === 'connected'

  return NextResponse.json({
    ok,
    contentSource: env.contentSource,
    database,
    auth: isAuthConfigured(),
    oauth: {
      github: isGithubAuthConfigured(),
      google: isGoogleAuthConfigured(),
    },
    blob: isBlobConfigured(),
  })
}
