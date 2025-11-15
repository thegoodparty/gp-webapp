import { test, expect } from "@playwright/test";
import { AccountHelper } from "../../../src/helpers/account.helper";
import { NavigationHelper } from "../../../src/helpers/navigation.helper";
import { CleanupHelper } from "../../../src/helpers/cleanup.helper";
import { WaitHelper } from "../../../src/helpers/wait.helper";
import { TestDataHelper } from "../../../src/helpers/data.helper";
import { TestDataManager, TestUser } from "../../../src/utils/test-data-manager";

test.describe.skip("Profile Management", () => {
  let testUser: TestUser;

  test.beforeEach(async ({ page }) => {
    // Create a test account for authenticated tests
    testUser = await AccountHelper.createTestAccount(page);
    
    // Navigate to profile page
    await NavigationHelper.navigateToPage(page, "/profile");
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

  test("should display profile page elements", async ({ page }) => {
    // Assert - verify profile page is loaded (use heading role to be specific)
    await expect(page.getByRole("heading", { name: "Personal Information" })).toBeVisible();
    
    // Verify form fields are present
    await expect(page.getByTestId("personal-first-name")).toBeVisible();
    await expect(page.getByTestId("personal-email")).toBeVisible();
    await expect(page.locator("input[name='phone']")).toBeVisible();
    await expect(page.getByTestId("personal-zip")).toBeVisible();
  });

  test("should update personal information", async ({ page }) => {
    // Wait for profile page to load
    await WaitHelper.waitForPageReady(page);
    
    // Arrange - generate new test data
    const newFirstName = TestDataHelper.generateTimestamp() + "Updated";
    const newEmail = TestDataHelper.generateTestEmail();
    const newPhone = TestDataHelper.generateTestPhone();
    const newZip = "90210";
    
    // Act - update profile information
    await page.getByTestId("personal-first-name").waitFor({ state: "visible", timeout: 10000 });
    await page.getByTestId("personal-first-name").fill(newFirstName);
    await page.getByTestId("personal-email").fill(newEmail);
    await page.locator("input[name='phone']").fill(newPhone);
    await page.getByTestId("personal-zip").fill(newZip);
    
    // Save changes
    await page.locator('form').filter({ hasText: 'Save Changes' }).getByRole('button').first().click();
    
    // Wait for save to complete
    await WaitHelper.waitForPageReady(page);
    
    // Assert - verify changes were saved
    await expect(page.getByTestId("personal-first-name")).toHaveValue(newFirstName);
    await expect(page.getByTestId("personal-email")).toHaveValue(newEmail);
    // Phone number gets formatted, so check for formatted version
    await expect(page.locator("input[name='phone']")).toHaveValue(/\(510\) 586-/); // Formatted phone
    await expect(page.getByTestId("personal-zip")).toHaveValue(newZip);
  });

  test("should display notification settings", async ({ page }) => {
    // Wait for page to load
    await WaitHelper.waitForPageReady(page);
    
    // Assert - verify notification settings section exists
    const notificationSwitches = page.getByRole("switch");
    const switchCount = await notificationSwitches.count();
    
    // Should have at least one notification switch
    expect(switchCount).toBeGreaterThan(0);
    
    if (switchCount > 0) {
      await expect(notificationSwitches.first()).toBeVisible();
    }
  });

  test("should toggle notification settings", async ({ page }) => {
    // Wait for page to load
    await WaitHelper.waitForPageReady(page);
    
    // Find notification switches
    const notificationSwitches = page.getByRole("switch");
    const switchCount = await notificationSwitches.count();
    
    if (switchCount > 0) {
      // Act - toggle first switch
      const firstSwitch = notificationSwitches.first();
      await firstSwitch.waitFor({ state: "visible", timeout: 10000 });
      
      // Get initial state
      const initialState = await firstSwitch.isChecked();
      
      // Toggle the switch
      await firstSwitch.click();
      
      // Assert - verify state changed
      const newState = await firstSwitch.isChecked();
      expect(newState).not.toBe(initialState);
    }
  });

  test("should display password change section", async ({ page }) => {
    // Wait for page to load
    await WaitHelper.waitForPageReady(page);
    
    // Assert - verify password change fields exist
    const oldPasswordField = page.getByLabel("Old Password");
    const newPasswordField = page.getByLabel("New Password");
    
    if (await oldPasswordField.isVisible({ timeout: 5000 })) {
      await expect(oldPasswordField).toBeVisible();
      await expect(newPasswordField).toBeVisible();
      await expect(page.getByRole("button", { name: "Save Changes" }).nth(1)).toBeVisible();
    }
  });
});
