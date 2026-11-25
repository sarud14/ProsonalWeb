import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'

import { StackPageView } from '../StackPageView'

test('renders each group with its tools and the total tool count', () => {
  render(
    <StackPageView
      data={{
        groups: [
          { label: 'FRAMEWORK', tools: [{ name: 'Next.js', note: 'app router' }, { name: 'React Native', note: 'mobile' }] },
          { label: 'DATA', tools: [{ name: 'Prisma', note: 'orm' }] },
        ],
      }}
    />,
  )
  expect(screen.getByText('FRAMEWORK')).toBeInTheDocument()
  expect(screen.getByText('React Native')).toBeInTheDocument()
  expect(screen.getByText('mobile')).toBeInTheDocument()
  expect(screen.getByText('03 TOOLS')).toBeInTheDocument()
})
