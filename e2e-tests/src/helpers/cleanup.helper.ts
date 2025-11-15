import { Page, TestInfo } from "@playwright/test";

export class CleanupHelper {
  static async takeScreenshotOnFailure(page: Page, testInfo: TestInfo): Promise<void> {
    if (testInfo.status === "failed") {
      const screenshotPath = `screenshots/${testInfo.title.replace(/[^a-z0-9]/gi, '_')}-${Date.now()}.png`;
      await page.screenshot({
        path: screenshotPath,
        fullPage: true,
      });
      console.log(`Screenshot saved: ${screenshotPath}`);
    }
  }

  static async cleanupTestData(): Promise<void> {
    // Placeholder for test data cleanup
    // This would typically clean up any test data created during the test
    console.log("Cleaning up test data...");
  }

  static async clearBrowserData(page: Page): Promise<void> {
    // Clear cookies, local storage, session storage
    await page.context().clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  }
}
