import type { DashboardLibraryStat } from '@/types/dashboard.types'

interface LibraryStatsCardProps {
  readonly stats: readonly DashboardLibraryStat[]
}

export function LibraryStatsCard({ stats }: LibraryStatsCardProps): React.JSX.Element {
  return (
    <div className="rounded-xl border border-border bg-card p-[22px]">
      <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        Library
      </div>
      <div className="flex flex-col gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-baseline justify-between">
            <span className="text-[13px] text-muted-foreground">{stat.label}</span>
            <span className="text-[22px] font-medium">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
