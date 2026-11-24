import type { AdminMediaOption } from '@/types/admin-content.types'
import type { FocusPageData } from '@/types/focus.types'
import type { LandingBlock, LandingPageData, NavItem, SiteConfig } from '@/types/site.types'
import type { SiteSocialLink } from '@/types/site-settings.types'
import type { StackGroup, StackPageData } from '@/types/stack.types'
import type { FocusReadingItem } from '@/types/focus.types'
import type { LandingFocusItem, LandingHeroData } from '@/types/landing.types'

export interface LandingPageEditorProps {
  readonly initialData: LandingPageData
  readonly media: readonly AdminMediaOption[]
  readonly uploadEnabled: boolean
}

export interface FocusPageEditorProps {
  readonly initialData: FocusPageData
}

export interface StackPageEditorProps {
  readonly initialData: StackPageData
}

export interface SitePageEditorProps {
  readonly initialData: SiteConfig
  readonly media: readonly AdminMediaOption[]
  readonly uploadEnabled: boolean
}

export interface ClientNavItem extends NavItem {
  readonly clientId: string
}

export interface ClientSocialLink extends SiteSocialLink {
  readonly clientId: string
}

export interface ClientLandingBlock extends LandingBlock {
  readonly clientId: string
}

export interface ClientStackGroup extends StackGroup {
  readonly clientId: string
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

export interface ClientReadingItem extends FocusReadingItem {
  readonly clientId: string
}

export interface FocusReadingModalProps {
  readonly state: FocusReadingModalState
  readonly onClose: () => void
  readonly onSave: (item: FocusReadingModalState['item']) => void
}

export interface FocusRoadmapItemModalProps {
  readonly state: FocusRoadmapItemModalState
  readonly onClose: () => void
  readonly onSave: (item: FocusRoadmapItemModalState['item']) => void
}

export interface LandingBlockModalProps {
  readonly state: LandingBlockModalState
  readonly onClose: () => void
  readonly onSave: (block: LandingBlock) => void
}

export interface LandingBlockPropsEditorProps {
  readonly type: string
  readonly props: Record<string, unknown>
  readonly onChange: (props: Record<string, unknown>) => void
}

export interface ClientMetaItem extends LandingFocusItem {
  readonly clientId: string
}

export interface LandingHeroEditorProps {
  readonly hero: LandingHeroData
  readonly media: readonly AdminMediaOption[]
  readonly uploadEnabled: boolean
  readonly isSaving: boolean
  readonly onSave: (hero: LandingHeroData) => void
}

export interface NavItemModalProps {
  readonly state: NavItemModalState
  readonly onClose: () => void
  readonly onSave: (item: NavItemModalState['item']) => void
}

export interface StackGroupModalProps {
  readonly state: StackGroupModalState
  readonly onClose: () => void
  readonly onSave: (group: StackGroupModalState['group']) => void
}
