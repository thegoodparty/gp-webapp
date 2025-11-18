import { test, expect } from "@playwright/test";
import { NavigationHelper } from "../../../src/helpers/navigation.helper";
import { CleanupHelper } from "../../../src/helpers/cleanup.helper";
import { generateEmail, generatePhone, userData } from "helpers/dataHelpers";

// Reset storage state for auth tests to avoid being pre-authenticated
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Sign Up Functionality", () => {
  test.beforeEach(async ({ page }) => {
    await NavigationHelper.navigateToPage(page, "/sign-up");
    await NavigationHelper.dismissOverlays(page);
  });

  test.afterEach(async ({ page }, testInfo) => {
    await CleanupHelper.takeScreenshotOnFailure(page, testInfo);
    await CleanupHelper.clearBrowserData(page);
    await CleanupHelper.cleanupTestData(page);
  });

  test("should validate sign up form data processing", async ({ page }) => {
    // Arrange
    const testZip = '94066';
    
    // Verify page loaded correctly
    const signUpPageHeader = page.getByRole('heading', { name: 'Join GoodParty.org' });
    await expect(signUpPageHeader).toBeVisible();

    // Act - Fill form with intentional leading spaces to test trimming
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
  });
});