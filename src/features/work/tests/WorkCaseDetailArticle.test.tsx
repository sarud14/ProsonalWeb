import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'

import { workFixture } from '@/test-utils/fixtures'

import { WorkCaseDetailArticle } from '../WorkCaseDetailArticle'
import { getWorkCaseDetail } from '../query/workCaseDetail'

test('renders each case-study section from the detail model', () => {
  const detail = getWorkCaseDetail(workFixture())
  render(<WorkCaseDetailArticle detail={detail} />)
  expect(screen.getByRole('heading', { name: detail.contextHeadline })).toBeInTheDocument()
  expect(screen.getByText(detail.problemCallout)).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: detail.constraintsHeading })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: detail.decisionsHeading })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: detail.impactHeading })).toBeInTheDocument()
  expect(screen.getByText('Impact one.')).toBeInTheDocument()
})
