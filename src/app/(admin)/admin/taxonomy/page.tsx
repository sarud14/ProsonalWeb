import type { Metadata } from 'next'

import { TaxonomyPageView } from '@/components/admin-page/Taxonomy/TaxonomyPageView'
import { mapDomainItems } from '@/lib/admin/taxonomy-mappers'
import { taxonomyData } from '@/lib/data/taxonomy.data'

export const metadata: Metadata = {
  title: 'Taxonomy — Admin — FEOps Kit',
}

export default async function AdminTaxonomyPage(): Promise<React.JSX.Element> {
  const domains = await taxonomyData.getAllWithWorkCounts()

  return <TaxonomyPageView initialDomains={mapDomainItems(domains)} />
}
