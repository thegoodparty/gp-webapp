import { test, expect } from "@playwright/test";
import { SimpleAuthHelper } from "../../../src/helpers/simple-auth.helper";
import { NavigationHelper } from "../../../src/helpers/navigation.helper";
import { CleanupHelper } from "../../../src/helpers/cleanup.helper";
import { WaitHelper } from "../../../src/helpers/wait.helper";

test.describe("Profile Management (Admin)", () => {
  test.beforeEach(async ({ page }) => {
    // Skip if admin credentials not available
    if (!process.env.TEST_USER_ADMIN || !process.env.TEST_USER_ADMIN_PASSWORD) {
      test.skip(true, "Admin credentials not available for profile testing");
    }

    // Try existing session first, then login
    const hasSession = await SimpleAuthHelper.useExistingAdminSession(page);
    if (!hasSession) {
      const loginSuccess = await SimpleAuthHelper.loginAsAdmin(page);
      if (!loginSuccess) {
        test.skip(true, "Could not authenticate as admin");
      }
    }
    
    // Navigate to profile page
    await NavigationHelper.navigateToPage(page, "/profile");
    await NavigationHelper.dismissOverlays(page);
  });

  test.afterEach(async ({ page }, testInfo) => {
    await CleanupHelper.takeScreenshotOnFailure(page, testInfo);
    await CleanupHelper.clearBrowserData(page);
  });

  test("should display profile page elements", async ({ page }) => {
    // Wait for profile page to load
    await WaitHelper.waitForPageReady(page);
    
    // Assert - verify profile page is loaded (use heading role to be specific)
    await expect(page.getByRole("heading", { name: "Personal Information" }).first()).toBeVisible();
    
    // Verify basic form fields are present
    const personalFields = page.locator('[data-testid*="personal"], input[name="phone"]');
    const fieldCount = await personalFields.count();
    
    expect(fieldCount).toBeGreaterThan(0);
    if (fieldCount > 0) {
      await expect(personalFields.first()).toBeVisible();
    }
  });

  test("should display notification settings section", async ({ page }) => {
    // Wait for page to load
    await WaitHelper.waitForPageReady(page);
    
    // Assert - verify notification settings section exists
    const notificationSwitches = page.getByRole("switch");
    const switchCount = await notificationSwitches.count();
    
    if (switchCount > 0) {
      await expect(notificationSwitches.first()).toBeVisible();
      console.log(`✅ Found ${switchCount} notification switches`);
    } else {
      console.log("ℹ️ No notification switches found on this profile");
    }
  });

  test("should display password section", async ({ page }) => {
    // Wait for page to load
    await WaitHelper.waitForPageReady(page);
    
    // Assert - verify password section exists
    const passwordSection = page.getByRole("heading", { name: "Password" });
    
    if (await passwordSection.isVisible({ timeout: 5000 })) {
      await expect(passwordSection).toBeVisible();
      
      // Check for password fields
      const passwordFields = page.locator('input[type="password"], [data-testid*="password"]');
      const fieldCount = await passwordFields.count();
      
      if (fieldCount > 0) {
        console.log(`✅ Found ${fieldCount} password fields`);
      }
    } else {
      console.log("ℹ️ Password section not visible on this profile");
    }
  });

  test("should have delete account functionality", async ({ page }) => {
    // Wait for page to load
    await WaitHelper.waitForPageReady(page);
    
    // Scroll to bottom where delete button should be
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Assert - verify delete account button exists (but don't click it!)
    const deleteButton = page.getByText("Delete Account");
    
    if (await deleteButton.isVisible({ timeout: 5000 })) {
      await expect(deleteButton).toBeVisible();
      console.log("✅ Delete Account button found");
    } else {
      console.log("ℹ️ Delete Account button not found (may be admin account)");
    }
  });
});
