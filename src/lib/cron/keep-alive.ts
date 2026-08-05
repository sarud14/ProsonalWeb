import {
  CRON_BEARER_PREFIX,
  CRON_NOT_CONFIGURED_ERROR,
  CRON_UNAUTHORIZED_BODY,
} from '@/constants/cron'
import type { KeepAliveDeps, KeepAliveResult } from '@/types/keep-alive.types'

export function isAuthorizedCronRequest(
  authorizationHeader: string | null,
  cronSecret: string,
): boolean {
  if (cronSecret.length === 0) return false
  return authorizationHeader === `${CRON_BEARER_PREFIX}${cronSecret}`
}

export async function handleKeepAlive(
  authorizationHeader: string | null,
  deps: KeepAliveDeps,
): Promise<KeepAliveResult> {
  if (deps.cronSecret.length === 0) {
    return {
      status: 503,
      body: { error: CRON_NOT_CONFIGURED_ERROR },
    }
  }

  if (!isAuthorizedCronRequest(authorizationHeader, deps.cronSecret)) {
    return {
      status: 401,
      body: CRON_UNAUTHORIZED_BODY,
    }
  }

  try {
    await deps.pingDatabase()
    return {
      status: 200,
      body: { ok: true, at: deps.now().toISOString() },
    }
  } catch (error) {
    console.error('[keep-alive] database ping failed', error)
    return {
      status: 500,
      body: { ok: false },
    }
  }
}
