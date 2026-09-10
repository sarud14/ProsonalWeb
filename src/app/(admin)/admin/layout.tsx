import { AdminShell } from '@/features/admin-shell/AdminShell'
import { mapAdminSessionUser } from '@/lib/auth/map-admin-session-user'
import { getOptionalAdminSession, requireAdminSession } from '@/lib/auth/session'
import { contactData } from '@/lib/data/contact.data'

export const dynamic = 'force-dynamic'

export default async function AdminPanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>): Promise<React.JSX.Element> {
  await requireAdminSession()

  const [unreadCount, session] = await Promise.all([
    contactData.countUnread(),
    getOptionalAdminSession(),
  ])

  const user = mapAdminSessionUser(session)

  return (
    <AdminShell unreadCount={unreadCount} user={user}>
      {children}
    </AdminShell>
  )
}
