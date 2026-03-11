import { expect, test } from '@playwright/test'
import { setupClerkTestingToken } from '@clerk/testing/playwright'
import { TestDataHelper } from '../../../src/helpers/data.helper'
import { NavigationHelper } from '../../../src/helpers/navigation.helper'

// Reset storage state for auth tests to avoid being pre-authenticated
test.use({ storageState: { cookies: [], origins: [] } })

test.describe('Sign Up Functionality', () => {
  test('should display sign up form elements', async ({ page }) => {
    await setupClerkTestingToken({ page })
    await NavigationHelper.navigateToPage(page, '/sign-up')
    await NavigationHelper.dismissOverlays(page)

    // Clerk's <SignUp /> renders its own UI
    await expect(page.locator('.cl-signUp-root')).toBeVisible()
    await expect(page.getByLabel(/first name/i).first()).toBeVisible()
    await expect(page.getByLabel(/last name/i).first()).toBeVisible()
    await expect(page.getByLabel(/email/i).first()).toBeVisible()
    await expect(page.getByLabel(/password/i).first()).toBeVisible()
    await expect(page.getByRole('button', { name: /continue/i })).toBeVisible()
  })

  test('should validate and process form data correctly', async ({ page }) => {
    await setupClerkTestingToken({ page })
    await NavigationHelper.navigateToPage(page, '/sign-up')
    await NavigationHelper.dismissOverlays(page)

    const testUser = TestDataHelper.generateTestUser()

    await page
      .getByLabel(/first name/i)
      .first()
      .fill(` ${testUser.firstName}`)
    await page
      .getByLabel(/last name/i)
      .first()
      .fill(` ${testUser.lastName}`)
    await page.getByLabel(/email/i).first().fill(testUser.email)
    await page
      .getByLabel(/password/i)
      .first()
      .fill(testUser.password)
    await page.getByRole('button', { name: /continue/i }).click()

    // After successful Clerk signup, user is redirected to onboarding
    await expect(page).toHaveURL(/\/onboarding/, { timeout: 45000 })
  })
})
