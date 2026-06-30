import type { Metadata } from 'next'

import { DashboardView } from '@/components/admin-page/Dashboard/DashboardView'
import { auth } from '@/lib/auth/session'
import { dashboardData } from '@/lib/data/dashboard.data'

export const metadata: Metadata = {
  title: 'Admin Dashboard — FEOps Kit',
}

export default async function AdminDashboardPage(): Promise<React.JSX.Element> {
  const [data, session] = await Promise.all([dashboardData.getData(), auth()])

  const rawName = session?.user?.name?.trim()
  const userName = rawName?.split(/\s+/)[0] ?? 'there'

  return <DashboardView data={data} userName={userName} />
}
