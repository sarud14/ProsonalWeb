import { useState } from 'react'

import type { AdminMessageFilterKey } from '@/constants/admin-messages'
import type { AdminMessageItem, MessagesQueryResult } from '@/types/admin-messages.types'

import { filterMessages } from './messagesQuery'

export function useMessagesQuery(
  messages: readonly AdminMessageItem[]
): MessagesQueryResult {
  const [filter, setFilter] = useState<AdminMessageFilterKey>('all')

  return {
    filter,
    setFilter,
    filteredMessages: filterMessages(messages, filter),
  }
}
