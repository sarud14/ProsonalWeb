import { describe, expect, it } from 'vitest'

import {
  CONTACT_DEFAULT_BODY,
  CONTACT_DEFAULT_HEADLINE,
  CONTACT_DEFAULT_SUCCESS_MESSAGE,
} from '@/constants/contact'
import { parseLandingContact } from '@/lib/admin/landing-block-props'

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
