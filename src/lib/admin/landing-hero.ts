import { LANDING_FOCUS_ITEMS } from '@/constants/landing'
import { parseLandingFocusItems } from '@/lib/admin/landing-block-props'
import type { LandingFocusItem, LandingHeroData } from '@/types/landing.types'
import type { LandingBlock, LandingPageData } from '@/types/site.types'

export const DEFAULT_LANDING_HERO: LandingHeroData = {
  eyebrowLabel: 'Engineering System',
  eyebrowVersion: 'v1.0',
  titleLine1: 'Building scalable',
  titleLine2: 'digital products,',
  titleLine3: 'framed as systems.',
  body:
    'Frontend engineer working in Next.js, TypeScript, and AI-assisted workflows. Focused on CMS platforms, booking systems, multilingual applications, and frontend architecture.',
  bodyHighlights: ['Next.js', 'TypeScript'],
  primaryCtaLabel: 'View the work',
  primaryCtaHref: '/work',
  secondaryCtaLabel: 'Browse the system',
  secondaryCtaHref: '#modules',
  metaItems: [...LANDING_FOCUS_ITEMS],
  profileName: 'Sarut Dumrongprechachan',
  profileSubtitle: 'FE-Eng · AU / Remote',
  profileStatus: 'Open',
  profileImageUrl: null,
  profileImageAlt: '',
  codeFilename: 'engineer.config.ts',
  codeRole: 'Frontend Engineer',
  codeStack: ['Next.js', 'TS', 'React'],
  codeDomains: ['cms', 'booking', 'i18n'],
  codeFocus: 'platform-eng',
  codeStatus: 'available',
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parseStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string')
}

function parseMetaItems(value: unknown): LandingFocusItem[] {
  if (!Array.isArray(value)) return []

  return value
    .filter(isRecord)
    .map((item) => ({
      label: typeof item.label === 'string' ? item.label : '',
      value: typeof item.value === 'string' ? item.value : '',
    }))
}

export function parseLandingHeroData(value: unknown): LandingHeroData {
  if (!isRecord(value)) return DEFAULT_LANDING_HERO

  const metaItems = parseMetaItems(value.metaItems)

  return {
    eyebrowLabel:
      typeof value.eyebrowLabel === 'string'
        ? value.eyebrowLabel
        : DEFAULT_LANDING_HERO.eyebrowLabel,
    eyebrowVersion:
      typeof value.eyebrowVersion === 'string'
        ? value.eyebrowVersion
        : DEFAULT_LANDING_HERO.eyebrowVersion,
    titleLine1:
      typeof value.titleLine1 === 'string' ? value.titleLine1 : DEFAULT_LANDING_HERO.titleLine1,
    titleLine2:
      typeof value.titleLine2 === 'string' ? value.titleLine2 : DEFAULT_LANDING_HERO.titleLine2,
    titleLine3:
      typeof value.titleLine3 === 'string' ? value.titleLine3 : DEFAULT_LANDING_HERO.titleLine3,
    body: typeof value.body === 'string' ? value.body : DEFAULT_LANDING_HERO.body,
    bodyHighlights:
      parseStringArray(value.bodyHighlights).length > 0
        ? parseStringArray(value.bodyHighlights)
        : DEFAULT_LANDING_HERO.bodyHighlights,
    primaryCtaLabel:
      typeof value.primaryCtaLabel === 'string'
        ? value.primaryCtaLabel
        : DEFAULT_LANDING_HERO.primaryCtaLabel,
    primaryCtaHref:
      typeof value.primaryCtaHref === 'string'
        ? value.primaryCtaHref
        : DEFAULT_LANDING_HERO.primaryCtaHref,
    secondaryCtaLabel:
      typeof value.secondaryCtaLabel === 'string'
        ? value.secondaryCtaLabel
        : DEFAULT_LANDING_HERO.secondaryCtaLabel,
    secondaryCtaHref:
      typeof value.secondaryCtaHref === 'string'
        ? value.secondaryCtaHref
        : DEFAULT_LANDING_HERO.secondaryCtaHref,
    metaItems: metaItems.length > 0 ? metaItems : DEFAULT_LANDING_HERO.metaItems,
    profileName:
      typeof value.profileName === 'string' ? value.profileName : DEFAULT_LANDING_HERO.profileName,
    profileSubtitle:
      typeof value.profileSubtitle === 'string'
        ? value.profileSubtitle
        : DEFAULT_LANDING_HERO.profileSubtitle,
    profileStatus:
      typeof value.profileStatus === 'string'
        ? value.profileStatus
        : DEFAULT_LANDING_HERO.profileStatus,
    profileImageUrl:
      typeof value.profileImageUrl === 'string' && value.profileImageUrl.length > 0
        ? value.profileImageUrl
        : null,
    profileImageAlt:
      typeof value.profileImageAlt === 'string'
        ? value.profileImageAlt
        : DEFAULT_LANDING_HERO.profileImageAlt,
    codeFilename:
      typeof value.codeFilename === 'string' ? value.codeFilename : DEFAULT_LANDING_HERO.codeFilename,
    codeRole: typeof value.codeRole === 'string' ? value.codeRole : DEFAULT_LANDING_HERO.codeRole,
    codeStack:
      parseStringArray(value.codeStack).length > 0
        ? parseStringArray(value.codeStack)
        : DEFAULT_LANDING_HERO.codeStack,
    codeDomains:
      parseStringArray(value.codeDomains).length > 0
        ? parseStringArray(value.codeDomains)
        : DEFAULT_LANDING_HERO.codeDomains,
    codeFocus:
      typeof value.codeFocus === 'string' ? value.codeFocus : DEFAULT_LANDING_HERO.codeFocus,
    codeStatus:
      typeof value.codeStatus === 'string' ? value.codeStatus : DEFAULT_LANDING_HERO.codeStatus,
  }
}

function isLandingBlock(value: unknown): value is LandingBlock {
  return (
    isRecord(value) &&
    typeof value.type === 'string' &&
    typeof value.enabled === 'boolean' &&
    typeof value.order === 'number' &&
    isRecord(value.props)
  )
}

function heroFromLegacyFocusBlock(blocks: readonly LandingBlock[]): LandingHeroData | null {
  const focusBlock = blocks.find((block) => block.type === 'focusItems')
  if (!focusBlock) return null

  const metaItems = parseLandingFocusItems(focusBlock.props)
  if (metaItems.length === 0) return null

  return { ...DEFAULT_LANDING_HERO, metaItems }
}

export function parseLandingPageData(value: unknown): LandingPageData {
  if (!isRecord(value)) {
    return { hero: DEFAULT_LANDING_HERO, blocks: [] }
  }

  const rawBlocks = Array.isArray(value.blocks) ? value.blocks.filter(isLandingBlock) : []
  const blocks = rawBlocks.filter((block) => block.type !== 'focusItems')

  const legacyHero = heroFromLegacyFocusBlock(rawBlocks)
  const hero = value.hero
    ? parseLandingHeroData(value.hero)
    : legacyHero ?? DEFAULT_LANDING_HERO

  return { hero, blocks }
}
