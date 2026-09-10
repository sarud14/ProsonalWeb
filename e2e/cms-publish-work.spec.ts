import { expect, test, type Page } from '@playwright/test'

function isCmsDbEnabled(): boolean {
  const databaseUrl = process.env.DATABASE_URL?.trim() ?? ''
  return databaseUrl.length > 0 && process.env.CONTENT_SOURCE === 'db'
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
  // exact: true — getByLabel('Metric') also matches "Metric label *"
  await field('Metric').fill('1')
  await field('Metric label').fill('TEST')
  await page.getByPlaceholder('Add stack item…').fill('Playwright')
  await page.getByPlaceholder('Add stack item…').press('Enter')
  await field('Context').fill('Critical CMS publish path.')
  await field('Problem').fill('Public pages must reflect a published draft.')
  await field('Constraints').fill('Single admin session.')
  await field('Architecture').fill('Server Actions write through the DAL.')
  await field('Decisions').fill('E2E covers login-or-ungated admin then publish.')
  await field('Impact').fill('The public work page shows the new title.')
}

test('login then publish work appears on the public case-study page', async ({ page }) => {
  test.skip(
    !isCmsDbEnabled(),
    'CMS publish e2e needs CONTENT_SOURCE=db and DATABASE_URL'
  )

  await page.goto('/login')
  await expect(page.getByRole('heading', { name: 'Admin sign-in' })).toBeVisible()

  const slug = `e2e-work-${Date.now()}`
  const title = `E2E Work ${slug}`

  await page.goto('/admin/work/new')
  if (page.url().includes('/login')) {
    test.skip(true, 'Admin is gated; OAuth login is not automated')
  }

  await expect(page.getByRole('heading', { name: 'New work' })).toBeVisible()
  await fillRequiredWorkFields(page, slug, title)
  await page.getByRole('button', { name: 'Publish' }).click()
  await page.waitForURL('**/admin/work', { timeout: 30_000 })

  await page.goto(`/work/${slug}`)
  await expect(page.getByRole('heading', { name: title, level: 1 })).toBeVisible()
})
