import {
  MESSAGE_PREVIEW_MAX_LENGTH,
  type AdminMessageFilterKey,
} from '@/constants/admin-messages'
import type { AdminMessageItem } from '@/types/admin-messages.types'

export function filterMessages(
  messages: readonly AdminMessageItem[],
  filter: AdminMessageFilterKey
): readonly AdminMessageItem[] {
  switch (filter) {
    case 'unread':
      return messages.filter((message) => !message.read && !message.archived)
    case 'archived':
      return messages.filter((message) => message.archived)
    default:
      return messages.filter((message) => !message.archived)
  }
}

export function messagePreview(
  message: string,
  maxLength: number = MESSAGE_PREVIEW_MAX_LENGTH
): string {
  if (message.length <= maxLength) return message
  return `${message.slice(0, maxLength)}…`
}
