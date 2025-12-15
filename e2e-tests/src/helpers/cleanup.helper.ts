import type { Page } from "@playwright/test";

export class CleanupHelper {
	static async cleanupTestData(page?: Page): Promise<void> {
		const { TestDataManager } = await import("../utils/test-data-manager");
		await TestDataManager.cleanup(page);
	}

	static async clearBrowserData(page: Page): Promise<void> {
		try {
			// Clear cookies
			await page.context().clearCookies();

			// Clear storage (with error handling for security restrictions)
			await page.evaluate(() => {
				try {
					localStorage.clear();
					sessionStorage.clear();
				} catch (error) {
					// Ignore security errors - some pages restrict storage access
					console.log("Storage clear skipped due to security restrictions");
				}
			});
		} catch (error) {
			// Don't fail tests due to cleanup issues
			console.warn("Browser data cleanup failed:", error.message);
		}
	}
}
