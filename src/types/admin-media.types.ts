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
