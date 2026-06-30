import type { Metadata } from 'next'

import { StackPageEditor } from '@/components/admin-page/Pages/StackPageEditor'
import { loadStackPageData } from '@/lib/admin/load-page-section'

export const metadata: Metadata = {
  title: 'Stack page — Admin — FEOps Kit',
}

export default async function AdminStackPage(): Promise<React.JSX.Element> {
  const initialData = await loadStackPageData()

  return <StackPageEditor initialData={initialData} />
}
