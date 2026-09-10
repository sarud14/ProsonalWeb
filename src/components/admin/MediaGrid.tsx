'use client'

import Image from 'next/image'

import type { AdminMediaItem } from '@/types/admin-media.types'

interface MediaGridProps {
  readonly items: readonly AdminMediaItem[]
  readonly mode?: 'library' | 'picker'
  readonly onSelect?: (id: string) => void
  readonly onEditAlt?: (item: AdminMediaItem) => void
  readonly onDelete?: (id: string) => void
}

export function MediaGrid({
  items,
  mode = 'library',
  onSelect,
  onEditAlt,
  onDelete,
}: MediaGridProps): React.JSX.Element {
  if (items.length === 0) {
    return (
      <p className="py-12 text-center text-sm italic text-muted-foreground">
        No media assets yet. Upload files to get started.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => {
        const isPicker = mode === 'picker'

        return (
          <div
            key={item.id}
            className="overflow-hidden rounded-lg border border-border bg-card"
          >
            <button
              type="button"
              onClick={() => (isPicker ? onSelect?.(item.id) : onEditAlt?.(item))}
              className="block w-full cursor-pointer border-none bg-transparent p-0 text-left"
            >
              <div className="relative aspect-[4/3] w-full bg-background">
                <Image
                  src={item.url}
                  alt={item.alt || 'Media asset'}
                  fill
                  className="object-cover"
                  unoptimized
                />
                {item.referenceCount > 0 && (
                  <span className="absolute right-2 top-2 rounded-md bg-background/90 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                    {item.referenceCount} ref{item.referenceCount === 1 ? '' : 's'}
                  </span>
                )}
              </div>
            </button>

            <div className="flex items-center justify-between gap-2 px-2.5 py-2">
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-medium text-foreground">
                  {item.alt || 'Untitled'}
                </div>
                <div className="truncate font-mono text-[10px] text-muted-foreground">
                  {item.mimeType.split('/')[1] ?? item.mimeType}
                </div>
              </div>

              {!isPicker && onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(item.id)}
                  disabled={item.referenceCount > 0}
                  title={
                    item.referenceCount > 0
                      ? `In use by ${item.referenceCount} item(s)`
                      : 'Delete'
                  }
                  className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-[7px] border border-border bg-transparent text-sm text-primary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
