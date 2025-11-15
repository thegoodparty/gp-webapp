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
      
      await page.getByRole("button", { name: "Join" }).click();
      await page.waitForURL(url => !url.toString().includes('/sign-up'), { timeout: 30000 });
      
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