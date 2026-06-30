import type { Metadata } from 'next'

import { MediaLibraryView } from '@/components/admin-page/Media/MediaLibraryView'
import { mapMediaLibraryItems } from '@/lib/admin/media-mappers'
import { mediaData } from '@/lib/data/media.data'
import { isBlobConfigured } from '@/lib/media/upload'

export const metadata: Metadata = {
  title: 'Media — Admin — FEOps Kit',
}

export default async function AdminMediaPage(): Promise<React.JSX.Element> {
  const assets = await mediaData.getAllWithReferenceCounts()
  const initialItems = mapMediaLibraryItems(assets)

  return (
    <MediaLibraryView initialItems={initialItems} uploadEnabled={isBlobConfigured()} />
  )
}
