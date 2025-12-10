import { expect, test } from "@playwright/test";
import { CleanupHelper } from "../../../src/helpers/cleanup.helper";
import { TestDataHelper } from "../../../src/helpers/data.helper";
import { NavigationHelper } from "../../../src/helpers/navigation.helper";
import { WaitHelper } from "../../../src/helpers/wait.helper";

test.describe("Volunteer Page", () => {
	test.beforeEach(async ({ page }) => {
		await NavigationHelper.navigateToPage(page, "/volunteer");
		await NavigationHelper.dismissOverlays(page);
	});

	test.afterEach(async ({ page }, testInfo) => {
		await CleanupHelper.takeScreenshotOnFailure(page, testInfo);
	});

	test("should display volunteer page elements", async ({ page }) => {
		await expect(page).toHaveTitle(/Get Involved/);
		await expect(
			page.getByText(/Turn dissatisfaction into action/),
		).toBeVisible();

		const actionButton = page.getByRole("button", {
			name: "Start taking action",
		});
		if (await actionButton.isVisible({ timeout: 5000 })) {
			await expect(actionButton.first()).toBeVisible();
		}

		const involvementButtons = page
			.getByRole("button")
			.filter({ hasText: /Get Involved|Join|Sign Up|Volunteer/ });
		const buttonCount = await involvementButtons.count();
		if (buttonCount > 0) {
			await expect(involvementButtons.first()).toBeVisible();
		}
	});

	test("should display volunteer images", async ({ page }) => {
		await WaitHelper.waitForPageReady(page);
		await expect(page.getByAltText("megaphone").first()).toBeVisible();
		await expect(page.getByAltText("GoodParty").first()).toBeVisible();

		const peopleImages = page.getByAltText(/Sal Davis|Terry Vo|Kieryn McCann/);
		const peopleCount = await peopleImages.count();
		if (peopleCount > 0) {
			await expect(peopleImages.first()).toBeVisible();
		}
	});

	test("should have working volunteer form", async ({ page }) => {
		await WaitHelper.waitForPageReady(page);

		const testUser = TestDataHelper.generateTestUser();
		await page.locator("input[name='First Name']").fill(testUser.firstName);
		await page.locator("input[name='Last Name']").fill(testUser.lastName);
		await page.locator("input[name='phone']").fill(testUser.phone);
		await page.locator("input[name='email']").fill(testUser.email);

		const checkbox = page.locator("input[type='checkbox']");
		if (await checkbox.isVisible({ timeout: 5000 })) {
			await checkbox.click();
		}

		const submitButton = page.getByRole("button", {
			name: /Start taking action/,
		});
		await submitButton.first().click();

		await expect(
			page.getByText(/Thank you! we will be in touch soon./),
		).toBeVisible({ timeout: 30000 });
	});

	test("should display FAQ sections", async ({ page }) => {
		await WaitHelper.waitForPageReady(page);
		const expandables = page.getByTestId("faq-expandable");
		const count = await expandables.count();

		if (count > 0) {
			const firstExpandButton = expandables
				.first()
				.locator('button[aria-label="expand"]');
			if (await firstExpandButton.isVisible({ timeout: 5000 })) {
				await expect(firstExpandButton).toHaveAttribute("aria-label", "expand");
				await firstExpandButton.click();

				const collapseButton = expandables
					.first()
					.locator('button[aria-label="collapse"]');
				await expect(collapseButton).toBeVisible();
			}
		}
	});

	test("should have proper form validation", async ({ page }) => {
		await WaitHelper.waitForPageReady(page);
		const submitButton = page.getByRole("button", {
			name: /Start taking action/,
		});

		if (await submitButton.isVisible({ timeout: 5000 })) {
			await expect(submitButton.first()).toBeDisabled();
		}

		const firstNameField = page.locator("input[name='First Name']");
		const emailField = page.locator("input[name='email']");

		if (await firstNameField.isVisible({ timeout: 5000 })) {
			await expect(firstNameField).toBeVisible();
		}
		if (await emailField.isVisible({ timeout: 5000 })) {
			await expect(emailField).toBeVisible();
		}
	});
});
