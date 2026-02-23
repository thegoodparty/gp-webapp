import { expect, test } from '@playwright/test'
import { authenticateTestUser } from 'tests/utils/api-registration'
import { NavigationHelper } from '../../../src/helpers/navigation.helper'
import { WaitHelper } from '../../../src/helpers/wait.helper'
import { visualSnapshot } from '../../../src/helpers/visual.helper'

test.describe('Content Builder', () => {
  test('should access Content Builder page', async ({ page }) => {
    await authenticateTestUser(page)
    await page.goto('/dashboard')
    await NavigationHelper.dismissOverlays(page)
    await page.goto('/dashboard/content')
    await WaitHelper.waitForPageReady(page)
    await WaitHelper.waitForLoadingToComplete(page)
    await expect(
      page.getByRole('heading', { name: 'Content Builder' }),
    ).toBeVisible()
    await expect(page).toHaveURL(/\/dashboard\/content$/)

    await visualSnapshot(page, 'content-builder.png')
    console.log('✅ Content Builder page accessible')
  })
})
