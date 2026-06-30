'use client'

import Image from 'next/image'

interface ImagePickerProps {
  readonly imageUrl?: string | null
  readonly altText?: string
  readonly onPickFromMedia: () => void
}

export function ImagePicker({
  imageUrl,
  altText,
  onPickFromMedia,
}: ImagePickerProps): React.JSX.Element {
  return (
    <div className="flex items-center gap-3.5">
      <div className="flex size-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-card">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={altText ?? ''}
            width={96}
            height={64}
            className="size-full object-cover"
            unoptimized
          />
        ) : (
          <span className="font-mono text-[9px] text-muted-foreground">
            No image
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={onPickFromMedia}
        className="cursor-pointer rounded-lg border border-border bg-card px-3.5 py-[9px] text-[13px] font-semibold text-foreground"
      >
        Choose from media…
      </button>
    </div>
  )
}
