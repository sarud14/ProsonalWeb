import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'

import { LibraryStatsCard } from '../LibraryStatsCard'

test('lists each library stat', () => {
  render(<LibraryStatsCard stats={[{ label: 'Work', value: 9 }, { label: 'Media', value: 12 }]} />)
  expect(screen.getByText('Work')).toBeInTheDocument()
  expect(screen.getByText('9')).toBeInTheDocument()
  expect(screen.getByText('12')).toBeInTheDocument()
})
