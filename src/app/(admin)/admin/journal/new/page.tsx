import type { Metadata } from 'next'

import { JournalForm } from '@/components/admin-page/Journal/JournalForm'
import { JOURNAL_LIST_CONFIG } from '@/constants/admin-content-list'
import { emptyJournalFormState } from '@/lib/admin/content-form-mappers'
import { mapMediaOptions } from '@/lib/admin/map-media-options'
import { mediaData } from '@/lib/data/media.data'

export const metadata: Metadata = {
  title: 'New Journal — Admin — FEOps Kit',
}

export default async function NewJournalPage(): Promise<React.JSX.Element> {
  const media = await mediaData.getAll()

  return (
    <JournalForm
      initialValues={emptyJournalFormState()}
      media={mapMediaOptions(media)}
      listHref={JOURNAL_LIST_CONFIG.listHref}
    />
  )
}
