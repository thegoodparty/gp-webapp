import { test, expect } from "@playwright/test";
import { AuthHelper } from "../../../src/helpers/auth.helper";
import { NavigationHelper } from "../../../src/helpers/navigation.helper";
import { CleanupHelper } from "../../../src/helpers/cleanup.helper";
import { generateEmail, generatePhone, userData } from "helpers/dataHelpers";
import { WaitHelper } from "src/helpers/wait.helper";

// Reset storage state for auth tests to avoid being pre-authenticated
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Login Functionality", () => {
  test.beforeEach(async ({ page }) => {
    await NavigationHelper.navigateToPage(page, "/login");
    await NavigationHelper.dismissOverlays(page);
  });

  test.afterEach(async ({ page }, testInfo) => {
    await CleanupHelper.takeScreenshotOnFailure(page, testInfo);
    await CleanupHelper.clearBrowserData(page);
    await CleanupHelper.cleanupTestData(page);
  });

  test("should display login form elements", async ({ page }) => {
    await expect(page.getByText("Login to GoodParty.org")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByPlaceholder("Please don't use your dog's")).toBeVisible(); // More specific password field locator
    await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
  });

  test("should show error for invalid credentials", async ({ page }) => {
    const invalidEmail = "nonexistent@example.com";
    const invalidPassword = "wrongpassword123";
    await page.getByLabel("Email").fill(invalidEmail);
    await page.getByPlaceholder("Please don't use your dog's").fill(invalidPassword);
    
    const loginButton = page.getByRole("button", { name: "Login" });
    await expect(loginButton).toBeEnabled();
    await loginButton.click();
    await expect(page.getByText("Invalid login. Please check your credentials and try again.")).toBeVisible();
  });

  test.skip("should login with valid admin credentials", async ({ page }) => {
    // Skip if admin credentials not available
    if (!process.env.TEST_USER_ADMIN || !process.env.TEST_USER_ADMIN_PASSWORD) {
      test.skip(true, "Admin credentials not available");
    }

    await AuthHelper.loginAsAdmin(page);
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByText("Dashboard")).toBeVisible();
  });
});
