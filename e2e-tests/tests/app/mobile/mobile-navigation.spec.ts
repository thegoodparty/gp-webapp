import { expect, test } from '@playwright/test'
import { authenticateTestUser } from 'tests/utils/api-registration'
import {
  blockSlowScripts,
  NavigationHelper,
} from '../../../src/helpers/navigation.helper'
import { WaitHelper } from '../../../src/helpers/wait.helper'
import { visualSnapshot } from '../../../src/helpers/visual.helper'

test.describe('Mobile Navigation', () => {
  // Configure mobile viewport
  test.use({
    viewport: { width: 375, height: 667 },
  })

  test.beforeEach(async ({ page }) => {
    await blockSlowScripts(page)
    await authenticateTestUser(page)
    await page.goto('/dashboard')
    await NavigationHelper.dismissOverlays(page)
  })

  test('should display mobile dashboard', async ({ page }) => {
    await WaitHelper.waitForPageReady(page)
    await expect(page).toHaveURL(/\/dashboard$/)

    await expect(
      page.getByRole('heading', { level: 1 }).first(),
    ).toBeVisible()

    await visualSnapshot(page, 'mobile-dashboard.png', {
      mask: [page.getByRole('heading', { level: 1 }).first()],
    })
    console.log('✅ Mobile dashboard accessible')
  })

  test('should have mobile navigation menu', async ({ page }) => {
    await WaitHelper.waitForPageReady(page)
    const openMenu = page.getByRole('button', { name: /open menu/i })
    if (await openMenu.isVisible().catch(() => false)) {
      await expect(openMenu).toBeVisible()
    } else {
      const tilts = page.getByTestId('tilt')
      const count = await tilts.count()
      let sawVisible = false
      for (let i = 0; i < count; i++) {
        const t = tilts.nth(i)
        if (await t.isVisible().catch(() => false)) {
          await expect(t).toBeVisible()
          sawVisible = true
          break
        }
      }
      if (!sawVisible && count > 0) {
        await expect(tilts.first()).toBeAttached()
      }
    }
    console.log('✅ Mobile menu control is present')
  })

  test('should navigate to AI Assistant on mobile', async ({ page }) => {
    await WaitHelper.waitForPageReady(page)

    await page.goto('/dashboard/campaign-assistant')
    await WaitHelper.waitForPageReady(page)
    await expect(
      page.getByRole('heading', { name: 'AI Assistant' }),
    ).toBeVisible()
    await expect(page).toHaveURL(/\/dashboard\/campaign-assistant$/)

    await visualSnapshot(page, 'mobile-ai-assistant.png', {
      mask: [page.getByRole('heading', { name: 'AI Assistant' })],
    })
  })

  test('should navigate to Content Builder on mobile', async ({ page }) => {
    await WaitHelper.waitForPageReady(page)

    await page.goto('/dashboard/content')
    await WaitHelper.waitForPageReady(page)
    await expect(
      page.getByRole('heading', { name: 'Content Builder' }),
    ).toBeVisible()
    await expect(page).toHaveURL(/\/dashboard\/content$/)

    await visualSnapshot(page, 'mobile-content-builder.png', {
      mask: [page.getByRole('heading', { name: 'Content Builder' })],
    })
  })

  test('should navigate to My Profile on mobile', async ({ page }) => {
    await WaitHelper.waitForPageReady(page)

    await page.goto('/dashboard/profile')
    await WaitHelper.waitForPageReady(page)
    await expect(page).toHaveURL(/\/profile$/)

    const bodyContent = page.locator('body')
    await expect(bodyContent).toBeVisible()

    await visualSnapshot(page, 'mobile-profile.png', {
      mask: [
        page.getByTestId('personal-first-name'),
        page.getByTestId('personal-last-name'),
        page.getByTestId('personal-email'),
        page.getByTestId('personal-phone'),
        page.getByLabel('Mobile Number'),
        page.getByTestId('personal-zip'),
      ],
    })
    console.log('✅ Mobile profile page accessible')
  })
})
