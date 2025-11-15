import { test, expect } from "@playwright/test";
import { SimpleAccountHelper, TestAccount } from "../../../src/helpers/account-simple.helper";
import { NavigationHelper } from "../../../src/helpers/navigation.helper";
import { WaitHelper } from "../../../src/helpers/wait.helper";

test.describe("Content Builder (Simple)", () => {
  test("should access Content Builder with new account", async ({ page }) => {
    let testAccount: TestAccount;
    
    try {
      // Create account and get to dashboard
      testAccount = await SimpleAccountHelper.createAccountAndGetToDashboard(page);
      
      // Navigate to Content Builder
      await page.goto("/dashboard/content");
      await NavigationHelper.dismissOverlays(page);
      await WaitHelper.waitForPageReady(page);
      await WaitHelper.waitForLoadingToComplete(page);
      
      // Assert - verify Content Builder page loads
      await expect(page.getByRole("heading", { name: "Content Builder" })).toBeVisible();
      await expect(page).toHaveURL(/\/dashboard\/content$/);
      
      console.log("✅ Content Builder page accessible");
      
    } finally {
      // Clean up
      if (testAccount) {
        await SimpleAccountHelper.deleteTestAccount(page);
      }
    }
  });
});
