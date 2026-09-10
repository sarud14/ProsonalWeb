import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { AdminMessageItem } from '@/types/admin-messages.types'

import { useMessagesQuery } from '../query/useMessagesQuery'

const messages: readonly AdminMessageItem[] = [
  {
    id: 'unread',
    name: 'Ada',
    email: 'ada@example.com',
    message: 'Hello',
    read: false,
    archived: false,
    createdAt: '2026-01-01',
  },
  {
    id: 'archived',
    name: 'Bea',
    email: 'bea@example.com',
    message: 'Bye',
    read: true,
    archived: true,
    createdAt: '2026-01-02',
  },
]

describe('useMessagesQuery', () => {
  it('starts on all and switches to archived', () => {
    const { result } = renderHook(() => useMessagesQuery(messages))

    expect(result.current.filter).toBe('all')
    expect(result.current.filteredMessages.map((item) => item.id)).toEqual(['unread'])

    act(() => {
      result.current.setFilter('archived')
    })

    expect(result.current.filteredMessages.map((item) => item.id)).toEqual(['archived'])
  })
})
