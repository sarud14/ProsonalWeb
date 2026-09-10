import { describe, expect, it } from 'vitest'

import type { StackGroup } from '@/types/stack.types'

import { toClientGroups, toPersistableGroups } from '../query/stackPageQuery'

const groups: readonly StackGroup[] = [
  { label: 'Runtime', tools: [{ name: 'Next.js', note: 'App Router' }] },
]

describe('toClientGroups / toPersistableGroups', () => {
  it('stamps and strips clientId', () => {
    const client = toClientGroups(groups)
    expect(client[0]?.clientId).toBe('group-Runtime-0')
    expect(toPersistableGroups(client)).toEqual(groups)
  })
})
