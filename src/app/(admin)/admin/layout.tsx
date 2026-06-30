import { AdminShell } from '@/components/admin-page/AdminShell'
import { requireAdminSession } from '@/lib/auth/session'
import { contactData } from '@/lib/data/contact.data'

export const dynamic = 'force-dynamic'

export default async function AdminPanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>): Promise<React.JSX.Element> {
  await requireAdminSession()

  const unreadCount = await contactData.countUnread()

  return <AdminShell unreadCount={unreadCount}>{children}</AdminShell>
}
