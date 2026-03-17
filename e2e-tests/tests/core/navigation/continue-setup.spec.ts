import { expect, test } from '@playwright/test'
import { TestDataHelper } from '../../../src/helpers/data.helper'
import { NavigationHelper } from '../../../src/helpers/navigation.helper'

test.describe('Continue Setup button', () => {
  test('should link to office selection when user bails before selecting an office', async ({
    page,
  }) => {
    const testUser = TestDataHelper.generateTestUser()

    await page.goto('/sign-up')
    await NavigationHelper.dismissOverlays(page)

    await page
      .getByRole('textbox', { name: 'First Name' })
      .fill(testUser.firstName)
    await page
      .getByRole('textbox', { name: 'Last Name' })
      .fill(testUser.lastName)
    await page.getByRole('textbox', { name: 'email' }).fill(testUser.email)
    await page.getByRole('textbox', { name: 'phone' }).fill(testUser.phone)
    await page.getByRole('textbox', { name: 'Zip Code' }).fill(testUser.zipCode)
    await page
      .getByPlaceholder("Please don't use your dog's name")
      .fill(testUser.password)

    const joinButton = page.getByRole('button', { name: 'Join' })
    await joinButton.waitFor({ state: 'visible' })
    await joinButton.click()

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
