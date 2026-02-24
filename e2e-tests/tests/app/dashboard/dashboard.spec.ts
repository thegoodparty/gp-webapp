import { expect, test } from '@playwright/test'
import { authenticateTestUser } from 'tests/utils/api-registration'
import { NavigationHelper } from '../../../src/helpers/navigation.helper'
import { WaitHelper } from '../../../src/helpers/wait.helper'
import { visualSnapshot } from '../../../src/helpers/visual.helper'

test.describe('Dashboard Functionality', () => {
  test('should access dashboard and navigate to app features', async ({
    page,
  }) => {
    console.log(
      `🧪 Testing dashboard functionality with pre-authenticated user`,
    )
    await authenticateTestUser(page)
    await page.goto('/dashboard')
    await NavigationHelper.dismissOverlays(page)

    await expect(page).toHaveURL(/\/dashboard$/)

    const dashboardContent = page.locator('h1, h2, h3, main')
    await expect(dashboardContent.first()).toBeVisible()
    console.log('✅ Dashboard accessible')
    await visualSnapshot(page, 'dashboard.png')

    await page.goto('/dashboard/campaign-assistant')
    await WaitHelper.waitForPageReady(page)
    await expect(
      page.getByRole('heading', { name: 'AI Assistant' }),
    ).toBeVisible()
    console.log('✅ AI Assistant accessible')
    await visualSnapshot(page, 'campaign-assistant.png')

    await page.goto('/profile')
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
