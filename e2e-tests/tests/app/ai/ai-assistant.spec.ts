import { test, expect } from "@playwright/test";
import { NavigationHelper } from "../../../src/helpers/navigation.helper";
import { WaitHelper } from "../../../src/helpers/wait.helper";

test.describe("AI Assistant", () => {
  test.beforeEach(async ({ page }) => {
    // Page is already authenticated and fully onboarded via storageState from auth.setup.ts
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');
    
    if (!page.url().includes('/dashboard')) {
      throw new Error(`Expected dashboard but got: ${page.url()}`);
    }
    
    await NavigationHelper.dismissOverlays(page);
  });

  test("should access AI Assistant with authenticated user", async ({ page }) => {
    console.log(`🧪 Testing AI Assistant with authenticated user`);
      
      await page.goto('/dashboard/campaign-assistant');
      await WaitHelper.waitForPageReady(page);
      
      await expect(page.getByRole("heading", { name: "AI Assistant" })).toBeVisible();
      
      const topicButtons = page.getByRole("button").filter({ hasText: /Campaign|Strategy/ });
      const buttonCount = await topicButtons.count();
      
      if (buttonCount > 0) {
        console.log(`✅ AI Assistant working - ${buttonCount} topics available`);
      }
      
  });
});