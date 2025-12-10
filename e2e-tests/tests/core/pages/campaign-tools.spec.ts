import { expect, test } from "@playwright/test";
import { CleanupHelper } from "../../../src/helpers/cleanup.helper";
import { NavigationHelper } from "../../../src/helpers/navigation.helper";
import { WaitHelper } from "../../../src/helpers/wait.helper";

test.describe("Campaign Tools Page", () => {
	test.beforeEach(async ({ page }) => {
		await NavigationHelper.navigateToPage(page, "/run-for-office");
		await NavigationHelper.dismissOverlays(page);
	});

	test.afterEach(async ({ page }, testInfo) => {
		await CleanupHelper.takeScreenshotOnFailure(page, testInfo);
	});

	test("should display campaign tools page elements", async ({ page }) => {
		await expect(page).toHaveTitle(/Campaign Tools/);
		await expect(
			page.getByText(/Supercharge your local campaign/),
		).toBeVisible();
	});

	test("should display call-to-action buttons", async ({ page }) => {
		await WaitHelper.waitForPageReady(page);
		await expect(
			page.getByRole("link", { name: "Book a free demo" }),
		).toBeVisible();
		await expect(
			page.getByRole("link", { name: "Interactive demo" }).first(),
		).toBeVisible();
	});

	test("should display campaign tools images", async ({ page }) => {
		await WaitHelper.waitForPageReady(page);
		await expect(page.getByAltText("run for office").first()).toBeVisible();
		await expect(page.getByAltText("content").first()).toBeVisible();
		await expect(page.getByAltText("GoodParty").first()).toBeVisible();
	});

	test("should navigate to demo page when clicking demo button", async ({
		page,
	}) => {
		await WaitHelper.waitForPageReady(page);

		await page.getByRole("link", { name: "Book a free demo" }).click();
		await expect(page).toHaveURL(/\/product-tour/);
	});

	test("should navigate to interactive demo", async ({ page }) => {
		await WaitHelper.waitForPageReady(page);

		await page.getByRole("link", { name: "Interactive demo" }).first().click();
		await expect(page).toHaveURL(/\/product-tour/);
	});
});
