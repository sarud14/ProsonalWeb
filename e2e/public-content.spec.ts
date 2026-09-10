import { expect, test } from '@playwright/test'

test('home exposes primary navigation', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible()
})

test('work index renders the route heading', async ({ page }) => {
  await page.goto('/work')
  await expect(page.getByRole('heading', { name: 'Selected work' })).toBeVisible()
})

test('login page renders the admin sign-in heading', async ({ page }) => {
  await page.goto('/login')
  await expect(page.getByRole('heading', { name: 'Admin sign-in' })).toBeVisible()
})
