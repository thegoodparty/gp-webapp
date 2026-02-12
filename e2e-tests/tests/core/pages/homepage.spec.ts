import { expect, test } from '@playwright/test'
import { NavigationHelper } from '../../../src/helpers/navigation.helper'

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await NavigationHelper.navigateToPage(page, '/')
    await NavigationHelper.dismissOverlays(page)
  })

  test('should display homepage elements', async ({ page }) => {
    await expect(page).toHaveTitle(/GoodParty/)

    await expect(page.getByTestId('navbar')).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()

    await expect(
      page.getByText('Join the GoodParty.org Community'),
    ).toBeVisible()
  })

  test('should have working navigation links', async ({ page }) => {
    await expect(page.getByTestId('nav-product')).toBeVisible()
    await expect(page.getByTestId('nav-resources')).toBeVisible()
    await expect(page.getByTestId('nav-about-us')).toBeVisible()
  })
})
