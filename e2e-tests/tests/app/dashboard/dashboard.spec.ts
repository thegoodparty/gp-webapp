import { expect, test, type Page } from '@playwright/test'
import {
  authenticateTestUser,
  ensureCampaignOrganizationCookie,
} from 'tests/utils/api-registration'
import {
  blockSlowScripts,
  NavigationHelper,
} from '../../../src/helpers/navigation.helper'
import { WaitHelper } from '../../../src/helpers/wait.helper'
import { visualSnapshot } from '../../../src/helpers/visual.helper'

/**
 * Greeting line after client campaign/user hydration (HeaderSection).
 * Avoids matching unrelated h1s; works with legacy layout and sidebar inset.
 */
function campaignPageGreetingHeading(page: Page) {
  return page
    .getByRole('heading', { level: 1 })
    .filter({ hasText: /Hello|until|General|Primary|Election|concluded/ })
    .first()
}

test.describe('Dashboard Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await blockSlowScripts(page)
  })

  test('should access dashboard and navigate to app features', async ({
    page,
  }) => {
    test.setTimeout(120000)
    console.log(
      `🧪 Testing dashboard functionality with pre-authenticated user`,
    )
    const { client } = await authenticateTestUser(page)
    await ensureCampaignOrganizationCookie(page, client)
    await page.goto('/dashboard')
    await page.waitForURL(/\/dashboard/)
    await NavigationHelper.dismissOverlays(page)

    await expect(page).toHaveURL(/\/dashboard$/)

    await expect(campaignPageGreetingHeading(page)).toBeVisible({
      timeout: 90000,
    })
    console.log('✅ Dashboard accessible')
    await visualSnapshot(page, 'dashboard.png', {
      mask: [
        // Greeting / election line changes with date and copy experiments
        campaignPageGreetingHeading(page),
      ],
    })

    await page.goto('/dashboard/campaign-assistant')
    await WaitHelper.waitForPageReady(page)
    await expect(
      page.getByRole('heading', { name: 'AI Assistant' }),
    ).toBeVisible({ timeout: 60000 })
    console.log('✅ AI Assistant accessible')
    await visualSnapshot(page, 'campaign-assistant.png')

    await page.goto('/dashboard/profile')
    await WaitHelper.waitForPageReady(page)
    await expect(
      page.getByRole('heading', { name: 'Personal Information' }).first(),
    ).toBeVisible()
    console.log('✅ Profile accessible')
    await visualSnapshot(page, 'profile.png', {
      mask: [
        page.getByTestId('personal-first-name'),
        page.getByTestId('personal-last-name'),
        page.getByTestId('personal-email'),
        page.getByTestId('personal-phone'),
        page.getByTestId('personal-zip'),
      ],
    })
  })
})
