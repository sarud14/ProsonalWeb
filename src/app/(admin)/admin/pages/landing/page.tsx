import type { Metadata } from 'next'

import { LandingPageEditor } from '@/components/admin-page/Pages/LandingPageEditor'
import { loadLandingPageData } from '@/lib/admin/load-page-section'
import { mapMediaOptions } from '@/lib/admin/map-media-options'
import { mediaData } from '@/lib/data/media.data'
import { isBlobConfigured } from '@/lib/media/upload'

export const metadata: Metadata = {
  title: 'Landing page — Admin — FEOps Kit',
}

export default async function AdminLandingPage(): Promise<React.JSX.Element> {
  const [initialData, media] = await Promise.all([loadLandingPageData(), mediaData.getAll()])

  return (
    <LandingPageEditor
      initialData={initialData}
      media={mapMediaOptions(media)}
      uploadEnabled={isBlobConfigured()}
    />
  )
}
