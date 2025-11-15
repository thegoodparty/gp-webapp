import { test, expect } from "@playwright/test";
import { TestDataHelper } from "../../../src/helpers/data.helper";
import { NavigationHelper } from "../../../src/helpers/navigation.helper";
import { WaitHelper } from "../../../src/helpers/wait.helper";

test.describe("AI Assistant", () => {
  test("should access AI Assistant with new account", async ({ page }) => {
    const testUser = TestDataHelper.generateTestUser();
    console.log(`🧪 Testing AI Assistant with: ${testUser.email}`);
    
    try {
      // Create account
      await page.goto("/sign-up");
      await NavigationHelper.dismissOverlays(page);
      
      await page.getByRole("textbox", { name: "First Name" }).fill(testUser.firstName);
      await page.getByRole("textbox", { name: "Last Name" }).fill(testUser.lastName);
      await page.getByRole("textbox", { name: "email" }).fill(testUser.email);
      await page.getByRole("textbox", { name: "phone" }).fill(testUser.phone);
      await page.getByRole("textbox", { name: "Zip Code" }).fill("28739");
      await page.getByPlaceholder("Please don't use your dog's name").fill(testUser.password);
      
      const joinButton = page.getByRole("button", { name: "Join" });
      await joinButton.waitFor({ state: "visible", timeout: 10000 });
      
      // Wait for button to be enabled (form validation)
      await page.waitForFunction(() => {
        const button = document.querySelector('button[type="submit"]') as HTMLButtonElement;
        return button && !button.disabled;
      }, { timeout: 15000 });
      
      await joinButton.click();
      
      // Wait for navigation with better error handling
      try {
        await page.waitForURL(url => !url.toString().includes('/sign-up'), { timeout: 45000 });
      } catch (error) {
        console.warn(`⚠️ Signup navigation timeout. Current URL: ${page.url()}`);
        
        // Check if we're on an error page or if there are validation errors
        const errorMessages = await page.locator('[role="alert"], .error, .invalid').count();
        if (errorMessages > 0) {
          const errorText = await page.locator('[role="alert"], .error, .invalid').first().textContent();
          throw new Error(`Signup failed with validation error: ${errorText}`);
        }
        
        // If we're still on signup page, there might be a form issue
        if (page.url().includes('/sign-up')) {
          throw new Error(`Signup form submission failed - still on signup page`);
        }
        
        throw error;
      }
      
      // Handle potential onboarding flow
      if (page.url().includes('/onboarding/')) {
        console.log("🚀 Bypassing onboarding flow...");
        await page.goto('/dashboard');
        await page.waitForLoadState('domcontentloaded');
      }
      
      // Ensure we're at dashboard before proceeding
      if (!page.url().includes('/dashboard')) {
        await page.goto('/dashboard');
        await page.waitForLoadState('domcontentloaded');
      }
      
      // Navigate to AI Assistant
      await page.goto('/dashboard/campaign-assistant');
      await WaitHelper.waitForPageReady(page);
      
      // Test AI Assistant functionality
      await expect(page.getByRole("heading", { name: "AI Assistant" })).toBeVisible();
      
      // Look for conversation topics
      const topicButtons = page.getByRole("button").filter({ hasText: /Campaign|Strategy/ });
      const buttonCount = await topicButtons.count();
      
      if (buttonCount > 0) {
        console.log(`✅ AI Assistant working - ${buttonCount} topics available`);
      }
      
      // Cleanup
      await page.goto("/profile");
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      const deleteButton = page.getByText("Delete Account");
      if (await deleteButton.isVisible({ timeout: 5000 })) {
        await deleteButton.click();
        await page.waitForSelector('[role="dialog"]', { timeout: 10000 });
        await page.getByRole("button", { name: "Proceed" }).click();
        await page.waitForURL(url => !url.toString().includes('/profile'), { timeout: 10000 });
        console.log("✅ Account cleaned up");
      }
      
    } catch (error) {
      console.error("❌ AI Assistant test failed:", error.message);
      throw error;
    }
  });
});