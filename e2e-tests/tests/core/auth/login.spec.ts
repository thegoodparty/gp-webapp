import { expect, test } from '@playwright/test'
import { NavigationHelper } from '../../../src/helpers/navigation.helper'

test.describe('Login Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await NavigationHelper.navigateToPage(page, '/login')
    await NavigationHelper.dismissOverlays(page)
  })

  test('should display login form elements', async ({ page }) => {
    await expect(page.getByText('Login to GoodParty.org')).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(
      page.getByPlaceholder("Please don't use your dog's"),
    ).toBeVisible() // More specific password field locator
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible()
  })

  test('should show error for invalid credentials', async ({ page }) => {
    const invalidEmail = 'nonexistent@example.com'
    const invalidPassword = 'wrongpassword123'
    await page.getByLabel('Email').fill(invalidEmail)
    await page
      .getByPlaceholder("Please don't use your dog's")
      .fill(invalidPassword)

    const loginButton = page.getByRole('button', { name: 'Login' })
    await expect(loginButton).toBeEnabled()
    await loginButton.click()
    await expect(
      page.getByText(
        'Invalid login. Please check your credentials and try again.',
      ),
    ).toBeVisible()
  })
})
