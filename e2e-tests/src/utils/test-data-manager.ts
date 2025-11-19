import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

export interface TestUser {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  zipCode: string;
}

export interface TestCardInfo {
  cardNumber: string;
  expirationDate: string;
  zipCode: string;
  cvc: string;
}

export class TestDataManager {
  private static createdUsers: TestUser[] = [];
  private static createdCampaigns: any[] = [];
  private static readonly testCardInfo: TestCardInfo = {
    cardNumber: "4242424242424242",
    expirationDate: "12/28",
    zipCode: "90210",
    cvc: "123",
  };

  /**
   * Return canonical test credit card details for use in tests.
   */
  static getTestCardInfo(): TestCardInfo {
    return { ...this.testCardInfo };
  }

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
      password: process.env.TEST_DEFAULT_PASSWORD || "TestPassword123!",
      zipCode: "28739",
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
          
          // Wait for the welcome message to appear
          await page.waitForSelector('h1', { timeout: 10000 });
          
          // Look for the form fields - they use RenderInputField components
          const zipField = page.getByLabel("Zip Code");
          if (await zipField.isVisible({ timeout: 5000 })) {
            // Use zip code 28739 which has actual office data
            await zipField.fill("28739");
            
            // Wait for office level dropdown to appear
            const levelSelect = page.getByLabel("Office Level");
            if (await levelSelect.isVisible({ timeout: 5000 })) {
              await levelSelect.selectOption("Local/Township/City");
              
              // Wait for network request to complete and offices to load
              await page.waitForLoadState('networkidle', { timeout: 15000 });
              
              // Wait for the "X offices found" message
              await page.waitForFunction(() => {
                const text = document.body.textContent || '';
                return text.includes('offices found') || text.includes('office found');
              }, { timeout: 20000 });
              
              console.log("📍 Office search completed, selecting first office...");
              
              // Look for the first office button/card and click it
              const officeButtons = page.getByRole("button").filter({ hasText: /Council|Mayor|Board|Commission/ });
              const officeCount = await officeButtons.count();
              
              if (officeCount > 0) {
                await officeButtons.first().click();
                console.log("✅ Selected first available office");
              } else {
                // Look for radio button inputs for office selection
                const officeRadios = page.locator('input[type="radio"]');
                const radioCount = await officeRadios.count();

                if (radioCount > 0) {
                  await officeRadios.first().click();
                  console.log("✅ Selected first office via radio button");
                  await page.waitForTimeout(1000);
                } else {
                  // Try any button that might be an office selection
                  const anyOfficeButton = page.locator('button').filter({ hasText: /Town|City|County|Village|Council/ });
                  if (await anyOfficeButton.count() > 0) {
                    await anyOfficeButton.first().click();
                    console.log("✅ Selected office option");
                  }
                }
              }
            }
          }
          
