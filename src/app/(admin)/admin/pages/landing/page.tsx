import type { Metadata } from 'next'

import { LandingPageEditor } from '@/components/admin-page/Pages/LandingPageEditor'
import { loadLandingPageData } from '@/lib/admin/load-page-section'

export const metadata: Metadata = {
  title: 'Landing page — Admin — FEOps Kit',
}

export default async function AdminLandingPage(): Promise<React.JSX.Element> {
  const initialData = await loadLandingPageData()

  return <LandingPageEditor initialData={initialData} />
}
