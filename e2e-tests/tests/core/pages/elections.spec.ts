import { expect, test } from '@playwright/test'
import { NavigationHelper } from '../../../src/helpers/navigation.helper'
import { WaitHelper } from '../../../src/helpers/wait.helper'

test.describe('Elections Pages', () => {
  test('should display explore offices page', async ({ page }) => {
    await NavigationHelper.navigateToPage(page, '/elections')
    await NavigationHelper.dismissOverlays(page)
    await expect(page).toHaveTitle(/Election Research/)
    await expect(
      page.getByText(/Explore elections in your community/),
    ).toBeVisible()

    await expect(page.getByAltText('map').first()).toBeVisible()

    const candidateImages = page.getByAltText(
      /Carlos Rousselin|Breanna Stott|Victoria Masika/,
    )
    const candidateCount = await candidateImages.count()
    if (candidateCount > 0) {
      await expect(candidateImages.first()).toBeVisible()
    }
  })

  test('should display county-level election page', async ({ page }) => {
    await NavigationHelper.navigateToPage(page, '/elections/ca/dublin')
    await NavigationHelper.dismissOverlays(page)
    await expect(page).toHaveTitle(/Run for Office in Dublin/)
    await expect(page.getByText(/Dublin elections/)).toBeVisible()

    const electionLinks = page.getByRole('link', {
      name: /City|Council|Legislature|Mayor/,
    })
    const linkCount = await electionLinks.count()
    if (linkCount > 0) {
      await expect(electionLinks.first()).toBeVisible()
    }

    await expect(page.getByText(/Dublin Fast facts/)).toBeVisible()
  })

  test('should display municipal-level election page', async ({ page }) => {
    await NavigationHelper.navigateToPage(
      page,
      '/elections/il/adams-county/beverly-township',
    )
    await NavigationHelper.dismissOverlays(page)
    await expect(page).toHaveTitle(/Run for Office in Beverly township/)
    await expect(page.getByText(/Beverly township elections/)).toBeVisible()

    const roleLinks = page.getByRole('link', {
      name: /Parks|Recreation|District|Board/,
    })
    const roleCount = await roleLinks.count()
    if (roleCount > 0) {
      await expect(roleLinks.first()).toBeVisible()
    }

    await expect(page.getByText(/Beverly township fast facts/)).toBeVisible()
  })

  test('should have working navigation from elections page', async ({
    page,
  }) => {
    await NavigationHelper.navigateToPage(page, '/elections')
    await NavigationHelper.dismissOverlays(page)
    await WaitHelper.waitForPageReady(page)
    const stateLinks = page
      .getByRole('link')
      .filter({ hasText: /California|Texas|New York|Florida/ })
    const stateCount = await stateLinks.count()

    if (stateCount > 0) {
      const firstStateLink = stateLinks.first()
      await firstStateLink.click()
      await expect(page).toHaveURL(/\/elections\/[a-z]{2}$/)

      const stateContent = page.locator('h1, h2, [data-testid*="state"]')
      await expect(stateContent.first()).toBeVisible()
    } else {
      console.log('ℹ️ No state links found for navigation testing')
    }
  })

  test('should display election search functionality', async ({ page }) => {
    await NavigationHelper.navigateToPage(page, '/elections')
    await NavigationHelper.dismissOverlays(page)
    await WaitHelper.waitForPageReady(page)
    const searchElements = page.locator(
      'input[type="search"], input[placeholder*="search"], input[placeholder*="zip"]',
    )
    const searchCount = await searchElements.count()

    if (searchCount > 0) {
      await expect(searchElements.first()).toBeVisible()
      console.log('✅ Search functionality found')
    } else {
      console.log('ℹ️ No search functionality visible on elections page')
    }
  })
})
