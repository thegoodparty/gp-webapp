import { test, expect } from "@playwright/test";
import { NavigationHelper } from "../../../src/helpers/navigation.helper";
import { WaitHelper } from "../../../src/helpers/wait.helper";

test.describe("AI Assistant", () => {
  test.beforeEach(async ({ page }) => {
    // Page is already authenticated and fully onboarded via storageState from auth.setup.ts
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');
    
    // Verify we're at dashboard (should be immediate since user is fully onboarded)
    if (!page.url().includes('/dashboard')) {
      throw new Error(`Expected dashboard but got: ${page.url()}`);
    }
    
    // Dismiss any overlays
    await NavigationHelper.dismissOverlays(page);
  });

  test("should access AI Assistant with authenticated user", async ({ page }) => {
    console.log(`🧪 Testing AI Assistant with authenticated user`);
      
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
      
  });
});