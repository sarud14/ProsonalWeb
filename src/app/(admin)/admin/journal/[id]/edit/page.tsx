import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { JournalForm } from '@/components/admin-page/Journal/JournalForm'
import { JOURNAL_LIST_CONFIG } from '@/constants/admin-content-list'
import { journalRecordToFormState } from '@/lib/admin/content-form-mappers'
import { mapMediaOptions } from '@/lib/admin/map-media-options'
import { journalData } from '@/lib/data/journal.data'
import { mediaData } from '@/lib/data/media.data'
import type { EditJournalPageProps } from '@/types/admin-page.types'

export async function generateMetadata({
  params,
}: EditJournalPageProps): Promise<Metadata> {
  const { id } = await params
  return {
    title: `Edit Journal — Admin — FEOps Kit`,
    description: `Edit journal post ${id}`,
  }
}

export default async function EditJournalPage({
  params,
}: EditJournalPageProps): Promise<React.JSX.Element> {
  const { id } = await params
  const [post, media] = await Promise.all([journalData.getById(id), mediaData.getAll()])

  if (!post) notFound()

  return (
    <JournalForm
      initialValues={journalRecordToFormState(post)}
      media={mapMediaOptions(media)}
      listHref={JOURNAL_LIST_CONFIG.listHref}
    />
  )
}
