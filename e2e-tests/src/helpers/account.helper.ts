import { Page, expect } from "@playwright/test";
import type { TestUser } from "../utils/test-data-manager";
import { TestDataManager } from "../utils/test-data-manager";
import { TestDataHelper } from "./data.helper";
import { WaitHelper } from "./wait.helper";

export class AccountHelper {
  /**
   * Create a test account that will be automatically cleaned up
   */
  static async createTestAccount(page: Page): Promise<TestUser> {
    const userData = TestDataHelper.generateTestUser();
    return await TestDataManager.createAndTrackTestAccount(page, userData);
  }

  /**
   * Delete the currently logged-in account
   */
  static async deleteCurrentAccount(page: Page): Promise<void> {
    await TestDataManager.deleteAccount(page);
  }

  /**
   * Login with test credentials (for tests that need authenticated users)
   */
  static async loginWithTestAccount(page: Page, credentials: TestUser): Promise<void> {
    await page.goto("/login");
    await page.waitForLoadState("domcontentloaded");
    
    await page.getByLabel("Email").fill(credentials.email);
    await page.getByPlaceholder("Please don't use your dog's").fill(credentials.password);
    
    const loginButton = page.getByRole("button", { name: "Login" });
    await loginButton.waitFor({ state: "visible", timeout: 10000 });
    await loginButton.click();
    
    // Wait for successful login (could redirect to dashboard or onboarding)
    await page.waitForURL(url => !url.toString().includes('/login'), { timeout: 30000 });
  }

  /**
   * Use the global test user (created in globalSetup) if available
   * Falls back to creating a new account if global user is not available
   */
  static async useGlobalTestUser(page: Page): Promise<TestUser> {
    const globalUserEmail = process.env.GLOBAL_TEST_USER_EMAIL;
    const globalUserPassword = process.env.GLOBAL_TEST_USER_PASSWORD;
    
    if (globalUserEmail && globalUserPassword) {
      console.log(`🌍 Using global test user: ${globalUserEmail}`);
      
      const globalUser: TestUser = {
        email: globalUserEmail,
        password: globalUserPassword,
        firstName: process.env.GLOBAL_TEST_USER_FIRST_NAME || 'Global',
        lastName: process.env.GLOBAL_TEST_USER_LAST_NAME || 'User',
        phone: '5105551234',
        zipCode: '28739'
      };
      
      // Login with the global user
      await this.loginWithTestAccount(page, globalUser);
      
      // Handle case where user is still in onboarding
      if (page.url().includes('/onboarding/')) {
        console.log("🚀 Global user still in onboarding, completing it...");
        try {
          await TestDataManager.completeOnboarding(page);
        } catch (error) {
          console.warn("⚠️ Failed to complete onboarding, tests may need to handle onboarding state");
        }
      }
      
      return globalUser;
    } else {
      console.log("⚠️ Global test user not available, creating new account...");
      return await this.createTestAccount(page);
    }
  }

  static async upgradeToPro(page: Page): Promise<void> {
    const { cardNumber, expirationDate, zipCode, cvc } = TestDataManager.getTestCardInfo();
    const testCampaignCommittee = 'Test Campaign Committee';
    const testUser = TestDataHelper.generateTestUser();

  
    // Verify user is on voter data (free) page
    await WaitHelper.waitForPageReady(page);
    await expect(page.getByRole('heading', { name: 'Why pay more for less?' })).toBeVisible();
    await page.getByRole('link', { name: 'Start today for just $10/month.' }).click();
  
    // Verify office details
    await WaitHelper.waitForPageReady(page);
    await expect(page.getByRole('heading', { name: 'Please confirm your office details.' })).toBeVisible();
    await page.getByRole('link', { name: 'Confirm' }).click();
  
    // Confirm campaign committee details
    await WaitHelper.waitForPageReady(page);
    await page.getByLabel('Name Of Campaign Committee').fill(testCampaignCommittee);
    await page.getByRole('switch').click();
    await page.locator('input[type="file"]').setInputFiles('src/fixtures/testpdf.pdf');
    await page.getByRole('button', { name: 'Next' }).click();
  
    // Agree to GoodParty.org Terms
    await WaitHelper.waitForPageReady(page);
    await page.getByRole("button", { name: "I Accept" }).click();
    await page.getByRole("button", { name: "I Accept" }).click();
    await page.getByRole("button", { name: "I Accept" }).click();
    await page.getByPlaceholder('Jane Doe').fill(testUser.firstName + ' ' + testUser.lastName);
    await page.getByRole('button', { name: 'Finish' }).click();
  
    // Pay for pro through Stripe
    await WaitHelper.waitForPageReady(page);
    await page.getByLabel('Email').fill(testUser.email);
    await expect(page.getByTestId('product-summary-product-image')).toBeVisible({timeout: 10000});
    await page.getByTestId('card-accordion-item').click();
    await WaitHelper.waitForPageReady(page);
    await page.getByPlaceholder('1234 1234 1234').fill(cardNumber);
    await page.getByPlaceholder('MM / YY').fill(expirationDate);
    await page.getByPlaceholder('CVC').fill(cvc);
    await page.getByPlaceholder('Full name on card').fill(testUser.firstName + ' ' + testUser.lastName);
    await page.getByPlaceholder('ZIP').fill(zipCode);
    await page.getByLabel('Save my information for').click({ timeout: 10000 });
    await page.getByTestId('hosted-payment-submit-button').click();
    await WaitHelper.waitForPageReady(page);
  }
}