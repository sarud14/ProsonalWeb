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

  it('pings Postgres three times a day and fails unless the database is connected', () => {
    const workflow = readFileSync(
      path.join(process.cwd(), '.github/workflows/keep-alive.yml'),
      'utf8',
    )

    expect(workflow).toContain("cron: '0 1 * * *'")
    expect(workflow).toContain("cron: '0 7 * * *'")
    expect(workflow).toContain("cron: '0 13 * * *'")
    expect(workflow).not.toContain('*/2')
    expect(workflow).toContain('[ "$ok" != "true" ] || [ "$database" != "connected" ]')
  })
})
