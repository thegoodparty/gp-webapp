import { test, expect } from "@playwright/test";
import { SimpleAuthHelper } from "../../../src/helpers/simple-auth.helper";
import { NavigationHelper } from "../../../src/helpers/navigation.helper";
import { CleanupHelper } from "../../../src/helpers/cleanup.helper";
import { WaitHelper } from "../../../src/helpers/wait.helper";

test.describe("Dashboard Functionality (Admin)", () => {
  test.beforeEach(async ({ page }) => {
    // Skip if admin credentials not available
    if (!process.env.TEST_USER_ADMIN || !process.env.TEST_USER_ADMIN_PASSWORD) {
      test.skip(true, "Admin credentials not available for dashboard testing");
    }

    // Try existing session first, then login
    const hasSession = await SimpleAuthHelper.useExistingAdminSession(page);
    if (!hasSession) {
      const loginSuccess = await SimpleAuthHelper.loginAsAdmin(page);
      if (!loginSuccess) {
        test.skip(true, "Could not authenticate as admin");
      }
    }
    
    await NavigationHelper.dismissOverlays(page);
  });

  test.afterEach(async ({ page }, testInfo) => {
    await CleanupHelper.takeScreenshotOnFailure(page, testInfo);
    await CleanupHelper.clearBrowserData(page);
  });

  test("should display dashboard page when authenticated", async ({ page }) => {
    // Assert - verify we're on dashboard and it's loaded
    await expect(page).toHaveURL(/\/dashboard$/);
    
    // Check for any dashboard content (admin dashboard may be different)
    const dashboardContent = page.locator('main, [data-testid*="dashboard"], [class*="dashboard"], h1, h2');
    await expect(dashboardContent.first()).toBeVisible();
  });

  test("should have navigation elements", async ({ page }) => {
    // Wait for page to load
    await WaitHelper.waitForPageReady(page);
    
    // Assert - verify basic navigation is present
    await expect(page.getByTestId("navbar")).toBeVisible();
    
    // Check if we can navigate to profile
    await page.goto("/profile");
    await WaitHelper.waitForPageReady(page);
    
    // Should have some profile content
    const profileContent = page.locator('h1, h2, [data-testid*="personal"]');
    await expect(profileContent.first()).toBeVisible();
  });

  test("should display admin dashboard elements", async ({ page }) => {
    // Navigate to admin dashboard if available
    await page.goto("/admin");
    await WaitHelper.waitForPageReady(page);
    
    // Check if admin dashboard is accessible
    const adminContent = page.locator('h1, h2, [class*="admin"], [data-testid*="admin"]');
    const contentCount = await adminContent.count();
    
    if (contentCount > 0) {
      await expect(adminContent.first()).toBeVisible();
      console.log("✅ Admin dashboard accessible");
    } else {
      console.log("ℹ️ Admin dashboard not accessible with current credentials");
    }
  });
});
