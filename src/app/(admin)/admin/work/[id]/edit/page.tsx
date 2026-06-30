import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { WorkForm } from '@/components/admin-page/Work/WorkForm'
import { WORK_LIST_CONFIG } from '@/constants/admin-content-list'
import { workRecordToFormState } from '@/lib/admin/content-form-mappers'
import { mapMediaOptions } from '@/lib/admin/map-media-options'
import { mediaData } from '@/lib/data/media.data'
import { workData } from '@/lib/data/work.data'
import type { EditWorkPageProps } from '@/types/admin-page.types'

export async function generateMetadata({
  params,
}: EditWorkPageProps): Promise<Metadata> {
  const { id } = await params
  return {
    title: `Edit Work — Admin — FEOps Kit`,
    description: `Edit work item ${id}`,
  }
}

export default async function EditWorkPage({
  params,
}: EditWorkPageProps): Promise<React.JSX.Element> {
  const { id } = await params
  const [work, media] = await Promise.all([workData.getById(id), mediaData.getAll()])

  if (!work) notFound()

  return (
    <WorkForm
      initialValues={workRecordToFormState(work)}
      media={mapMediaOptions(media)}
      listHref={WORK_LIST_CONFIG.listHref}
    />
  )
}
