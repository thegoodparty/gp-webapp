import { test, expect } from "@playwright/test";
import { AuthHelper } from "../../../src/helpers/auth.helper";
import { NavigationHelper } from "../../../src/helpers/navigation.helper";
import { CleanupHelper } from "../../../src/helpers/cleanup.helper";
import { WaitHelper } from "../../../src/helpers/wait.helper";

test.describe("Dashboard Functionality (Simple)", () => {
  test.beforeEach(async ({ page }) => {
    // Skip if admin credentials not available
    if (!process.env.TEST_USER_ADMIN || !process.env.TEST_USER_ADMIN_PASSWORD) {
      test.skip(true, "Admin credentials not available for dashboard testing");
    }

    // Use admin credentials to test dashboard functionality
    await AuthHelper.loginAsAdmin(page);
    await NavigationHelper.dismissOverlays(page);
  });

  test.afterEach(async ({ page }, testInfo) => {
    await CleanupHelper.takeScreenshotOnFailure(page, testInfo);
    await CleanupHelper.clearBrowserData(page);
  });

  test("should display dashboard page when authenticated", async ({ page }) => {
    // Assert - verify we're on dashboard and it's loaded
    await expect(page).toHaveURL(/\/dashboard$/);
    
    // Check for any dashboard content (flexible since admin dashboard may be different)
    const dashboardContent = page.locator('main, [data-testid*="dashboard"], [class*="dashboard"]');
    await expect(dashboardContent.first()).toBeVisible();
  });

  test("should have navigation elements", async ({ page }) => {
    // Wait for page to load
    await WaitHelper.waitForPageReady(page);
    
    // Assert - verify basic navigation is present
    await expect(page.getByTestId("navbar")).toBeVisible();
    
    // Check if we can navigate to profile
    await page.goto("/profile");
    await expect(page.getByRole("heading", { name: "Personal Information" })).toBeVisible();
  });
});
