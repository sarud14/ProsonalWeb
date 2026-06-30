import type { AdminMessageItem } from '@/types/admin-messages.types'

type ContactRow = {
  readonly id: string
  readonly name: string
  readonly email: string
  readonly message: string
  readonly read: boolean
  readonly archived: boolean
  readonly createdAt: Date
}

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
