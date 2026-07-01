import type { NavItem } from '@/types/site.types'
import type { SiteBrand } from '@/types/site-brand.types'

export interface NavBarProps {
  readonly items: readonly NavItem[]
  readonly brand: SiteBrand
  readonly className?: string
}
