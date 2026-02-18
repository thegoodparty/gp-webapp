import { expect, test } from '@playwright/test'
import { authenticateTestUser } from 'tests/utils/api-registration'
import { NavigationHelper } from '../../../src/helpers/navigation.helper'
import { visualSnapshot } from '../../../src/helpers/visual.helper'

test.describe('Resources Functionality', () => {
  test('should display resources page with guides and templates @experimental', async ({
    page,
  }) => {
    await authenticateTestUser(page)
    await page.goto('/dashboard')
    await NavigationHelper.dismissOverlays(page)
    await page.goto('/dashboard/resources')

    await expect(page).toHaveURL(/\/dashboard\/resources$/)
    await expect(page.getByRole('heading', { name: 'Guides' })).toBeVisible()
    await expect(
      page.getByRole('link', { name: /Campaign Playbook/ }),
    ).toBeVisible()
    await expect(
      page.getByRole('link', { name: /Launch Checklist/ }),
    ).toBeVisible()
    await expect(
      page.getByRole('link', { name: /GOTV Checklist/ }),
    ).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Templates' })).toBeVisible()
    await expect(page.getByRole('link', { name: /Social Media/ })).toBeVisible()
    await expect(page.getByRole('link', { name: /Meta Ads/ })).toBeVisible()
    await expect(page.getByRole('link', { name: /Yard Signs/ })).toBeVisible()

    await visualSnapshot(page, 'resources-page.png')
  })
})
