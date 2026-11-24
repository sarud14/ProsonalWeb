export interface AdminMediaItem {
  readonly id: string
  readonly url: string
  readonly alt: string
  readonly mimeType: string
  readonly folder: string | null
  readonly createdAt: string
  readonly referenceCount: number
}

export interface MediaLibraryViewProps {
  readonly initialItems: readonly AdminMediaItem[]
  readonly uploadEnabled: boolean
}

export interface MediaAltModalState {
  readonly id: string
  readonly alt: string
}

export interface MediaAltModalProps {
  readonly state: MediaAltModalState
  readonly onClose: () => void
  readonly onSave: (id: string, alt: string) => void
}

export type MediaRow = {
  readonly id: string
  readonly url: string
  readonly alt: string
  readonly mimeType: string
  readonly folder: string | null
  readonly createdAt: Date
  readonly _count: {
    readonly workCovers: number
    readonly journalCovers: number
    readonly engineeringCovers: number
  }
}

export type MediaUploadResult =
  | { readonly success: true; readonly id: string; readonly url: string }
  | { readonly success: false; readonly error: string }
