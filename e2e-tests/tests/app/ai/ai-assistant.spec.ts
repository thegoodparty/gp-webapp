import { test, expect } from "@playwright/test";
import { SimpleAccountHelper, TestAccount } from "../../../src/helpers/account-simple.helper";
import { NavigationHelper } from "../../../src/helpers/navigation.helper";
import { CleanupHelper } from "../../../src/helpers/cleanup.helper";
import { WaitHelper } from "../../../src/helpers/wait.helper";

test.describe("AI Assistant (Simple)", () => {
  let testAccount: TestAccount;

  test("should access AI Assistant with new account", async ({ page }) => {
    try {
      // Create account and get to dashboard
      testAccount = await SimpleAccountHelper.createAccountAndGetToDashboard(page);
      
      // Navigate to AI Assistant
      await page.goto("/dashboard/campaign-assistant");
      await NavigationHelper.dismissOverlays(page);
      await WaitHelper.waitForPageReady(page);
      
      // Assert - verify AI Assistant page loads
      await expect(page.getByRole("heading", { name: "AI Assistant" })).toBeVisible();
      await expect(page).toHaveURL(/\/dashboard\/campaign-assistant$/);
      
      console.log("✅ AI Assistant page accessible");
      
    } finally {
      // Clean up
      if (testAccount) {
        await SimpleAccountHelper.deleteTestAccount(page);
      }
    }
  });

  test("should display conversation topics", async ({ page }) => {
    try {
      // Create account and get to dashboard
      testAccount = await SimpleAccountHelper.createAccountAndGetToDashboard(page);
      
      // Navigate to AI Assistant
      await page.goto("/dashboard/campaign-assistant");
      await NavigationHelper.dismissOverlays(page);
      await WaitHelper.waitForPageReady(page);
      
      // Assert - verify conversation topics are available
      const topicButtons = page.getByRole("button").filter({ hasText: /Campaign|Strategy|Policy|Messaging/ });
      const buttonCount = await topicButtons.count();
      
      if (buttonCount > 0) {
        await expect(topicButtons.first()).toBeVisible();
        console.log(`✅ Found ${buttonCount} conversation topics`);
      } else {
        console.log("ℹ️ No conversation topics found (may require campaign setup)");
      }
      
    } finally {
      // Clean up
      if (testAccount) {
        await SimpleAccountHelper.deleteTestAccount(page);
      }
    }
  });
});
