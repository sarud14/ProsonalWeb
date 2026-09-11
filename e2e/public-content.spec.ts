import { expect, test } from '@playwright/test'

function hasDatabase(): boolean {
  return (process.env.DATABASE_URL?.trim() ?? '').length > 0
}

test('visitor opens work from primary nav and reads a case study', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  // Wait until a client island has painted so next/link is hydrated.
  await expect(page.getByText(/engineer\.config/i)).toBeVisible()

  const workNav = page
    .getByRole('navigation', { name: 'Primary' })
    .getByRole('link', { name: 'Work', exact: true })
  await expect(workNav).toHaveAttribute('href', '/work')
  await workNav.click()
  await expect(page).toHaveURL(/\/work\/?$/, { timeout: 30_000 })
  await expect(page.getByRole('heading', { name: 'Selected work' })).toBeVisible()

  const caseLink = page.getByRole('link', { name: /FEOps Kit/i }).first()
  if ((await caseLink.count()) === 0) {
    test.skip(true, 'No published FEOps Kit case study in this content source')
  }
  await expect(caseLink).toBeVisible()
  await caseLink.click()
  await expect(page).toHaveURL(/\/work\/feops-kit\/?/, { timeout: 30_000 })
  await expect(page.getByRole('heading', { name: 'FEOps Kit', level: 1 })).toBeVisible()
})

test('visitor can filter the work list by problem domain', async ({ page }) => {
  await page.goto('/work')

  const filters = page.getByRole('group', { name: 'Problem domain' })
  await expect(filters.getByRole('button', { name: 'ALL' })).toHaveAttribute(
    'aria-pressed',
    'true'
  )

  const architecture = filters.getByRole('button', { name: 'Architecture' })
  if ((await architecture.count()) === 0) {
    test.skip(true, 'Architecture domain filter is not in this content source')
  }
  await architecture.click()
  await expect(architecture).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('link', { name: /FEOps Kit/i })).toBeVisible()
})

test('login page shows admin sign-in, not a completed OAuth session', async ({ page }) => {
  await page.goto('/login')
  await expect(page.getByRole('heading', { name: 'Admin sign-in' })).toBeVisible()
})

test('visitor can submit the contact form', async ({ page }) => {
  test.skip(
    !hasDatabase(),
    'Contact submit writes through Prisma and needs DATABASE_URL'
  )

  await page.goto('/contact')
  await page.getByRole('textbox', { name: 'Name' }).fill('E2E Visitor')
  await page.getByRole('textbox', { name: 'Email' }).fill('e2e-visitor@example.com')
  await page.getByRole('textbox', { name: 'Message' }).fill('Public contact flow from Playwright.')
  await page.getByRole('button', { name: 'Send message' }).click()
  await expect(page.getByRole('status')).toBeVisible()
})
