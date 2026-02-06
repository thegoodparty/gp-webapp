import { expect, type Page } from "@playwright/test";
import { TestDataHelper } from "./data.helper";
import { WaitHelper } from "./wait.helper";

const testCardInfo = {
	cardNumber: "4242424242424242",
	expirationDate: "12/28",
	zipCode: "90210",
	cvc: "123",
};
export class AccountHelper {
	static async upgradeToPro(page: Page): Promise<void> {
		const { cardNumber, expirationDate, zipCode, cvc } = testCardInfo;
		const testCampaignCommittee = "Test Campaign Committee";
		const testUser = TestDataHelper.generateTestUser();

		// Verify user is on voter data (free) page
		await WaitHelper.waitForPageReady(page);
		await expect(
			page.getByRole("heading", { name: "Why pay more for less?" }),
		).toBeVisible();
		await page
			.getByRole("link", { name: "Start today for just $10/month." })
			.click();

		// Verify office details
		await WaitHelper.waitForPageReady(page);
		await expect(
			page.getByRole("heading", {
				name: "Please confirm your office details.",
			}),
		).toBeVisible();
		await page.getByRole("link", { name: "Confirm" }).click();

		// Confirm campaign committee details
		await WaitHelper.waitForPageReady(page);
		await page
			.getByLabel("Name Of Campaign Committee")
			.fill(testCampaignCommittee);
		await page.getByRole("switch").click();
		await page
			.locator('input[type="file"]')
			.setInputFiles("src/fixtures/testpdf.pdf");
		await page.getByRole("button", { name: "Next" }).click();

		// Agree to GoodParty.org Terms
		await WaitHelper.waitForPageReady(page);
		await page.getByRole("button", { name: "I Accept" }).click();
		await page.getByRole("button", { name: "I Accept" }).click();
		await page.getByRole("button", { name: "I Accept" }).click();
		await page
			.getByPlaceholder("Jane Doe")
			.fill(testUser.firstName + " " + testUser.lastName);
		await page.getByRole("button", { name: "Finish" }).click();

		// Pay for pro through Stripe
		await WaitHelper.waitForPageReady(page);
		await page.getByLabel("Email").fill(testUser.email);
		await expect(page.getByTestId("product-summary-product-image")).toBeVisible(
			{ timeout: 10000 },
		);
		await page.getByTestId("card-accordion-item").click();
		await WaitHelper.waitForPageReady(page);
		await page.getByPlaceholder("1234 1234 1234").fill(cardNumber);
		await page.getByPlaceholder("MM / YY").fill(expirationDate);
		await page.getByPlaceholder("CVC").fill(cvc);
		await page
			.getByPlaceholder("Full name on card")
			.fill(testUser.firstName + " " + testUser.lastName);
		await page.getByPlaceholder("ZIP").fill(zipCode);
		await page.getByLabel("Save my information for").click({ timeout: 10000 });
		await page.getByTestId("hosted-payment-submit-button").click();
		await WaitHelper.waitForPageReady(page);
	}
}
