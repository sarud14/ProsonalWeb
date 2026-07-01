import type {
  SiteContactSettings,
  SiteFooterSettings,
  SiteSeoSettings,
  SiteSocialLink,
} from '@/types/site-settings.types'

export const DEFAULT_SITE_SEO: SiteSeoSettings = {
  title: 'FEOps Kit',
  description: 'A reusable Next.js-based frontend engineering portfolio system',
  ogImageUrl: null,
}

export const DEFAULT_SITE_CONTACT: SiteContactSettings = {
  email: '',
  location: 'Australia — Remote',
}

export const DEFAULT_SITE_FOOTER: SiteFooterSettings = {
  copyrightName: 'Sarut Dumrongprechachan',
  tagline: 'Designed as a system, not a page',
  buildLabel: 'Build 2026.06 · All systems nominal',
}

export const DEFAULT_SITE_SOCIAL_LINKS: readonly SiteSocialLink[] = [
  { label: 'GitHub', url: '' },
  { label: 'LinkedIn', url: '' },
]

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function parseSiteSeo(value: unknown): SiteSeoSettings {
  if (!isRecord(value)) return DEFAULT_SITE_SEO

  return {
    title: typeof value.title === 'string' ? value.title : DEFAULT_SITE_SEO.title,
    description:
      typeof value.description === 'string' ? value.description : DEFAULT_SITE_SEO.description,
    ogImageUrl:
      typeof value.ogImageUrl === 'string' && value.ogImageUrl.length > 0
        ? value.ogImageUrl
        : null,
  }
}

export function parseSiteSocialLinks(value: unknown): SiteSocialLink[] {
  const raw = Array.isArray(value)
    ? value
    : isRecord(value) && Array.isArray(value.links)
      ? value.links
      : []

  const links = raw
    .filter(isRecord)
    .map((item) => ({
      label: typeof item.label === 'string' ? item.label : '',
      url: typeof item.url === 'string' ? item.url : '',
    }))
    .filter((item) => item.label.length > 0 || item.url.length > 0)

  return links.length > 0 ? links : [...DEFAULT_SITE_SOCIAL_LINKS]
}

export function parseSiteContact(value: unknown): SiteContactSettings {
  if (!isRecord(value)) return DEFAULT_SITE_CONTACT

  return {
    email: typeof value.email === 'string' ? value.email : DEFAULT_SITE_CONTACT.email,
    location:
      typeof value.location === 'string' ? value.location : DEFAULT_SITE_CONTACT.location,
  }
}

export function parseSiteFooter(value: unknown, contactValue?: unknown): SiteFooterSettings {
  if (isRecord(value)) {
    const hasFooterFields =
      typeof value.copyrightName === 'string' ||
      typeof value.tagline === 'string' ||
      typeof value.buildLabel === 'string'

    if (hasFooterFields) {
      return {
        copyrightName:
          typeof value.copyrightName === 'string'
            ? value.copyrightName
            : DEFAULT_SITE_FOOTER.copyrightName,
        tagline: typeof value.tagline === 'string' ? value.tagline : DEFAULT_SITE_FOOTER.tagline,
        buildLabel:
          typeof value.buildLabel === 'string' ? value.buildLabel : DEFAULT_SITE_FOOTER.buildLabel,
      }
    }
  }

  // Legacy: footer fields may have lived under contact
  if (isRecord(contactValue)) {
    const hasFooterFields =
      typeof contactValue.footerCopyright === 'string' ||
      typeof contactValue.footerTagline === 'string' ||
      typeof contactValue.footerBuildLabel === 'string'

    if (hasFooterFields) {
      return {
        copyrightName:
          typeof contactValue.footerCopyright === 'string'
            ? contactValue.footerCopyright
            : DEFAULT_SITE_FOOTER.copyrightName,
        tagline:
          typeof contactValue.footerTagline === 'string'
            ? contactValue.footerTagline
            : DEFAULT_SITE_FOOTER.tagline,
        buildLabel:
          typeof contactValue.footerBuildLabel === 'string'
            ? contactValue.footerBuildLabel
            : DEFAULT_SITE_FOOTER.buildLabel,
      }
    }
  }

  return DEFAULT_SITE_FOOTER
}
