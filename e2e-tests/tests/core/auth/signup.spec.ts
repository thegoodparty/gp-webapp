import { expect, test } from '@playwright/test'
import { setupClerkTestingToken } from '@clerk/testing/playwright'
import {
  blockSlowScripts,
  NavigationHelper,
} from '../../../src/helpers/navigation.helper'
import {
  fillClerkSignUpForm,
  getClerkContinueButton,
} from '../../../src/helpers/clerk.helper'

test.use({ storageState: { cookies: [], origins: [] } })

test.describe('Sign Up Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await setupClerkTestingToken({ page })
    await blockSlowScripts(page)
    await NavigationHelper.navigateToPage(page, '/sign-up')
    await NavigationHelper.dismissOverlays(page)
    await page.waitForSelector('.cl-signUp-root', { state: 'attached' })
  })

  test('should display sign up form elements', async ({ page }) => {
    await expect(page.locator('.cl-signUp-root')).toBeVisible()
    const firstNameVisible = await page
      .locator('input[name=firstName]')
      .isVisible()
    const lastNameVisible = await page
      .locator('input[name=lastName]')
      .isVisible()
    const emailVisible = await page
      .locator('input[name=emailAddress]')
      .isVisible()
    const passwordVisible = await page
      .locator('input[name=password]')
      .isVisible()
    const continueButtonVisible = await getClerkContinueButton(page).isVisible()

    expect(firstNameVisible).toBeTruthy()
    expect(lastNameVisible).toBeTruthy()
    expect(emailVisible).toBeTruthy()
    expect(passwordVisible).toBeTruthy()
    expect(continueButtonVisible).toBeTruthy()
  })

  test('should successfully sign up and redirect to onboarding', async ({
    page,
  }) => {
    await fillClerkSignUpForm(page)
    await page.waitForTimeout(2000)
    await page.waitForURL('**/onboarding**', { timeout: 10000 })
  })
})
