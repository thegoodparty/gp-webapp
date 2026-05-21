import { expect, test } from '@playwright/test'
import { authenticateTestUser } from 'tests/utils/api-registration'
import {
  blockSlowScripts,
  NavigationHelper,
} from '../../../src/helpers/navigation.helper'
import { WaitHelper } from '../../../src/helpers/wait.helper'
import { visualSnapshot } from '../../../src/helpers/visual.helper'

test.describe('Profile Management', () => {
  test.beforeEach(async ({ page }) => {
    await blockSlowScripts(page)
  })

  test('should access profile page', async ({ page }) => {
    test.setTimeout(120000)
    await authenticateTestUser(page)
    await page.goto('/dashboard')
    await NavigationHelper.dismissOverlays(page)

    await page.goto('/dashboard/profile')
    await page.waitForURL(/\/dashboard\/profile/)
    await WaitHelper.waitForPageReady(page)
    await expect(
      page.getByRole('heading', { name: 'Contact Information' }).first(),
    ).toBeVisible({ timeout: 5000 })
    await expect(page).toHaveURL(/\/profile$/)

    const personalFields = page.locator('[data-testid*="personal"]')
    const fieldCount = await personalFields.count()

    if (fieldCount > 0) {
      await expect(personalFields.first()).toBeVisible()
      console.log(`✅ Profile accessible with ${fieldCount} personal fields`)
    }

    // Mask personal info fields — content varies per test user
    await visualSnapshot(page, 'profile-page.png', {
      mask: [page.locator('input, [data-testid*="personal"]')],
    })
  })
})
