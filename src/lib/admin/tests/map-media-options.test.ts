import { describe, expect, it } from 'vitest'

import { findMediaOption, mapMediaOptions } from '../map-media-options'

describe('mapMediaOptions', () => {
  it('copies id, url, and alt', () => {
    expect(mapMediaOptions([{ id: 'img-1', url: '/a.png', alt: 'Cover' }])).toEqual([
      { id: 'img-1', url: '/a.png', alt: 'Cover' },
    ])
  })
})

describe('findMediaOption', () => {
  const media = [{ id: 'img-1', url: '/a.png', alt: 'Cover' }]

  it('returns the matching asset', () => {
    expect(findMediaOption(media, 'img-1')?.alt).toBe('Cover')
  })

  it('returns undefined when id is missing', () => {
    expect(findMediaOption(media, null)).toBeUndefined()
    expect(findMediaOption(media, 'missing')).toBeUndefined()
  })
})
