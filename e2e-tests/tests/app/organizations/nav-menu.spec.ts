import { expect, test } from '@playwright/test'
import {
  setupWinServeUser,
  switchOrganization,
  getSelectedOrgName,
  getOrgPickerOptions,
} from 'src/helpers/organizations'
import {
  blockSlowScripts,
  NavigationHelper,
} from 'src/helpers/navigation.helper'

test.describe('Navigation Menu by Org Type', () => {
  test.beforeEach(async ({ page }) => {
    await blockSlowScripts(page)
  })

  test('campaign org shows campaign menu items', async ({ page }) => {
    await setupWinServeUser(page)
    await page.goto('/dashboard/polls', { waitUntil: 'domcontentloaded' })
    await NavigationHelper.dismissOverlays(page)

    // Switch to campaign org
    const eoOrgName = await getSelectedOrgName(page)
    const allOrgs = await getOrgPickerOptions(page)
    const campaignOrgName = allOrgs.find((name) => name !== eoOrgName)!
    expect(campaignOrgName).toBeTruthy()

    await switchOrganization(page, campaignOrgName)
    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 15000 })
    await NavigationHelper.dismissOverlays(page)

    const sidebar = page.locator('[data-sidebar="content"]')

    await expect(sidebar.getByText('Dashboard')).toBeVisible({ timeout: 10000 })
    await expect(sidebar.getByText('Voter Outreach')).toBeVisible()
    await expect(sidebar.getByText('Website')).toBeVisible()
    await expect(sidebar.getByText('AI Assistant')).toBeVisible()
    await expect(sidebar.getByText('Content Builder')).toBeVisible()

    await expect(sidebar.getByText('Constituents')).not.toBeVisible()
    await expect(sidebar.getByText('Polls')).not.toBeVisible()
  })

  test('elected office org shows serve menu items', async ({ page }) => {
    await setupWinServeUser(page)
    await page.goto('/dashboard/polls', { waitUntil: 'domcontentloaded' })
    await NavigationHelper.dismissOverlays(page)

    const sidebar = page.locator('[data-sidebar="content"]')

    await expect(sidebar.getByText('Constituents')).toBeVisible({
      timeout: 10000,
    })
    await expect(sidebar.getByText('Polls')).toBeVisible()

    await expect(sidebar.getByText('Dashboard')).not.toBeVisible()
    await expect(sidebar.getByText('Voter Outreach')).not.toBeVisible()
    await expect(sidebar.getByText('Website')).not.toBeVisible()
    await expect(sidebar.getByText('AI Assistant')).not.toBeVisible()
    await expect(sidebar.getByText('Content Builder')).not.toBeVisible()
  })
})
