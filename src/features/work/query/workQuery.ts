import {
  buildWorkDomainFilterOptions,
  matchesWorkDomainFilter,
} from '@/lib/content/work-domain-filters'
import type { WorkCaseStudy } from '@/types/work.types'
import type { WorkListQueryResult } from '@/types/work-list.types'

export function queryWorkList(
  items: readonly WorkCaseStudy[],
  domainFilters: readonly string[],
  activeFilter: string
): WorkListQueryResult {
  const shownItems = items.filter((item) =>
    matchesWorkDomainFilter(item.domains, activeFilter)
  )

  return {
    filters: buildWorkDomainFilterOptions(domainFilters),
    shownItems,
    countLabel: `SHOWING ${shownItems.length} OF ${items.length}`,
  }
}

export function articleReadProgressPercent(
  articleTop: number,
  articleScrollHeight: number,
  viewportHeight: number
): number {
  const total = articleScrollHeight - viewportHeight
  const scrolled = Math.min(Math.max(-articleTop, 0), total)
  return total > 0 ? (scrolled / total) * 100 : 0
}
