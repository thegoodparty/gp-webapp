import { expect, type Page, test } from '@playwright/test'
import { setupClerkTestingToken } from '@clerk/testing/playwright'
import {
  blockSlowScripts,
  NavigationHelper,
} from '../../../src/helpers/navigation.helper'
import { fillClerkSignUpForm } from '../../../src/helpers/clerk.helper'

test.use({ storageState: { cookies: [], origins: [] } })

const signUpTestUser = async (page: Page): Promise<string> => {
  await setupClerkTestingToken({ page })

  await page.goto('/sign-up')
  await NavigationHelper.dismissOverlays(page)

  await fillClerkSignUpForm(page)

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
})
