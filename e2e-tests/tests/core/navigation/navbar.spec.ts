import { expect, test } from '@playwright/test'
import {
  blockSlowScripts,
  NavigationHelper,
} from '../../../src/helpers/navigation.helper'
import {
  visualSnapshot,
  visualSnapshotElement,
} from '../../../src/helpers/visual.helper'

test.describe('Navigation Bar', () => {
  test.beforeEach(async ({ page }) => {
    await blockSlowScripts(page)
    await NavigationHelper.navigateToPage(page, '/login')
    await NavigationHelper.dismissOverlays(page)
  })

  test('should display main navigation elements', async ({ page }) => {
    await expect(page.getByTestId('navbar')).toBeVisible()
    await expect(
      page.locator('[data-testid="navbar"] [data-cy="logo"]'),
    ).toBeVisible()

    await expect(page.getByTestId('nav-product')).toBeVisible()
    await expect(page.getByTestId('nav-resources')).toBeVisible()
    await expect(page.getByTestId('nav-about-us')).toBeVisible()

    await visualSnapshotElement(
      page.getByTestId('navbar'),
      'navbar-default.png',
    )
  })

  test('should expand product dropdown menu', async ({ page }) => {
    await page.getByTestId('nav-product').click()
    await expect(page.getByTestId('nav-campaign-tools').first()).toBeVisible()
    await expect(page.getByTestId('nav-template-library').first()).toBeVisible()
    await expect(page.getByTestId('nav-voter-data').first()).toBeVisible()
    await expect(page.getByTestId('nav-texting').first()).toBeVisible()
    await expect(page.getByTestId('nav-yard-signs').first()).toBeVisible()
    await expect(page.getByTestId('nav-serve').first()).toBeVisible()
    await expect(page.getByTestId('nav-pricing').first()).toBeVisible()
    await expect(page.getByTestId('nav-good-party-pro').first()).toBeVisible()

    await visualSnapshot(page, 'navbar-product-dropdown.png', {
      clip: { x: 0, y: 0, width: 1280, height: 400 },
    })
  })

  test('should expand resources dropdown menu', async ({ page }) => {
    await page.getByTestId('nav-resources').click()
    await expect(page.getByTestId('nav-get-demo')).toBeVisible()
    await expect(page.getByTestId('nav-blog')).toBeVisible()
    await expect(page.getByTestId('nav-community')).toBeVisible()
    await expect(page.getByTestId('nav-case-studies')).toBeVisible()

    await visualSnapshot(page, 'navbar-resources-dropdown.png', {
      clip: { x: 0, y: 0, width: 1280, height: 400 },
    })
  })

  test('should expand about us dropdown menu', async ({ page }) => {
    await page.getByTestId('nav-about-us').click()
    await expect(page.getByTestId('nav-about')).toBeVisible()
    await expect(page.getByTestId('nav-team')).toBeVisible()
    await expect(page.getByTestId('nav-contact-us')).toBeVisible()

    await visualSnapshot(page, 'navbar-about-dropdown.png', {
      clip: { x: 0, y: 0, width: 1280, height: 400 },
    })
  })

  test('should navigate to campaign tools page', async ({ page }) => {
    await page.getByTestId('nav-product').click()
    await expect(page.getByTestId('nav-campaign-tools').first()).toBeVisible()
    const campaignToolsLink = page
      .locator('a', {
        has: page.getByTestId('nav-campaign-tools'),
      })
      .first()
    await expect(campaignToolsLink).toHaveAttribute('href', /\/run-for-office$/)
    await expect(campaignToolsLink).toHaveAttribute('target', '_blank')
  })

  test('should navigate to blog page', async ({ page }) => {
    await page.getByTestId('nav-resources').click()
    await expect(page.getByTestId('nav-blog').first()).toBeVisible()
    const blogLink = page
      .locator('a', { has: page.getByTestId('nav-blog') })
      .first()
    await expect(blogLink).toHaveAttribute('href', /\/blog$/)
    await expect(blogLink).toHaveAttribute('target', '_blank')
  })

  test('should navigate to about page', async ({ page }) => {
    await page.getByTestId('nav-about-us').click()
    await expect(page.getByTestId('nav-about').first()).toBeVisible()
    const aboutLink = page
      .locator('a', { has: page.getByTestId('nav-about') })
      .first()
    await expect(aboutLink).toHaveAttribute('href', /\/about$/)
    await expect(aboutLink).toHaveAttribute('target', '_blank')
  })

  test('should close dropdown when clicking outside', async ({ page }) => {
    await page.getByTestId('nav-product').click()
    await expect(page.getByTestId('nav-campaign-tools')).toBeVisible()

    await page.locator('body').click()
    await expect(page.getByTestId('nav-campaign-tools')).not.toBeVisible()
  })
})
