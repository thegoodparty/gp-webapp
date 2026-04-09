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

test.describe('Organization Switcher', () => {
  test.beforeEach(async ({ page }) => {
    await blockSlowScripts(page)
  })

  test('shows both campaign and elected office orgs after winning', async ({
    page,
  }) => {
    await setupElectedOfficeUser(page)
    await page.goto('/dashboard', { waitUntil: 'domcontentloaded' })
    await NavigationHelper.dismissOverlays(page)

    const options = await getOrgPickerOptions(page)
    expect(options).toHaveLength(2)
  })

  test('switching to campaign org routes to /dashboard', async ({ page }) => {
    await setupElectedOfficeUser(page)
    await page.goto('/dashboard/polls', { waitUntil: 'domcontentloaded' })
    await NavigationHelper.dismissOverlays(page)

    // After setup, EO org is selected. Find the other (campaign) org.
    const eoOrgName = await getSelectedOrgName(page)
    const allOrgs = await getOrgPickerOptions(page)
    const campaignOrgName = allOrgs.find((name) => name !== eoOrgName)!
    expect(campaignOrgName).toBeTruthy()

    await switchOrganization(page, campaignOrgName)
    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 15000 })
  })

  test('switching to elected office org routes to /dashboard/polls', async ({
    page,
  }) => {
    await setupElectedOfficeUser(page)
    await page.goto('/dashboard/polls', { waitUntil: 'domcontentloaded' })
    await NavigationHelper.dismissOverlays(page)

    // Get org names dynamically
    const eoOrgName = await getSelectedOrgName(page)
    const allOrgs = await getOrgPickerOptions(page)
    const campaignOrgName = allOrgs.find((name) => name !== eoOrgName)!

    // Switch to campaign first
    await switchOrganization(page, campaignOrgName)
    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 15000 })
    await NavigationHelper.dismissOverlays(page)

    // Switch back to EO
    await switchOrganization(page, eoOrgName)
    await expect(page).toHaveURL(/\/dashboard\/polls/, { timeout: 15000 })
  })

  test('org selection persists across page reload', async ({ page }) => {
    await setupElectedOfficeUser(page)
    await page.goto('/dashboard/polls', { waitUntil: 'domcontentloaded' })
    await NavigationHelper.dismissOverlays(page)

    // Get org names dynamically and switch to campaign
    const eoOrgName = await getSelectedOrgName(page)
    const allOrgs = await getOrgPickerOptions(page)
    const campaignOrgName = allOrgs.find((name) => name !== eoOrgName)!

    await switchOrganization(page, campaignOrgName)
    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 15000 })
    await NavigationHelper.dismissOverlays(page)

    const selectedBefore = await getSelectedOrgName(page)

    await page.reload({ waitUntil: 'domcontentloaded' })
    await NavigationHelper.dismissOverlays(page)

    const selectedAfter = await getSelectedOrgName(page)
    expect(selectedAfter).toBe(selectedBefore)
  })
})
