import { getCurrentEnvironment } from "./src/config/environments";

export default async function globalSetup() {
	console.log("🚀 Starting test suite setup...");

	// Validate environment configuration
	const config = getCurrentEnvironment();
	console.log(`📍 Environment: ${process.env.NODE_ENV || "local"}`);
	console.log(`🌐 Base URL: ${config.baseURL}`);

	// Validate required environment variables for admin tests
	if (!process.env.TEST_USER_ADMIN || !process.env.TEST_USER_ADMIN_PASSWORD) {
		console.warn(
			"⚠️  Admin credentials not found - admin tests will be skipped",
		);
	}

	// Create test results directory
	const fs = await import("fs");
	const path = await import("path");

	const resultsDir = path.resolve(__dirname, "test-results");
	if (!fs.existsSync(resultsDir)) {
		fs.mkdirSync(resultsDir, { recursive: true });
	}

	const screenshotsDir = path.resolve(__dirname, "screenshots");
	if (!fs.existsSync(screenshotsDir)) {
		fs.mkdirSync(screenshotsDir, { recursive: true });
	}

	// Create a global test user with completed onboarding for reuse
	await createGlobalTestUser();

	console.log("✅ Global setup completed successfully");
}

async function createGlobalTestUser() {
	const { chromium } = require("@playwright/test");

	console.log("👤 Creating global test user with completed onboarding...");

	const browser = await chromium.launch();
	const context = await browser.newContext();
	const page = await context.newPage();

	try {
		const config = getCurrentEnvironment();
		await page.goto(`${config.baseURL}/sign-up`);

		// Generate global user data (inline implementation)
		const timestamp = Date.now();
		const env = process.env.NODE_ENV || "local";

		const globalUser = {
			firstName: `GlobalTest${timestamp}`,
			lastName: "User",
			email: `global-test-user-${timestamp}@${env}.example.com`,
			phone: `5105${timestamp.toString().slice(-6)}`,
			password: process.env.TEST_DEFAULT_PASSWORD || "TestPassword123!",
			zipCode: "28739",
		};

		// Create account
		await page
			.getByRole("textbox", { name: "First Name" })
			.fill(globalUser.firstName);
		await page
			.getByRole("textbox", { name: "Last Name" })
			.fill(globalUser.lastName);
		await page.getByRole("textbox", { name: "email" }).fill(globalUser.email);
		await page.getByRole("textbox", { name: "phone" }).fill(globalUser.phone);
		await page
			.getByRole("textbox", { name: "Zip Code" })
			.fill(globalUser.zipCode);
		await page
			.getByPlaceholder("Please don't use your dog's name")
			.fill(globalUser.password);

		const joinButton = page.getByRole("button", { name: "Join" });
		await joinButton.waitFor({ state: "visible", timeout: 15000 });

		// Wait for form validation to complete (with fallback)
		try {
			await page.waitForFunction(
				() => {
					const button = document.querySelector('button[type="submit"]');
					return button && !button.disabled;
				},
				{ timeout: 5000 },
			);
		} catch (error) {
			console.warn("⚠️ Form validation wait timed out, proceeding anyway");
		}

		await joinButton.click();

		// Wait for successful registration
		await page.waitForURL((url) => !url.toString().includes("/sign-up"), {
			timeout: 45000,
		});

		// Try to complete onboarding if we're redirected there
		if (page.url().includes("/onboarding/")) {
			console.log("🚀 Attempting to complete onboarding for global user...");
			try {
				await completeOnboardingFlow(page);

				// Verify we reached dashboard after onboarding
				if (page.url().includes("/dashboard")) {
					console.log(
						"✅ Successfully completed onboarding and reached dashboard",
					);
				} else {
					console.warn(
						"⚠️ Onboarding didn't lead to dashboard, current URL:",
						page.url(),
					);
					console.log(
						"ℹ️ Global user will be available but may need onboarding completion in tests",
					);
				}
			} catch (error) {
				console.warn("⚠️ Onboarding completion failed:", error.message);
				console.log("ℹ️ Global user created but still in onboarding state");
			}
		}

		// Store global user credentials in environment for tests to use
		process.env.GLOBAL_TEST_USER_EMAIL = globalUser.email;
		process.env.GLOBAL_TEST_USER_PASSWORD = globalUser.password;
		process.env.GLOBAL_TEST_USER_FIRST_NAME = globalUser.firstName;
		process.env.GLOBAL_TEST_USER_LAST_NAME = globalUser.lastName;

		console.log(`✅ Global test user created: ${globalUser.email}`);
	} catch (error) {
		console.warn("⚠️ Failed to create global test user:", error.message);
		console.warn("Tests will fall back to creating individual accounts");
	} finally {
		await context.close();
		await browser.close();
	}
}

