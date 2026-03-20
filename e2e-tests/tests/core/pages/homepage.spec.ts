import { expect, test } from '@playwright/test'
import {
  blockSlowScripts,
  NavigationHelper,
} from '../../../src/helpers/navigation.helper'

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await blockSlowScripts(page)
  })

  test('should redirect unauthenticated users to login', async ({ page }) => {
    await page.goto('/')
    await page.waitForURL(/\/login/, { timeout: 15000 })
    await expect(page).toHaveURL(/\/login$/)
  })

  test('should display navigation on login page', async ({ page }) => {
    await NavigationHelper.navigateToPage(page, '/login')
    await NavigationHelper.dismissOverlays(page)

    await expect(page.getByTestId('navbar')).toBeVisible()
    await expect(page.getByTestId('nav-product')).toBeVisible()
    await expect(page.getByTestId('nav-resources')).toBeVisible()
    await expect(page.getByTestId('nav-about-us')).toBeVisible()
  })
})
