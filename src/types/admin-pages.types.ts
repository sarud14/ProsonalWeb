import type { FocusPageData } from '@/types/focus.types'
import type { LandingBlock, LandingPageData, NavItem, SiteConfig } from '@/types/site.types'
import type { StackGroup, StackPageData } from '@/types/stack.types'

export interface LandingPageEditorProps {
  readonly initialData: LandingPageData
}

export interface FocusPageEditorProps {
  readonly initialData: FocusPageData
}

export interface StackPageEditorProps {
  readonly initialData: StackPageData
}

export interface SitePageEditorProps {
  readonly initialData: SiteConfig
}

export interface LandingBlockModalState {
  readonly block: LandingBlock
  readonly isNew: boolean
  readonly clientId?: string
}

export interface FocusReadingDraft {
  readonly idx: string
  readonly title: string
}

export interface StackGroupDraft {
  readonly label: string
  readonly tools: readonly { readonly name: string; readonly note: string }[]
}

export interface NavItemDraft {
  readonly key: string
  readonly label: string
  readonly href: string
  readonly enabled: boolean
}

export interface FocusReadingModalState {
  readonly item: FocusReadingDraft
  readonly isNew: boolean
  readonly itemId?: string
}

export interface FocusRoadmapItemModalState {
  readonly columnIndex: number
  readonly item: {
    readonly title: string
    readonly note: string
    readonly dot: string
  }
  readonly isNew: boolean
  readonly itemId?: string
}

export interface StackGroupModalState {
  readonly group: StackGroupDraft
  readonly isNew: boolean
  readonly groupId?: string
}

export interface NavItemModalState {
  readonly item: NavItemDraft
  readonly isNew: boolean
  readonly itemKey?: string
}

export type { LandingBlock, NavItem, SiteConfig, StackGroup }
