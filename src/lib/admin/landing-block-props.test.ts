import { describe, expect, it } from 'vitest'

import {
  CONTACT_DEFAULT_BODY,
  CONTACT_DEFAULT_HEADLINE,
  CONTACT_DEFAULT_SUCCESS_MESSAGE,
} from '@/constants/contact'
import {
  parseLandingContact,
  parseLandingModules,
  visibleLandingModules,
} from '@/lib/admin/landing-block-props'

describe('parseLandingContact', () => {
  it('returns defaults when props are empty', () => {
    expect(parseLandingContact({})).toEqual({
      headline: CONTACT_DEFAULT_HEADLINE,
      body: CONTACT_DEFAULT_BODY,
      successMessage: CONTACT_DEFAULT_SUCCESS_MESSAGE,
    })
  })

  it('keeps provided non-empty strings', () => {
    expect(
      parseLandingContact({
        headline: 'Say hello',
        body: 'Drop a line.',
        successMessage: 'Got it.',
      })
    ).toEqual({
      headline: 'Say hello',
      body: 'Drop a line.',
      successMessage: 'Got it.',
    })
  })

  it('falls back when values are blank or wrong type', () => {
    expect(
      parseLandingContact({
        headline: '  ',
        body: 12,
        successMessage: null,
      })
    ).toEqual({
      headline: CONTACT_DEFAULT_HEADLINE,
      body: CONTACT_DEFAULT_BODY,
      successMessage: CONTACT_DEFAULT_SUCCESS_MESSAGE,
    })
  })
})

describe('parseLandingModules', () => {
  it('defaults enabled to true when the field is missing', () => {
    const items = parseLandingModules({
      items: [
        {
          num: '01',
          title: 'Work',
          desc: 'Cases',
          link: '/work',
          linkLabel: 'ENTRIES',
        },
      ],
    })

    expect(items[0]?.enabled).toBe(true)
  })

  it('keeps enabled false when stored in JSON', () => {
    const items = parseLandingModules({
      items: [
        {
          num: '02',
          title: 'Journal',
          desc: 'Notes',
          link: '/journal',
          linkLabel: 'POSTS',
          enabled: false,
        },
      ],
    })

    expect(items[0]?.enabled).toBe(false)
  })
})

describe('visibleLandingModules', () => {
  it('hides only cards with enabled false', () => {
    const visible = visibleLandingModules([
      {
        num: '01',
        title: 'Work',
        desc: 'Cases',
        link: '/work',
        linkLabel: 'ENTRIES',
        enabled: true,
      },
      {
        num: '02',
        title: 'Journal',
        desc: 'Notes',
        link: '/journal',
        linkLabel: 'POSTS',
        enabled: false,
      },
    ])

    expect(visible.map((item) => item.title)).toEqual(['Work'])
  })
})
