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

test.describe('Organization Header Propagation', () => {
  test.beforeEach(async ({ page }) => {
    await blockSlowScripts(page)
  })

  test('organization slug cookie is set and updates on switch', async ({
    page,
  }) => {
    await setupWinServeUser(page)
    await page.goto('/dashboard/polls', { waitUntil: 'domcontentloaded' })
    await NavigationHelper.dismissOverlays(page)

    const cookiesBefore = await page.context().cookies()
    const slugCookieBefore = cookiesBefore.find(
      (c) => c.name === 'organization-slug',
    )
    expect(slugCookieBefore).toBeTruthy()
    expect(slugCookieBefore!.value).toBeTruthy()
    expect(slugCookieBefore!.value.length).toBeGreaterThan(10)

    const eoOrgName = await getSelectedOrgName(page)
    const allOrgs = await getOrgPickerOptions(page)
    const campaignOrgName = allOrgs.find((name) => name !== eoOrgName)!
    expect(campaignOrgName).toBeTruthy()

    await switchOrganization(page, campaignOrgName)
    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 15000 })

    const cookiesAfter = await page.context().cookies()
    const slugCookieAfter = cookiesAfter.find(
      (c) => c.name === 'organization-slug',
    )
    expect(slugCookieAfter).toBeTruthy()
    expect(slugCookieAfter!.value).toBeTruthy()
    expect(slugCookieAfter!.value).not.toBe(slugCookieBefore!.value)
  })

  test('switching orgs updates the header on subsequent requests', async ({
    page,
  }) => {
    await setupWinServeUser(page)
    await page.goto('/dashboard/polls', { waitUntil: 'domcontentloaded' })
    await NavigationHelper.dismissOverlays(page)

    const eoOrgName = await getSelectedOrgName(page)
    const allOrgs = await getOrgPickerOptions(page)
    const campaignOrgName = allOrgs.find((name) => name !== eoOrgName)!
    expect(campaignOrgName).toBeTruthy()

    await switchOrganization(page, campaignOrgName)
    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 15000 })

    const cookiesAfter = await page.context().cookies()
    const slugCookie = cookiesAfter.find((c) => c.name === 'organization-slug')
    expect(slugCookie).toBeTruthy()

    const capturedHeaders: string[] = []
    page.on('request', (request) => {
      const url = request.url()
      if (url.includes('/api/') || url.includes('/v1/')) {
        const header = request.headers()['x-organization-slug']
        if (header) {
          capturedHeaders.push(header)
        }
      }
    })

    await page.goto('/dashboard', { waitUntil: 'domcontentloaded' })
    await page.waitForLoadState('networkidle')

    expect(capturedHeaders.length).toBeGreaterThan(0)
    for (const header of capturedHeaders) {
      expect(header).toBe(slugCookie!.value)
    }
  })
})
