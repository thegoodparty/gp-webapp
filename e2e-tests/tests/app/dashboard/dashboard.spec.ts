import { test, expect } from "@playwright/test";
import { NavigationHelper } from "../../../src/helpers/navigation.helper";
import { WaitHelper } from "../../../src/helpers/wait.helper";

test.describe("Dashboard Functionality", () => {
  test.beforeEach(async ({ page }) => {
    // Page is already authenticated and fully onboarded via storageState from auth.setup.ts
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');
    
    if (!page.url().includes('/dashboard')) {
      throw new Error(`Expected dashboard but got: ${page.url()}`);
    }
    
    await NavigationHelper.dismissOverlays(page);
  });

  test("should access dashboard and navigate to app features", async ({ page }) => {
    console.log(`🧪 Testing dashboard functionality with pre-authenticated user`);
    
    await expect(page).toHaveURL(/\/dashboard$/);
    
    const dashboardContent = page.locator('h1, h2, h3, main');
    await expect(dashboardContent.first()).toBeVisible();
    console.log("✅ Dashboard accessible");
    
    await page.goto("/dashboard/campaign-assistant");
    await WaitHelper.waitForPageReady(page);
    await expect(page.getByRole("heading", { name: "AI Assistant" })).toBeVisible();
    console.log("✅ AI Assistant accessible");
    
    await page.goto("/profile");
    await WaitHelper.waitForPageReady(page);
    await expect(page.getByRole("heading", { name: "Personal Information" }).first()).toBeVisible();
    console.log("✅ Profile accessible");
  });
});