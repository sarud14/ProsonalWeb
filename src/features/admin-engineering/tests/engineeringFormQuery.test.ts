import { describe, expect, it } from 'vitest'

import { emptyEngineeringFormState } from '@/lib/admin/content-form-mappers'

import { buildEngineeringMutationPayload } from '../query/engineeringFormQuery'

describe('buildEngineeringMutationPayload', () => {
  it('includes the engineering type from form state', () => {
    const payload = buildEngineeringMutationPayload({
      ...emptyEngineeringFormState(),
      slug: 'caching',
      type: 'PERFORMANCE',
    })

    expect(payload.slug).toBe('caching')
    expect(payload.type).toBe('PERFORMANCE')
  })
})
