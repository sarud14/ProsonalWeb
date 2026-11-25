import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'

import { CodeTypingBlock } from '../CodeTypingBlock'

test('shows the config filename in the editor header', () => {
  render(
    <CodeTypingBlock
      config={{
        codeFilename: 'developer.config.ts',
        codeRole: 'Frontend Developer',
        codeStack: ['Next.js'],
        codeDomains: ['cms'],
        codeFocus: 'frontend-platform',
        codeStatus: 'available',
      }}
    />,
  )
  expect(screen.getByText('developer.config.ts')).toBeInTheDocument()
})
