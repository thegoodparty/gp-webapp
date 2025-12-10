import type { Page } from "@playwright/test";
import type { TestUser } from "../utils/test-data-manager";
import { TestDataHelper } from "./data.helper";

export class OnboardedUserHelper {
	/**
	 * Create a user and complete the full onboarding flow
	 * This should only be used when you need a fresh onboarded user
	 */
	static async createOnboardedUser(page: Page): Promise<TestUser> {
		const userData = TestDataHelper.generateTestUser();
		console.log(`🚀 Creating fully onboarded user: ${userData.email}`);

		// Step 0: Create account
		await page.goto("/sign-up");
		await page.waitForLoadState("domcontentloaded");

		await page
			.getByRole("textbox", { name: "First Name" })
			.fill(userData.firstName);
		await page
			.getByRole("textbox", { name: "Last Name" })
			.fill(userData.lastName);
		await page.getByRole("textbox", { name: "email" }).fill(userData.email);
		await page.getByRole("textbox", { name: "phone" }).fill(userData.phone);
		await page
			.getByRole("textbox", { name: "Zip Code" })
			.fill(userData.zipCode);
		await page
			.getByPlaceholder("Please don't use your dog's name")
			.fill(userData.password);

		const joinButton = page.getByRole("button", { name: "Join" });
		await joinButton.waitFor({ state: "visible", timeout: 15000 });
		await joinButton.click();

		// Wait for onboarding
		await page.waitForURL((url) => url.toString().includes("/onboarding/"), {
			timeout: 45000,
		});

		// Complete onboarding flow
		await OnboardedUserHelper.completeOnboardingFlow(page);

		// Verify we're at dashboard
		if (!page.url().includes("/dashboard")) {
			throw new Error(`Onboarding failed - ended at: ${page.url()}`);
		}

		console.log(`✅ Successfully created onboarded user: ${userData.email}`);
		return userData;
	}

	/**
	 * Complete the onboarding flow assuming we're already on step 1
	 */
	static async completeOnboardingFlow(page: Page): Promise<void> {
		let attempts = 0;
		const maxAttempts = 10;

		while (page.url().includes("/onboarding/") && attempts < maxAttempts) {
			await page.waitForLoadState("domcontentloaded");

			// Step 1: Office Selection
			if (page.url().includes("/1")) {
				console.log("📍 Completing Step 1: Office Selection");
				await OnboardedUserHelper.completeOfficeSelection(page);
			}

			// Step 2: Party Selection
			else if (page.url().includes("/2")) {
				console.log("🎭 Completing Step 2: Party Selection");
				await OnboardedUserHelper.completePartySelection(page);
			}

			// Step 3: Pledge Step
			else if (page.url().includes("/3")) {
				console.log("📜 Completing Step 3: Pledge Agreement");
				await OnboardedUserHelper.completePledgeStep(page);
			}

			// Step 4: Complete Step
			else if (page.url().includes("/4")) {
				console.log("🎉 Completing Step 4: Finish Onboarding");
				await OnboardedUserHelper.completeFinishStep(page);
				return; // Should redirect to dashboard
			}

			attempts++;
			await page.waitForTimeout(1000);
		}

		if (page.url().includes("/onboarding/")) {
			throw new Error(`Onboarding stuck at: ${page.url()}`);
		}
	}

