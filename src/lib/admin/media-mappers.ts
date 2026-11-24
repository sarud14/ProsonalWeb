import type { AdminMediaItem } from '@/types/admin-media.types'
import type { MediaRow } from '@/types/admin-media.types'

export function mapMediaLibraryItems(assets: readonly MediaRow[]): AdminMediaItem[] {
  return assets.map((asset) => ({
    id: asset.id,
    url: asset.url,
    alt: asset.alt,
    mimeType: asset.mimeType,
    folder: asset.folder,
    createdAt: asset.createdAt.toISOString(),
    referenceCount:
      asset._count.workCovers + asset._count.journalCovers + asset._count.engineeringCovers,
  }))
}
