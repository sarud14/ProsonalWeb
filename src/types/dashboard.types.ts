export type DashboardContentKind = 'work' | 'journal' | 'engineering'

export interface DashboardRecentItem {
  readonly kind: DashboardContentKind
  readonly kindLabel: string
  readonly title: string
  readonly status: 'PUBLISHED' | 'DRAFT'
  readonly editHref: string
}

export interface DashboardLibraryStat {
  readonly label: string
  readonly value: number
}

export interface DashboardData {
  readonly recents: readonly DashboardRecentItem[]
  readonly libraryStats: readonly DashboardLibraryStat[]
  readonly unreadCount: number
}

export interface DashboardViewProps {
  readonly data: DashboardData
  readonly userName: string
}

export interface DashboardGreetingProps {
  readonly userName: string
}

export interface InboxCardProps {
  readonly unreadCount: number
}

export interface LibraryStatsCardProps {
  readonly stats: readonly DashboardLibraryStat[]
}

export interface RecentContentCardProps {
  readonly recents: readonly DashboardRecentItem[]
}
