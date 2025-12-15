import { expect, test } from "@playwright/test";
import { AccountHelper } from "../../../src/helpers/account.helper";
import { CleanupHelper } from "../../../src/helpers/cleanup.helper";
import { TestDataHelper } from "../../../src/helpers/data.helper";
import { NavigationHelper } from "../../../src/helpers/navigation.helper";

// Reset storage state for auth tests to avoid being pre-authenticated
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Sign Up Functionality", () => {
	test.afterEach(async ({ page }, testInfo) => {
		await CleanupHelper.takeScreenshotOnFailure(page, testInfo);
	});

	test("should create new account successfully", async ({ page }) => {
		const testUser = await AccountHelper.createTestAccount(page);
		await expect(page).toHaveURL(/\/dashboard/);
		console.log(`✅ Test account created and onboarded: ${testUser.email}`);
	});

	test("should display sign up form elements", async ({ page }) => {
		await NavigationHelper.navigateToPage(page, "/sign-up");
		await NavigationHelper.dismissOverlays(page);
		await expect(
			page.getByRole("heading", { name: "Join GoodParty.org" }),
		).toBeVisible();
		await expect(
			page.getByRole("textbox", { name: "First Name" }),
		).toBeVisible();
		await expect(
			page.getByRole("textbox", { name: "Last Name" }),
		).toBeVisible();
		await expect(page.getByRole("textbox", { name: "email" })).toBeVisible();
		await expect(page.getByRole("textbox", { name: "phone" })).toBeVisible();
		await expect(page.getByRole("textbox", { name: "Zip Code" })).toBeVisible();
		await expect(page.getByRole("textbox", { name: "password" })).toBeVisible();
		await expect(page.getByRole("button", { name: "Join" })).toBeVisible();
	});

	test("should validate and process form data correctly", async ({ page }) => {
		await NavigationHelper.navigateToPage(page, "/sign-up");
		await NavigationHelper.dismissOverlays(page);

		const testZip = "94066";
		const unique = TestDataHelper.generateTimestamp();
		const testEmail = TestDataHelper.generateTestEmail();
		const testPhone = TestDataHelper.generateTestPhone();
		await page
			.getByRole("textbox", { name: "First Name" })
			.fill(` firstName-${unique}`);
		await page
			.getByRole("textbox", { name: "Last Name" })
			.fill(` lastName-${unique}`);
		await page.getByRole("textbox", { name: "email" }).fill(testEmail);
		await page.getByRole("textbox", { name: "phone" }).fill(testPhone);
		await page.getByRole("textbox", { name: "Zip Code" }).fill(testZip);
		await page
			.getByRole("textbox", { name: "password" })
			.fill("TestPassword123!");
		await page.getByRole("button", { name: "Join" }).click();
		const registerResponse = await page.waitForResponse((resp) => {
			return (
				resp.url().includes("/register") &&
				resp.request().method() === "POST" &&
				resp.headers()["content-type"]?.includes("application/json")
			);
		});

		const body = await registerResponse.json();
		// Handle possible response shapes: { user: {...} } or { data: { user: {...} } }
		const user = (body?.user ?? body?.data?.user) as any;
		expect(
			user,
			`Unexpected registration response shape: ${JSON.stringify(body)}`,
		).toBeTruthy();
		const firstName = user.firstName as string;
		const lastName = user.lastName as string;
		const email = user.email as string;
		const zip = user.zip as string;
		const phone = user.phone as string;
		expect(firstName).toBe(firstName.trim());
		expect(lastName).toBe(lastName.trim());
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		expect(email.trim()).toBe(email);
		expect(emailRegex.test(email)).toBeTruthy();
		const zipRegex = /^\d{5}(?:-\d{4})?$/;
		expect(zip.trim()).toBe(zip);
		expect(zipRegex.test(zip)).toBeTruthy();
		const phoneRegex = /^\d{10}$/;
		expect(phone.trim()).toBe(phone);
		expect(phoneRegex.test(phone)).toBeTruthy();
		await expect(page).toHaveURL(/\/onboarding/);
	});
});
