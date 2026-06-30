import type { Metadata } from 'next'

import { ContentListClient } from '@/components/admin-page/shared/ContentListClient'
import {
  JOURNAL_LIST_COLUMNS,
  JOURNAL_LIST_CONFIG,
} from '@/constants/admin-content-list'
import { mapJournalToTableRows } from '@/lib/admin/content-list-mappers'
import { journalData } from '@/lib/data/journal.data'

export const metadata: Metadata = {
  title: 'Manage Journal — Admin — FEOps Kit',
}

export default async function AdminJournalPage(): Promise<React.JSX.Element> {
  const items = await journalData.getAll()
  const rows = mapJournalToTableRows(items)

  return (
    <ContentListClient
      config={JOURNAL_LIST_CONFIG}
      columns={JOURNAL_LIST_COLUMNS}
      rows={rows}
    />
  )
}
