import { expect, test } from '@playwright/test'
import { faker } from '@faker-js/faker'
import {
  blockSlowScripts,
  NavigationHelper,
} from 'src/helpers/navigation.helper'
import { WaitHelper } from 'src/helpers/wait.helper'
import { authenticateTestUser } from 'tests/utils/api-registration'

test.describe('Website Management', () => {
  test.beforeEach(async ({ page }) => {
    await blockSlowScripts(page)
  })

  test('should create and publish website through complete flow', async ({
    page,
  }) => {
    const { client } = await authenticateTestUser(page, { isolated: true })
    await client.put('/v1/campaigns/mine', {
      formattedAddress: '1600 Pennsylvania Ave NW, Washington, DC',
      placeId: 'ChIJGVtI4by3t4kRr51d_Qm_x58',
    })
    await NavigationHelper.navigateToPage(page, '/dashboard/website')
    await NavigationHelper.dismissOverlays(page)

    await expect(
      page.getByRole('heading', { name: 'Create your free website' }).first(),
    ).toBeVisible()
    await expect(page).toHaveURL(/\/website$/)

    await page
      .getByRole('button', { name: 'Create your website' })
      .first()
      .click()
    await WaitHelper.waitForLoadingToComplete(page)
    await expect(
      page.getByRole('heading', {
        name: 'What do you want your custom link to be?',
      }),
    ).toBeVisible()

    await page.getByRole('button', { name: 'Next', exact: true }).click()
    await WaitHelper.waitForLoadingToComplete(page)
    await expect(
      page.getByRole('heading', { name: /Upload your campaign logo/ }),
    ).toBeVisible()
    // Logo upload is skipped in CI due to CORS in test env; flow validation continues without file to verify progression. Will re-enable once file uploads are supported in Vercel test environments.
    // await page.locator('input[type="file"]').setInputFiles('src/fixtures/heart.png');

    await page.getByRole('button', { name: 'Next', exact: true }).click()
    await WaitHelper.waitForLoadingToComplete(page)
    await expect(
      page.getByRole('heading', { name: 'Choose a color theme' }),
    ).toBeVisible()

    await page.getByText('dark').click()
    await page.getByRole('button', { name: 'Next', exact: true }).click()
    await WaitHelper.waitForLoadingToComplete(page)
    await expect(
      page.getByRole('heading', { name: 'Customize the content' }),
    ).toBeVisible()
    // Banner upload is skipped in CI due to CORS in test env; validate navigation only. Will re-enable once file uploads are supported in Vercel test environments.
    // await page.locator('input[type="file"]').setInputFiles('src/fixtures/heart.png');
    const websiteTitleInput = page
      .locator('label', { hasText: 'Title' })
      .locator('xpath=following-sibling::*[1]//input')
      .first()
    await websiteTitleInput.fill(
      `${faker.person.firstName()} for ${faker.location.city()}`,
    )

    await page.getByRole('button', { name: 'Next', exact: true }).click()
    await WaitHelper.waitForLoadingToComplete(page)
    await expect(
      page.getByRole('heading', { name: 'What is your campaign about?' }),
    ).toBeVisible()

    await page.getByRole('button', { name: 'Next', exact: true }).click()
    await expect(
      page.getByRole('alert').filter({ hasText: 'Please complete Your Bio' }),
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'What is your campaign about?' }),
    ).toBeVisible()

    await page.locator('.ql-editor').click()
    await page
      .locator('.ql-editor')
      .fill(
        'As a lifelong resident of our community, I am committed to sustainable growth, public safety, and creating opportunities for all residents in our district.',
      )

    await page.getByRole('button', { name: 'Add issue' }).click()
    await page.locator('input[required]').fill('Education')
    await page
      .locator('textarea[required]')
      .fill(
        'Our schools deserve leaders who prioritize student outcomes and teacher support.',
      )
    await page.getByRole('button', { name: 'Save' }).click()

    await page.getByRole('button', { name: 'Next', exact: true }).click()
    await WaitHelper.waitForLoadingToComplete(page)
    await expect(
      page.getByRole('heading', { name: 'How can voters contact you?' }),
    ).toBeVisible()

    const emailInput = page.locator('input[name="email"]')
    const phoneInput = page.locator('input[name="phone"]')
    const committeeInput = page
      .locator('label', { hasText: 'Campaign Committee Name' })
      .locator('xpath=following-sibling::*[1]//input')
      .first()

    await page.evaluate(() => {
      const addressInput = document.querySelector(
        'input[placeholder="Enter your address"]',
      )
      if (!addressInput) {
        throw new Error('Address input not found')
      }
      const fiberKey = Object.keys(addressInput).find((key) =>
        key.startsWith('__reactFiber$'),
      )
      if (!fiberKey) {
        throw new Error('React fiber key not found for address input')
      }
      let fiber: unknown = (addressInput as unknown as Record<string, unknown>)[
        fiberKey
      ] as unknown
      while (fiber) {
        const props = (fiber as { memoizedProps?: Record<string, unknown> })
          .memoizedProps
        const onAddressSelect =
          props && typeof props.onAddressSelect === 'function'
            ? (props.onAddressSelect as (place: {
                formatted_address: string
                place_id: string
              }) => void)
            : null
        if (onAddressSelect) {
          onAddressSelect({
            formatted_address: '1600 Pennsylvania Ave NW, Washington, DC',
            place_id: 'ChIJGVtI4by3t4kRr51d_Qm_x58',
          })
          return
        }
        fiber = (fiber as { return?: unknown }).return
      }
      throw new Error('onAddressSelect handler not found')
    })
    await emailInput.fill(faker.internet.email())
    await phoneInput.fill('(202) 555-0123')
    await committeeInput.fill(
      `Friends of ${faker.person.firstName()} ${faker.person.lastName()}`,
    )

    await page.getByRole('button', { name: 'Publish website' }).click()
    await WaitHelper.waitForLoadingToComplete(page)
    const liveHeading = page
      .getByRole('heading')
      .filter({ hasText: /Congratulations,\s*your website is live!/i })
      .first()
    const publishedCardHeading = page
      .getByText('Your campaign website', { exact: true })
      .first()

    await Promise.any([
      liveHeading.waitFor({ state: 'visible', timeout: 20000 }),
      publishedCardHeading.waitFor({ state: 'visible', timeout: 20000 }),
    ])

    if (await liveHeading.isVisible()) {
      await expect(
        page.getByRole('link', { name: 'Add a domain' }),
      ).toBeVisible()
      await page.getByRole('link', { name: 'Done' }).click()
    }

    await expect(
      page
        .getByRole('heading', { name: /Published/ })
        .locator('div')
        .first(),
    ).toBeVisible()
  })
})
