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

test.describe('Auto org switch based on URL', () => {
  test.beforeEach(async ({ page }) => {
    await blockSlowScripts(page)
  })

  test('auto-switches to EO org when navigating to /dashboard/polls with campaign org', async ({
    page,
  }) => {
    await setupElectedOfficeUser(page)
    await page.goto('/dashboard/polls', { waitUntil: 'domcontentloaded' })
    await NavigationHelper.dismissOverlays(page)

    // Record org names
    const eoOrgName = await getSelectedOrgName(page)
    const allOrgs = await getOrgPickerOptions(page)
    const campaignOrgName = allOrgs.find((name) => name !== eoOrgName)!
    expect(campaignOrgName).toBeTruthy()

    // Switch to campaign org (lands on /dashboard)
    await switchOrganization(page, campaignOrgName)
    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 15000 })
    await NavigationHelper.dismissOverlays(page)

    // Now navigate directly to an EO URL while campaign org is selected.
    // serveAccess should auto-switch to the EO org via /api/switch-org.
    await page.goto('/dashboard/polls', { waitUntil: 'domcontentloaded' })
    await NavigationHelper.dismissOverlays(page)

    // Should land on /dashboard/polls (not be redirected to /dashboard)
    await expect(page).toHaveURL(/\/dashboard\/polls/, { timeout: 15000 })

    // EO org should now be selected
    const currentOrg = await getSelectedOrgName(page)
    expect(currentOrg).toBe(eoOrgName)
  })
})
