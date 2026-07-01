'use client'

import Image from 'next/image'
import { useRef } from 'react'

import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface ImagePickerProps {
  readonly imageUrl?: string | null
  readonly altText?: string
  readonly uploadEnabled?: boolean
  readonly isUploading?: boolean
  readonly onUpload?: (file: File) => void | Promise<void>
  readonly onPickFromMedia?: () => void
  readonly onRemove?: () => void
  readonly className?: string
}

export function ImagePicker({
  imageUrl,
  altText,
  uploadEnabled = false,
  isUploading = false,
  onUpload,
  onPickFromMedia,
  onRemove,
  className,
}: ImagePickerProps): React.JSX.Element {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canUpload = uploadEnabled && onUpload !== undefined
  const canPick = onPickFromMedia !== undefined

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="flex flex-wrap items-start gap-3.5">
        <div className="flex aspect-[1200/630] w-full max-w-[280px] shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-card">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={altText ?? ''}
              width={280}
              height={147}
              className="size-full object-cover"
              unoptimized
            />
          ) : (
            <span className="px-3 text-center font-mono text-[10px] tracking-[0.08em] text-muted-foreground uppercase">
              No image selected
            </span>
          )}
        </div>

        <div className="flex min-w-[180px] flex-1 flex-col gap-2">
          {canUpload && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) void onUpload(file)
                  e.target.value = ''
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
              >
                {isUploading ? 'Uploading…' : 'Upload image'}
              </Button>
            </>
          )}

          {canPick && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isUploading}
              onClick={onPickFromMedia}
            >
              Choose from media
            </Button>
          )}

          {imageUrl && onRemove && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isUploading}
              onClick={onRemove}
            >
              Remove image
            </Button>
          )}
        </div>
      </div>

      {!canUpload && !canPick && (
        <p className="text-xs text-muted-foreground">
          Image selection is not available in this context.
        </p>
      )}

      {canUpload === false && canPick && (
        <p className="text-xs text-muted-foreground">
          Uploads are disabled until blob storage is configured. You can still pick an existing
          file from the media library.
        </p>
      )}
    </div>
  )
}
