import { Page } from "@playwright/test";
import { TestDataManager, TestUser } from "../utils/test-data-manager";
import { TestDataHelper } from "./data.helper";

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
}
