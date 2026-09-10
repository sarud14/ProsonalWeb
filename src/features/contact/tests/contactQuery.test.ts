import { describe, expect, it } from 'vitest'

import { CONTACT_HONEYPOT_FIELD } from '@/constants/contact'

import { buildContactSubmitInput } from '../query/contactQuery'

describe('buildContactSubmitInput', () => {
  it('puts the honeypot value on the website field', () => {
    expect(
      buildContactSubmitInput({
        name: 'Ada',
        email: 'ada@example.com',
        message: 'Hello',
        website: 'http://spam.test',
      })
    ).toEqual({
      name: 'Ada',
      email: 'ada@example.com',
      message: 'Hello',
      [CONTACT_HONEYPOT_FIELD]: 'http://spam.test',
    })
  })
})
