import { describe, expect, it } from 'vitest'

import { emptyWorkFormState } from '@/lib/admin/content-form-mappers'

import { buildWorkMutationPayload } from '../query/workFormQuery'

describe('buildWorkMutationPayload', () => {
  it('copies mutable arrays off the form state', () => {
    const values = { ...emptyWorkFormState(), slug: 'kit', stack: ['Next.js'], domains: ['CMS'] }
    const payload = buildWorkMutationPayload(values)

    expect(payload.slug).toBe('kit')
    expect(payload.stack).toEqual(['Next.js'])
    expect(payload.stack).not.toBe(values.stack)
    expect(payload.domains).not.toBe(values.domains)
  })
})
