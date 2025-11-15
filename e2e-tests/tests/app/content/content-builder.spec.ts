import { test, expect } from "@playwright/test";
import { AccountHelper } from "../../../src/helpers/account.helper";
import { NavigationHelper } from "../../../src/helpers/navigation.helper";
import { CleanupHelper } from "../../../src/helpers/cleanup.helper";
import { WaitHelper } from "../../../src/helpers/wait.helper";
import { TestUser } from "../../../src/utils/test-data-manager";

test.describe("Content Builder", () => {
  let testUser: TestUser;

  test.beforeEach(async ({ page }) => {
    // Use global test user (with completed onboarding) or create new account
    testUser = await AccountHelper.useGlobalTestUser(page);
    await NavigationHelper.dismissOverlays(page);
  });

  test.afterEach(async ({ page }, testInfo) => {
    await CleanupHelper.takeScreenshotOnFailure(page, testInfo);
    await CleanupHelper.clearBrowserData(page);
    await CleanupHelper.cleanupTestData(page);
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