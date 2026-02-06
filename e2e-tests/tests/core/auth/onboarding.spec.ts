import { expect, type Page, test } from "@playwright/test";
import { TestDataHelper } from "../../../src/helpers/data.helper";
import { NavigationHelper } from "../../../src/helpers/navigation.helper";

test("authenticate with onboarded user", async ({ page }) => {
	console.log("🔐 Setting up authenticated user...");

	const testUser = TestDataHelper.generateTestUser();

	await page.goto("/sign-up");
	await NavigationHelper.dismissOverlays(page);

	await page
		.getByRole("textbox", { name: "First Name" })
		.fill(testUser.firstName);
	await page
		.getByRole("textbox", { name: "Last Name" })
		.fill(testUser.lastName);
	await page.getByRole("textbox", { name: "email" }).fill(testUser.email);
	await page.getByRole("textbox", { name: "phone" }).fill(testUser.phone);
	await page.getByRole("textbox", { name: "Zip Code" }).fill(testUser.zipCode);
	await page
		.getByPlaceholder("Please don't use your dog's name")
		.fill(testUser.password);

	const joinButton = page.getByRole("button", { name: "Join" });
	await joinButton.waitFor({ state: "visible", timeout: 15000 });
	await joinButton.click();

	await page.waitForURL((url) => url.toString().includes("/onboarding/"), {
		timeout: 45000,
	});
	console.log("📝 User created, now completing onboarding...");

	await completeOnboardingFlow(page);

	if (!page.url().includes("/dashboard")) {
		throw new Error(`Onboarding failed - ended at: ${page.url()}`);
	}

	console.log(`✅ Fully onboarded user created: ${testUser.email}`);
	console.log(`📍 Final URL: ${page.url()}`);

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
	console.log("ℹ️ Tests will complete onboarding if needed");
});

async function completeOnboardingFlow(page: Page): Promise<void> {
	await completeStep1OfficeSelection(page);
	await completeStep2PartySelection(page);
	await completeStep3PledgeAgreement(page);
	await completeStep4FinishOnboarding(page);
}

async function completeStep1OfficeSelection(page: Page): Promise<void> {
	console.log("📍 Completing Step 1: Office Selection");

	await fillZipCode(page);
	await selectOfficeLevel(page);
	await waitForOfficesLoad(page);
	await selectOffice(page);
	await proceedToStep2(page);

	console.log("✅ Completed Step 1 - moved to step 2");
}

async function fillZipCode(page: Page): Promise<void> {
	const zipField = page.getByLabel("Zip Code");
	await zipField.fill("28739");
}

async function selectOfficeLevel(page: Page): Promise<void> {
	let levelSelected = false;

	const levelSelect = page.getByLabel("Office Level");
	if (await levelSelect.isVisible({ timeout: 3000 })) {
		try {
			await levelSelect.selectOption("Local/Township/City");
			levelSelected = true;
		} catch {
			await levelSelect.selectOption({ index: 1 });
			levelSelected = true;
		}
	}

	if (!levelSelected) {
		const anySelect = page.locator("select").first();
		if (await anySelect.isVisible({ timeout: 3000 })) {
			await anySelect.selectOption({ index: 1 });
		}
	}
}

async function waitForOfficesLoad(page: Page): Promise<void> {
	await page.waitForFunction(
		() => {
			const text = document.body.textContent || "";
			return text.includes("offices found") || text.includes("office found");
		},
		{ timeout: 30000 },
	);
}

async function selectOffice(page: Page): Promise<void> {
	let officeSelected = false;

	const officeRadios = page.locator('input[type="radio"]');
	const radioCount = await officeRadios.count();

	if (radioCount > 0) {
		await officeRadios.first().click();
		officeSelected = true;
		console.log("✅ Selected office via radio button");
	} else {
		const officeButtons = page.getByRole("button").filter({
			hasText:
				/Council|Mayor|Board|Commission|Village|County|Flat Rock|Henderson/,
		});
		const buttonCount = await officeButtons.count();

		if (buttonCount > 0) {
			await officeButtons.first().click();
			officeSelected = true;
			console.log("✅ Selected office via button");
		}
	}

	if (!officeSelected) {
		throw new Error("Could not select an office");
	}

	await page.waitForFunction(
		() => {
			const buttons = Array.from(document.querySelectorAll("button"));
			for (const button of buttons) {
				if (button.textContent?.includes("Next") || button.type === "submit") {
					return !(button as HTMLButtonElement).disabled;
				}
			}
			return false;
		},
		{ timeout: 10000 },
	);
}

