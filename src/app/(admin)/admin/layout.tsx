import { requireAdminSession } from '@/lib/auth/session'

export default async function AdminPanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>): Promise<React.JSX.Element> {
  await requireAdminSession()

  return <>{children}</>
}
