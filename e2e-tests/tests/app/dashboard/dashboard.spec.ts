import { test, expect } from "@playwright/test";
import { AccountHelper } from "../../../src/helpers/account.helper";
import { NavigationHelper } from "../../../src/helpers/navigation.helper";
import { CleanupHelper } from "../../../src/helpers/cleanup.helper";
import { WaitHelper } from "../../../src/helpers/wait.helper";
import { TestDataManager, TestUser } from "../../../src/utils/test-data-manager";

test.describe.skip("Dashboard Functionality", () => {
  let testUser: TestUser;

  test.beforeEach(async ({ page }) => {
    // Create a test account for authenticated tests
    testUser = await AccountHelper.createTestAccount(page);
    
    // Navigate to dashboard
    await NavigationHelper.navigateToPage(page, "/dashboard");
    await NavigationHelper.dismissOverlays(page);
  });

  test.afterEach(async ({ page }, testInfo) => {
    await CleanupHelper.takeScreenshotOnFailure(page, testInfo);
    
    // Clean up the test account
    try {
      await TestDataManager.deleteAccount(page);
    } catch (error) {
      console.warn("Failed to delete test account in afterEach:", error.message);
    }
    
    await CleanupHelper.clearBrowserData(page);
    await CleanupHelper.cleanupTestData(page);
  });

  test("should display dashboard page elements", async ({ page }) => {
    // Assert - verify main dashboard elements
    await expect(page.getByRole("heading", { name: /Campaign progress/ })).toBeVisible();
    
    // Verify dashboard is loaded and user is authenticated
    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test("should display voter contact tracking", async ({ page }) => {
    // Wait for dashboard to fully load
    await WaitHelper.waitForPageReady(page);
    
    // Assert - verify voter contact tracking elements are present
    const recordContactsButton = page.getByRole("button", { name: /Record voter contacts/ });
    await expect(recordContactsButton).toBeVisible({ timeout: 30000 });
  });

  test("should allow logging voter contact data", async ({ page }) => {
    // Wait for dashboard to fully load
    await WaitHelper.waitForPageReady(page);
    
    // Act - open voter contact modal
    const recordContactsButton = page.getByRole("button", { name: /Record voter contacts/ });
    await expect(recordContactsButton).toBeVisible({ timeout: 30000 });
    await recordContactsButton.click();
    
    // Fill in contact data
    await page.getByLabel("Text Messages Sent").click();
    await page.getByLabel("Text Messages Sent").fill("100");
    await page.getByRole("button", { name: "Save" }).click();
    
    // Assert - verify the data was saved
    await expect(page.getByText(/100 voters contacted/)).toBeVisible();
  });

  test("should display campaign progress metrics", async ({ page }) => {
    // Wait for dashboard to load
    await WaitHelper.waitForPageReady(page);
    
    // Assert - verify campaign progress section exists
    await expect(page.getByRole("heading", { name: /Campaign progress/ })).toBeVisible();
    
    // Check for common dashboard widgets (these may vary based on campaign setup)
    const dashboardContent = page.locator('[data-testid*="dashboard"], [class*="dashboard"], main, .main-content');
    await expect(dashboardContent.first()).toBeVisible();
  });
});
