import { Page, expect } from "@playwright/test";
import { WaitHelper } from "./wait.helper";

export class NavigationHelper {
  static async navigateToPage(page: Page, path: string): Promise<void> {
    await page.goto(path);
    await WaitHelper.waitForPageReady(page);
  }

  static async dismissCookieBanner(page: Page): Promise<void> {
    try {
      // Use user-facing locator instead of generic selector
      const closeButton = page.getByRole("button", { name: "Close" });
      if (await closeButton.isVisible({ timeout: 5000 })) {
        await closeButton.click();
      }
    } catch {
      // Cookie banner not present - continue silently
    }
  }

  static async dismissOverlays(page: Page): Promise<void> {
    try {
      // Dismiss cookie banner
      await this.dismissCookieBanner(page);
      
      // Dismiss promotional overlays
      const promoOverlay = page.getByRole("heading", { name: "Win with GoodParty.org Pro!" });
      if (await promoOverlay.isVisible({ timeout: 2000 })) {
        await page.getByRole("img").first().click(); // Close button
      }
    } catch {
      // Overlays not present - continue
    }
  }

  static async navigateToNavItem(page: Page, navItem: string, isMobile: boolean = false): Promise<void> {
    if (isMobile) {
      // Open mobile menu
      await page.getByTestId("tilt").nth(1).click();
      await page.getByRole("link", { name: navItem }).click();
      await page.getByTestId("tilt").nth(1).click(); // Close menu
    } else {
      await page.getByRole("link", { name: navItem }).click();
    }
    
    await WaitHelper.waitForPageReady(page);
  }
}
