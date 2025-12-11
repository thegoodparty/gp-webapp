import { expect, test } from "@playwright/test";
import { CleanupHelper } from "src/helpers/cleanup.helper";
import { NavigationHelper } from "src/helpers/navigation.helper";
import { WaitHelper } from "src/helpers/wait.helper";

test.describe("Website Management @experimental", () => {
	// Explicitly use the authenticated state created by setup
	test.use({ storageState: "playwright/.auth/user.json" });

	test.beforeEach(async ({ page }) => {
		await NavigationHelper.navigateToPage(page, "/dashboard/website");
		await NavigationHelper.dismissOverlays(page);
	});

	test.afterEach(async ({ page }) => {
		await CleanupHelper.clearBrowserData(page);
	});

	test("should create and publish website through complete flow", async ({
		page,
	}) => {
		await expect(
			page.getByRole("heading", { name: "Create your free website" }).first(),
		).toBeVisible();
		await expect(page).toHaveURL(/\/website$/);
		await page
			.getByRole("button", { name: "Create your website" })
			.first()
			.click();
		await WaitHelper.waitForLoadingToComplete(page);
		await expect(
			page.getByRole("heading", {
				name: "What do you want your custom link to be?",
			}),
		).toBeVisible();
		await page.getByRole("button", { name: "Next" }).click();
		await WaitHelper.waitForLoadingToComplete(page);
		await expect(
			page.getByRole("heading", { name: /Upload your campaign logo/ }),
		).toBeVisible();
		// Logo upload is skipped in CI due to CORS in test env; flow validation continues without file to verify progression. Will re-enable once file uploads are supported in Vercel test environments.
		// await page.locator('input[type="file"]').setInputFiles('src/fixtures/heart.png');
		await page.getByRole("button", { name: "Next" }).click();
		await WaitHelper.waitForLoadingToComplete(page);
		await expect(
			page.getByRole("heading", { name: "Choose a color theme" }),
		).toBeVisible();
		await page.getByText("dark").click();
		await page.getByRole("button", { name: "Next" }).click();
		await WaitHelper.waitForLoadingToComplete(page);
		await expect(
			page.getByRole("heading", { name: "Customize the content" }),
		).toBeVisible();
		// Banner upload is skipped in CI due to CORS in test env; validate navigation only. Will re-enable once file uploads are supported in Vercel test environments.
		// await page.locator('input[type="file"]').setInputFiles('src/fixtures/heart.png');
		await page.getByRole("button", { name: "Next" }).click();
		await WaitHelper.waitForLoadingToComplete(page);
		await expect(
			page.getByRole("heading", { name: "What is your campaign about?" }),
		).toBeVisible();
		await page.getByRole("button", { name: "Next" }).click();
		await WaitHelper.waitForLoadingToComplete(page);
		await expect(
			page.getByRole("heading", { name: "How can voters contact you?" }),
		).toBeVisible();
		await page.getByRole("button", { name: "Publish website" }).click();
		await WaitHelper.waitForLoadingToComplete(page);
		await expect(
			page.getByRole("heading", {
				name: "Congratulations, your website is live!",
			}),
		).toBeVisible();
		await expect(
			page.getByRole("link", { name: "Add a domain" }),
		).toBeVisible();
		await page.getByRole("link", { name: "Done" }).click();
		await expect(
			page
				.getByRole("heading", { name: /Published/ })
				.locator("div")
				.first(),
		).toBeVisible();
	});
});
