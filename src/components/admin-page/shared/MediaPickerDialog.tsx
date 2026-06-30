'use client'

import type { AdminMediaOption } from '@/types/admin-content.types'

import { MediaGrid } from '@/components/admin-page/Media/MediaGrid'
import type { AdminMediaItem } from '@/types/admin-media.types'

interface MediaPickerDialogProps {
  readonly open: boolean
  readonly media: readonly AdminMediaOption[]
  readonly onSelect: (mediaId: string) => void
  readonly onClose: () => void
}

function toPickerItems(media: readonly AdminMediaOption[]): AdminMediaItem[] {
  return media.map((asset) => ({
    id: asset.id,
    url: asset.url,
    alt: asset.alt,
    mimeType: 'image/*',
    folder: null,
    createdAt: '',
    referenceCount: 0,
  }))
}

export function MediaPickerDialog({
  open,
  media,
  onSelect,
  onClose,
}: MediaPickerDialogProps): React.JSX.Element | null {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/50"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="max-h-[80vh] w-[90%] max-w-[720px] overflow-y-auto rounded-[14px] border border-border bg-card p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium">Choose from media</h3>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer border-none bg-transparent text-muted-foreground"
          >
            ×
          </button>
        </div>

        <MediaGrid
          items={toPickerItems(media)}
          mode="picker"
          onSelect={(id) => {
            onSelect(id)
            onClose()
          }}
        />
      </div>
    </div>
  )
}
