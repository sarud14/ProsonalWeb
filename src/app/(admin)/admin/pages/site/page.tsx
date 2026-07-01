import type { Metadata } from 'next'

import { SitePageEditor } from '@/components/admin-page/Pages/SitePageEditor'
import { loadSiteConfig } from '@/lib/admin/load-page-section'
import { mapMediaOptions } from '@/lib/admin/map-media-options'
import { mediaData } from '@/lib/data/media.data'
import { isBlobConfigured } from '@/lib/media/upload'

export const metadata: Metadata = {
  title: 'Site config — Admin — FEOps Kit',
}

export default async function AdminSitePage(): Promise<React.JSX.Element> {
  const [initialData, media] = await Promise.all([loadSiteConfig(), mediaData.getAll()])

  return (
    <SitePageEditor
      initialData={initialData}
      media={mapMediaOptions(media)}
      uploadEnabled={isBlobConfigured()}
    />
  )
}
