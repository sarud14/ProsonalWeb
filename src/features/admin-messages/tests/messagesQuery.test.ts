import { describe, expect, it } from 'vitest'

import type { AdminMessageItem } from '@/types/admin-messages.types'

import { filterMessages, messagePreview } from '../query/messagesQuery'

function message(
  id: string,
  flags: { readonly read?: boolean; readonly archived?: boolean }
): AdminMessageItem {
  return {
    id,
    name: 'Ada',
    email: 'ada@example.com',
    message: 'Hello',
    read: flags.read ?? false,
    archived: flags.archived ?? false,
    createdAt: '2026-01-01',
  }
}

describe('filterMessages', () => {
  const inbox = [
    message('unread', {}),
    message('read', { read: true }),
    message('archived', { archived: true, read: true }),
  ]

  it('hides archived messages on all', () => {
    expect(filterMessages(inbox, 'all').map((item) => item.id)).toEqual(['unread', 'read'])
  })

  it('keeps unread unarchived messages only', () => {
    expect(filterMessages(inbox, 'unread').map((item) => item.id)).toEqual(['unread'])
  })

  it('keeps archived messages only', () => {
    expect(filterMessages(inbox, 'archived').map((item) => item.id)).toEqual(['archived'])
  })
})

describe('messagePreview', () => {
  it('returns the full short message', () => {
    expect(messagePreview('Short')).toBe('Short')
  })

  it('truncates long messages with an ellipsis', () => {
    expect(messagePreview('abcdefghij', 4)).toBe('abcd…')
  })
})
