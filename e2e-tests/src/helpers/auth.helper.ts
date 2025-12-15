import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { getCurrentEnvironment } from "../config/environments";

export interface UserCredentials {
	email: string;
	password: string;
}

export class AuthHelper {
	static async loginAsUser(
		page: Page,
		credentials: UserCredentials,
	): Promise<void> {
		const config = getCurrentEnvironment();

		await page.goto("/login");
		await page.waitForLoadState("domcontentloaded");

		// Use user-facing locators (Playwright best practice)
		await page.getByLabel("Email").fill(credentials.email);
		await page
			.getByPlaceholder("Please don't use your dog's")
			.fill(credentials.password); // More specific password field locator

		// Wait for button to be enabled (form validation)
		const loginButton = page.getByRole("button", { name: "Login" });
		await expect(loginButton).toBeEnabled();
		await loginButton.click();

		// Web-first assertion with auto-waiting
		await expect(page.getByText("Dashboard")).toBeVisible();
		await expect(page).toHaveURL(/\/dashboard$/);
	}

	static async loginAsAdmin(page: Page): Promise<void> {
		const adminEmail = process.env.TEST_USER_ADMIN;
		const adminPassword = process.env.TEST_USER_ADMIN_PASSWORD;

		if (!adminEmail || !adminPassword) {
			throw new Error("Admin credentials not found in environment variables");
		}

		await AuthHelper.loginAsUser(page, {
			email: adminEmail,
			password: adminPassword,
		});
	}

	static async logout(page: Page): Promise<void> {
		await page.getByRole("button", { name: "Logout" }).click();
		await expect(page).toHaveURL(/\/(login|$)/);
	}
}
