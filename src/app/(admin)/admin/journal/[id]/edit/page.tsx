import type { Metadata } from 'next'

import type { EditJournalPageProps } from '@/types/admin-page.types'

export async function generateMetadata({
  params,
}: EditJournalPageProps): Promise<Metadata> {
  const { id } = await params
  return {
    title: `Edit Journal ${id} — Admin — FEOps Kit`,
  }
}

export default async function EditJournalPage({
  params,
}: EditJournalPageProps): Promise<React.JSX.Element> {
  const { id } = await params
  return (
    <main>
      <h1>Edit Journal: {id}</h1>
    </main>
  )
}
