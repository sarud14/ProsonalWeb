import type { ReactNode } from 'react'

export interface ChipListProps {
  readonly items: readonly string[]
}

export interface ConfirmDialogProps {
  readonly open: boolean
  readonly title: string
  readonly body: string
  readonly confirmLabel?: string
  readonly onConfirm: () => void
  readonly onCancel: () => void
}

export interface DataTableColumn {
  readonly key: string
  readonly label: string
  readonly align?: 'left' | 'center' | 'right'
}

export type CellType =
  | { readonly kind: 'title'; readonly text: string }
  | { readonly kind: 'text'; readonly text: string; readonly mono?: boolean }
  | { readonly kind: 'badge'; readonly status: 'PUBLISHED' | 'DRAFT' }
  | { readonly kind: 'chips'; readonly items: readonly string[] }
  | { readonly kind: 'custom'; readonly render: ReactNode }

export interface DataTableRow {
  readonly id: string
  readonly cells: readonly CellType[]
  readonly status: 'PUBLISHED' | 'DRAFT'
}

export interface DataTableProps {
  readonly columns: readonly DataTableColumn[]
  readonly rows: readonly DataTableRow[]
  readonly gridTemplate: string
  readonly onEdit: (id: string) => void
  readonly onTogglePublish: (id: string) => void
  readonly onDelete: (id: string) => void
}

export interface FormActionsProps {
  readonly onPublish: () => void
  readonly onSaveDraft: () => void
  readonly onPreview?: () => void
  readonly onCancel: () => void
  readonly isSubmitting?: boolean
}

export interface FormSectionProps {
  readonly label: string
  readonly columns?: string
  readonly children: React.ReactNode
}

export interface ImagePickerProps {
  readonly imageUrl?: string | null
  readonly altText?: string
  readonly uploadEnabled?: boolean
  readonly isUploading?: boolean
  readonly onUpload?: (file: File) => void | Promise<void>
  readonly onPickFromMedia?: () => void
  readonly onRemove?: () => void
  readonly className?: string
}

export interface InlineEditRowProps {
  readonly id: string
  readonly label: string
  readonly sortOrder: number
  readonly referenceCount: number
  readonly onLabelChange: (id: string, label: string) => void
  readonly onDelete: (id: string) => void
}

export interface ReorderableItem {
  readonly id: string
  readonly primary: string
  readonly secondary?: string
  readonly bullets?: readonly string[]
  readonly meta?: React.ReactNode
}

export interface ReorderableListProps {
  readonly label: string
  readonly items: readonly ReorderableItem[]
  readonly onMoveUp: (id: string) => void
  readonly onMoveDown: (id: string) => void
  readonly onRemove: (id: string) => void
  readonly onAdd: () => void
  readonly renderExtra?: (item: ReorderableItem) => React.ReactNode
}

export interface SectionHeadingProps {
  readonly kicker: string
  readonly title: string
  readonly action?: React.ReactNode
}

export interface StatusBadgeProps {
  readonly status: 'PUBLISHED' | 'DRAFT'
}

export interface TagInputProps {
  readonly tags: readonly string[]
  readonly onChange: (tags: readonly string[]) => void
  readonly placeholder?: string
  readonly ariaLabel?: string
}

export interface ToastProps {
  readonly message: string
  readonly open: boolean
  readonly onClose: () => void
  readonly duration?: number
}
