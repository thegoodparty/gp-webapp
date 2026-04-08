import type { Page } from '@playwright/test'
import { WaitHelper } from './wait.helper'

// LinkedIn's analytics script (snap.licdn.com) intermittently stalls in CI,
// which prevents the browser's `load` event from firing and causes Playwright's
// `page.goto()` to time out at 45s. Blocking it has no effect on test coverage.
export const blockSlowScripts = async (page: Page) => {
  await page.route('**/snap.licdn.com/**', (route) => route.abort())
}

export class NavigationHelper {
  /**
   * Opens the mobile nav drawer. New dashboard sidebar uses an "Open menu" button;
   * legacy layouts use the Hamburger (`data-testid="tilt"`).
   */
  static async openMobileNavMenu(page: Page): Promise<void> {
    const openMenu = page.getByRole('button', { name: /open menu/i })
    if (await openMenu.isVisible().catch(() => false)) {
      await openMenu.click()
      return
    }

    const tilts = page.getByTestId('tilt')
    const count = await tilts.count()
    if (count === 0) {
      throw new Error('No mobile menu trigger found (Open menu or tilt)')
    }
    for (let i = 0; i < count; i++) {
      const t = tilts.nth(i)
      if (await t.isVisible().catch(() => false)) {
        await t.click()
        return
      }
    }
    // Legacy layouts sometimes attach two tilt nodes (e.g. desktop + mobile); the
    // actionable one may only match index 1, or need force when CSS hides duplicates.
    if (count >= 2) {
      await tilts.nth(1).click({ force: true })
      return
    }
    await tilts.first().click({ force: true })
  }

  static async navigateToPage(page: Page, path: string): Promise<void> {
    await page.goto(path)
    await WaitHelper.waitForPageReady(page)
  }

  static async dismissCookieBanner(page: Page): Promise<void> {
    try {
      // Try multiple common cookie banner patterns
      const cookieSelectors = [
        page.getByRole('button', { name: 'Close' }),
        page.getByRole('button', { name: /accept/i }),
        page.getByRole('button', { name: /agree/i }),
        page.getByRole('button', { name: /ok/i }),
        page.getByRole('button', { name: /dismiss/i }),
        page.locator(
          '[data-testid*="cookie"] button, [class*="cookie"] button, [id*="cookie"] button',
        ),
        page.locator('button:has-text("×"), button:has-text("✕")'),
      ]

      for (const selector of cookieSelectors) {
        try {
          if (await selector.first().isVisible({ timeout: 2000 })) {
            await selector.first().click()
            await selector.first().waitFor({ state: 'hidden', timeout: 5000 })
            return
          }
        } catch {
          // Try next selector
        }
      }
    } catch {
      // Cookie banner not present - continue silently
    }
  }

  static async dismissOverlays(page: Page): Promise<void> {
    try {
      // Dismiss cookie banner
      await NavigationHelper.dismissCookieBanner(page)

      // Dismiss promotional overlays
      const promoOverlay = page.getByRole('heading', {
        name: 'Win with GoodParty.org Pro!',
      })
      if (await promoOverlay.isVisible({ timeout: 2000 })) {
        await page.getByRole('img').first().click() // Close button
      }
    } catch {
      // Overlays not present - continue
    }
  }

  static async openMobileMenu(page: Page): Promise<void> {
    const openMenu = page.getByRole('button', { name: /open menu/i })
    if (await openMenu.isVisible().catch(() => false)) {
      await openMenu.click()
      return
    }
    const trigger = page.getByTestId('mobile-menu-trigger')
    if (await trigger.isVisible().catch(() => false)) {
      await trigger.click()
      return
    }
    await NavigationHelper.openMobileNavMenu(page)
  }
}
