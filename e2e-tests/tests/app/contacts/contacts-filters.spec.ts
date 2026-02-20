import { expect, type Locator, type Page, test } from '@playwright/test'
import pRetry from 'p-retry'
import { NavigationHelper } from 'src/helpers/navigation.helper'
import { authenticateTestUser } from 'tests/utils/api-registration'

const selectCheckbox = async (sheet: Locator, label: string, value: string) => {
  const sectionHeading = sheet.locator('h4', { hasText: label })
  const container = sectionHeading.locator('xpath=../..')
  const checkboxLabel = container.getByText(value, { exact: true })
  await checkboxLabel.locator('xpath=..').getByRole('checkbox').click()
}

let filterCallCount = 0

const personPanelLocator = (page: Page) =>
  page
    .getByRole('dialog')
    .filter({ has: page.getByText('Registered Voter') })
    .first()

const openPersonPanel = async (row: Locator, panel: Locator) => {
  for (let attempt = 0; attempt < 3; attempt++) {
    await row.click({ force: true })
    try {
      await expect(panel).toBeVisible({ timeout: 10000 })
      return
    } catch {
      if (attempt === 2) await expect(panel).toBeVisible()
    }
  }
}

const closePanel = async (page: Page, panel: Locator) => {
  await pRetry(
    async () => {
      await page.keyboard.press('Escape')
      await expect(panel).toBeHidden({ timeout: 5000 })
    },
    { retries: 3 },
  )
}

const testFilterField = async (
  page: Page,
  config: {
    select: { label: string; values: string[] }[]
    expectTableValues?: { columnIndex: number; value: string | RegExp }[]
    expectSheetValues: (
      | { label: string; value: string | RegExp }
      | ((panel: Locator) => Promise<void>)
    )[]
  },
) => {
  filterCallCount++

  /**
   * Why:
   * For whatever reason, the amount of page navigation in this test suite can cause memory crashes
   * in the browser. It's not that reflective of actual user behavior, so we reload the page every few
   * filters in order to avoid the memory issues.
   */
  if (filterCallCount % 8 === 0) {
    await page.reload({ waitUntil: 'domcontentloaded' })
    await NavigationHelper.dismissOverlays(page)
    await expect(
      page
        .locator('table')
        .first()
        .locator('tbody tr')
        .first()
        .locator('td')
        .first(),
    ).toHaveText(/.+/)
  }

  await page.getByTestId('edit-list-button').first().click()
  const sheet = page
    .getByRole('dialog')
    .filter({
      has: page.getByRole('button', { name: /update segment/i }),
    })
    .first()

  await expect(sheet).toBeVisible()
  await sheet.getByRole('button', { name: /clear filters/i }).click()

  for (const { label, values } of config.select) {
    for (const value of values) {
      await selectCheckbox(sheet, label, value)
    }
  }

  const updateBtn = sheet.getByRole('button', { name: /update segment/i })
  await updateBtn.scrollIntoViewIfNeeded()
  await updateBtn.click()
  try {
    await expect(sheet).toBeHidden()
  } catch {
    await page.keyboard.press('Escape')
    await expect(sheet).toBeHidden()
  }

  const table = page.locator('table').first()
  const firstCell = table.locator('tbody tr').first().locator('td').first()
  await expect(firstCell).toHaveText(/.+/)

  if (config.expectTableValues) {
    for (const { columnIndex, value } of config.expectTableValues) {
      const cell = table
        .locator('tbody tr')
        .first()
        .locator('td')
        .nth(columnIndex)
      await expect(cell).toHaveText(value)
    }
  }

  const firstRow = table.locator('tbody tr').first()
  const panel = personPanelLocator(page)

  await openPersonPanel(firstRow, panel)

  for (const expectation of config.expectSheetValues) {
    if (typeof expectation === 'function') {
      await expectation(panel)
    } else {
      const { label, value } = expectation
      const fieldLabel = panel.locator('p', { hasText: label }).first()
      const fieldContainer = fieldLabel.locator('xpath=..')
      await expect(fieldContainer).toHaveText(value)
    }
  }

  await closePanel(page, panel)
}

