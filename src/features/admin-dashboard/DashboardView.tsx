import type { DashboardViewProps } from '@/types/dashboard.types'

import { DashboardGreeting } from './DashboardGreeting'
import { InboxCard } from './InboxCard'
import { LibraryStatsCard } from './LibraryStatsCard'
import { QuickActions } from './QuickActions'
import { RecentContentCard } from './RecentContentCard'

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
