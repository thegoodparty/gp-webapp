import { expect, test } from '@playwright/test'
import { setupClerkTestingToken } from '@clerk/testing/playwright'
import { TestDataHelper } from '../../../src/helpers/data.helper'
import {
  blockSlowScripts,
  NavigationHelper,
} from '../../../src/helpers/navigation.helper'

// Reset storage state for auth tests to avoid being pre-authenticated
test.use({ storageState: { cookies: [], origins: [] } })

test.describe('Sign Up Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await setupClerkTestingToken({ page })
    await blockSlowScripts(page)
    await NavigationHelper.navigateToPage(page, '/sign-up')
    await NavigationHelper.dismissOverlays(page)
    await page.waitForSelector('.cl-signUp-root', { state: 'attached'})
  })

  test('should display sign up form elements', async ({ page }) => {    
    await expect(page.locator('.cl-signUp-root')).toBeVisible()
    const firstNameVisible = await page.locator('input[name=firstName]').isVisible()
    const lastNameVisible = await page.locator('input[name=lastName]').isVisible()
    const emailVisible = await page.locator('input[name=emailAddress]').isVisible()
    const passwordVisible = await page.locator('input[name=password]').isVisible()
    const continueButtonVisible = await page.getByRole('button', { name: /^continue$/i }).isVisible()
    
    expect(firstNameVisible).toBeTruthy()
    expect(lastNameVisible).toBeTruthy()
    expect(emailVisible).toBeTruthy()
    expect(passwordVisible).toBeTruthy()
    expect(continueButtonVisible).toBeTruthy()
  })

  test('should successfully sign up and redirect to onboarding', async ({ page }) => {
    const testUserData = TestDataHelper.generateTestUserData()

    const firstNameVisible = await page.locator('input[name=firstName]').isVisible()
    console.log('FirstName visible:', firstNameVisible)
    const lastNameVisible = await page.locator('input[name=lastName]').isVisible()
    console.log('LastName visible:', lastNameVisible)
    const emailVisible = await page.locator('input[name=emailAddress]').isVisible()
    console.log('Email visible:', emailVisible)
    const passwordVisible = await page.locator('input[name=password]').isVisible()
    console.log('Password visible:', passwordVisible)
    const continueButtonVisible = await page.getByRole('button', { name: /^continue$/i }).isVisible()

    
    if (firstNameVisible) {
      const firstNameField = page.locator('input[name=firstName]')
      await firstNameField.fill(testUserData.firstName)
    }

    if (lastNameVisible) {
      const lastNameField = page.locator('input[name=lastName]')
      await lastNameField.fill(testUserData.lastName)
    }

    await page
      .locator('input[name=emailAddress]')
      .fill(testUserData.email)
    await page
      .locator('input[name=password]')
      .fill(testUserData.password)

    const continueBtn = page.getByRole('button', {
      name: 'Continue',
      exact: true,
    })

    console.log(
      'Continue button visible:',
      continueButtonVisible,
    )
    console.log(
      'Continue button enabled:',
      await continueBtn.isEnabled(),
    )
    console.log(
      'Continue button text:',
      await continueBtn.textContent(),
    )

    const urlBefore = page.url()
    console.log('URL before click:', urlBefore)

    await continueBtn.click()
    console.log('Click executed')

    await page.waitForTimeout(2000)
    const urlAfter = page.url()
    console.log('URL after click:', urlAfter)
    console.log(
      'URL changed:',
      urlBefore !== urlAfter,
    )

    await page.waitForURL('**/onboarding**', { timeout: 10000 })
  })
})
