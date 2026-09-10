import { describe, expect, it } from 'vitest'

import { emptyJournalFormState } from '@/lib/admin/content-form-mappers'

import { buildJournalMutationPayload } from '../query/journalFormQuery'

describe('buildJournalMutationPayload', () => {
  it('turns an empty pull quote into null', () => {
    const payload = buildJournalMutationPayload({
      ...emptyJournalFormState(),
      slug: 'note',
      pull: '',
    })

    expect(payload.pull).toBeNull()
  })

  it('keeps a non-empty pull quote', () => {
    const payload = buildJournalMutationPayload({
      ...emptyJournalFormState(),
      pull: 'Keep going.',
    })

    expect(payload.pull).toBe('Keep going.')
  })
})
