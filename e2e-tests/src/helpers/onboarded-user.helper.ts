import type { Page } from "@playwright/test";
import type { TestUser } from "../utils/test-data-manager";

export class OnboardedUserHelper {
	/**
	 * Login with a user that has already completed onboarding
	 * This is the preferred method for dashboard tests
	 */
	static async loginWithOnboardedUser(
		page: Page,
		credentials: TestUser,
	): Promise<void> {
		await page.goto("/login");
		await page.waitForLoadState("domcontentloaded");

		await page.getByLabel("Email").fill(credentials.email);
		await page
			.getByPlaceholder("Please don't use your dog's")
			.fill(credentials.password);

		const loginButton = page.getByRole("button", { name: "Login" });
		await loginButton.waitFor({ state: "visible", timeout: 10000 });
		await loginButton.click();

		// Should go directly to dashboard since onboarding is complete
		await page.waitForURL(/\/dashboard/, { timeout: 30000 });
		console.log(`✅ Logged in with onboarded user: ${credentials.email}`);
	}

	/**
	 * Delete an onboarded user account
	 */
	static async deleteOnboardedUser(page: Page): Promise<void> {
		await page.goto("/profile");
		await page.waitForLoadState("domcontentloaded");

		await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

		const deleteButton = page.getByText("Delete Account");
		await deleteButton.scrollIntoViewIfNeeded();
		await deleteButton.waitFor({ state: "visible", timeout: 10000 });
		await deleteButton.click();

		await page.waitForSelector('[role="dialog"]', { timeout: 10000 });

		const proceedButton = page.getByRole("button", { name: "Proceed" });
		await proceedButton.waitFor({ state: "visible", timeout: 10000 });
		await proceedButton.click();

		await page.waitForURL((url) => new URL(url).pathname === "/", {
			timeout: 15000,
		});
		console.log("✅ Onboarded user account deleted");
	}
}
