'use client'

import { useCallback, useState } from 'react'

import type { MediaAltModalState } from '@/types/admin-media.types'

import {
  AdminFormField,
  adminInputClassName,
} from '@/components/admin-page/shared/AdminFormField'

interface MediaAltModalProps {
  readonly state: MediaAltModalState
  readonly onClose: () => void
  readonly onSave: (id: string, alt: string) => void
}

export function MediaAltModal({
  state,
  onClose,
  onSave,
}: MediaAltModalProps): React.JSX.Element {
  const [alt, setAlt] = useState(state.alt)

  const handleSave = useCallback(() => {
    onSave(state.id, alt)
  }, [alt, onSave, state.id])

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/50"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-[90%] max-w-[440px] rounded-[14px] border border-border bg-card p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-5 text-[22px] font-medium">Edit alt text</h3>

        <AdminFormField label="Alt text">
          <input
            className={adminInputClassName}
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
          />
        </AdminFormField>

        <div className="mt-6 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg border border-border bg-secondary px-[18px] py-2.5 text-[13px] font-semibold text-muted-foreground"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="cursor-pointer rounded-lg bg-primary px-[18px] py-2.5 text-[13px] font-bold text-primary-foreground"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
