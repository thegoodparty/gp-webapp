import type { Page } from "@playwright/test";

export class WaitHelper {
  static async waitForPageReady(page: Page): Promise<void> {
    // Wait for DOM content to load
    await page.waitForLoadState("domcontentloaded");
    
    // Wait for network to be idle (with timeout)
    try {
      await page.waitForLoadState("networkidle", { timeout: 10000 });
    } catch {
      // Continue if network idle times out - don't block tests
      console.log("Network idle timeout, continuing...");
    }
    
    // Wait for page to be fully ready
    await page.waitForFunction(() => document.readyState === "complete");
  }

  static async waitForElementVisible(page: Page, selector: string): Promise<void> {
    await page.waitForSelector(selector, { state: "visible" });
  }

  static async waitForApiResponse(page: Page, urlPattern: string): Promise<void> {
    await page.waitForResponse(response => 
      response.url().includes(urlPattern) && response.status() === 200
    );
  }

  static async waitForCondition(
    page: Page, 
    condition: () => Promise<boolean>,
    timeout: number = 30000
  ): Promise<void> {
    await page.waitForFunction(condition, { timeout });
  }

  static async waitForLoadingToComplete(page: Page): Promise<void> {
    // Wait for common loading indicators to disappear
    await page.waitForFunction(() => {
      const loadingElements = document.querySelectorAll(
        '[data-loading="true"], .loading, .spinner, [class*="loading"], [class*="Loading"]'
      );
      return loadingElements.length === 0;
    }, { timeout: 30000 });
  }
}
