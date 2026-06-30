'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useRef, useState } from 'react'

import { deleteMedia, updateMediaAlt } from '@/actions/media.actions'
import { MediaAltModal } from '@/components/admin-page/Media/MediaAltModal'
import { MediaGrid } from '@/components/admin-page/Media/MediaGrid'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Toast } from '@/components/ui/Toast'
import { uploadMediaFile } from '@/lib/media/client-upload'
import type { MediaAltModalState, MediaLibraryViewProps } from '@/types/admin-media.types'

export function MediaLibraryView({
  initialItems,
  uploadEnabled,
}: MediaLibraryViewProps): React.JSX.Element {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [altModal, setAltModal] = useState<MediaAltModalState | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const showError = useCallback((message: string) => {
    setToast(message)
  }, [])

  const handleUpload = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return

      setIsUploading(true)

      for (const file of Array.from(files)) {
        const result = await uploadMediaFile(file)
        if (!result.success) {
          showError(result.error)
          break
        }
      }

      setIsUploading(false)
      router.refresh()
    },
    [router, showError]
  )

  const handleSaveAlt = useCallback(
    async (id: string, alt: string) => {
      const result = await updateMediaAlt({ id, alt })
      if (!result.success) {
        showError(result.error)
        return
      }

      setAltModal(null)
      router.refresh()
    },
    [router, showError]
  )

  const handleDelete = useCallback(async () => {
    if (!deleteId) return

    const result = await deleteMedia(deleteId)
    if (!result.success) {
      showError(result.error)
      setDeleteId(null)
      return
    }

    setDeleteId(null)
    router.refresh()
  }, [deleteId, router, showError])

  return (
    <div>
      <SectionHeading
        kicker="Library"
        title="Media"
        action={
          uploadEnabled ? (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => void handleUpload(e.target.files)}
              />
              <button
                type="button"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer rounded-lg bg-primary px-[15px] py-2 text-xs font-semibold text-primary-foreground disabled:opacity-50"
              >
                {isUploading ? 'Uploading…' : '+ Upload'}
              </button>
            </>
          ) : undefined
        }
      />

      {!uploadEnabled && (
        <p className="mb-4 text-[13px] text-muted-foreground">
          Blob storage is not configured. Set `BLOB_READ_WRITE_TOKEN` in `.env` to enable uploads.
        </p>
      )}

      <div
        className="mb-6 rounded-xl border border-dashed border-border bg-card p-8 text-center"
        onDragOver={(e) => {
          e.preventDefault()
        }}
        onDrop={(e) => {
          e.preventDefault()
          if (uploadEnabled) void handleUpload(e.dataTransfer.files)
        }}
      >
        <p className="text-sm text-muted-foreground">
          {uploadEnabled
            ? 'Drag and drop images here, or use Upload above.'
            : 'Uploads disabled until blob storage is configured.'}
        </p>
      </div>

      <MediaGrid
        items={initialItems}
        onEditAlt={(item) => setAltModal({ id: item.id, alt: item.alt })}
        onDelete={(id) => setDeleteId(id)}
      />

      {altModal && (
        <MediaAltModal
          key={altModal.id}
          state={altModal}
          onClose={() => setAltModal(null)}
          onSave={(id, alt) => void handleSaveAlt(id, alt)}
        />
      )}

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete media?"
        body="This permanently removes the file from the library. Content already using it will keep the URL until you change it."
        confirmLabel="Delete"
        onConfirm={() => void handleDelete()}
        onCancel={() => setDeleteId(null)}
      />

      <Toast message={toast ?? ''} open={toast !== null} onClose={() => setToast(null)} />
    </div>
  )
}
