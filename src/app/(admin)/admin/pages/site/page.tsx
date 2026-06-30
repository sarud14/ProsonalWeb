import type { Metadata } from 'next'

import { SitePageEditor } from '@/components/admin-page/Pages/SitePageEditor'
import { loadSiteConfig } from '@/lib/admin/load-page-section'

export const metadata: Metadata = {
  title: 'Site config — Admin — FEOps Kit',
}

export default async function AdminSitePage(): Promise<React.JSX.Element> {
  const initialData = await loadSiteConfig()

  return <SitePageEditor initialData={initialData} />
}
