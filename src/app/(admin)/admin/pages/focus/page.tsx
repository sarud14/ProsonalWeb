import type { Metadata } from 'next'

import { FocusPageEditor } from '@/features/admin-pages/FocusPageEditor'
import { loadFocusPageData } from '@/lib/admin/load-page-section'

export const metadata: Metadata = {
  title: 'Focus page — Admin — FEOps Kit',
}

export default async function AdminFocusPage(): Promise<React.JSX.Element> {
  const initialData = await loadFocusPageData()

  return <FocusPageEditor initialData={initialData} />
}
