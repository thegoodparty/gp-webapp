import type { Locator, Page } from '@playwright/test'

export const getClerkContinueButton = (page: Page): Locator =>
  page.getByRole('button', { name: /^continue$/i })
