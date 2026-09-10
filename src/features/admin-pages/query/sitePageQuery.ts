import { omitClientIds } from '@/lib/admin/client-list'
import type { ClientNavItem, ClientSocialLink } from '@/types/admin-pages.types'
import type { NavItem } from '@/types/site.types'
import type { SiteSocialLink } from '@/types/site-settings.types'

export function normalizeNavOrders(items: readonly NavItem[]): NavItem[] {
  return items.map((item, index) => ({ ...item, order: index }))
}

export function toClientNav(nav: readonly NavItem[]): ClientNavItem[] {
  return normalizeNavOrders(nav).map((item) => ({
    ...item,
    clientId: item.key,
  }))
}

export function toClientSocial(links: readonly SiteSocialLink[]): ClientSocialLink[] {
  return links.map((link, index) => ({
    ...link,
    clientId: `social-${link.label}-${index}`,
  }))
}

export function toPersistableNav(nav: readonly ClientNavItem[]): NavItem[] {
  return normalizeNavOrders(omitClientIds(nav))
}

export function toPersistableSocial(
  links: readonly ClientSocialLink[]
): SiteSocialLink[] {
  return omitClientIds(links)
}
