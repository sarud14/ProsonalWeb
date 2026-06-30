'use client'

interface FormActionsProps {
  readonly onPublish: () => void
  readonly onSaveDraft: () => void
  readonly onPreview?: () => void
  readonly onCancel: () => void
  readonly isSubmitting?: boolean
}

export function FormActions({
  onPublish,
  onSaveDraft,
  onPreview,
  onCancel,
  isSubmitting = false,
}: FormActionsProps): React.JSX.Element {
  return (
    <div className="mt-7 flex items-center gap-3 border-t border-border pt-6">
      <button
        type="button"
        onClick={onPublish}
        disabled={isSubmitting}
        className="cursor-pointer rounded-lg bg-primary px-[22px] py-3 text-[13px] font-bold text-primary-foreground disabled:opacity-50"
      >
        Publish
      </button>
      <button
        type="button"
        onClick={onSaveDraft}
        disabled={isSubmitting}
        className="cursor-pointer rounded-lg bg-primary/85 px-[22px] py-3 text-[13px] font-semibold text-primary-foreground disabled:opacity-50"
      >
        Save draft
      </button>
      {onPreview && (
        <button
          type="button"
          onClick={onPreview}
          className="cursor-pointer rounded-lg border border-border bg-card px-[18px] py-3 text-[13px] font-semibold text-foreground"
        >
          Preview ↗
        </button>
      )}
      <button
        type="button"
        onClick={onCancel}
        className="ml-auto cursor-pointer border-none bg-transparent px-3.5 py-3 text-[13px] text-muted-foreground"
      >
        Cancel
      </button>
    </div>
  )
}
