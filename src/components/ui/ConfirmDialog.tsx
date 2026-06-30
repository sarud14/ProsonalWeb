'use client'

import { useCallback, useEffect } from 'react'

interface ConfirmDialogProps {
  readonly open: boolean
  readonly title: string
  readonly body: string
  readonly confirmLabel?: string
  readonly onConfirm: () => void
  readonly onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
}: ConfirmDialogProps): React.JSX.Element | null {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    },
    [onCancel]
  )

  useEffect(() => {
    if (!open) return
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, handleKeyDown])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 animate-in fade-in duration-200"
      onClick={onCancel}
    >
      <div
        className="w-[90%] max-w-[400px] rounded-[14px] bg-card p-7 shadow-[0_24px_60px_rgba(0,0,0,0.25)] animate-in zoom-in-[0.97] duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-2 text-[22px] font-medium">{title}</h3>
        <p className="mb-[22px] text-sm leading-relaxed text-muted-foreground">
          {body}
        </p>
        <div className="flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer rounded-lg border border-border bg-secondary px-[18px] py-2.5 text-[13px] font-semibold text-muted-foreground"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="cursor-pointer rounded-lg bg-primary px-[18px] py-2.5 text-[13px] font-bold text-primary-foreground"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
