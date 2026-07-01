import type { CSSProperties } from 'react'

import type { SiteThemeColorKey, SiteThemeSettings } from '@/types/site-settings.types'

/** Matches `globals.css` — oklch tokens; CMS may store hex after user picks a color. */
export const DEFAULT_SITE_THEME: SiteThemeSettings = {
  primary: 'oklch(0.45 0.13 250)',
  background: 'oklch(0.035 0.005 250)',
  foreground: 'oklch(0.95 0 0)',
  success: 'oklch(0.72 0.19 155)',
  destructive: 'oklch(0.577 0.245 27.325)',
}

export const SITE_THEME_APPLY_KEYS = [
  'primary',
  'background',
  'foreground',
  'success',
  'destructive',
] as const satisfies readonly SiteThemeColorKey[]

export const SITE_THEME_COLOR_FIELDS: readonly {
  readonly key: SiteThemeColorKey
  readonly label: string
  readonly hint: string
}[] = [
  { key: 'primary', label: 'Accent / primary', hint: 'Buttons, links, highlights' },
  {
    key: 'background',
    label: 'Page background',
    hint: 'Canvas color under the grid overlay',
  },
  { key: 'foreground', label: 'Text', hint: 'Headings and body on dark bg' },
  { key: 'success', label: 'Success', hint: 'Available status, positive states' },
  { key: 'destructive', label: 'Error / unavailable', hint: 'Unavailable status, errors' },
]

const HEX_COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/
const OKLCH_COLOR_PATTERN = /^oklch\(/i

/** Hex swatches for `<input type="color">` when the stored value is oklch. */
export const DEFAULT_THEME_PICKER_HEX: Record<SiteThemeColorKey, string> = {
  primary: '#4a6ab5',
  background: '#060608',
  foreground: '#f2f2f2',
  success: '#4fd08b',
  destructive: '#e45454',
}

/** Value for the native color picker — hex only; oklch falls back to the design swatch. */
export function toThemePickerHex(value: string, fallbackHex: string): string {
  const trimmed = value.trim()
  if (HEX_COLOR_PATTERN.test(trimmed)) return trimmed.toLowerCase()
  return fallbackHex.toLowerCase()
}

/** Legacy seed/CMS hex that matches design defaults — do not treat as a custom theme. */
const THEME_DEFAULT_ALIASES: Record<SiteThemeColorKey, readonly string[]> = {
  primary: ['#4a6ab5', '#3f61a8'],
  background: ['#060608', '#09090b'],
  foreground: ['#f2f2f2', '#f5f5f5', '#fafafa'],
  success: ['#4fd08b', '#5cd998'],
  destructive: ['#e45454', '#dc2626'],
}

function parseColor(value: unknown, fallback: string): string {
  if (typeof value !== 'string') return fallback
  const trimmed = value.trim()
  if (HEX_COLOR_PATTERN.test(trimmed)) return trimmed.toLowerCase()
  if (OKLCH_COLOR_PATTERN.test(trimmed)) return trimmed
  return fallback
}

function isDefaultThemeValue(key: SiteThemeColorKey, value: string): boolean {
  const normalized = value.trim().toLowerCase()
  if (normalized === DEFAULT_SITE_THEME[key].trim().toLowerCase()) return true
  return THEME_DEFAULT_ALIASES[key].some((alias) => alias.toLowerCase() === normalized)
}

/** Coerce legacy default hex back to globals.css oklch tokens for display and comparison. */
export function normalizeSiteTheme(theme: SiteThemeSettings): SiteThemeSettings {
  return {
    primary: isDefaultThemeValue('primary', theme.primary)
      ? DEFAULT_SITE_THEME.primary
      : theme.primary,
    background: isDefaultThemeValue('background', theme.background)
      ? DEFAULT_SITE_THEME.background
      : theme.background,
    foreground: isDefaultThemeValue('foreground', theme.foreground)
      ? DEFAULT_SITE_THEME.foreground
      : theme.foreground,
    success: isDefaultThemeValue('success', theme.success)
      ? DEFAULT_SITE_THEME.success
      : theme.success,
    destructive: isDefaultThemeValue('destructive', theme.destructive)
      ? DEFAULT_SITE_THEME.destructive
      : theme.destructive,
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function parseSiteTheme(value: unknown): SiteThemeSettings {
  if (!isRecord(value)) return DEFAULT_SITE_THEME

  return normalizeSiteTheme({
    primary: parseColor(value.primary, DEFAULT_SITE_THEME.primary),
    background: parseColor(value.background, DEFAULT_SITE_THEME.background),
    foreground: parseColor(value.foreground, DEFAULT_SITE_THEME.foreground),
    success: parseColor(value.success, DEFAULT_SITE_THEME.success),
    destructive: parseColor(value.destructive, DEFAULT_SITE_THEME.destructive),
  })
}

function colorsMatch(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase()
}

/** Skip inline overrides when CMS still uses design defaults — `globals.css` stays authoritative. */
export function shouldApplyCustomTheme(theme: SiteThemeSettings): boolean {
  const normalized = normalizeSiteTheme(theme)
  return SITE_THEME_APPLY_KEYS.some(
    (key) => !colorsMatch(normalized[key], DEFAULT_SITE_THEME[key])
  )
}

export function buildThemeCssVars(theme: SiteThemeSettings): CSSProperties {
  // Grid overlay (--grid-line) stays in globals.css; CMS only changes the canvas color under it.
  return {
    '--background': theme.background,
    '--foreground': theme.foreground,
    '--primary': theme.primary,
    '--primary-foreground': '#fafafa',
    '--success': theme.success,
    '--destructive': theme.destructive,
    '--ring': theme.primary,
    '--sidebar-primary': theme.primary,
    '--sidebar-ring': theme.primary,
  } as CSSProperties
}
