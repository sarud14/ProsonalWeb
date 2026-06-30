import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { EngineeringForm } from '@/components/admin-page/Engineering/EngineeringForm'
import { ENGINEERING_LIST_CONFIG } from '@/constants/admin-content-list'
import { engineeringRecordToFormState } from '@/lib/admin/content-form-mappers'
import { mapMediaOptions } from '@/lib/admin/map-media-options'
import { engineeringData } from '@/lib/data/engineering.data'
import { mediaData } from '@/lib/data/media.data'
import type { EditEngineeringPageProps } from '@/types/admin-page.types'

export async function generateMetadata({
  params,
}: EditEngineeringPageProps): Promise<Metadata> {
  const { id } = await params
  return {
    title: `Edit Engineering Note — Admin — FEOps Kit`,
    description: `Edit engineering note ${id}`,
  }
}

export default async function EditEngineeringPage({
  params,
}: EditEngineeringPageProps): Promise<React.JSX.Element> {
  const { id } = await params
  const [note, media] = await Promise.all([
    engineeringData.getById(id),
    mediaData.getAll(),
  ])

  if (!note) notFound()

  return (
    <EngineeringForm
      initialValues={engineeringRecordToFormState(note)}
      media={mapMediaOptions(media)}
      listHref={ENGINEERING_LIST_CONFIG.listHref}
    />
  )
}
