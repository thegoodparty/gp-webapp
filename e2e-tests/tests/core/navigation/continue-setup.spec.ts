import { expect, type Page, test } from '@playwright/test'
import { setupClerkTestingToken } from '@clerk/testing/playwright'
import { TestDataHelper } from '../../../src/helpers/data.helper'
import {
  blockSlowScripts,
  NavigationHelper,
} from '../../../src/helpers/navigation.helper'
import { getClerkContinueButton } from '../../../src/helpers/clerk.helper'

test.use({ storageState: { cookies: [], origins: [] } })

const signUpTestUser = async (page: Page): Promise<string> => {
  await setupClerkTestingToken({ page })
  const testUser = TestDataHelper.generateTestUserData()

  await page.goto('/sign-up')
  await NavigationHelper.dismissOverlays(page)

  await page.getByLabel(/email/i).first().fill(testUser.email)
  await page
    .getByLabel(/password/i)
    .first()
    .fill(testUser.password)
  await getClerkContinueButton(page).click()

  await page.waitForURL((url) => url.toString().includes('/onboarding/'), {
    timeout: 45000,
  })

  return page.url()
}

test.describe('Onboarding redirect persistence', () => {
  test.beforeEach(async ({ page }) => {
    await blockSlowScripts(page)
  })

  test('should redirect back to onboarding after bailing and returning', async ({
    page,
  }) => {
    const onboardingUrl = await signUpTestUser(page)

    await page.goto('https://goodparty.org/blog')

    await page.goto('/login')
    await page.waitForURL((url) => url.toString().includes('/onboarding/'), {
      timeout: 5000,
    })
    expect(page.url()).toBe(onboardingUrl)

    await page.goto('https://goodparty.org/blog')

    await page.goto('/')
    await page.waitForURL((url) => url.toString().includes('/onboarding/'), {
      timeout: 5000,
    })
    expect(page.url()).toBe(onboardingUrl)
  })

  test('Finish Later should log out and redirect to blog', async ({ page }) => {
    await signUpTestUser(page)

    const finishLater = page.getByText('Finish Later')
    await expect(finishLater).toBeVisible()
    await finishLater.click()

    await page.waitForURL(
      (url) =>
        !url.toString().includes('localhost') && url.pathname === '/blog',
      { timeout: 5000 },
    )

    await page.goto('/dashboard')
    await page.waitForURL((url) => url.toString().includes('/login'), {
      timeout: 5000,
    })
  })
})
