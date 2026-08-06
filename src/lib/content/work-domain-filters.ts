import { WORK_FILTER_ALL } from '@/constants/work'

export function buildWorkDomainFilterOptions(
  domainLabels: readonly string[],
): readonly string[] {
  const uniqueLabels = [...new Set(domainLabels.map((label) => label.trim()).filter(Boolean))]
  return [WORK_FILTER_ALL, ...uniqueLabels]
}

export function matchesWorkDomainFilter(
  itemDomains: readonly string[],
  filter: string,
): boolean {
  if (filter === WORK_FILTER_ALL) return true
  return itemDomains.includes(filter)
}
