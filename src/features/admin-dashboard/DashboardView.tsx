import type { DashboardViewProps } from '@/types/dashboard.types'

import { DashboardGreeting } from '@/features/admin-dashboard/DashboardGreeting'
import { InboxCard } from '@/features/admin-dashboard/InboxCard'
import { LibraryStatsCard } from '@/features/admin-dashboard/LibraryStatsCard'
import { QuickActions } from '@/features/admin-dashboard/QuickActions'
import { RecentContentCard } from '@/features/admin-dashboard/RecentContentCard'

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
