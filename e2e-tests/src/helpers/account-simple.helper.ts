import { Page, expect } from "@playwright/test";
import { TestDataHelper } from "./data.helper";
import { NavigationHelper } from "./navigation.helper";

export interface TestAccount {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export class SimpleAccountHelper {
  /**
   * Create a test account and navigate to dashboard (bypassing onboarding)
   */
  static async createAccountAndGetToDashboard(page: Page): Promise<TestAccount> {
    const testUser = TestDataHelper.generateTestUser();
    console.log(`🧪 Creating test account: ${testUser.email}`);
    
    // Step 1: Register account
    await page.goto("/sign-up");
    await page.waitForLoadState("domcontentloaded");
    await NavigationHelper.dismissOverlays(page);
    
    // Fill registration form (use zip code 28739 for proper office data)
    await page.getByRole("textbox", { name: "First Name" }).fill(testUser.firstName);
    await page.getByRole("textbox", { name: "Last Name" }).fill(testUser.lastName);
    await page.getByRole("textbox", { name: "email" }).fill(testUser.email);
    await page.getByRole("textbox", { name: "phone" }).fill(testUser.phone);
    await page.getByRole("textbox", { name: "Zip Code" }).fill("28739"); // Use zip with office data
    await page.getByPlaceholder("Please don't use your dog's name").fill(testUser.password);
    
    // Submit registration
    const joinButton = page.getByRole("button", { name: "Join" });
    await joinButton.waitFor({ state: "visible", timeout: 10000 });
    await joinButton.click();
    
    // Step 2: Wait for registration and complete onboarding properly
    await page.waitForURL(url => !url.toString().includes('/sign-up'), { timeout: 30000 });
    
    // Complete onboarding flow if we're redirected there
    if (page.url().includes('/onboarding/')) {
      console.log("🚀 Completing onboarding flow...");
      await this.completeOnboardingFlow(page);
    }
    
    // Ensure we end up at dashboard
    if (!page.url().includes('/dashboard')) {
      await page.goto('/dashboard');
      await page.waitForLoadState('domcontentloaded');
    }
    
    console.log("✅ Account created and dashboard accessible");
    
    return {
      email: testUser.email,
      password: testUser.password,
      firstName: testUser.firstName,
      lastName: testUser.lastName,
    };
  }

