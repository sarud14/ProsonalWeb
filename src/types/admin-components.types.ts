import type { DataTableColumn, DataTableRow } from '@/components/ui'
import type { AdminContentListConfig, AdminMediaOption } from '@/types/admin-content.types'
import type { AdminMediaItem } from '@/types/admin-media.types'

export interface AdminFormFieldProps {
  readonly label: string
  readonly required?: boolean
  readonly span?: string
  readonly children: React.ReactNode
}

export interface ContentListClientProps {
  readonly config: AdminContentListConfig
  readonly columns: readonly DataTableColumn[]
  readonly rows: readonly DataTableRow[]
}

export interface MediaGridProps {
  readonly items: readonly AdminMediaItem[]
  readonly mode?: 'library' | 'picker'
  readonly onSelect?: (id: string) => void
  readonly onEditAlt?: (item: AdminMediaItem) => void
  readonly onDelete?: (id: string) => void
}

export interface MediaPickerDialogProps {
  readonly open: boolean
  readonly media: readonly AdminMediaOption[]
  readonly onSelect: (mediaId: string) => void
  readonly onClose: () => void
}
