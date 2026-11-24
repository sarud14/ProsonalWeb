import type { AdminMessageItem } from '@/types/admin-messages.types'
import type { ContactRow } from '@/types/admin-messages.types'

export function mapContactMessages(messages: readonly ContactRow[]): AdminMessageItem[] {
  return messages.map((message) => ({
    id: message.id,
    name: message.name,
    email: message.email,
    message: message.message,
    read: message.read,
    archived: message.archived,
    createdAt: message.createdAt.toISOString(),
  }))
}

export function formatMessageDate(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}
