'use client'

import Image from 'next/image'

import type { AdminMediaOption } from '@/types/admin-content.types'

interface MediaPickerDialogProps {
  readonly open: boolean
  readonly media: readonly AdminMediaOption[]
  readonly onSelect: (mediaId: string) => void
  readonly onClose: () => void
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
    >
      <div
        className="max-h-[80vh] w-[90%] max-w-[640px] overflow-y-auto rounded-[14px] border border-border bg-card p-6"
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

        {media.length === 0 ? (
          <p className="py-8 text-center text-sm italic text-muted-foreground">
            No media assets yet. Upload files in the Media library.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {media.map((asset) => (
              <button
                key={asset.id}
                type="button"
                onClick={() => {
                  onSelect(asset.id)
                  onClose()
                }}
                className="cursor-pointer overflow-hidden rounded-lg border border-border bg-background text-left"
              >
                <div className="relative aspect-[3/2] w-full">
                  <Image
                    src={asset.url}
                    alt={asset.alt}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="truncate px-2 py-1.5 text-xs text-muted-foreground">
                  {asset.alt || asset.id}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