  /**
   * Complete the onboarding flow properly
   */
  static async completeOnboardingFlow(page: Page): Promise<void> {
    let attempts = 0;
    while (page.url().includes('/onboarding/') && attempts < 10) {
      await page.waitForLoadState('domcontentloaded');
      
      // Step 1: Office Selection
      if (page.url().includes('/1')) {
        console.log("📍 Step 1: Office Selection");
        
        // Wait for form to load
        await page.waitForSelector('h1', { timeout: 10000 });
        
        // Fill zip code (28739 has office data)
        const zipField = page.getByLabel("Zip Code");
        if (await zipField.isVisible({ timeout: 5000 })) {
          await zipField.fill("28739");
          
          // Select office level
          const levelSelect = page.getByLabel("Office Level");
          if (await levelSelect.isVisible({ timeout: 5000 })) {
            await levelSelect.selectOption("Local/Township/City");
            
            // Wait for offices to load (look for spinning animation to complete)
            await page.waitForLoadState('networkidle', { timeout: 15000 });
            
            // Wait for "X offices found" message
            await page.waitForFunction(() => {
              const text = document.body.textContent || '';
              return text.includes('offices found') || text.includes('office found');
            }, { timeout: 20000 });
            
            console.log("📍 Offices loaded, selecting first office...");
            
            // Select the first office using the working pattern
            console.log("📍 Looking for office options to select...");
            
            const officeButtons = page.locator('[role="button"]').filter({ hasText: /Town|City|Council|Board|Mayor|Commission|Village/ });
            const officeCount = await officeButtons.count();
            console.log(`🏛️ Found ${officeCount} office options`);
            
            if (officeCount > 0) {
              const firstOffice = officeButtons.first();
              const officeText = await firstOffice.textContent();
              console.log(`🏛️ Selecting: ${officeText?.substring(0, 50)}`);
              
              await firstOffice.click();
              console.log("✅ Office selected");
              
              // Wait for selection to register
              await page.waitForTimeout(2000);
            } else {
              console.log("⚠️ No office options found");
            }
          }
        }
        
        // Click Next button
        const nextButton = page.getByRole("button", { name: "Next" }).first();
        if (await nextButton.isVisible({ timeout: 5000 })) {
          // Check if button is enabled
          const isEnabled = await nextButton.isEnabled();
          console.log(`▶️ Next button enabled: ${isEnabled}`);
          
          if (isEnabled) {
            await nextButton.click();
            console.log("✅ Clicked Next for Step 1");
          } else {
            console.log("⚠️ Next button not enabled, skipping step");
          }
        }
      }
      
      // Step 2: Party Selection
      else if (page.url().includes('/2')) {
        console.log("🎭 Step 2: Party Selection");
        
        const otherLabel = page.getByLabel("Other");
        if (await otherLabel.isVisible({ timeout: 5000 })) {
          await otherLabel.fill("Independent");
        }
        
        const nextButton = page.getByRole("button", { name: "Next" }).first();
        if (await nextButton.isVisible({ timeout: 5000 })) {
          await nextButton.click();
          console.log("✅ Clicked Next for Step 2");
        }
      }
      
      // Step 3: Pledge Agreement
      else if (page.url().includes('/3')) {
        console.log("📜 Step 3: Pledge Agreement");
        
        const agreeButton = page.getByRole("button", { name: "I Agree" });
        if (await agreeButton.isVisible({ timeout: 10000 })) {
          await agreeButton.click();
          console.log("✅ Agreed to pledge");
        }
      }
      
      // Step 4: Complete
      else if (page.url().includes('/4')) {
        console.log("🎉 Step 4: Complete Onboarding");
        
        const viewDashboardButton = page.getByRole("button", { name: "View Dashboard" });
        if (await viewDashboardButton.isVisible({ timeout: 10000 })) {
          await viewDashboardButton.click();
          await page.waitForURL(/\/dashboard/, { timeout: 15000 });
          console.log("✅ Onboarding completed, redirected to dashboard");
          return;
        }
      }
      
      // Wait for URL change
      const currentUrl = page.url();
      await page.waitForLoadState('domcontentloaded');
      
      // Safety check
      if (page.url() === currentUrl) {
        attempts++;
        if (attempts >= 5) {
          console.warn("Onboarding seems stuck, breaking out");
          break;
        }
      }
      
      attempts++;
    }
    
    // Final check - ensure we're at dashboard
    if (!page.url().includes('/dashboard')) {
      await page.goto('/dashboard');
      await page.waitForLoadState('domcontentloaded');
    }
  }

  /**
   * Delete test account via UI
   */
  static async deleteTestAccount(page: Page): Promise<void> {
    try {
      console.log("🗑️ Deleting test account...");
      
      // Navigate to profile
      await page.goto("/profile");
      await page.waitForLoadState("domcontentloaded");
      
      // Scroll to delete button
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      
      // Click delete button
      const deleteButton = page.getByText("Delete Account");
      await deleteButton.scrollIntoViewIfNeeded();
      await deleteButton.click();
      
      // Handle confirmation modal
      await page.waitForSelector('[role="dialog"]', { timeout: 10000 });
      const proceedButton = page.getByRole("button", { name: "Proceed" });
      await proceedButton.click();
      
      // Wait for redirect (flexible)
      try {
        await page.waitForURL(url => !url.toString().includes('/profile'), { timeout: 10000 });
        console.log("✅ Test account deleted successfully");
      } catch {
        // Check if we're redirected anyway
        if (!page.url().includes('/profile')) {
          console.log("✅ Test account deleted (redirect completed)");
        }
      }
    } catch (error) {
      console.warn("⚠️ Account deletion failed:", error.message);
      // Don't throw - cleanup should be best effort
    }
  }
}
