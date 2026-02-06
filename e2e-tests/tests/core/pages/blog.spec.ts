import { expect, test } from "@playwright/test";
import { NavigationHelper } from "../../../src/helpers/navigation.helper";
import { WaitHelper } from "../../../src/helpers/wait.helper";

test.describe("Blog Page", () => {
	test.beforeEach(async ({ page }) => {
		await NavigationHelper.navigateToPage(page, "/blog");
		await NavigationHelper.dismissOverlays(page);
	});

	test("should display blog page elements", async ({ page }) => {
		await expect(page.getByRole("heading", { name: "Blog" })).toBeVisible();

		await expect(
			page.getByText(
				/Insights into politics, running for office, and the latest updates from the independent movement/,
			),
		).toBeVisible();

		await expect(
			page.getByRole("link", { name: "Latest Articles" }).first(),
		).toBeVisible();
		await expect(
			page.getByRole("link", { name: "News" }).first(),
		).toBeVisible();
		await expect(
			page.getByRole("link", { name: "Politics" }).first(),
		).toBeVisible();
		await expect(
			page.getByRole("link", { name: "Independent Cause" }).first(),
		).toBeVisible();
	});

	test("should display blog articles", async ({ page }) => {
		await WaitHelper.waitForPageReady(page);
		await expect(
			page.getByRole("button", { name: "Read More" }).first(),
		).toBeVisible();
		await expect(
			page.getByRole("button", { name: "Read More" }).first(),
		).toBeEnabled();
	});

	test("should navigate to blog article", async ({ page }) => {
		await WaitHelper.waitForPageReady(page);

		await page.getByRole("button", { name: "Read More" }).first().click();
		await expect(page).toHaveURL(/.*\/article/);
	});

	test("should filter blog by news category", async ({ page }) => {
		await page.getByRole("link", { name: "News" }).first().click();

		await expect(page).toHaveURL(/\/section\/news/i);
		await expect(page.getByTestId("articleTitle")).toHaveText("News");
	});

	test("should filter blog by politics category", async ({ page }) => {
		await page.getByRole("link", { name: "Politics" }).first().click();

		await expect(page).toHaveURL(/\/section\/politics/i);
		await expect(page.getByTestId("articleTitle")).toHaveText("Politics");
	});

	test("should navigate to blog article and display content", async ({
		page,
	}) => {
		await WaitHelper.waitForPageReady(page);

		await page.getByRole("button", { name: "Read More" }).first().click();
		await WaitHelper.waitForPageReady(page);
		await expect(page.getByTestId("articleHeroImage")).toBeVisible();
		await expect(page.getByTestId("articleTitle")).toBeVisible();
		await expect(page.getByTestId("articleCategory")).toBeVisible();
		await expect(page.getByTestId("blogAuthor")).toBeVisible();
		await expect(page.getByTestId("CMS-contentWrapper").first()).toBeVisible();

		const shareButtons = page.getByTestId("shareBlog");
		await expect(shareButtons.first()).toBeVisible();

		const faqSection = page.getByTestId("faqSection");
		if (await faqSection.isVisible({ timeout: 5000 })) {
			await expect(faqSection).toBeVisible();
		}
	});
});
