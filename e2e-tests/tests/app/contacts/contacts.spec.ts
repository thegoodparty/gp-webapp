import { expect, test } from '@playwright/test'
import {
  blockSlowScripts,
  NavigationHelper,
} from 'src/helpers/navigation.helper'
import { authenticateTestUser } from 'tests/utils/api-registration'
import { visualSnapshot } from 'src/helpers/visual.helper'
import { filtersSheet, personContactPanel } from 'src/helpers/contacts-e2e'
import { wait } from 'tests/utils/eventually'

test.describe('Contacts Page', () => {
  test.beforeEach(async ({ page }) => {
    await blockSlowScripts(page)
  })

  test('contacts page functionality', async ({ page }) => {
    await authenticateTestUser(page, { isolated: true })
    await page.goto('/dashboard/election-result', {
      waitUntil: 'domcontentloaded',
    })
    await wait(500)
    await page
      .getByRole('button', { name: 'I won my race' })
      .click({ timeout: 10000 })

    await page.waitForURL('**/polls/welcome', { timeout: 15000 })

    await page.goto('/dashboard/contacts', { waitUntil: 'domcontentloaded' })
    await NavigationHelper.dismissOverlays(page)
    await expect(page).toHaveURL(/\/dashboard\/contacts/)
    await expect(
      page.getByRole('heading', { name: 'Constituents' }),
    ).toBeVisible()
    // URL and Contacts heading verified

    //
    //
    //
    // --- Table load: contacts table is visible and has at least one row ---
    const table = page.locator('table').first()
    await expect(table).toBeVisible({ timeout: 20000 })
    const firstRow = table.locator('tbody tr').first()
    await expect(firstRow).toBeVisible({ timeout: 25000 })
    const tableRows = table.locator('tbody tr')
    const initialRowCount = await tableRows.count()
    expect(initialRowCount).toBeGreaterThan(0)
    const firstCell = firstRow.locator('td').first()
    await expect(firstCell).toHaveText(/.+/, { timeout: 25000 })
    const page1FirstPersonName = (await firstCell.textContent())?.trim()
    expect(page1FirstPersonName).toBeTruthy()
    const statsCards = [
      page.locator(`[data-testid="contact-stats-totalConstituents"]`),
      page.locator(`[data-testid="contact-stats-visibleContactsPercent"]`),
      page.locator(`[data-testid="contact-stats-homeowners"]`),
      page.locator(`[data-testid="contact-stats-hasChildren"]`),
      page.locator(`[data-testid="contact-stats-medianIncome"]`),
    ]
    await visualSnapshot(page, 'contacts-page.png', {
      mask: [...statsCards, table.locator('tbody')],
    })

    const pagination = page.locator('[data-slot="pagination-content"]')

    const nextLink = page
      .getByRole('link', { name: /go to next page|next/i })
      .first()
    await expect(nextLink).toBeVisible({ timeout: 5000 })
    await nextLink.click()
    await expect(
      pagination.getByRole('link', { name: '2' }).first(),
    ).toHaveAttribute('data-active', 'true', { timeout: 5000 })
    const newTableRows = table.locator('tbody tr')
    const newRowCount = await newTableRows.count()
    expect(newRowCount).toBeGreaterThan(0)

    const currentFirstRow = table.locator('tbody tr').first()
    await expect(currentFirstRow).toBeVisible()
    const firstPersonName = (
      await currentFirstRow.locator('td').first().textContent()
    )?.trim()
    expect(firstPersonName).toBeTruthy()
    expect(firstPersonName).not.toEqual(page1FirstPersonName)

    const personSheet = personContactPanel(page)
    for (let attempt = 0; attempt < 3; attempt++) {
      await currentFirstRow.scrollIntoViewIfNeeded()
      await currentFirstRow.locator('td').first().click({ force: true })
      try {
        await expect(personSheet).toBeVisible({ timeout: 12000 })
        break
      } catch {
        if (attempt === 2) {
          await expect(personSheet).toBeVisible()
        }
      }
    }
    await expect(
      personSheet.getByText('Contact Information', { exact: true }),
    ).toBeVisible({ timeout: 30000 })

    await expect(
      personSheet.getByText(firstPersonName!, { exact: false }),
    ).toBeVisible({ timeout: 5000 })

    await visualSnapshot(page, 'contacts-person-overlay.png', {
      mask: [...statsCards, personSheet],
    })

    const closeButton = personSheet.getByRole('button', { name: /close/i })
    await closeButton.click()

    await expect(personSheet).toBeHidden({ timeout: 10000 })

    const searchInput = page.getByPlaceholder('Search contacts').first()
    await expect(searchInput).toBeVisible()

    const searchTerm = firstPersonName?.split(' ')[0] || 'Test'

    await searchInput.fill(searchTerm)
    await searchInput.press('Enter')

    const searchResults = table.locator('tbody tr')
    
    await expect
      .poll(() => searchResults.count(), { timeout: 5000 })
      .toBeGreaterThanOrEqual(1)
    
    await expect(
      pagination.getByRole('link', { name: '1' }).first(),
    ).toHaveAttribute('data-active', 'true', { timeout: 5000 })
    const searchFirstRow = table.locator('tbody tr').first()
    await expect(searchFirstRow).toContainText(searchTerm, {
      ignoreCase: true,
    })
    await searchInput.clear()
    await searchInput.press('Enter')
    await expect(
      pagination.getByRole('link', { name: '1' }).first(),
    ).toHaveAttribute('data-active', 'true', { timeout: 5000 })

    const afterClearFirstRow = table.locator('tbody tr').first()
    await expect(
      afterClearFirstRow.locator('td').filter({ hasText: /.+/ }),
    ).not.toHaveCount(0, { timeout: 20000 })

    const createListButton = page.getByRole('button', {
      name: /create list/i,
    })
    await createListButton.scrollIntoViewIfNeeded()
    await expect(createListButton).toBeVisible({ timeout: 10000 })
    await createListButton.click({ force: true })
    const sheet = filtersSheet(page, /create segment/i)
    await expect(sheet).toBeVisible({ timeout: 30000 })

    await visualSnapshot(page, 'contacts-filters-sheet.png', {
      mask: statsCards,
    })

    const age18_25Label = sheet.getByText('18-25', { exact: true })
    const age18_25Checkbox = age18_25Label
      .locator('xpath=..')
      .getByRole('checkbox')
    await age18_25Checkbox.click({ timeout: 10000 })
    const createSegmentButton = sheet.getByRole('button', {
      name: /create segment/i,
    })
    await expect(createSegmentButton).toBeEnabled({ timeout: 5000 })
    await createSegmentButton.click({ force: true })
    await expect(sheet).toBeHidden({ timeout: 15000 })
    const segmentFirstRow = table.locator('tbody tr').first()
    await expect(
      segmentFirstRow.locator('td').filter({ hasText: /.+/ }),
    ).not.toHaveCount(0, { timeout: 35000 })
    const segmentRows = await table.locator('tbody tr').all()
    const ageColumnIndex = 2
    const age18to25Regex = /^\s*(18|19|20|21|22|23|24|25)\s*$/
    for (const row of segmentRows) {
      await expect(row.locator('td').nth(ageColumnIndex)).toHaveText(
        age18to25Regex,
      )
    }

    const segmentSelectTrigger = page.getByRole('combobox').first()
    await segmentSelectTrigger.click({ timeout: 5000 })
    await expect(page.getByText('Custom Segments')).toBeVisible({
      timeout: 5000,
    })
    await expect(page.getByText(/Custom Segment 1/i).first()).toBeVisible({
      timeout: 5000,
    })
    await page.keyboard.press('Escape')
    await page.getByTestId('edit-list-button').first().click({ timeout: 5000 })
    const editSheet = page
      .getByRole('dialog')
      .filter({
        has: page.getByRole('button', { name: /update segment/i }),
      })
      .first()
    await expect(editSheet).toBeVisible({ timeout: 10000 })
    const age25_35Label = editSheet.getByText('25-35', { exact: true })
    const age25_35Checkbox = age25_35Label
      .locator('xpath=..')
      .getByRole('checkbox')
    await age25_35Checkbox.click({ timeout: 10000 })
    const age18_25LabelEdit = editSheet.getByText('18-25', { exact: true })
    const age18_25CheckboxEdit = age18_25LabelEdit
      .locator('xpath=..')
      .getByRole('checkbox')
    await age18_25CheckboxEdit.click({ timeout: 10000 })
    await editSheet
      .getByRole('button', { name: /update segment/i })
      .click({ force: true })
    await expect(editSheet).toBeHidden({ timeout: 10000 })
    const afterEditFirstRow = table.locator('tbody tr').first()
    await expect(
      afterEditFirstRow.locator('td').filter({ hasText: /.+/ }),
    ).not.toHaveCount(0, { timeout: 20000 })

    const afterEditSegmentRows = await table.locator('tbody tr').all()
    const age25to35Regex = /^\s*(25|26|27|28|29|30|31|32|33|34|35)\s*$/
    for (const row of afterEditSegmentRows) {
      await expect(row.locator('td').nth(ageColumnIndex)).toHaveText(
        age25to35Regex,
      )
    }
  })
})
