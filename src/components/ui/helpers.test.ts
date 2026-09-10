import { expect, test } from 'vitest'

import { cn } from './helpers'

test('cn merges tailwind classes and drops conflicts', () => {
  expect(cn('px-2', 'px-4', 'text-foreground')).toBe('px-4 text-foreground')
})

test('cn skips falsy values', () => {
  expect(cn('block', false && 'hidden', undefined, 'text-sm')).toBe(
    'block text-sm'
  )
})
