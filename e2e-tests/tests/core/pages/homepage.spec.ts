import { test, expect } from "@playwright/test";
import { NavigationHelper } from "../../../src/helpers/navigation.helper";
import { CleanupHelper } from "../../../src/helpers/cleanup.helper";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await NavigationHelper.navigateToPage(page, "/");
    await NavigationHelper.dismissOverlays(page);
  });

  test.afterEach(async ({ page }, testInfo) => {
    await CleanupHelper.takeScreenshotOnFailure(page, testInfo);
  });

  test("should display homepage elements", async ({ page }) => {
    // Assert - verify page title and key elements
    await expect(page).toHaveTitle(/GoodParty/);
    
    // Verify navbar and footer are present
    await expect(page.getByTestId("navbar")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
    
    // Verify main content is loaded
    await expect(page.getByText("Join the GoodParty.org Community")).toBeVisible();
  });

  test("should have working navigation links", async ({ page }) => {
    // Test that main navigation is functional
    await expect(page.getByTestId("nav-product")).toBeVisible();
    await expect(page.getByTestId("nav-resources")).toBeVisible();
    await expect(page.getByTestId("nav-about-us")).toBeVisible();
  });
});