test('validate contacts filters', async ({ page }) => {
  test.setTimeout(5 * 60 * 1000)

  await authenticateTestUser(page, {
    isolated: true,
    race: {
      zip: '82001',
      office: 'Cheyenne City Council - Ward 2',
    },
  })

  await page.goto('/dashboard/election-result')
  await page.getByRole('button', { name: 'I won my race' }).click()
  await page.waitForTimeout(3000)

  await page.goto('/dashboard/contacts')
  await NavigationHelper.dismissOverlays(page)

  await expect(page).toHaveURL(/\/dashboard\/contacts/)
  await expect(page.getByRole('heading', { name: 'Contacts' })).toBeVisible()

  const table = page.locator('table').first()
  await expect(table).toBeVisible()
  await expect(table.locator('tbody tr').first()).toBeVisible()
  await expect(
    table.locator('tbody tr').first().locator('td').first(),
  ).toHaveText(/.+/)

  const createListButton = page.getByRole('button', { name: /create list/i })
  await createListButton.scrollIntoViewIfNeeded()
  await expect(createListButton).toBeVisible()
  await createListButton.click({ force: true })
  const sheet = page
    .getByRole('dialog')
    .filter({
      has: page.getByRole('button', { name: /create segment/i }),
    })
    .first()
  await expect(sheet).toBeVisible()
  await selectCheckbox(sheet, 'Gender', 'Unknown')
  await sheet
    .getByRole('button', { name: /create segment/i })
    .click({ force: true })
  await expect(sheet).toBeHidden()
  await expect(
    table.locator('tbody tr').first().locator('td').first(),
  ).toHaveText(/.+/)

  await test.step('Filter: Gender', async () => {
    await testFilterField(page, {
      select: [{ label: 'Gender', values: ['Male'] }],
      expectTableValues: [{ columnIndex: 1, value: 'M' }],
      expectSheetValues: [
        async (panel) => {
          await expect(panel).toHaveText(/Male/)
        },
      ],
    })

    await testFilterField(page, {
      select: [{ label: 'Gender', values: ['Female'] }],
      expectTableValues: [{ columnIndex: 1, value: 'F' }],
      expectSheetValues: [
        async (panel) => {
          await expect(panel).toHaveText(/Female/)
        },
      ],
    })
  })

  await test.step('Filter: Age', async () => {
    await testFilterField(page, {
      select: [{ label: 'Age', values: ['25-35'] }],
      expectTableValues: [{ columnIndex: 2, value: /^\s*(2[5-9]|3[0-5])\s*$/ }],
      expectSheetValues: [
        async (panel) => {
          const header = panel.locator('p.text-xl').first()
          await expect(header).toHaveText(/\b(2[5-9]|3[0-5]) years old\b/)
        },
      ],
    })

    await testFilterField(page, {
      select: [{ label: 'Age', values: ['35-50'] }],
      expectTableValues: [
        { columnIndex: 2, value: /^\s*(3[5-9]|4[0-9]|50)\s*$/ },
      ],
      expectSheetValues: [
        async (panel) => {
          const header = panel.locator('p.text-xl').first()
          await expect(header).toHaveText(/\b(3[5-9]|4[0-9]|50) years old\b/)
        },
      ],
    })
  })

  await test.step('Filter: Cell Phone', async () => {
    await testFilterField(page, {
      select: [{ label: 'Cell Phone', values: ['Has Cell Phone'] }],
      expectTableValues: [{ columnIndex: 4, value: /\d/ }],
      expectSheetValues: [{ label: 'Cell Phone Number', value: /\d/ }],
    })
  })

  await test.step('Filter: Landline', async () => {
    await testFilterField(page, {
      select: [{ label: 'Landline', values: ['Has Landline'] }],
      expectTableValues: [{ columnIndex: 5, value: /\d/ }],
      expectSheetValues: [{ label: 'Landline', value: /\d/ }],
    })
  })

  await test.step('Filter: Language', async () => {
    await testFilterField(page, {
      select: [{ label: 'Language', values: ['English'] }],
      expectSheetValues: [{ label: 'Language', value: /English/i }],
    })

    await testFilterField(page, {
      select: [{ label: 'Language', values: ['Spanish'] }],
      expectSheetValues: [{ label: 'Language', value: /Spanish/i }],
    })
  })

  await test.step('Filter: Voter Likely', async () => {
    await testFilterField(page, {
      select: [{ label: 'Voter Likely', values: ['Unlikely'] }],
      expectSheetValues: [{ label: 'Voter Status', value: /Unlikely/i }],
    })

    await testFilterField(page, {
      select: [{ label: 'Voter Likely', values: ['Likely'] }],
      expectSheetValues: [{ label: 'Voter Status', value: /Likely/i }],
    })
  })

  await test.step('Filter: Children', async () => {
    await testFilterField(page, {
      select: [{ label: 'Children', values: ['Yes'] }],
      expectSheetValues: [{ label: 'Has Children Under 18', value: /Yes/i }],
    })

    await testFilterField(page, {
      select: [{ label: 'Children', values: ['No'] }],
      expectSheetValues: [{ label: 'Has Children Under 18', value: /No/i }],
    })
  })

  await test.step('Filter: Homeowner', async () => {
    await testFilterField(page, {
      select: [{ label: 'Homeowner', values: ['Yes'] }],
      expectSheetValues: [{ label: 'Homeowner', value: /Yes/i }],
    })

    await testFilterField(page, {
      select: [{ label: 'Homeowner', values: ['No'] }],
      expectSheetValues: [{ label: 'Homeowner', value: /No/i }],
    })
  })

  await test.step('Filter: Marital Status', async () => {
    await testFilterField(page, {
      select: [{ label: 'Marital Status', values: ['Married'] }],
      expectSheetValues: [{ label: 'Marital Status', value: /Married/i }],
    })

    await testFilterField(page, {
      select: [{ label: 'Marital Status', values: ['Single'] }],
      expectSheetValues: [{ label: 'Marital Status', value: /Single/i }],
    })
  })

  await test.step('Filter: Veteran Status', async () => {
    await testFilterField(page, {
      select: [{ label: 'Veteran Status', values: ['Yes'] }],
      expectSheetValues: [{ label: 'Veteran Status', value: /Yes/i }],
    })
  })

  await test.step('Filter: Business Owner', async () => {
    await testFilterField(page, {
      select: [{ label: 'Business Owner', values: ['Yes'] }],
      expectSheetValues: [{ label: 'Business Owner', value: /Yes/i }],
    })
  })

  await test.step('Filter: Education', async () => {
    await testFilterField(page, {
      select: [{ label: 'Level of Education', values: ['College Degree'] }],
      expectSheetValues: [
        { label: 'Level of Education', value: /College Degree/i },
      ],
    })

    await testFilterField(page, {
      select: [
        { label: 'Level of Education', values: ['High School Diploma'] },
      ],
      expectSheetValues: [
        { label: 'Level of Education', value: /High School Diploma/i },
      ],
    })
  })

  await test.step('Filter: Income', async () => {
    await testFilterField(page, {
      select: [{ label: 'Household Income Range', values: ['$50k - $75k'] }],
      expectSheetValues: [
        { label: 'Estimated Income Range', value: /\$50k\s*-\s*\$75k/ },
      ],
    })

    await testFilterField(page, {
      select: [{ label: 'Household Income Range', values: ['$75k - $100k'] }],
      expectSheetValues: [
        { label: 'Estimated Income Range', value: /\$75k\s*-\s*\$100k/ },
      ],
    })
  })

  await test.step('Filter: Ethnicity', async () => {
    await testFilterField(page, {
      select: [{ label: 'Ethnicity', values: ['Hispanic'] }],
      expectSheetValues: [{ label: 'Ethnicity Group', value: /Hispanic/i }],
    })

    await testFilterField(page, {
      select: [{ label: 'Ethnicity', values: ['European'] }],
      expectSheetValues: [{ label: 'Ethnicity Group', value: /European/i }],
    })
  })

  await test.step('Filter: Gender + Age', async () => {
    await testFilterField(page, {
      select: [
        { label: 'Gender', values: ['Male'] },
        { label: 'Age', values: ['25-35'] },
      ],
      expectTableValues: [
        { columnIndex: 1, value: /^\s*M\s*$/ },
        { columnIndex: 2, value: /^\s*(2[5-9]|3[0-5])\s*$/ },
      ],
      expectSheetValues: [
        async (panel) => {
          const header = panel.locator('p.text-xl').first()
          await expect(header).toHaveText(/M.*\b(2[5-9]|3[0-5]) years old\b/)
        },
      ],
    })
  })

  await test.step('Filter Combo: Female, Ages 25-50, Cell Phone, Married', async () => {
    await testFilterField(page, {
      select: [
        { label: 'Gender', values: ['Female'] },
        { label: 'Age', values: ['25-35', '35-50'] },
        { label: 'Cell Phone', values: ['Has Cell Phone'] },
        { label: 'Marital Status', values: ['Married'] },
      ],
      expectTableValues: [
        { columnIndex: 1, value: /^\s*F\s*$/ },
        { columnIndex: 2, value: /^\s*(2[5-9]|3[0-9]|4[0-9]|50)\s*$/ },
        { columnIndex: 4, value: /\d/ },
      ],
      expectSheetValues: [
        async (panel) => {
          await expect(panel).toHaveText(/Female/)
        },
        { label: 'Cell Phone Number', value: /\d/ },
        { label: 'Marital Status', value: /Married/i },
      ],
    })
  })

  await test.step('Filter Combo: Male, Likely/Super Voters, Homeowner, Higher Education', async () => {
    await testFilterField(page, {
      select: [
        { label: 'Gender', values: ['Male'] },
        { label: 'Voter Likely', values: ['Likely', 'Super'] },
        { label: 'Homeowner', values: ['Yes'] },
        {
          label: 'Level of Education',
          values: ['College Degree', 'Graduate Degree'],
        },
      ],
      expectTableValues: [{ columnIndex: 1, value: /^\s*M\s*$/ }],
      expectSheetValues: [
        async (panel) => {
          await expect(panel).toHaveText(/Male/)
        },
        { label: 'Voter Status', value: /(Likely|Super)/i },
        { label: 'Homeowner', value: /Yes/i },
        {
          label: 'Level of Education',
          value: /(College Degree|Graduate Degree)/i,
        },
      ],
    })
  })

  await test.step('Filter Combo: Ages 35+, Landline, Children, Income $75-125k, Ethnicity', async () => {
    await testFilterField(page, {
      select: [
        { label: 'Age', values: ['35-50', '50+'] },
        { label: 'Landline', values: ['Has Landline'] },
        { label: 'Children', values: ['Yes'] },
        {
          label: 'Household Income Range',
          values: ['$75k - $100k', '$100k - $125k'],
        },
        { label: 'Ethnicity', values: ['European', 'Hispanic'] },
      ],
      expectTableValues: [
        { columnIndex: 2, value: /^\s*(3[5-9]|[4-9]\d|\d{3})\s*$/ },
        { columnIndex: 5, value: /\d/ },
      ],
      expectSheetValues: [
        async (panel) => {
          const header = panel.locator('p.text-xl').first()
          await expect(header).toHaveText(
            /\b(3[5-9]|[4-9]\d|\d{3}) years old\b/,
          )
        },
        { label: 'Has Children Under 18', value: /Yes/i },
        {
          label: 'Estimated Income Range',
          value: /\$(75k|100k)\s*-\s*\$(100k|125k)/,
        },
        { label: 'Ethnicity Group', value: /(European|Hispanic)/i },
      ],
    })
  })
})
