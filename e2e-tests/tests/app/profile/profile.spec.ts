import { test, expect } from "@playwright/test";
import { SharedTestUserManager } from "../../../src/utils/shared-test-user.js";
import { NavigationHelper } from "../../../src/helpers/navigation.helper";
import { CleanupHelper } from "../../../src/helpers/cleanup.helper";
import { WaitHelper } from "../../../src/helpers/wait.helper";

test.describe("Profile Management", () => {
  test.beforeEach(async ({ page }) => {
    // Skip if no shared test user available
    if (!SharedTestUserManager.hasValidSharedUser()) {
      test.skip(true, "No shared test user available - run global setup first");
    }
    
    // Login with shared test user
    await SharedTestUserManager.loginWithSharedUser(page);
    await NavigationHelper.dismissOverlays(page);
  });

  test.afterEach(async ({ page }, testInfo) => {
    await CleanupHelper.takeScreenshotOnFailure(page, testInfo);
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