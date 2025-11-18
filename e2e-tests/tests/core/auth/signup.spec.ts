import { test, expect } from "@playwright/test";
import { NavigationHelper } from "../../../src/helpers/navigation.helper";
import { CleanupHelper } from "../../../src/helpers/cleanup.helper";
import { AccountHelper } from "../../../src/helpers/account.helper";
import { TestDataHelper } from "../../../src/helpers/data.helper";

// Reset storage state for auth tests to avoid being pre-authenticated
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Sign Up Functionality", () => {
  test.afterEach(async ({ page }, testInfo) => {
    await CleanupHelper.takeScreenshotOnFailure(page, testInfo);
  });

  test("should create new account successfully", async ({ page }) => {
    // Create a test account (automatically tracked for cleanup)
    const testUser = await AccountHelper.createTestAccount(page);

    // Assert - verify account creation succeeded and user is logged in
    // The account helper completes onboarding, so user should be at dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    console.log(`✅ Test account created and onboarded: ${testUser.email}`);
  });

  test("should display sign up form elements", async ({ page }) => {
    // Arrange & Act
    await NavigationHelper.navigateToPage(page, "/sign-up");
    await NavigationHelper.dismissOverlays(page);
    
    // Assert - verify form elements are visible
    await expect(page.getByRole('heading', { name: 'Join GoodParty.org' })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "First Name" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Last Name" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "email" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "phone" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Zip Code" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "password" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Join" })).toBeVisible();
  });

  test("should validate and process form data correctly", async ({ page }) => {
    // Arrange
    await NavigationHelper.navigateToPage(page, "/sign-up");
    await NavigationHelper.dismissOverlays(page);
    
    const testZip = '94066';
    const testEmail = TestDataHelper.generateTestEmail();
    const testPhone = TestDataHelper.generateTestPhone();
    
    // Act - Fill form with intentional leading spaces to test trimming
    await page.getByRole("textbox", { name: "First Name" }).fill(' firstName');
    await page.getByRole("textbox", { name: "Last Name" }).fill(' lastName');
    await page.getByRole("textbox", { name: "email" }).fill(testEmail);
    await page.getByRole("textbox", { name: "phone" }).fill(testPhone);
    await page.getByRole("textbox", { name: "Zip Code" }).fill(testZip);
    await page.getByRole("textbox", { name: "password" }).fill("TestPassword123!");
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
    
    // Assert - Verify leading/trailing whitespace is removed
    expect(firstName).toBe(firstName.trim());
    expect(lastName).toBe(lastName.trim());
    
    // Assert - Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(email.trim()).toBe(email);
    expect(emailRegex.test(email)).toBeTruthy();

    // Assert - ZIP validation (US 5-digit or 5+4)
    const zipRegex = /^\d{5}(?:-\d{4})?$/;
    expect(zip.trim()).toBe(zip);
    expect(zipRegex.test(zip)).toBeTruthy();

    // Assert - Phone validation (US 10-digit, numbers only)
    const phoneRegex = /^\d{10}$/;
    expect(phone.trim()).toBe(phone);
    expect(phoneRegex.test(phone)).toBeTruthy();
    
    // Assert - Verify successful registration (redirect to onboarding)
    await expect(page).toHaveURL(/\/onboarding/);
  });
});