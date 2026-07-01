import { describe, expect, it } from 'vitest'

import {
  buildThemeCssVars,
  DEFAULT_SITE_THEME,
  DEFAULT_THEME_PICKER_HEX,
  normalizeSiteTheme,
  parseSiteTheme,
  shouldApplyCustomTheme,
  toThemePickerHex,
} from '@/lib/admin/site-theme'

describe('parseSiteTheme', () => {
  it('returns defaults for empty object', () => {
    expect(parseSiteTheme({})).toEqual(DEFAULT_SITE_THEME)
  })

  it('ignores invalid color values', () => {
    const theme = parseSiteTheme({ primary: 'not-a-color', background: '#112233' })
    expect(theme.primary).toBe(DEFAULT_SITE_THEME.primary)
    expect(theme.background).toBe('#112233')
  })
})

describe('shouldApplyCustomTheme', () => {
  it('returns false when theme matches design defaults', () => {
    expect(shouldApplyCustomTheme(DEFAULT_SITE_THEME)).toBe(false)
  })

  it('returns false for legacy default hex from old seed', () => {
    expect(
      shouldApplyCustomTheme({
        ...DEFAULT_SITE_THEME,
        primary: '#4a6ab5',
        background: '#060608',
      })
    ).toBe(false)
  })

  it('returns true when only background differs from default', () => {
    expect(
      shouldApplyCustomTheme({
        ...DEFAULT_SITE_THEME,
        background: '#ff0000',
      })
    ).toBe(true)
  })

  it('returns true when a color was customized', () => {
    expect(shouldApplyCustomTheme({ ...DEFAULT_SITE_THEME, primary: '#ff0000' })).toBe(true)
  })
})

describe('normalizeSiteTheme', () => {
  it('maps legacy default hex to oklch tokens', () => {
    const normalized = normalizeSiteTheme({
      ...DEFAULT_SITE_THEME,
      primary: '#4a6ab5',
    })
    expect(normalized.primary).toBe('oklch(0.45 0.13 250)')
  })
})

describe('buildThemeCssVars', () => {
  it('maps theme colors to CSS variables including background', () => {
    const vars = buildThemeCssVars({
      primary: '#ff0000',
      background: '#000000',
      foreground: '#ffffff',
      success: '#00ff00',
      destructive: '#ff00ff',
    }) as Record<string, string>

    expect(vars['--primary']).toBe('#ff0000')
    expect(vars['--background']).toBe('#000000')
    expect(vars['--foreground']).toBe('#ffffff')
    expect(vars['--success']).toBe('#00ff00')
    expect(vars['--grid-line']).toBeUndefined()
  })
})

describe('toThemePickerHex', () => {
  it('returns hex values as-is', () => {
    expect(toThemePickerHex('#AABBCC', '#000000')).toBe('#aabbcc')
  })

  it('falls back for oklch stored values', () => {
    expect(toThemePickerHex('oklch(0.45 0.13 250)', DEFAULT_THEME_PICKER_HEX.primary)).toBe(
      '#4a6ab5'
    )
  })
})
