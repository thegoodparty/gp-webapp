import { expect, test } from '@playwright/test'
import {
  blockSlowScripts,
  NavigationHelper,
} from '../../../src/helpers/navigation.helper'
import { authenticateTestUser } from 'tests/utils/api-registration'

test.describe('Custom office flow', () => {
  test.beforeEach(async ({ page }) => {
    await blockSlowScripts(page)
  })

  test('should allow user to submit a custom office via "I don\'t see my office"', async ({
    page,
  }) => {
    const { client } = await authenticateTestUser(page, {
      skipCampaignCreation: true,
      isolated: true,
    })

    await page.goto('/onboarding/office-selection')
    await NavigationHelper.dismissOverlays(page)

    // Step through Welcome → Ballot status → Party affiliation → Office selection.
    const continueButton = page
      .getByRole('button', { name: /continue/i })
      .first()
    await continueButton.waitFor({ state: 'visible', timeout: 15000 })

    // Welcome
    await continueButton.click()

    // Ballot status
    await page.getByRole('radio').first().click({ force: true })
    await continueButton.click()

    // Party affiliation
    await page.getByRole('radio').first().click({ force: true })
    await continueButton.click()

    // Office selection — search by zip first
    await page.getByLabel(/zip code/i).fill('82001')
    await page.getByRole('button', { name: /search/i }).click()

    // Open the manual-office-entry step
    const cantFindLink = page.getByRole('button', {
      name: /i don't see my office/i,
    })
    await cantFindLink.waitFor({ state: 'visible', timeout: 30000 })
    await cantFindLink.click()

    // Manual entry form
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: /tell us about your office/i,
      }),
    ).toBeVisible()

    await page.getByLabel('Office Name').fill('City Council')
    await page.getByRole('combobox', { name: /state/i }).click()
    await page.getByRole('option', { name: 'NC' }).click()
    await page.getByLabel('City, Town Or County').fill('Hendersonville')
    await page.getByLabel('District (If Applicable)').fill('3')
    await page.getByRole('combobox', { name: /term length/i }).click()
    await page.getByRole('option', { name: '4 years' }).click()
    await page.getByLabel('General Election Date').fill('2030-02-01')

    await expect(continueButton).toBeEnabled()
    await continueButton.click()

    // Manual flow skips P2V/voter-demographics; lands on the pledge step.
    await expect(
      page.getByRole('heading', { level: 1, name: /pledge/i }),
    ).toBeVisible({ timeout: 15000 })

    type OrganizationsResponse = {
      organizations: {
        slug: string
        campaignId: number
        name: string
        electedOfficeId: number | null
        district: string | null
        position: string | null
        positionName: string
      }[]
    }

    await expect
      .poll(
        async () => {
          const { data } = await client.get<OrganizationsResponse>(
            '/v1/organizations',
          )
          return data.organizations.length
        },
        { timeout: 15000 },
      )
      .toBe(1)

    const { data } = await client.get<OrganizationsResponse>(
      '/v1/organizations',
    )
    expect(data.organizations[0]).toStrictEqual({
      slug: expect.any(String),
      campaignId: expect.any(Number),
      name: '2030 Campaign',
      electedOfficeId: null,
      district: null,
      position: null,
      positionName: 'City Council',
    })

    const { data: campaign } = await client.get<{
      id: number
      details: {
        electionDate: string
        city: string
        district: string
        officeTermLength: string
        state: string
        electionId: string | null
        zip: string | null
      }
    }>('/v1/campaigns/mine', {
      headers: {
        'x-organization-slug': data.organizations[0]!.slug,
      },
    })
    expect(campaign).toMatchObject({
      id: expect.any(Number),
      details: {
        electionDate: '2030-02-01',
        city: 'Hendersonville',
        district: '3',
        officeTermLength: '4 years',
        state: 'NC',
        electionId: null,
        zip: null,
      },
    })
  })
})