          // Click Next button (use first() to avoid Next.js dev tools button)
          const nextButton = page.getByRole("button", { name: "Next" }).first();
          if (await nextButton.isVisible({ timeout: 5000 })) {
            // Wait for button to be enabled (form validation)
            await page.waitForFunction(() => {
              const button = document.querySelector('button[type="submit"][data-step="1"]') as HTMLButtonElement;
              return button && !button.disabled;
            }, { timeout: 15000 });
            
            await nextButton.click();
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
          
          const nextButton = page.getByRole("button", { name: "Next" }).first();
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
      await page.waitForURL(url => new URL(url).pathname === '/', { timeout: 15000 });
      
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
                const button = document.querySelector('[data-testid="login-submit-button"]') as HTMLButtonElement;
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
    
    try {
      // Navigate to signup and create account
      await page.goto("/sign-up", { waitUntil: 'domcontentloaded' });
      
      // Dismiss any overlays that might interfere with form interaction
      const { NavigationHelper } = await import('../helpers/navigation.helper');
      await NavigationHelper.dismissOverlays(page);
      
      // Fill registration form with better error handling
      await page.getByRole("textbox", { name: "First Name" }).fill(userData.firstName);
      await page.getByRole("textbox", { name: "Last Name" }).fill(userData.lastName);
      await page.getByRole("textbox", { name: "email" }).fill(userData.email);
      await page.getByRole("textbox", { name: "phone" }).fill(userData.phone);
      await page.getByRole("textbox", { name: "Zip Code" }).fill(userData.zipCode);
      await page.getByPlaceholder("Please don't use your dog's name").fill(userData.password);
      
      // Wait for form to be fully filled and validated
      await page.waitForTimeout(1000);
      
      // Submit form with better waiting
      const joinButton = page.getByRole("button", { name: "Join" });
      await joinButton.waitFor({ state: "visible", timeout: 15000 });
      
      // Check for form validation errors first
      const validationErrors = await page.locator('[role="alert"], .error, .invalid').count();
      if (validationErrors > 0) {
        console.warn(`⚠️ Found ${validationErrors} validation errors on form`);
        const errorTexts = await page.locator('[role="alert"], .error, .invalid').allTextContents();
        console.warn("Validation errors:", errorTexts);
      }
      
      // Wait for form validation to complete (with fallback)
      try {
        await page.waitForFunction(() => {
          const button = document.querySelector('button[type="submit"]') as HTMLButtonElement;
          return button && !button.disabled;
        }, { timeout: 10000 });
        console.log("✅ Form validation passed, clicking Join button");
        
        // Dismiss any overlays that might have appeared (like cookie banners)
        const { NavigationHelper } = await import('../helpers/navigation.helper');
        await NavigationHelper.dismissOverlays(page);
        
        await joinButton.click();
      } catch (error) {
        console.warn("⚠️ Form validation wait timed out");
        
        // Check if button is still disabled and why
        const isDisabled = await joinButton.isDisabled();
        console.warn(`Button disabled: ${isDisabled}`);
        
        if (isDisabled) {
          // Log form state for debugging
          const formData = await page.evaluate(() => {
            const form = document.querySelector('form');
            if (!form) return "No form found";
            
            const formData = new FormData(form);
            const data: any = {};
            for (const [key, value] of formData.entries()) {
              data[key] = value;
            }
            return data;
          });
          console.warn("Form data:", formData);
          
          // Try to find what's preventing submission
          const requiredFields = await page.locator('input[required]').count();
          console.warn(`Required fields found: ${requiredFields}`);
        }
        
        // Dismiss overlays before force clicking
        const { NavigationHelper } = await import('../helpers/navigation.helper');
        await NavigationHelper.dismissOverlays(page);
        
        // Try force clicking as last resort
        console.warn("Trying force click as fallback");
        await joinButton.click({ force: true });
      }
      
      // Wait for the registration request to be sent
      let registrationResponse;
      try {
        console.log("⏳ Waiting for registration API call...");
        registrationResponse = await page.waitForResponse(
          response => response.url().includes('/register') && 
                     response.request().method() === 'POST',
          { timeout: 30000 }
        );
        console.log(`📡 Registration response: ${registrationResponse.status()}`);
        
        if (!registrationResponse.ok()) {
          const responseText = await registrationResponse.text();
          console.error(`❌ Registration failed: ${registrationResponse.status()} - ${responseText}`);
          throw new Error(`Registration API call failed: ${registrationResponse.status()}`);
        }
      } catch (error) {
        console.error("❌ Registration API call timeout or failed:", error.message);
        
        // Check if we're still on signup page and try to understand why
        if (page.url().includes('/sign-up')) {
          // Look for any error messages on the page
          const errorMessages = await page.locator('[role="alert"], .error, .invalid, .text-red-500').allTextContents();
          if (errorMessages.length > 0) {
            console.error("Error messages found:", errorMessages);
          }
          
          // Check if there are overlays blocking the form
          const overlays = await page.locator('[role="dialog"], .modal, .popup, .overlay').count();
          if (overlays > 0) {
            console.warn(`Found ${overlays} potential overlay(s) blocking form submission`);
            const { NavigationHelper } = await import('../helpers/navigation.helper');
            await NavigationHelper.dismissOverlays(page);
          }
        }
        
        throw error;
      }
      
      // Wait for successful registration with better error handling
      try {
        await page.waitForURL(url => !url.toString().includes('/sign-up'), { 
          timeout: 15000, // Reduced timeout since we already confirmed API success
          waitUntil: 'domcontentloaded'
        });
      } catch (error) {
        console.warn("⚠️ URL change timeout, but registration API succeeded. Checking current state...");
        const currentUrl = page.url();
        console.log(`Current URL: ${currentUrl}`);
        
        if (currentUrl.includes('/sign-up')) {
          // Force navigation if still on signup page despite successful API call
          console.log("🔄 Force navigating to dashboard...");
          await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
        }
      }
      
      // Handle post-registration navigation more reliably
      const currentUrl = page.url();
      
      if (currentUrl.includes('/onboarding/')) {
        console.log("🚀 Detected onboarding flow, completing it...");
        await this.completeOnboarding(page);
      } else if (!currentUrl.includes('/dashboard')) {
        console.log("🏠 Navigating to dashboard...");
        await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
      }
      
      // Verify we're successfully logged in and at dashboard
      await page.waitForURL(/\/dashboard/, { timeout: 15000 });
      
      // Look for any dashboard content to confirm we're logged in
      const dashboardContent = page.locator('h1, h2, h3, main, [data-testid*="dashboard"]');
      await dashboardContent.first().waitFor({ state: 'visible', timeout: 10000 });
      
    } catch (error) {
      console.error(`❌ Account creation failed for ${userData.email}:`, error.message);
      
      // Check for common error conditions
      if (error.message.includes('Target page, context or browser has been closed')) {
        throw new Error('Browser context was closed during account creation. This may indicate a server error or network issue.');
      }
      
      if (error.message.includes('Timeout')) {
        // Try to get more context about what went wrong
        const currentUrl = page.url();
        console.error(`Current URL when timeout occurred: ${currentUrl}`);
        
        // Check for error messages on the page
        try {
          const errorMessages = await page.locator('[role="alert"], .error, .invalid').count();
          if (errorMessages > 0) {
            const errorText = await page.locator('[role="alert"], .error, .invalid').first().textContent();
            throw new Error(`Account creation failed with error: ${errorText}`);
          }
        } catch (e) {
          // Ignore errors when checking for error messages
        }
      }
      
      throw error;
    }
    
    return userData;
  }
}
