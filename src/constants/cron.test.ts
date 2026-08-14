import { readFileSync } from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import {
  CRON_KEEP_ALIVE_PATH,
  CRON_KEEP_ALIVE_SCHEDULE,
} from '@/constants/cron'

describe('vercel cron config', () => {
  it('pings /api/health once per day in UTC with no auth gate', () => {
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
