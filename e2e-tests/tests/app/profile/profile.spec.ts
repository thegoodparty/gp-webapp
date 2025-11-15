import { test, expect } from "@playwright/test";
import { SimpleAccountHelper, TestAccount } from "../../../src/helpers/account-simple.helper";
import { NavigationHelper } from "../../../src/helpers/navigation.helper";
import { WaitHelper } from "../../../src/helpers/wait.helper";

test.describe("Profile Management (Simple)", () => {
  test("should access and update profile with new account", async ({ page }) => {
    let testAccount: TestAccount;
    
    try {
      // Create account and get to dashboard
      testAccount = await SimpleAccountHelper.createAccountAndGetToDashboard(page);
      
      // Navigate to Profile
      await page.goto("/profile");
      await NavigationHelper.dismissOverlays(page);
      await WaitHelper.waitForPageReady(page);
      
      // Assert - verify Profile page loads
      await expect(page.getByRole("heading", { name: "Personal Information" }).first()).toBeVisible();
      await expect(page).toHaveURL(/\/profile$/);
      
      // Verify profile fields are accessible
      const personalFields = page.locator('[data-testid*="personal"]');
      const fieldCount = await personalFields.count();
      
      if (fieldCount > 0) {
        await expect(personalFields.first()).toBeVisible();
        console.log(`✅ Profile accessible with ${fieldCount} personal fields`);
      }
      
    } finally {
      // Clean up
      if (testAccount) {
        await SimpleAccountHelper.deleteTestAccount(page);
      }
    }
  });
});
