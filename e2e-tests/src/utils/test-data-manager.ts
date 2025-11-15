import { Page } from "@playwright/test";

export interface TestUser {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  zipCode: string;
}

export class TestDataManager {
  private static createdUsers: TestUser[] = [];
  private static createdCampaigns: any[] = [];

  /**
   * Create a test user and track it for cleanup
   */
  static async createTestUser(page: Page, userData: TestUser): Promise<TestUser> {
    // Track the user for cleanup
    this.createdUsers.push(userData);
    
    console.log(`📝 Tracking test user for cleanup: ${userData.email}`);
    return userData;
  }

  /**
   * Generate test user data without creating the account
   */
  static generateTestUserData(): TestUser {
    const timestamp = Date.now();
    const env = process.env.NODE_ENV || "local";
    
    return {
      firstName: `Test${timestamp}`,
      lastName: "User",
      email: `test-${timestamp}@${env}.example.com`,
      phone: `5105${timestamp.toString().slice(-6)}`,
      password: "TestPassword123!",
      zipCode: "82901",
    };
  }

  /**
   * Delete a test account using the UI
   */
  static async deleteAccount(page: Page): Promise<void> {
    try {
      console.log("🗑️ Deleting test account via UI...");
      
      // Navigate to profile page
      await page.goto("/profile");
      await page.waitForLoadState("domcontentloaded");
      
      // Find and click Delete Account button
      const deleteButton = page.getByRole("button", { name: "Delete Account" });
      await deleteButton.waitFor({ state: "visible", timeout: 10000 });
      await deleteButton.click();
      
      // Handle the confirmation modal
      const proceedButton = page.getByRole("button", { name: "Proceed" });
      await proceedButton.waitFor({ state: "visible", timeout: 10000 });
      await proceedButton.click();
      
      // Wait for redirect to home page
      await page.waitForURL(/\/(home|$)/, { timeout: 10000 });
      
      console.log("✅ Test account deleted successfully");
    } catch (error) {
      console.warn("⚠️ Failed to delete test account:", error.message);
      // Don't throw - cleanup should be best effort
    }
  }

  /**
   * Clean up all created test data
   */
  static async cleanup(page?: Page): Promise<void> {
    console.log(`🧹 Cleaning up ${this.createdUsers.length} test users...`);
    
    if (page && this.createdUsers.length > 0) {
      // Delete accounts via UI if page is available
      for (const user of this.createdUsers) {
        try {
          // Login as the user first, then delete
          await page.goto("/login");
          await page.getByLabel("Email").fill(user.email);
          await page.getByPlaceholder("Please don't use your dog's").fill(user.password);
          
          const loginButton = page.getByRole("button", { name: "Login" });
          await loginButton.waitFor({ state: "visible", timeout: 5000 });
          await loginButton.click();
          
          // Delete the account
          await this.deleteAccount(page);
        } catch (error) {
          console.warn(`⚠️ Failed to cleanup user ${user.email}:`, error.message);
        }
      }
    }
    
    // Clear tracking arrays
    this.createdUsers = [];
    this.createdCampaigns = [];
    
    console.log("✅ Test data cleanup completed");
  }

  /**
   * Get all tracked users (for debugging)
   */
  static getTrackedUsers(): TestUser[] {
    return [...this.createdUsers];
  }

  /**
   * Create a test account and track it for cleanup
   */
  static async createAndTrackTestAccount(page: Page, userData: TestUser): Promise<TestUser> {
    // Track the user for cleanup
    this.createdUsers.push(userData);
    
    console.log(`📝 Creating and tracking test user: ${userData.email}`);
    
    // Navigate to signup and create account
    await page.goto("/sign-up");
    await page.waitForLoadState("domcontentloaded");
    
    // Fill registration form
    await page.getByRole("textbox", { name: "First Name" }).fill(userData.firstName);
    await page.getByRole("textbox", { name: "Last Name" }).fill(userData.lastName);
    await page.getByRole("textbox", { name: "email" }).fill(userData.email);
    await page.getByRole("textbox", { name: "phone" }).fill(userData.phone);
    await page.getByRole("textbox", { name: "Zip Code" }).fill(userData.zipCode);
    await page.getByPlaceholder("Please don't use your dog's name").fill(userData.password);
    
    // Submit form
    const joinButton = page.getByRole("button", { name: "Join" });
    await joinButton.waitFor({ state: "visible", timeout: 10000 });
    await joinButton.click();
    
    // Wait for successful registration (redirect to onboarding or dashboard)
    await page.waitForURL(/\/(onboarding|dashboard)/, { timeout: 30000 });
    
    return userData;
  }
}
