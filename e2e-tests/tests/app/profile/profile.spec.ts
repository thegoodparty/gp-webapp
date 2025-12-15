import { expect, test } from "@playwright/test";
import { NavigationHelper } from "../../../src/helpers/navigation.helper";
import { WaitHelper } from "../../../src/helpers/wait.helper";

test.describe("Profile Management", () => {
	test.beforeEach(async ({ page }) => {
		// Page is already authenticated via storageState from auth.setup.ts
		await page.goto("/dashboard");
		await page.waitForLoadState("domcontentloaded");
		await NavigationHelper.dismissOverlays(page);
	});

	test("should access profile page", async ({ page }) => {
		await page.goto("/profile");
		await WaitHelper.waitForPageReady(page);
		await expect(
			page.getByRole("heading", { name: "Personal Information" }).first(),
		).toBeVisible();
		await expect(page).toHaveURL(/\/profile$/);

		const personalFields = page.locator('[data-testid*="personal"]');
		const fieldCount = await personalFields.count();

		if (fieldCount > 0) {
			await expect(personalFields.first()).toBeVisible();
			console.log(`✅ Profile accessible with ${fieldCount} personal fields`);
		}
	});
});
