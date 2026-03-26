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

test.describe('Contacts Organization Scoping', () => {
  test.beforeEach(async ({ page }) => {
    await blockSlowScripts(page)
  })

  test('hides Political Party field for elected office org', async ({
    page,
  }) => {
    await setupWinServeUser(page)
    await page.goto('/dashboard/contacts', { waitUntil: 'domcontentloaded' })
    await NavigationHelper.dismissOverlays(page)

    const table = page.locator('table').first()
    await expect(table).toBeVisible({ timeout: 20000 })
    const firstRow = table.locator('tbody tr').first()
    await expect(firstRow).toBeVisible({ timeout: 25000 })
    await expect(firstRow.locator('td').first()).toHaveText(/.+/, {
      timeout: 25000,
    })

    await firstRow.click({ force: true })
    const personSheet = page
      .getByRole('dialog')
      .filter({ has: page.getByText('Contact Information') })
      .first()
    await expect(personSheet).toBeVisible({ timeout: 15000 })

    await expect(personSheet.getByText('Political Party')).not.toBeVisible()
    await expect(personSheet.getByText('Registered Voter')).toBeVisible()
    await expect(personSheet.getByText('Voter Status')).toBeVisible()
  })

  test('custom segments are scoped per organization', async ({ page }) => {
    await setupWinServeUser(page)
    await page.goto('/dashboard/contacts', { waitUntil: 'domcontentloaded' })
    await NavigationHelper.dismissOverlays(page)

    const table = page.locator('table').first()
    await expect(table).toBeVisible({ timeout: 20000 })
    const firstRow = table.locator('tbody tr').first()
    await expect(firstRow).toBeVisible({ timeout: 25000 })
    await expect(firstRow.locator('td').first()).toHaveText(/.+/, {
      timeout: 25000,
    })

    const createListButton = page.getByRole('button', {
      name: /create list/i,
    })
    await createListButton.scrollIntoViewIfNeeded()
    await expect(createListButton).toBeVisible({ timeout: 10000 })
    await createListButton.click({ force: true })

    const sheet = page
      .getByRole('dialog')
      .filter({
        has: page.getByRole('button', { name: /create segment/i }),
      })
      .first()
    await expect(sheet).toBeVisible({ timeout: 10000 })

    const maleLabel = sheet.getByText('Male', { exact: true })
    await maleLabel.locator('xpath=..').getByRole('checkbox').click()

    const createSegmentButton = sheet.getByRole('button', {
      name: /create segment/i,
    })
    await expect(createSegmentButton).toBeEnabled({ timeout: 5000 })
    await createSegmentButton.click({ force: true })
    await expect(sheet).toBeHidden({ timeout: 15000 })

    await expect(
      table.locator('tbody tr').first().locator('td').first(),
    ).toHaveText(/.+/, { timeout: 25000 })

    const segmentSelectTrigger = page.getByRole('combobox').first()
    await segmentSelectTrigger.click({ timeout: 5000 })
    await expect(page.getByText(/Custom Segment 1/i).first()).toBeVisible({
      timeout: 5000,
    })
    await page.keyboard.press('Escape')

    const eoOrgName = await getSelectedOrgName(page)
    const allOrgs = await getOrgPickerOptions(page)
    const campaignOrgName = allOrgs.find((name) => name !== eoOrgName)!
    expect(campaignOrgName).toBeTruthy()

    await switchOrganization(page, campaignOrgName)
    await page.goto('/dashboard/contacts', { waitUntil: 'domcontentloaded' })
    await NavigationHelper.dismissOverlays(page)

    await expect(page.locator('table').first()).toBeVisible({ timeout: 20000 })

    const campaignCombobox = page.getByRole('combobox').first()
    await campaignCombobox.click({ timeout: 5000 })
    await expect(page.getByText(/Custom Segment 1/i)).not.toBeVisible()
    await page.keyboard.press('Escape')
  })
})
