import { test, expect } from "@playwright/test";
import { OnboardedUserHelper } from "../../../src/helpers/onboarded-user.helper";
import { NavigationHelper } from "../../../src/helpers/navigation.helper";
import { WaitHelper } from "../../../src/helpers/wait.helper";
import { TestUser } from "../../../src/utils/test-data-manager";

test.describe("AI Assistant", () => {
  let testUser: TestUser;

  test.beforeEach(async ({ page }) => {
    // Use a pre-onboarded user from global setup, or create one
    const globalUserEmail = process.env.GLOBAL_TEST_USER_EMAIL;
    const globalUserPassword = process.env.GLOBAL_TEST_USER_PASSWORD;
    
    if (globalUserEmail && globalUserPassword) {
      testUser = {
        email: globalUserEmail,
        password: globalUserPassword,
        firstName: process.env.GLOBAL_TEST_USER_FIRST_NAME || 'Global',
        lastName: process.env.GLOBAL_TEST_USER_LAST_NAME || 'User',
        phone: '5105551234',
        zipCode: '28739'
      };
      
      console.log(`🌍 Using global onboarded user: ${testUser.email}`);
      await OnboardedUserHelper.loginWithOnboardedUser(page, testUser);
    } else {
      console.log("⚠️ No global user available, creating onboarded user...");
      testUser = await OnboardedUserHelper.createOnboardedUser(page);
    }
    
    // Dismiss any overlays
    await NavigationHelper.dismissOverlays(page);
  });

  test("should access AI Assistant with authenticated user", async ({ page }) => {
    console.log(`🧪 Testing AI Assistant with: ${testUser.email}`);
      
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

  test.afterEach(async ({ page }) => {
    // Only cleanup if we created a new user (not the global user)
    const isGlobalUser = testUser.email === process.env.GLOBAL_TEST_USER_EMAIL;
    if (!isGlobalUser) {
      console.log("🗑️ Cleaning up onboarded test user...");
      try {
        await OnboardedUserHelper.deleteOnboardedUser(page);
      } catch (error) {
        console.warn("⚠️ Failed to cleanup test user:", error.message);
      }
    } else {
      console.log("🌍 Preserving global onboarded user for other tests");
    }
  });
});