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
    
    // Wait for successful login
    await page.waitForURL(/\/dashboard/, { timeout: 30000 });
  }
}
