import { expect, test } from '@playwright/test'
import { NavigationHelper } from 'src/helpers/navigation.helper'
import { WaitHelper } from 'src/helpers/wait.helper'
import { authenticateTestUser } from 'tests/utils/api-registration'
import { visualSnapshot } from 'src/helpers/visual.helper'

test.describe('Website Management @experimental', () => {
  test('should create and publish website through complete flow', async ({
    page,
  }) => {
    await authenticateTestUser(page)
    await NavigationHelper.navigateToPage(page, '/dashboard/website')
    await NavigationHelper.dismissOverlays(page)

    await expect(
      page.getByRole('heading', { name: 'Create your free website' }).first(),
    ).toBeVisible()
    await expect(page).toHaveURL(/\/website$/)
    await visualSnapshot(page, 'website-step0-landing.png')

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
    await visualSnapshot(page, 'website-step1-custom-link.png')

    await page.getByRole('button', { name: 'Next' }).click()
    await WaitHelper.waitForLoadingToComplete(page)
    await expect(
      page.getByRole('heading', { name: /Upload your campaign logo/ }),
    ).toBeVisible()
    await visualSnapshot(page, 'website-step2-logo-upload.png')
    // Logo upload is skipped in CI due to CORS in test env; flow validation continues without file to verify progression. Will re-enable once file uploads are supported in Vercel test environments.
    // await page.locator('input[type="file"]').setInputFiles('src/fixtures/heart.png');

    await page.getByRole('button', { name: 'Next' }).click()
    await WaitHelper.waitForLoadingToComplete(page)
    await expect(
      page.getByRole('heading', { name: 'Choose a color theme' }),
    ).toBeVisible()
    await visualSnapshot(page, 'website-step3-color-theme.png')

    await page.getByText('dark').click()
    await page.getByRole('button', { name: 'Next' }).click()
    await WaitHelper.waitForLoadingToComplete(page)
    await expect(
      page.getByRole('heading', { name: 'Customize the content' }),
    ).toBeVisible()
    await visualSnapshot(page, 'website-step4-customize-content.png')
    // Banner upload is skipped in CI due to CORS in test env; validate navigation only. Will re-enable once file uploads are supported in Vercel test environments.
    // await page.locator('input[type="file"]').setInputFiles('src/fixtures/heart.png');

    await page.getByRole('button', { name: 'Next' }).click()
    await WaitHelper.waitForLoadingToComplete(page)
    await expect(
      page.getByRole('heading', { name: 'What is your campaign about?' }),
    ).toBeVisible()
    await visualSnapshot(page, 'website-step5-campaign-about.png')

    await page.getByRole('button', { name: 'Next' }).click()
    await WaitHelper.waitForLoadingToComplete(page)
    await expect(
      page.getByRole('heading', { name: 'How can voters contact you?' }),
    ).toBeVisible()
    await visualSnapshot(page, 'website-step6-voter-contact.png')

    await page.getByRole('button', { name: 'Publish website' }).click()
    await WaitHelper.waitForLoadingToComplete(page)
    await expect(
      page.getByRole('heading', {
        name: 'Congratulations, your website is live!',
      }),
    ).toBeVisible()
    await visualSnapshot(page, 'website-published-success.png')

    await expect(page.getByRole('link', { name: 'Add a domain' })).toBeVisible()
    await page.getByRole('link', { name: 'Done' }).click()
    await expect(
      page
        .getByRole('heading', { name: /Published/ })
        .locator('div')
        .first(),
    ).toBeVisible()
    await visualSnapshot(page, 'website-dashboard-published.png')
  })
})
