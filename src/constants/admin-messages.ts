export const ADMIN_MESSAGE_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'archived', label: 'Archived' },
] as const

export type AdminMessageFilterKey = (typeof ADMIN_MESSAGE_FILTERS)[number]['key']
