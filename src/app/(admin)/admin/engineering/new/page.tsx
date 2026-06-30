import type { Metadata } from 'next'

import { EngineeringForm } from '@/components/admin-page/Engineering/EngineeringForm'
import { ENGINEERING_LIST_CONFIG } from '@/constants/admin-content-list'
import { emptyEngineeringFormState } from '@/lib/admin/content-form-mappers'
import { mapMediaOptions } from '@/lib/admin/map-media-options'
import { mediaData } from '@/lib/data/media.data'

export const metadata: Metadata = {
  title: 'New Engineering Note — Admin — FEOps Kit',
}

export default async function NewEngineeringPage(): Promise<React.JSX.Element> {
  const media = await mediaData.getAll()

  return (
    <EngineeringForm
      initialValues={emptyEngineeringFormState()}
      media={mapMediaOptions(media)}
      listHref={ENGINEERING_LIST_CONFIG.listHref}
    />
  )
}
