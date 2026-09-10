import { useState } from 'react'

import { WORK_FILTER_ALL } from '@/constants/work'
import type { WorkCaseStudy } from '@/types/work.types'
import type { WorkListHookResult } from '@/types/work-list.types'

import { queryWorkList } from './workQuery'

export function useWorkQuery(
  items: readonly WorkCaseStudy[],
  domainFilters: readonly string[]
): WorkListHookResult {
  const [activeFilter, setActiveFilter] = useState<string>(WORK_FILTER_ALL)
  const queried = queryWorkList(items, domainFilters, activeFilter)

  return {
    ...queried,
    activeFilter,
    setActiveFilter,
  }
}
