import type { AdminMediaItem } from '@/types/admin-media.types'

type MediaRow = {
  readonly id: string
  readonly url: string
  readonly alt: string
  readonly mimeType: string
  readonly folder: string | null
  readonly createdAt: Date
  readonly _count: {
    readonly workCovers: number
    readonly journalCovers: number
    readonly engineeringCovers: number
  }
}

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
