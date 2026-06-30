import Link from 'next/link'

import type { DashboardRecentItem } from '@/types/dashboard.types'

import { DASHBOARD_RECENT_LIMIT } from '@/constants/dashboard'

import { StatusBadge } from '@/components/ui/StatusBadge'

interface RecentContentCardProps {
  readonly recents: readonly DashboardRecentItem[]
}

export function RecentContentCard({ recents }: RecentContentCardProps): React.JSX.Element {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-baseline justify-between border-b border-border px-[22px] py-[18px]">
        <h2 className="text-[19px] font-medium">Recent content</h2>
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          Last {DASHBOARD_RECENT_LIMIT}
        </span>
      </div>

      {recents.length === 0 ? (
        <p className="px-[22px] py-12 text-center text-[17px] italic text-muted-foreground">
          Nothing here yet.
        </p>
      ) : (
        recents.map((item) => (
          <Link
            key={`${item.kind}-${item.editHref}`}
            href={item.editHref}
            className="flex items-center gap-4 border-b border-border/50 px-[22px] py-3.5 last:border-b-0 hover:bg-muted/30"
          >
            <span className="w-[74px] shrink-0 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
              {item.kindLabel}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-medium">{item.title}</span>
            <StatusBadge status={item.status} />
          </Link>
        ))
      )}
    </section>
  )
}
