import { readFileSync } from 'node:fs'
import path from 'node:path'

import { describe, expect, it, vi } from 'vitest'

import {
  CRON_KEEP_ALIVE_PATH,
  CRON_KEEP_ALIVE_SCHEDULE,
  CRON_NOT_CONFIGURED_ERROR,
  CRON_UNAUTHORIZED_BODY,
} from '@/constants/cron'
import { handleKeepAlive, isAuthorizedCronRequest } from '@/lib/cron/keep-alive'

const CRON_SECRET = 'test-cron-secret'
const FIXED_NOW = new Date('2026-08-05T03:00:00.000Z')

describe('isAuthorizedCronRequest', () => {
  it('returns false when the cron secret is empty', () => {
    expect(isAuthorizedCronRequest('Bearer anything', '')).toBe(false)
  })

  it('returns false when the authorization header is missing', () => {
    expect(isAuthorizedCronRequest(null, CRON_SECRET)).toBe(false)
  })

  it('returns false when the bearer token does not match', () => {
    expect(isAuthorizedCronRequest('Bearer wrong-secret', CRON_SECRET)).toBe(false)
  })

  it('returns true when the bearer token matches the cron secret', () => {
    expect(isAuthorizedCronRequest(`Bearer ${CRON_SECRET}`, CRON_SECRET)).toBe(true)
  })
})

describe('handleKeepAlive', () => {
  it('returns 503 when the cron secret is not configured', async () => {
    const pingDatabase = vi.fn()

    const result = await handleKeepAlive(`Bearer ${CRON_SECRET}`, {
      cronSecret: '',
      pingDatabase,
      now: () => FIXED_NOW,
    })

    expect(result).toEqual({
      status: 503,
      body: { error: CRON_NOT_CONFIGURED_ERROR },
    })
    expect(pingDatabase).not.toHaveBeenCalled()
  })

  it('returns 401 without pinging the database when unauthorized', async () => {
    const pingDatabase = vi.fn()

    const result = await handleKeepAlive('Bearer wrong-secret', {
      cronSecret: CRON_SECRET,
      pingDatabase,
      now: () => FIXED_NOW,
    })

    expect(result).toEqual({
      status: 401,
      body: CRON_UNAUTHORIZED_BODY,
    })
    expect(pingDatabase).not.toHaveBeenCalled()
  })

  it('returns 200 with a timestamp after a successful database ping', async () => {
    const pingDatabase = vi.fn().mockResolvedValue(undefined)

    const result = await handleKeepAlive(`Bearer ${CRON_SECRET}`, {
      cronSecret: CRON_SECRET,
      pingDatabase,
      now: () => FIXED_NOW,
    })

    expect(result).toEqual({
      status: 200,
      body: { ok: true, at: '2026-08-05T03:00:00.000Z' },
    })
    expect(pingDatabase).toHaveBeenCalledOnce()
  })

  it('returns 500 when the database ping fails', async () => {
    const pingDatabase = vi.fn().mockRejectedValue(new Error('tenant not found'))
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    const result = await handleKeepAlive(`Bearer ${CRON_SECRET}`, {
      cronSecret: CRON_SECRET,
      pingDatabase,
      now: () => FIXED_NOW,
    })

    expect(result).toEqual({
      status: 500,
      body: { ok: false },
    })
    expect(errorSpy).toHaveBeenCalledOnce()
    errorSpy.mockRestore()
  })
})

describe('vercel cron config', () => {
  it('schedules the keep-alive path once per day in UTC', () => {
    const vercelPath = path.join(process.cwd(), 'vercel.json')
    const vercelConfig = JSON.parse(readFileSync(vercelPath, 'utf8')) as {
      readonly crons: readonly { readonly path: string; readonly schedule: string }[]
    }

    expect(vercelConfig.crons).toEqual([
      {
        path: CRON_KEEP_ALIVE_PATH,
        schedule: CRON_KEEP_ALIVE_SCHEDULE,
      },
    ])
  })
})