async function proceedToStep2(page: Page): Promise<void> {
	const nextButton = page.getByRole("button", { name: "Next" }).first();
	await expect(nextButton).toBeVisible();
	await expect(nextButton).toBeEnabled();
	await nextButton.click();

	await page.waitForURL((url) => url.toString().includes("/2"), {
		timeout: 15000,
	});
}

async function completeStep2PartySelection(page: Page): Promise<void> {
	console.log("🎭 Completing Step 2: Party Selection");

	await selectPartyAffiliation(page);
	await proceedToStep3(page);

	console.log("✅ Completed Step 2 - moved to step 3");
}

async function selectPartyAffiliation(page: Page): Promise<void> {
	let partySelected = false;

	const otherLabel = page.getByLabel("Other");
	if (await otherLabel.isVisible({ timeout: 3000 })) {
		await otherLabel.fill("Independent");
		partySelected = true;
		console.log("✅ Filled 'Other' party field");
	} else {
		const textInputs = page.locator('input[type="text"]');
		const inputCount = await textInputs.count();

		if (inputCount > 0) {
			for (let i = 0; i < inputCount; i++) {
				try {
					const input = textInputs.nth(i);
					await input.fill("Independent");

					const value = await input.inputValue();
					if (value === "Independent") {
						partySelected = true;
						console.log(`✅ Filled party input field ${i}`);
						break;
					}
				} catch {}
			}
		}
	}

	if (!partySelected) {
		const partyRadios = page.locator('input[type="radio"]');
		const radioCount = await partyRadios.count();

		if (radioCount > 0) {
			await partyRadios.first().click();
			partySelected = true;
			console.log("✅ Selected party via radio button");
		}
	}

	if (!partySelected) {
		throw new Error("Could not select party affiliation");
	}

	await page.waitForFunction(
		() => {
			const buttons = Array.from(document.querySelectorAll("button"));
			for (const button of buttons) {
				if (button.textContent?.includes("Next") || button.type === "submit") {
					return !(button as HTMLButtonElement).disabled;
				}
			}
			return false;
		},
		{ timeout: 10000 },
	);
}

async function proceedToStep3(page: Page): Promise<void> {
	const nextButton = page.getByRole("button", { name: "Next" }).first();
	await expect(nextButton).toBeVisible();

	const isEnabled = await nextButton.isEnabled();
	if (!isEnabled) {
		console.warn("Next button not enabled, checking form state...");
		const buttonAttrs = await nextButton.evaluate((el) => ({
			disabled: (el as HTMLButtonElement).disabled,
			"data-step": el.getAttribute("data-step"),
			"data-party": el.getAttribute("data-party"),
			"data-other-party": el.getAttribute("data-other-party"),
		}));
		console.log("Button attributes:", buttonAttrs);
	}

	await nextButton.click();

	await page.waitForURL((url) => url.toString().includes("/3"), {
		timeout: 15000,
	});
}

async function completeStep3PledgeAgreement(page: Page): Promise<void> {
	console.log("📜 Completing Step 3: Pledge Agreement");

	await acceptPledge(page);
	await proceedToStep4(page);

	console.log("✅ Completed Step 3 - moved to step 4");
}

async function acceptPledge(page: Page): Promise<void> {
	const agreeButton = page.getByRole("button", { name: "I Agree" });
	await agreeButton.waitFor({ state: "visible" });
	await agreeButton.click();
}

async function proceedToStep4(page: Page): Promise<void> {
	await page.waitForURL((url) => url.toString().includes("/4"), {
		timeout: 15000,
	});
}

async function completeStep4FinishOnboarding(page: Page): Promise<void> {
	console.log("🎉 Completing Step 4: Finish Onboarding");

	await navigateToDashboard(page);
	await verifyDashboardAccess(page);

	console.log("✅ Reached dashboard - onboarding complete!");
}

async function navigateToDashboard(page: Page): Promise<void> {
	const viewDashboardButton = page.getByRole("button", {
		name: "View Dashboard",
	});
	await viewDashboardButton.waitFor({ state: "visible" });
	await viewDashboardButton.click();
}

async function verifyDashboardAccess(page: Page): Promise<void> {
	await page.waitForURL(/\/dashboard/, { timeout: 15000 });
}
