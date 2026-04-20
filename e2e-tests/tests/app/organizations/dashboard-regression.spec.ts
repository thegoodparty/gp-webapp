import { expect, test } from '@playwright/test'
import {
  setupElectedOfficeUser,
  switchOrganization,
  getSelectedOrgName,
  getOrgPickerOptions,
} from 'src/helpers/organizations'
import {
  blockSlowScripts,
  NavigationHelper,
} from 'src/helpers/navigation.helper'
import { WaitHelper } from 'src/helpers/wait.helper'

test.describe('Dashboard Regression with Elected Office', () => {
  test.beforeEach(async ({ page }) => {
    await blockSlowScripts(page)
  })

  test('campaign pages remain accessible under campaign org', async ({
    page,
  }) => {
    await setupElectedOfficeUser(page)
    await page.goto('/dashboard/polls', { waitUntil: 'domcontentloaded' })
    await NavigationHelper.dismissOverlays(page)

    const eoOrgName = await getSelectedOrgName(page)
    const allOrgs = await getOrgPickerOptions(page)
    const campaignOrgName = allOrgs.find((name) => name !== eoOrgName)!
    expect(campaignOrgName).toBeTruthy()

    await switchOrganization(page, campaignOrgName)
    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 15000 })
    await WaitHelper.waitForPageReady(page)

    await expect(page.locator('main')).toBeVisible({ timeout: 10000 })

    await page.goto('/dashboard/campaign-assistant', {
      waitUntil: 'domcontentloaded',
    })
    await WaitHelper.waitForPageReady(page)
    await expect(
      page.getByRole('heading', { name: 'AI Assistant' }),
    ).toBeVisible({ timeout: 10000 })

    await page.goto('/dashboard/profile', { waitUntil: 'domcontentloaded' })
    await WaitHelper.waitForPageReady(page)
    await expect(
      page.getByRole('heading', { name: 'Contact Information' }),
    ).toBeVisible({ timeout: 10000 })
  })

  test('polls page accessible under elected office org', async ({ page }) => {
    await setupElectedOfficeUser(page)
    await page.goto('/dashboard/polls', { waitUntil: 'domcontentloaded' })
    await WaitHelper.waitForPageReady(page)
    await NavigationHelper.dismissOverlays(page)

    await expect(page).toHaveURL(/\/dashboard\/polls/)
    await expect(page.locator('main')).toBeVisible({ timeout: 10000 })
  })

  test('contacts page loads under elected office org', async ({ page }) => {
    await setupElectedOfficeUser(page)
    await page.goto('/dashboard/contacts', { waitUntil: 'domcontentloaded' })
    await WaitHelper.waitForPageReady(page)
    await NavigationHelper.dismissOverlays(page)

    await expect(
      page.getByRole('heading', { name: 'Constituents' }),
    ).toBeVisible({ timeout: 10000 })

    const table = page.locator('table')
    await expect(table).toBeVisible({ timeout: 15000 })

    const firstRow = table.locator('tbody tr').first()
    await expect(firstRow).toBeVisible({ timeout: 10000 })
    await expect(firstRow).toHaveText(/.+/)
  })
})
