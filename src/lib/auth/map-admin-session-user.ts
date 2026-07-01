import type { Session } from 'next-auth'

import type { AdminSessionUser } from '@/types/auth.types'

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'A'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export function mapAdminSessionUser(
  session: Session | null | undefined
): AdminSessionUser {
  const name =
    session?.user?.name?.trim() || session?.user?.email?.trim() || 'Admin'
  const email = session?.user?.email?.trim() ?? null
  const image = session?.user?.image?.trim() ?? null

  return {
    name,
    email,
    image,
    initials: getInitials(name),
  }
}
