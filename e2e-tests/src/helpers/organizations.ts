import type { Page } from '@playwright/test'

export const switchOrganization = async (
  page: Page,
  orgNameSubstring: string,
) => {
  const trigger = page
    .locator('[data-sidebar="header"]')
    .getByRole('button')
    .first()
  await trigger.click()

  const item = page.getByRole('menuitem', { name: orgNameSubstring })
  await item.click()

  await page.waitForLoadState('domcontentloaded')
}
