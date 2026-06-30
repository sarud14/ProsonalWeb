import type { Metadata } from 'next'

import { WorkForm } from '@/components/admin-page/Work/WorkForm'
import { WORK_LIST_CONFIG } from '@/constants/admin-content-list'
import { emptyWorkFormState } from '@/lib/admin/content-form-mappers'
import { mapMediaOptions } from '@/lib/admin/map-media-options'
import { mediaData } from '@/lib/data/media.data'

export const metadata: Metadata = {
  title: 'New Work — Admin — FEOps Kit',
}

export default async function NewWorkPage(): Promise<React.JSX.Element> {
  const media = await mediaData.getAll()

  return (
    <WorkForm
      initialValues={emptyWorkFormState()}
      media={mapMediaOptions(media)}
      listHref={WORK_LIST_CONFIG.listHref}
    />
  )
}
