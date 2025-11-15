import { test, expect } from "@playwright/test";
import { NavigationHelper } from "../../../src/helpers/navigation.helper";
import { CleanupHelper } from "../../../src/helpers/cleanup.helper";
import { WaitHelper } from "../../../src/helpers/wait.helper";

test.describe("Campaign Tools Page", () => {
  test.beforeEach(async ({ page }) => {
    await NavigationHelper.navigateToPage(page, "/run-for-office");
    await NavigationHelper.dismissOverlays(page);
  });

  test.afterEach(async ({ page }, testInfo) => {
    await CleanupHelper.takeScreenshotOnFailure(page, testInfo);
  });

  test("should display campaign tools page elements", async ({ page }) => {
    // Assert - verify page title and main content
    await expect(page).toHaveTitle(/Campaign Tools/);
    await expect(page.getByText(/Supercharge your local campaign/)).toBeVisible();
  });

  test("should display call-to-action buttons", async ({ page }) => {
    // Wait for page to fully load
    await WaitHelper.waitForPageReady(page);
    
    // Assert - verify key action buttons are present (use first() for duplicates)
    await expect(page.getByRole("link", { name: "Book a free demo" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Interactive demo" }).first()).toBeVisible();
  });

  test("should display campaign tools images", async ({ page }) => {
    // Wait for images to load
    await WaitHelper.waitForPageReady(page);
    
    // Assert - verify key images are present (use first() for duplicates)
    await expect(page.getByAltText("run for office").first()).toBeVisible();
    await expect(page.getByAltText("content").first()).toBeVisible();
    await expect(page.getByAltText("GoodParty").first()).toBeVisible();
  });

  test("should navigate to demo page when clicking demo button", async ({ page }) => {
    // Wait for page to load
    await WaitHelper.waitForPageReady(page);
    
    // Act - click on demo button
    await page.getByRole("link", { name: "Book a free demo" }).click();
    
    // Assert - should navigate to demo page (actual URL is /product-tour)
    await expect(page).toHaveURL(/\/product-tour/);
  });

  test("should navigate to interactive demo", async ({ page }) => {
    // Wait for page to load
    await WaitHelper.waitForPageReady(page);
    
    // Act - click on interactive demo (use first() for duplicates)
    await page.getByRole("link", { name: "Interactive demo" }).first().click();
    
    // Assert - should navigate to product tour
    await expect(page).toHaveURL(/\/product-tour/);
  });
});
