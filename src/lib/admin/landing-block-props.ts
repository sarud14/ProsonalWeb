import type {
  LandingFocusItem,
  LandingModule,
  LandingStat,
} from '@/types/landing.types'

import { LANDING_BLOCK_TYPES } from '@/constants/admin-pages'

export type LandingBlockType = (typeof LANDING_BLOCK_TYPES)[number]['value']

const EMPTY_STAT: LandingStat = { value: '', label: '' }

const EMPTY_MODULE: LandingModule = {
  num: '01',
  title: '',
  desc: '',
  link: '/',
  linkLabel: '',
}

export function getDefaultLandingBlockProps(
  type: LandingBlockType
): Record<string, unknown> {
  switch (type) {
    case 'stats':
      return { items: [{ ...EMPTY_STAT }] }
    case 'modules':
      return { items: [{ ...EMPTY_MODULE }] }
    case 'techStack':
      return { items: [] as string[] }
    default:
      return { items: [] }
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function parseLandingStats(props: Record<string, unknown>): LandingStat[] {
  const raw = props.items
  if (!Array.isArray(raw)) return []

  return raw
    .filter(isRecord)
    .map((item) => ({
      value: typeof item.value === 'string' ? item.value : '',
      label: typeof item.label === 'string' ? item.label : '',
    }))
}

export function parseLandingModules(props: Record<string, unknown>): LandingModule[] {
  const raw = props.items
  if (!Array.isArray(raw)) return []

  return raw
    .filter(isRecord)
    .map((item) => ({
      num: typeof item.num === 'string' ? item.num : '',
      title: typeof item.title === 'string' ? item.title : '',
      desc: typeof item.desc === 'string' ? item.desc : '',
      link: typeof item.link === 'string' ? item.link : '',
      linkLabel: typeof item.linkLabel === 'string' ? item.linkLabel : '',
      badge: typeof item.badge === 'string' && item.badge.length > 0 ? item.badge : undefined,
    }))
}

export function parseLandingTechStack(props: Record<string, unknown>): string[] {
  const raw = props.items
  if (!Array.isArray(raw)) return []
  return raw.filter((item): item is string => typeof item === 'string')
}

export function parseLandingFocusItems(props: Record<string, unknown>): LandingFocusItem[] {
  const raw = props.items
  if (!Array.isArray(raw)) return []

  return raw
    .filter(isRecord)
    .map((item) => ({
      label: typeof item.label === 'string' ? item.label : '',
      value: typeof item.value === 'string' ? item.value : '',
    }))
}

export function landingBlockTypeLabel(type: string): string {
  return LANDING_BLOCK_TYPES.find((entry) => entry.value === type)?.label ?? type
}
