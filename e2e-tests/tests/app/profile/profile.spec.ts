import { test, expect } from "@playwright/test";
import { AccountHelper } from "../../../src/helpers/account.helper";
import { NavigationHelper } from "../../../src/helpers/navigation.helper";
import { CleanupHelper } from "../../../src/helpers/cleanup.helper";
import { WaitHelper } from "../../../src/helpers/wait.helper";
import { TestUser } from "../../../src/utils/test-data-manager";

test.describe("Profile Management", () => {
  let testUser: TestUser;

  test.beforeEach(async ({ page }) => {
    // Create a properly configured test account with full onboarding
    testUser = await AccountHelper.createTestAccount(page);
    await NavigationHelper.dismissOverlays(page);
  });

  test.afterEach(async ({ page }, testInfo) => {
    await CleanupHelper.takeScreenshotOnFailure(page, testInfo);
    await CleanupHelper.clearBrowserData(page);
    await CleanupHelper.cleanupTestData(page);
  });

  test("should access profile page", async ({ page }) => {
    // Navigate to Profile
    await page.goto("/profile");
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
  });
});