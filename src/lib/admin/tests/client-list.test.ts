import { describe, expect, it } from 'vitest'

import { moveItemByClientId, omitClientId, omitClientIds } from '../client-list'

describe('omitClientId', () => {
  it('drops clientId and keeps the rest', () => {
    expect(omitClientId({ clientId: 'a', label: 'Home' })).toEqual({ label: 'Home' })
  })
})

describe('omitClientIds', () => {
  it('maps a list without client ids', () => {
    expect(
      omitClientIds([
        { clientId: 'a', label: 'Home' },
        { clientId: 'b', label: 'Work' },
      ])
    ).toEqual([{ label: 'Home' }, { label: 'Work' }])
  })
})

describe('moveItemByClientId', () => {
  const items = [
    { clientId: 'a', label: 'A' },
    { clientId: 'b', label: 'B' },
    { clientId: 'c', label: 'C' },
  ]

  it('moves an item up', () => {
    expect(moveItemByClientId(items, 'b', 'up')?.map((item) => item.clientId)).toEqual([
      'b',
      'a',
      'c',
    ])
  })

  it('returns null at the list edges', () => {
    expect(moveItemByClientId(items, 'a', 'up')).toBeNull()
    expect(moveItemByClientId(items, 'c', 'down')).toBeNull()
    expect(moveItemByClientId(items, 'missing', 'down')).toBeNull()
  })
})
