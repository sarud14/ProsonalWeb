import { expect, test, type Page } from '@playwright/test'

function isCmsDbEnabled(): boolean {
  const databaseUrl = process.env.DATABASE_URL?.trim() ?? ''
  return databaseUrl.length > 0 && process.env.CONTENT_SOURCE === 'db'
}

async function openUngatedNewWork(page: Page): Promise<boolean> {
  await page.goto('/admin/work/new')
  if (page.url().includes('/login')) {
    return false
  }

  await expect(page.getByRole('heading', { name: 'New work' })).toBeVisible()
  return true
}

async function fillRequiredWorkFields(
  page: Page,
  slug: string,
  title: string
): Promise<void> {
  const field = (label: string) =>
    page.getByRole('textbox', { name: `${label} *`, exact: true })

  await field('Slug').fill(slug)
  await field('Title').fill(title)
  await field('Role').fill('FE')
  await field('Tagline').fill('E2E published case study.')
  await field('Metric').fill('1')
  await field('Metric label').fill('TEST')
  await field('Year').fill('2026')
  await page.getByRole('textbox', { name: 'Stack' }).fill('Playwright')
  await page.getByRole('textbox', { name: 'Stack' }).press('Enter')
  await field('Context').fill('Critical CMS publish path.')
  await field('Problem').fill('Public pages must reflect a published draft.')
  await field('Constraints').fill('Single admin session.')
  await field('Architecture').fill('Server Actions write through the DAL.')
  await field('Decisions').fill('E2E covers ungated admin then publish.')
  await field('Impact').fill('The public work page shows the new title.')
}

test.describe('CMS work publish flow', () => {
  test.beforeEach(() => {
    test.skip(
      !isCmsDbEnabled(),
      'CMS work e2e needs CONTENT_SOURCE=db and DATABASE_URL'
    )
  })

  test('ungated admin can publish work to the public case-study page', async ({
    page,
  }) => {
    if (!(await openUngatedNewWork(page))) {
      test.skip(true, 'Admin is gated; OAuth login is not automated')
    }

    const slug = `e2e-work-${Date.now()}`
    const title = `E2E Work ${slug}`

    await fillRequiredWorkFields(page, slug, title)
    await page.getByRole('button', { name: 'Publish' }).click()
    await page.waitForURL('**/admin/work', { timeout: 30_000 })

    const response = await page.goto(`/work/${slug}`)
    expect(response?.ok()).toBe(true)
    await expect(page.getByRole('heading', { name: title, level: 1 })).toBeVisible()
  })

  test('ungated admin draft work is not on the public case-study page', async ({
    page,
  }) => {
    if (!(await openUngatedNewWork(page))) {
      test.skip(true, 'Admin is gated; OAuth login is not automated')
    }

    const slug = `e2e-draft-${Date.now()}`
    const title = `E2E Draft ${slug}`

    await fillRequiredWorkFields(page, slug, title)
    await page.getByRole('button', { name: 'Save draft' }).click()
    await page.waitForURL('**/admin/work', { timeout: 30_000 })

    const response = await page.goto(`/work/${slug}`)
    expect(response?.status()).toBe(404)
    await expect(page.getByRole('heading', { name: title, level: 1 })).toHaveCount(0)
  })
})
