import { describe, expect, it } from 'vitest'

import { submitContactSchema } from '@/validators/contact-action.schema'

describe('submitContactSchema', () => {
  it('accepts a valid payload without honeypot', () => {
    const result = submitContactSchema.safeParse({
      name: 'Alex',
      email: 'alex@example.com',
      message: 'Hello — interested in collaborating.',
    })

    expect(result.success).toBe(true)
  })

  it('accepts an empty honeypot website field', () => {
    const result = submitContactSchema.safeParse({
      name: 'Alex',
      email: 'alex@example.com',
      message: 'Hello',
      website: '',
    })

    expect(result.success).toBe(true)
  })

  it('rejects missing name or invalid email', () => {
    expect(
      submitContactSchema.safeParse({
        name: '',
        email: 'alex@example.com',
        message: 'Hello',
      }).success
    ).toBe(false)

    expect(
      submitContactSchema.safeParse({
        name: 'Alex',
        email: 'not-an-email',
        message: 'Hello',
      }).success
    ).toBe(false)
  })

  it('rejects an empty message', () => {
    expect(
      submitContactSchema.safeParse({
        name: 'Alex',
        email: 'alex@example.com',
        message: '',
      }).success
    ).toBe(false)
  })
})
