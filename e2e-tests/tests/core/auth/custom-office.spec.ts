import { expect, test } from '@playwright/test'
import { authenticateTestUser } from 'tests/utils/api-registration'

test.describe('Custom office flow', () => {
  test('should allow user to submit a custom office via "I don\'t see my office"', async ({
    page,
  }) => {
    const { client } = await authenticateTestUser(page, {
      skipCampaignCreation: true,
    })

    await page.goto('/onboarding/office-selection')

    await page.getByLabel('Zip Code').fill('28739')

    // Wait for offices to load
    await page.waitForFunction(
      () => {
        const text = document.body.textContent || ''
        return text.includes('offices found') || text.includes('office found')
      },
      { timeout: 30000 },
    )

    // Open "I don't see my office" modal
    const cantFindLink = page.getByText("I don't see my office")
    await cantFindLink.waitFor({ state: 'visible', timeout: 10000 })
    await cantFindLink.click()
    await expect(page.getByText('Troubleshooting')).toBeVisible()

    // Navigate to custom office form
    const stillDontSee = page.getByText("I still don't see my office")
    await stillDontSee.waitFor({ state: 'visible' })
    await stillDontSee.click()
    await expect(page.getByText('Request help')).toBeVisible()

    // Fill custom office form (scoped to modal via MUI presentation role)
    const modal = page.locator('[role="presentation"]')
    await modal.getByLabel('Office Name').fill('City Council')
    await modal.locator('select').first().selectOption('NC')
    await modal.getByLabel('City, Town Or County').fill('Hendersonville')
    await modal.getByLabel('District (If Applicable)').fill('3')
    await modal.locator('select').nth(1).selectOption('4 years')

    const futureDate = new Date()
    futureDate.setFullYear(futureDate.getFullYear() + 1)
    const dateStr = `${futureDate.getFullYear()}-${String(
      futureDate.getMonth() + 1,
    ).padStart(2, '0')}-${String(futureDate.getDate()).padStart(2, '0')}`
    await modal.getByLabel('General Election Date').fill(dateStr)

    // Submit
    const sendButton = modal.getByRole('button', { name: 'Send request' })
    await expect(sendButton).toBeEnabled()
    await sendButton.click()

    await page.waitForURL((url) => url.toString().includes('/2'), {
      timeout: 15000,
    })
    await expect(page).toHaveURL(/\/onboarding\/.*\/2/)

    const { data } = await client.get('/v1/organizations')
    expect(data.organizations).toHaveLength(1)
    expect(data.organizations[0]).toStrictEqual({
      slug: expect.any(String),
      campaignId: expect.any(Number),
      name: 'City Council',
      electedOfficeId: null,
    })
  })
})
