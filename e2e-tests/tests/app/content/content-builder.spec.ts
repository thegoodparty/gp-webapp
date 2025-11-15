import { test, expect } from "@playwright/test";
import { SharedTestUserManager } from "../../../src/utils/shared-test-user.js";
import { NavigationHelper } from "../../../src/helpers/navigation.helper";
import { CleanupHelper } from "../../../src/helpers/cleanup.helper";
import { WaitHelper } from "../../../src/helpers/wait.helper";

test.describe("Content Builder", () => {
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

  test("should access Content Builder page", async ({ page }) => {
    // Navigate to Content Builder
    await page.goto("/dashboard/content");
    await WaitHelper.waitForPageReady(page);
    await WaitHelper.waitForLoadingToComplete(page);
    
    // Assert - verify Content Builder page loads
    await expect(page.getByRole("heading", { name: "Content Builder" })).toBeVisible();
    await expect(page).toHaveURL(/\/dashboard\/content$/);
    
    console.log("✅ Content Builder page accessible");
  });
});