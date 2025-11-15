import { test, expect } from "@playwright/test";
import { NavigationHelper } from "../../../src/helpers/navigation.helper";
import { CleanupHelper } from "../../../src/helpers/cleanup.helper";
import { WaitHelper } from "../../../src/helpers/wait.helper";

test.describe("Content Builder", () => {
  test.beforeEach(async ({ page }) => {
    // Page is already authenticated via storageState from auth.setup.ts
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');
    await NavigationHelper.dismissOverlays(page);
  });

  test.afterEach(async ({ page }, testInfo) => {
    await CleanupHelper.takeScreenshotOnFailure(page, testInfo);
    await CleanupHelper.clearBrowserData(page);
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