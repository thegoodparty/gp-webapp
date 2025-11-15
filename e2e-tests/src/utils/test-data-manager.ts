import { Page, expect } from "@playwright/test";

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
   * Complete onboarding flow to get to dashboard
   */
  static async completeOnboarding(page: Page): Promise<void> {
    console.log("🚀 Completing onboarding flow...");
    
    try {
      let attempts = 0;
      while (page.url().includes('/onboarding/') && attempts < 10) {
        await page.waitForLoadState('domcontentloaded');
        
        // Step 1: Office Selection
        if (page.url().includes('/1')) {
          console.log("📍 Step 1: Office Selection");
          
          // Wait for office selection form
          await page.waitForSelector('input[name="zip"], [data-testid*="zip"]', { timeout: 10000 });
          
          // Fill office details if form is present
          const zipField = page.getByLabel("Zip Code");
          if (await zipField.isVisible({ timeout: 5000 })) {
            await zipField.fill("82901");
            
            const levelSelect = page.getByLabel("Office Level");
            if (await levelSelect.isVisible({ timeout: 5000 })) {
              await levelSelect.selectOption("Local/Township/City");
            }
            
            const officeNameField = page.getByLabel("Office Name");
            if (await officeNameField.isVisible({ timeout: 5000 })) {
              await officeNameField.fill("Green River City Council - Ward 1");
              
              // Look for office suggestion and click it
              const officeSuggestion = page.getByRole("button", { name: /Green River City Council/ });
              if (await officeSuggestion.isVisible({ timeout: 5000 })) {
                await officeSuggestion.first().click();
              }
            }
          }
          
          // Click Next or Save
          const nextButton = page.getByRole("button", { name: "Next" });
          const saveButton = page.getByRole("button", { name: "Save" });
          
          if (await nextButton.isVisible({ timeout: 5000 })) {
            await nextButton.click();
          } else if (await saveButton.isVisible({ timeout: 5000 })) {
            await saveButton.click();
          }
        }
        
        // Step 2: Party Selection
        else if (page.url().includes('/2')) {
          console.log("🎭 Step 2: Party Selection");
          
          // Look for party selection - usually "Other" or "Independent"
          const otherLabel = page.getByLabel("Other");
          if (await otherLabel.isVisible({ timeout: 5000 })) {
            await otherLabel.fill("Independent");
          }
          
          const nextButton = page.getByRole("button", { name: "Next" });
          if (await nextButton.isVisible({ timeout: 5000 })) {
            await nextButton.click();
          }
        }
        
        // Step 3: Pledge Step
        else if (page.url().includes('/3')) {
          console.log("📜 Step 3: Pledge Agreement");
          
          const agreeButton = page.getByRole("button", { name: "I Agree" });
          if (await agreeButton.isVisible({ timeout: 10000 })) {
            await agreeButton.click();
          }
        }
        
        // Step 4: Complete Step
        else if (page.url().includes('/4')) {
          console.log("🎉 Step 4: Complete Onboarding");
          
          const viewDashboardButton = page.getByRole("button", { name: "View Dashboard" });
          if (await viewDashboardButton.isVisible({ timeout: 10000 })) {
            await viewDashboardButton.click();
            await page.waitForURL(/\/dashboard/, { timeout: 15000 });
            return;
          }
        }
        
        // Safety check - wait for URL change or break
        const currentUrl = page.url();
        await page.waitForLoadState('domcontentloaded');
        
        // If URL didn't change, we might be stuck
        if (page.url() === currentUrl) {
          attempts++;
          if (attempts >= 5) {
            console.warn("Onboarding seems stuck, trying direct navigation");
            break;
          }
        }
        
        attempts++;
      }
      
      // Final attempt to get to dashboard
      if (!page.url().includes('/dashboard')) {
        console.log("🏠 Navigating directly to dashboard");
        await page.goto('/dashboard');
        await page.waitForLoadState('domcontentloaded');
      }
      
    } catch (error) {
      console.warn("Onboarding completion failed:", error.message);
      // Fallback to direct navigation
      await page.goto('/dashboard');
      await page.waitForLoadState('domcontentloaded');
    }
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
      
      // Scroll to bottom of page where delete button is located
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      
      // Find and click Delete Account button (it's in the Password section)
      const deleteButton = page.getByText("Delete Account");
      await deleteButton.scrollIntoViewIfNeeded();
      await deleteButton.waitFor({ state: "visible", timeout: 10000 });
      await deleteButton.click();
      
      // Handle the confirmation modal
      await page.waitForSelector('[role="dialog"]', { timeout: 10000 });
      
      // Verify modal content and click Proceed
      await expect(page.getByText("Are you sure you want to delete your account?")).toBeVisible();
      
      const proceedButton = page.getByRole("button", { name: "Proceed" });
      await proceedButton.waitFor({ state: "visible", timeout: 10000 });
      await proceedButton.click();
      
      // Wait for redirect to home page (account deletion redirects to /)
      await page.waitForURL(/^\/$/, { timeout: 15000 });
      
      console.log("✅ Test account deleted successfully");
    } catch (error) {
      console.warn("⚠️ Failed to delete test account:", error.message);
      console.warn("Current URL:", page.url());
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
          // Check if already logged in, if not, login first
          const currentUrl = page.url();
          
          if (!currentUrl.includes('/dashboard') && !currentUrl.includes('/profile')) {
            console.log(`🔑 Logging in as ${user.email} for cleanup...`);
            
            await page.goto("/login");
            await page.waitForLoadState("domcontentloaded");
            
            await page.getByLabel("Email").fill(user.email);
            await page.getByPlaceholder("Please don't use your dog's").fill(user.password);
            
            const loginButton = page.getByRole("button", { name: "Login" });
            await loginButton.waitFor({ state: "visible", timeout: 5000 });
            
            // Wait for button to be enabled
            try {
              await page.waitForFunction(() => {
                const button = document.querySelector('[data-testid="login-submit-button"]');
                return button && !button.disabled;
              }, { timeout: 10000 });
            } catch {
              console.warn("Login button not enabled, trying anyway...");
            }
            
            await loginButton.click();
            
            // Wait for successful login
            try {
              await page.waitForURL(url => url.toString().includes('/dashboard'), { timeout: 15000 });
            } catch {
              console.warn("Login may have failed, continuing with cleanup attempt...");
            }
          }
          
          // Now try to delete the account
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
    
    // Wait for successful registration - could go to onboarding flow
    try {
      // First, wait for any navigation away from sign-up
      await page.waitForURL(url => !url.toString().includes('/sign-up'), { timeout: 30000 });
      
      // If we're in onboarding, complete it to get to dashboard
      if (page.url().includes('/onboarding/')) {
        await this.completeOnboarding(page);
      }
      
      // Ensure we end up at dashboard
      if (!page.url().includes('/dashboard')) {
        await page.goto('/dashboard');
        await page.waitForLoadState('domcontentloaded');
      }
    } catch (error) {
      console.warn("Registration flow issue:", error.message);
      // Try to navigate to dashboard directly
      await page.goto('/dashboard');
      await page.waitForLoadState('domcontentloaded');
    }
    
    return userData;
  }
}
