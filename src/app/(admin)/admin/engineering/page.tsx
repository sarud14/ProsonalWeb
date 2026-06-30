import type { Metadata } from 'next'

import { ContentListClient } from '@/components/admin-page/shared/ContentListClient'
import {
  ENGINEERING_LIST_COLUMNS,
  ENGINEERING_LIST_CONFIG,
} from '@/constants/admin-content-list'
import { mapEngineeringToTableRows } from '@/lib/admin/content-list-mappers'
import { engineeringData } from '@/lib/data/engineering.data'

export const metadata: Metadata = {
  title: 'Manage Engineering — Admin — FEOps Kit',
}

export default async function AdminEngineeringPage(): Promise<React.JSX.Element> {
  const items = await engineeringData.getAll()
  const rows = mapEngineeringToTableRows(items)

  return (
    <ContentListClient
      config={ENGINEERING_LIST_CONFIG}
      columns={ENGINEERING_LIST_COLUMNS}
      rows={rows}
    />
  )
}
