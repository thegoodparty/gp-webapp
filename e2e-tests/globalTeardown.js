import { chromium } from "@playwright/test";
import { TestDataManager } from "./src/utils/test-data-manager";

export default async function globalTeardown() {
	console.log("🧹 Starting test suite cleanup...");

	// Create a browser context for cleanup operations with proper baseURL
	const browser = await chromium.launch();
	const context = await browser.newContext({
		baseURL: process.env.BASE_URL || "http://localhost:4000",
	});
	const page = await context.newPage();

	try {
		// Clean up any remaining individual test data
		await TestDataManager.cleanup(page);

		// Clean up global test user if it exists
		await cleanupGlobalTestUser(page);
	} finally {
		await browser.close();
	}
}

async function cleanupGlobalTestUser(page) {
	const globalUserEmail = process.env.GLOBAL_TEST_USER_EMAIL;
	const globalUserPassword = process.env.GLOBAL_TEST_USER_PASSWORD;

	if (globalUserEmail && globalUserPassword) {
		console.log(`🌍 Cleaning up global test user: ${globalUserEmail}`);

		try {
			// Login as global user
			await page.goto("/login");
			await page.waitForLoadState("domcontentloaded");

			await page.getByLabel("Email").fill(globalUserEmail);
			await page
				.getByPlaceholder("Please don't use your dog's")
				.fill(globalUserPassword);

			const loginButton = page.getByRole("button", { name: "Login" });
			await loginButton.waitFor({ state: "visible", timeout: 10000 });
			await loginButton.click();

			// Wait for successful login
			await page.waitForURL(/\/dashboard/, { timeout: 30000 });

			// Delete the global user account
			await TestDataManager.deleteAccount(page);

			console.log("✅ Global test user cleaned up successfully");
		} catch (error) {
			console.warn("⚠️ Failed to cleanup global test user:", error.message);
		}
	}

	console.log("✅ Global teardown completed successfully");
}
