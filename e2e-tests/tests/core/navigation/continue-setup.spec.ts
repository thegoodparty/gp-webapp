import { expect, test } from '@playwright/test'
import { setupClerkTestingToken } from '@clerk/testing/playwright'
import { TestDataHelper } from '../../../src/helpers/data.helper'
import {
  blockSlowScripts,
  NavigationHelper,
} from '../../../src/helpers/navigation.helper'

test.describe('Continue Setup button', () => {
  test.beforeEach(async ({ page }) => {
    await blockSlowScripts(page)
  })

  test('should link to office selection when user bails before selecting an office', async ({
    page,
  }) => {
    await setupClerkTestingToken({ page })
    const testUser = TestDataHelper.generateTestUser()

    await page.goto('/sign-up')
    await NavigationHelper.dismissOverlays(page)

    // Fill Clerk's <SignUp /> form
    await page
      .getByLabel(/first name/i)
      .first()
      .fill(testUser.firstName)
    await page
      .getByLabel(/last name/i)
      .first()
      .fill(testUser.lastName)
    await page.getByLabel(/email/i).first().fill(testUser.email)
    await page
      .getByLabel(/password/i)
      .first()
      .fill(testUser.password)
    await page.getByRole('button', { name: /continue/i }).click()

    await page.waitForURL((url) => url.toString().includes('/onboarding/'), {
      timeout: 45000,
    })

    // Bail before selecting an office by navigating away
    await NavigationHelper.navigateToPage(page, '/blog')
    await NavigationHelper.dismissOverlays(page)

    // Assert takes you back to office selection
    const continueButton = page.getByText('Continue Setup')
    await expect(continueButton).toBeVisible()
    await expect(continueButton).toHaveAttribute(
      'href',
      '/onboarding/office-selection',
    )
    await continueButton.click()
    await expect(page.getByText("Let's find your office")).toBeVisible()
  })
})
