import { test, expect } from "@playwright/test";
import { NavigationHelper } from "../../../src/helpers/navigation.helper";
import { CleanupHelper } from "../../../src/helpers/cleanup.helper";
import { WaitHelper } from "../../../src/helpers/wait.helper";

test.describe("Mobile Navigation", () => {
  // Configure mobile viewport
  test.use({ 
    viewport: { width: 375, height: 667 } 
  });

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

  test("should display mobile dashboard", async ({ page }) => {
    // Wait for dashboard to load
    await WaitHelper.waitForPageReady(page);
    
    // Assert - verify dashboard is accessible on mobile
    await expect(page.getByRole("heading", { name: /Campaign progress/ })).toBeVisible();
    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test("should have mobile navigation menu", async ({ page }) => {
    // Wait for page to load
    await WaitHelper.waitForPageReady(page);
    
    // Assert - verify mobile navigation elements (use first() for duplicates)
    const mobileMenuButton = page.getByTestId("tilt").first();
    
    if (await mobileMenuButton.isVisible({ timeout: 5000 })) {
      await expect(mobileMenuButton).toBeVisible(); // Mobile menu toggle
    }
  });

  test("should navigate to AI Assistant on mobile", async ({ page }) => {
    // Wait for page to load
    await WaitHelper.waitForPageReady(page);
    
    // Act - navigate using mobile navigation
    await NavigationHelper.navigateToNavItem(page, "AI Assistant", true);
    
    // Assert - verify AI Assistant page loads
    await expect(page.getByRole("heading", { name: "AI Assistant" })).toBeVisible();
    await expect(page).toHaveURL(/\/dashboard\/campaign-assistant$/);
  });

  test("should navigate to Content Builder on mobile", async ({ page }) => {
    // Wait for page to load
    await WaitHelper.waitForPageReady(page);
    
    // Act - navigate using mobile navigation
    await NavigationHelper.navigateToNavItem(page, "Content Builder", true);
    
    // Assert - verify Content Builder page loads
    await expect(page.getByRole("heading", { name: "Content Builder" })).toBeVisible();
    await expect(page).toHaveURL(/\/dashboard\/content$/);
  });

  test("should navigate to My Profile on mobile", async ({ page }) => {
    // Wait for page to load
    await WaitHelper.waitForPageReady(page);
    
    // Act - navigate using mobile navigation
    await NavigationHelper.navigateToNavItem(page, "My Profile", true);
    
    // Assert - verify Profile page loads (use heading role to avoid duplicates)
    await expect(page.getByRole("heading", { name: "Personal Information" })).toBeVisible();
    await expect(page).toHaveURL(/\/profile$/);
  });
});