	private static async completeOfficeSelection(page: Page): Promise<void> {
		// Fill zip code
		const zipField = page.getByLabel("Zip Code");
		if (await zipField.isVisible({ timeout: 5000 })) {
			await zipField.fill("28739");

			// Select office level
			const levelSelect = page.getByLabel("Office Level");
			if (await levelSelect.isVisible({ timeout: 5000 })) {
				try {
					await levelSelect.selectOption("Local/Township/City");
				} catch (error) {
					await levelSelect.selectOption({ index: 1 });
				}

				// Wait for offices to load
				await page.waitForLoadState("networkidle", { timeout: 15000 });

				// Wait for offices to appear
				await page.waitForFunction(
					() => {
						const text = document.body.textContent || "";
						return (
							text.includes("offices found") || text.includes("office found")
						);
					},
					{ timeout: 20000 },
				);

				// Select first office using the working approach from globalSetup
				console.log("🔍 Looking for office selection elements...");

				// Method 1: Radio buttons (most likely based on screenshots)
				const officeRadios = page.locator('input[type="radio"]');
				const radioCount = await officeRadios.count();
				console.log(`📻 Found ${radioCount} radio buttons`);

				if (radioCount > 0) {
					await officeRadios.first().click();
					console.log("✅ Selected first office via radio button");
					await page.waitForTimeout(2000);
				} else {
					// Method 2: Look for office buttons (this is what's working)
					const officeButtons = page.getByRole("button").filter({
						hasText:
							/Council|Mayor|Board|Commission|Village|County|Flat Rock|Henderson/,
					});
					const buttonCount = await officeButtons.count();
					console.log(`🔘 Found ${buttonCount} office buttons`);

					if (buttonCount > 0) {
						await officeButtons.first().click();
						console.log("✅ Selected office via button");
						await page.waitForTimeout(2000);
					} else {
						throw new Error("No office selection elements found");
					}
				}

				// Wait for selection to register
				await page.waitForTimeout(2000);

				// Click Next
				const nextButton = page.getByRole("button", { name: "Next" }).first();
				await nextButton.waitFor({ state: "visible", timeout: 5000 });

				// Wait for button to be enabled
				await page.waitForFunction(
					() => {
						const button = document.querySelector(
							'button[type="submit"][data-step="1"]',
						);
						return button && !(button as HTMLButtonElement).disabled;
					},
					{ timeout: 10000 },
				);

				await nextButton.click();
				console.log("✅ Completed Step 1");
			}
		}
	}

	private static async completePartySelection(page: Page): Promise<void> {
		console.log("🎭 Step 2: Party Selection");

		// Use the working approach from globalSetup
		let partySelected = false;

		// Method 1: Look for "Other" input field (this is working)
		const otherLabel = page.getByLabel("Other");
		if (await otherLabel.isVisible({ timeout: 3000 })) {
			await otherLabel.fill("Independent");
			partySelected = true;
			console.log("✅ Filled 'Other' party field with 'Independent'");
		}

		if (!partySelected) {
			// Method 2: Look for any text input field
			const allInputs = page.locator('input[type="text"]');
			const inputCount = await allInputs.count();
			console.log(`🔍 Found ${inputCount} text input fields`);

			for (let i = 0; i < inputCount; i++) {
				try {
					const input = allInputs.nth(i);
					await input.fill("Independent");
					await page.waitForTimeout(500);

					const value = await input.inputValue();
					if (value === "Independent") {
						partySelected = true;
						console.log(
							`✅ Successfully filled input field ${i} with party affiliation`,
						);
						break;
					}
				} catch (error) {}
			}
		}

		if (!partySelected) {
			throw new Error("Could not find party selection field");
		}

		// Wait for form validation
		await page.waitForTimeout(2000);

		// Click Next
		const nextButton = page.getByRole("button", { name: "Next" }).first();
		await nextButton.waitFor({ state: "visible", timeout: 5000 });

		// Check if button is enabled
		const isEnabled = await nextButton.isEnabled();
		console.log(`➡️ Next button enabled: ${isEnabled}`);

		if (isEnabled) {
			await nextButton.click();
			console.log("✅ Clicked Next button for Step 2");
		} else {
			console.warn("⚠️ Next button is disabled, trying force click");
			await nextButton.click({ force: true });
		}

		console.log("✅ Completed Step 2");
	}

	private static async completePledgeStep(page: Page): Promise<void> {
		const agreeButton = page.getByRole("button", { name: "I Agree" });
		await agreeButton.waitFor({ state: "visible", timeout: 10000 });
		await agreeButton.click();
		console.log("✅ Completed Step 3");
	}

	private static async completeFinishStep(page: Page): Promise<void> {
		const viewDashboardButton = page.getByRole("button", {
			name: "View Dashboard",
		});
		await viewDashboardButton.waitFor({ state: "visible", timeout: 10000 });
		await viewDashboardButton.click();

		// Wait for dashboard
		await page.waitForURL(/\/dashboard/, { timeout: 15000 });
		console.log("✅ Completed Step 4 - Reached Dashboard");
	}

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
