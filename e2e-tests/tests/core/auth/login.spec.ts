import { expect, test } from '@playwright/test'
import { setupClerkTestingToken } from '@clerk/testing/playwright'
import {
  blockSlowScripts,
  NavigationHelper,
} from '../../../src/helpers/navigation.helper'
import { visualSnapshot } from '../../../src/helpers/visual.helper'
import { getClerkContinueButton } from '../../../src/helpers/clerk.helper'
import { authenticateTestUser } from 'tests/utils/api-registration'
import { wait } from 'tests/utils/eventually'

test.describe('Login Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await blockSlowScripts(page)
    await setupClerkTestingToken({ page })
    await NavigationHelper.navigateToPage(page, '/login')
    await NavigationHelper.dismissOverlays(page)
  })

  test('should display login form elements', async ({ page }) => {
    // Clerk's <SignIn /> renders its own UI
    await expect(page.locator('.cl-signIn-root')).toBeVisible()
    await expect(page.getByLabel(/email/i).first()).toBeVisible()
    await expect(getClerkContinueButton(page)).toBeVisible()

    await visualSnapshot(page, 'login-page.png')
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await page.getByLabel(/email/i).first().fill('nonexistent@example.com')
    await getClerkContinueButton(page).click()

    // Clerk shows an error for non-existent accounts
    await expect(page.locator('.cl-formFieldErrorText').first()).toBeVisible({
      timeout: 5000,
    })

    await visualSnapshot(page, 'login-error-state.png')
  })

  test('should login and redirect to dashboard', async ({ page }) => {
    const { user } = await authenticateTestUser(page)

    await page.evaluate(() => window.Clerk?.signOut())
    await page.waitForLoadState('networkidle')

    await NavigationHelper.navigateToPage(page, '/login')
    await NavigationHelper.dismissOverlays(page)

    await page.getByLabel(/email/i).first().fill(user.email)
    await getClerkContinueButton(page).click()

    await page
      .getByLabel(/password/i)
      .first()
      .fill(user.password, { timeout: 10000 })
    await getClerkContinueButton(page).click()

    await page.waitForURL('**/dashboard', { timeout: 5000 })
    await wait(500)
    await expect(page.getByText('Campaign Progress')).toBeVisible()
  })
})
