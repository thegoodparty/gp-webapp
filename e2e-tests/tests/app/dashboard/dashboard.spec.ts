import { test, expect } from "@playwright/test";
import { SharedTestUserManager } from "../../../src/utils/shared-test-user";
import { NavigationHelper } from "../../../src/helpers/navigation.helper";
import { CleanupHelper } from "../../../src/helpers/cleanup.helper";
import { WaitHelper } from "../../../src/helpers/wait.helper";

test.describe("Dashboard Functionality", () => {
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

  test("should access dashboard successfully", async ({ page }) => {
    // Assert - verify dashboard is accessible
    await expect(page).toHaveURL(/\/dashboard$/);
    
    // Look for dashboard content (flexible for different user states)
    const dashboardContent = page.locator('h1, h2, h3, main, [data-testid*="dashboard"]');
    await expect(dashboardContent.first()).toBeVisible();
    
    console.log("✅ Dashboard accessible with shared user");
  });

  test("should allow navigation to profile", async ({ page }) => {
    // Navigate to profile
    await page.goto("/profile");
    await WaitHelper.waitForPageReady(page);
    
    // Assert - verify profile is accessible
    await expect(page).toHaveURL(/\/profile$/);
    await expect(page.getByRole("heading", { name: "Personal Information" }).first()).toBeVisible();
    
    console.log("✅ Profile navigation works");
  });

  test("should allow navigation to AI Assistant", async ({ page }) => {
    // Navigate to AI Assistant
    await page.goto("/dashboard/campaign-assistant");
    await WaitHelper.waitForPageReady(page);
    
    // Assert - verify AI Assistant is accessible
    await expect(page).toHaveURL(/\/dashboard\/campaign-assistant$/);
    await expect(page.getByRole("heading", { name: "AI Assistant" })).toBeVisible();
    
    console.log("✅ AI Assistant accessible");
  });

  test("should allow navigation to Content Builder", async ({ page }) => {
    // Navigate to Content Builder
    await page.goto("/dashboard/content");
    await WaitHelper.waitForPageReady(page);
    await WaitHelper.waitForLoadingToComplete(page);
    
    // Assert - verify Content Builder is accessible
    await expect(page).toHaveURL(/\/dashboard\/content$/);
    await expect(page.getByRole("heading", { name: "Content Builder" })).toBeVisible();
    
    console.log("✅ Content Builder accessible");
  });
});
