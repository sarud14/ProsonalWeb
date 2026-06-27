import type { NavItem } from '@/types/site.types'

export interface NavBarProps {
  readonly items: readonly NavItem[]
  readonly className?: string
}
