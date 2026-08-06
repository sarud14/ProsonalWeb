import 'server-only'

import { env } from '@/env'
import { WORK_DOMAIN_FILTERS, WORK_FILTER_ALL } from '@/constants/work'
import { taxonomyData } from '@/lib/data/taxonomy.data'

export async function resolveWorkDomainLabels(): Promise<readonly string[]> {
  if (env.contentSource === 'db') {
    const domains = await taxonomyData.getAll()
    return domains.map((domain) => domain.label)
  }

  return WORK_DOMAIN_FILTERS.filter((filter) => filter !== WORK_FILTER_ALL)
}
