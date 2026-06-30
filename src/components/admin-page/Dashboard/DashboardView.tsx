import type { DashboardViewProps } from '@/types/dashboard.types'

import { DashboardGreeting } from '@/components/admin-page/Dashboard/DashboardGreeting'
import { InboxCard } from '@/components/admin-page/Dashboard/InboxCard'
import { LibraryStatsCard } from '@/components/admin-page/Dashboard/LibraryStatsCard'
import { QuickActions } from '@/components/admin-page/Dashboard/QuickActions'
import { RecentContentCard } from '@/components/admin-page/Dashboard/RecentContentCard'

export function DashboardView({ data, userName }: DashboardViewProps): React.JSX.Element {
  return (
    <div>
      <DashboardGreeting userName={userName} />
      <QuickActions />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.7fr_1fr]">
        <RecentContentCard recents={data.recents} />

        <div className="flex flex-col gap-6">
          <InboxCard unreadCount={data.unreadCount} />
          <LibraryStatsCard stats={data.libraryStats} />
        </div>
      </div>
    </div>
  )
}
