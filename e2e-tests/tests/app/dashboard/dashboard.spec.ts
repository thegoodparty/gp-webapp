import { test, expect } from "@playwright/test";
import { TestDataHelper } from "../../../src/helpers/data.helper";
import { NavigationHelper } from "../../../src/helpers/navigation.helper";
import { CleanupHelper } from "../../../src/helpers/cleanup.helper";
import { WaitHelper } from "../../../src/helpers/wait.helper";

test.describe("Dashboard Functionality", () => {
  test("should create account and access dashboard", async ({ page }) => {
    const testUser = TestDataHelper.generateTestUser();
    console.log(`🧪 Testing dashboard with: ${testUser.email}`);
    
    try {
      // Step 1: Register account
      await page.goto("/sign-up");
      await page.waitForLoadState("domcontentloaded");
      await NavigationHelper.dismissOverlays(page);
      
      // Fill registration form with zip 28739 (has office data)
      await page.getByRole("textbox", { name: "First Name" }).fill(testUser.firstName);
      await page.getByRole("textbox", { name: "Last Name" }).fill(testUser.lastName);
      await page.getByRole("textbox", { name: "email" }).fill(testUser.email);
      await page.getByRole("textbox", { name: "phone" }).fill(testUser.phone);
      await page.getByRole("textbox", { name: "Zip Code" }).fill("28739");
      await page.getByPlaceholder("Please don't use your dog's name").fill(testUser.password);
      
      // Submit registration
      const joinButton = page.getByRole("button", { name: "Join" });
      await joinButton.click();
      
      // Step 2: Wait for onboarding and navigate to dashboard
      await page.waitForURL(url => !url.toString().includes('/sign-up'), { timeout: 30000 });
      
      // Navigate directly to dashboard (bypass onboarding complexity)
      await page.goto('/dashboard');
      await page.waitForLoadState('domcontentloaded');
      
      // Step 3: Test dashboard functionality
      await expect(page).toHaveURL(/\/dashboard$/);
      
      // Look for dashboard content
      const dashboardContent = page.locator('h1, h2, h3, main');
      await expect(dashboardContent.first()).toBeVisible();
      
      console.log("✅ Dashboard accessible");
      
      // Step 4: Test navigation to other app pages
      await page.goto("/dashboard/campaign-assistant");
      await expect(page.getByRole("heading", { name: "AI Assistant" })).toBeVisible();
      console.log("✅ AI Assistant accessible");
      
      await page.goto("/profile");
      await expect(page.getByRole("heading", { name: "Personal Information" }).first()).toBeVisible();
      console.log("✅ Profile accessible");
      
      // Step 5: Clean up - delete account
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      const deleteButton = page.getByText("Delete Account");
      if (await deleteButton.isVisible({ timeout: 5000 })) {
        await deleteButton.click();
        
        await page.waitForSelector('[role="dialog"]', { timeout: 10000 });
        const proceedButton = page.getByRole("button", { name: "Proceed" });
        await proceedButton.click();
        
        // Wait for redirect (flexible)
        await page.waitForURL(url => !url.toString().includes('/profile'), { timeout: 10000 });
        console.log("✅ Test account cleaned up");
      }
      
    } catch (error) {
      console.error("❌ Dashboard test failed:", error.message);
      await page.screenshot({ 
        path: `screenshots/dashboard-error-${Date.now()}.png`,
        fullPage: true 
      });
      throw error;
    }
  });
});