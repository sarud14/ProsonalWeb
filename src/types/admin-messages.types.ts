import type { AdminMessageFilterKey } from '@/constants/admin-messages'

export interface AdminMessageItem {
  readonly id: string
  readonly name: string
  readonly email: string
  readonly message: string
  readonly read: boolean
  readonly archived: boolean
  readonly createdAt: string
}

export interface MessagesPageViewProps {
  readonly initialMessages: readonly AdminMessageItem[]
}

export interface MessagesFilterState {
  readonly filter: AdminMessageFilterKey
}
