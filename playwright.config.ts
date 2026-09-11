import { defineConfig, devices } from '@playwright/test'

const PORT = Number(process.env.PORT) || 3000
const baseURL = `http://localhost:${PORT}`

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // NavBar primary landmark is `xl:flex` (1280px). Stay above that edge.
        viewport: { width: 1440, height: 900 },
      },
    },
  ],
  webServer: {
    command: process.env.CI ? 'yarn start' : 'yarn dev',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
})
