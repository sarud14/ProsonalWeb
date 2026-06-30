import type { Metadata } from 'next'

import { ContentListClient } from '@/components/admin-page/shared/ContentListClient'
import {
  WORK_LIST_COLUMNS,
  WORK_LIST_CONFIG,
} from '@/constants/admin-content-list'
import { mapWorkToTableRows } from '@/lib/admin/content-list-mappers'
import { workData } from '@/lib/data/work.data'

export const metadata: Metadata = {
  title: 'Manage Work — Admin — FEOps Kit',
}

export default async function AdminWorkPage(): Promise<React.JSX.Element> {
  const items = await workData.getAll()
  const rows = mapWorkToTableRows(items)

  return (
    <ContentListClient
      config={WORK_LIST_CONFIG}
      columns={WORK_LIST_COLUMNS}
      rows={rows}
    />
  )
}
