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
    // Arrange & Act - page is already on login from beforeEach
    
    // Assert - use web-first assertions with user-facing locators
    await expect(page.getByText("Login to GoodParty.org")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByPlaceholder("Please don't use your dog's")).toBeVisible(); // More specific password field locator
    await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
  });

  test("should show error for invalid credentials", async ({ page }) => {
    // Arrange - use a properly formatted email that doesn't exist
    const invalidEmail = "nonexistent@example.com";
    const invalidPassword = "wrongpassword123";
    
    // Act
    await page.getByLabel("Email").fill(invalidEmail);
    await page.getByPlaceholder("Please don't use your dog's").fill(invalidPassword);
    
    // Wait for button to be enabled (form validation)
    const loginButton = page.getByRole("button", { name: "Login" });
    await expect(loginButton).toBeEnabled();
    await loginButton.click();
    
    // Assert - web-first assertion with auto-waiting
    await expect(page.getByText("Invalid login. Please check your credentials and try again.")).toBeVisible();
  });

  test.skip("should login with valid admin credentials", async ({ page }) => {
    // Skip if admin credentials not available
    if (!process.env.TEST_USER_ADMIN || !process.env.TEST_USER_ADMIN_PASSWORD) {
      test.skip(true, "Admin credentials not available");
    }

    // Act
    await AuthHelper.loginAsAdmin(page);
    
    // Assert
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByText("Dashboard")).toBeVisible();
  });
});

test('Validate sign up forms', async ({ page }) => {
    const testZip = '94066';    
    await NavigationHelper.navigateToPage(page, "/sign-up");

    const signUpPageHeader = page.getByRole('heading', { name: 'Join GoodParty.org' });
    await expect(signUpPageHeader).toBeVisible();

    // Verify leading spaces are automatically removed from submission
    await page.getByRole("textbox", { name: "First Name" }).fill(' firstName');
    await page.getByRole("textbox", { name: "Last Name" }).fill(' lastName');
    await page.getByRole("textbox", { name: "email" }).fill(generateEmail());
    await page.getByRole("textbox", { name: "phone" }).fill(generatePhone());
    await page.getByRole("textbox", { name: "Zip Code" }).fill(testZip);
    await page.getByRole("textbox", { name: "password" }).fill(userData.password + "1");
    await page.getByRole("button", { name: "Join" }).click();

    // Wait for the register request
    const registerResponse = await page.waitForResponse(resp => {
        return resp.url().includes("/register") &&
               resp.request().method() === "POST" &&
               resp.headers()["content-type"]?.includes("application/json");
      });

    const body = await registerResponse.json();
    const firstName = body.user.firstName as string;
    const lastName  = body.user.lastName as string;
    const email     = body.user.email as string;
    const zip       = body.user.zip as string;
    const phone     = body.user.phone as string;

    // Assertions: no leading or trailing whitespace
    expect(firstName).toBe(firstName.trim());
    expect(lastName).toBe(lastName.trim());

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(email.trim()).toBe(email);
    expect(emailRegex.test(email)).toBeTruthy();

    // ZIP validation (US 5-digit or 5+4)
    const zipRegex = /^\d{5}(?:-\d{4})?$/;
    expect(zip.trim()).toBe(zip);
    expect(zipRegex.test(zip)).toBeTruthy();

    // Phone validation (US 10-digit, numbers only)
    const phoneRegex = /^\d{10}$/;
    expect(phone.trim()).toBe(phone);
    expect(phoneRegex.test(phone)).toBeTruthy();
});