// Inline onboarding completion logic to avoid module import issues
async function completeOnboardingFlow(page) {
	try {
		let attempts = 0;
		while (page.url().includes("/onboarding/") && attempts < 10) {
			await page.waitForLoadState("domcontentloaded");

			// Step 1: Office Selection
			if (page.url().includes("/1")) {
				console.log("📍 Step 1: Office Selection");

				const zipField = page.getByLabel("Zip Code");
				if (await zipField.isVisible({ timeout: 5000 })) {
					await zipField.fill("28739");

					// Try different selectors for the Office Level dropdown
					let levelSelect = page.getByLabel("Office Level");
					if (!(await levelSelect.isVisible({ timeout: 2000 }))) {
						levelSelect = page
							.locator("select")
							.filter({ hasText: /Select|Office/ });
					}
					if (!(await levelSelect.isVisible({ timeout: 2000 }))) {
						levelSelect = page.locator('select, [role="combobox"]').first();
					}

					if (await levelSelect.isVisible({ timeout: 5000 })) {
						// Try different option values
						try {
							await levelSelect.selectOption("Local/Township/City");
						} catch (error) {
							console.warn(
								"⚠️ Failed to select 'Local/Township/City', trying alternatives...",
							);
							try {
								await levelSelect.selectOption({ index: 1 }); // Select first non-default option
							} catch (error2) {
								console.warn(
									"⚠️ Failed to select by index, trying click approach...",
								);
								await levelSelect.click();
								await page.waitForTimeout(1000);
								// Try to click the first option that appears
								const firstOption = page
									.locator('option, [role="option"]')
									.nth(1);
								if (await firstOption.isVisible({ timeout: 2000 })) {
									await firstOption.click();
								}
							}
						}

						await page.waitForLoadState("networkidle", { timeout: 15000 });

						// Wait for offices to load with shorter timeout and fallback
						try {
							await page.waitForFunction(
								() => {
									const text = document.body.textContent || "";
									return (
										text.includes("offices found") ||
										text.includes("office found")
									);
								},
								{ timeout: 10000 },
							);
						} catch (error) {
							console.warn("⚠️ Office search timeout, trying to proceed anyway");
						}

						// Look for office selection elements (multiple approaches)
						console.log("🔍 Looking for office selection elements...");

						// Method 1: Radio buttons (most likely based on screenshots)
						const officeRadios = page.locator('input[type="radio"]');
						const radioCount = await officeRadios.count();
						console.log(`📻 Found ${radioCount} radio buttons`);

						if (radioCount > 0) {
							// Select the first office radio button
							await officeRadios.first().click();
							console.log("✅ Selected first office via radio button");

							// Wait a moment for the selection to register
							await page.waitForTimeout(2000);
						} else {
							// Method 2: Look for clickable office cards/containers
							const officeCards = page.locator(
								'[class*="office"], [class*="ballot"], [class*="race"], [class*="card"]',
							);
							const cardCount = await officeCards.count();
							console.log(`🗳️ Found ${cardCount} office cards`);

							if (cardCount > 0) {
								await officeCards.first().click();
								console.log("✅ Selected office via card click");
								await page.waitForTimeout(2000);
							} else {
								// Method 3: Look for buttons with office names
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
									// Method 4: Try clicking any text that contains office names
									const officeTexts = page.locator(
										"text=Flat Rock Village Council",
									);
									const textCount = await officeTexts.count();
									console.log(`📝 Found ${textCount} office text elements`);

									if (textCount > 0) {
										await officeTexts.first().click();
										console.log("✅ Selected office via text click");
										await page.waitForTimeout(2000);
									} else {
										console.warn("⚠️ No office selection elements found");
									}
								}
							}
						}
					}
				}

				const nextButton = page.getByRole("button", { name: "Next" }).first();
				if (await nextButton.isVisible({ timeout: 5000 })) {
					// Wait for Next button to be enabled with fallback
					try {
						await page.waitForFunction(
							() => {
								const button = document.querySelector(
									'button[type="submit"][data-step="1"]',
								);
								return button && !button.disabled;
							},
							{ timeout: 10000 },
						);
					} catch (error) {
						console.warn("⚠️ Next button wait timeout, proceeding anyway");
					}

					await nextButton.click();
					console.log("✅ Clicked Next button for Step 1");
				} else {
					console.warn("⚠️ Next button not found in Step 1");
				}
			}

			// Step 2: Party Selection
			else if (page.url().includes("/2")) {
				console.log("🎭 Step 2: Party Selection");

				// Try different approaches for party selection
				let partySelected = false;

				// Method 1: Look for "Other" input field (this is working in our test)
				const otherLabel = page.getByLabel("Other");
				if (await otherLabel.isVisible({ timeout: 3000 })) {
					await otherLabel.fill("Independent");
					partySelected = true;
					console.log("✅ Filled 'Other' party field with 'Independent'");
				}

				if (!partySelected) {
					// Method 2: Look for radio buttons for party selection
					const partyRadios = page.locator(
						'input[type="radio"][name*="party"], input[type="radio"][value*="party"]',
					);
					const partyRadioCount = await partyRadios.count();

					if (partyRadioCount > 0) {
						await partyRadios.first().click();
						partySelected = true;
						console.log("✅ Selected party via radio button");
					} else {
						// Method 3: Look for any input field that might be for party
						const partyInputs = page
							.locator('input[type="text"], textarea')
							.filter({ hasText: /party|affiliation/i });
						const inputCount = await partyInputs.count();

						if (inputCount > 0) {
							await partyInputs.first().fill("Independent");
							partySelected = true;
							console.log("✅ Filled party input field");
						} else {
							console.warn("⚠️ No party selection method found");
						}
					}
				}

				if (partySelected) {
					await page.waitForTimeout(1000); // Wait for form validation
				}

				const nextButton = page.getByRole("button", { name: "Next" }).first();
				if (await nextButton.isVisible({ timeout: 5000 })) {
					// Check if button is enabled before clicking
					const isEnabled = await nextButton.isEnabled();
					console.log(`➡️ Next button enabled: ${isEnabled}`);

					if (isEnabled) {
						await nextButton.click();
						console.log("✅ Clicked Next button for Step 2");
					} else {
						console.warn("⚠️ Next button is disabled, trying to proceed anyway");
						// Force click even if disabled
						await nextButton.click({ force: true });
					}
				}
			}

			// Step 3: Pledge Step
			else if (page.url().includes("/3")) {
				console.log("📜 Step 3: Pledge Agreement");

				const agreeButton = page.getByRole("button", { name: "I Agree" });
				if (await agreeButton.isVisible({ timeout: 10000 })) {
					await agreeButton.click();
				}
			}

			// Step 4: Complete Step
			else if (page.url().includes("/4")) {
				console.log("🎉 Step 4: Complete Onboarding");

				const viewDashboardButton = page.getByRole("button", {
					name: "View Dashboard",
				});
				if (await viewDashboardButton.isVisible({ timeout: 10000 })) {
					await viewDashboardButton.click();
					await page.waitForURL(/\/dashboard/, { timeout: 15000 });
					return;
				}
			}

			const currentUrl = page.url();
			await page.waitForLoadState("domcontentloaded");

			if (page.url() === currentUrl) {
				attempts++;
				if (attempts >= 5) {
					console.warn("Onboarding seems stuck, trying direct navigation");
					break;
				}
			}

			attempts++;
		}

		// Check if we successfully completed onboarding
		if (!page.url().includes("/dashboard")) {
			console.log(
				"🏠 Onboarding may not have completed fully, current URL:",
				page.url(),
			);
		} else {
			console.log("✅ Successfully completed onboarding and reached dashboard");
		}
	} catch (error) {
		console.warn("Onboarding completion failed:", error.message);
		console.warn("Current URL:", page.url());
	}
}
