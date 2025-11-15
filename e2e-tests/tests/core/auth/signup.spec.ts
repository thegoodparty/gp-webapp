import { test, expect } from "@playwright/test";
import { NavigationHelper } from "../../../src/helpers/navigation.helper";
import { CleanupHelper } from "../../../src/helpers/cleanup.helper";
import { TestDataHelper } from "../../../src/helpers/data.helper";
import { WaitHelper } from "../../../src/helpers/wait.helper";

test.describe("Registration Functionality", () => {
  test.beforeEach(async ({ page }) => {
    await NavigationHelper.navigateToPage(page, "/sign-up");
    await NavigationHelper.dismissOverlays(page);
  });

  test.afterEach(async ({ page }, testInfo) => {
    await CleanupHelper.takeScreenshotOnFailure(page, testInfo);
    await CleanupHelper.clearBrowserData(page);
  });

  test("should display registration form elements", async ({ page }) => {
    // Arrange & Act - page is already on signup from beforeEach
    
    // Assert - verify all form elements are visible using user-facing locators
    await expect(page.getByText("Join GoodParty.org")).toBeVisible();
    await expect(page.getByRole("textbox", { name: "First Name" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Last Name" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "email" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "phone" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Zip Code" })).toBeVisible();
    await expect(page.getByPlaceholder("Please don't use your dog's name")).toBeVisible(); // Password field
    await expect(page.getByRole("button", { name: "Join" })).toBeVisible();
    
    // Verify login link
    await expect(page.getByRole("link", { name: "Login here." })).toBeVisible();
  });

  test("should validate required fields", async ({ page }) => {
    // Arrange
    const joinButton = page.getByRole("button", { name: "Join" });
    
    // Assert - button should be disabled when form is empty
    await expect(joinButton).toBeDisabled();
  });

  test("should validate email format", async ({ page }) => {
    // Arrange
    const testUser = TestDataHelper.generateTestUser();
    
    // Act - fill form with invalid email
    await page.getByRole("textbox", { name: "First Name" }).fill(testUser.firstName);
    await page.getByRole("textbox", { name: "Last Name" }).fill(testUser.lastName);
    await page.getByRole("textbox", { name: "email" }).fill("invalid-email"); // Invalid format
    await page.getByRole("textbox", { name: "phone" }).fill(testUser.phone);
    await page.getByRole("textbox", { name: "Zip Code" }).fill(testUser.zipCode);
    await page.getByPlaceholder("Please don't use your dog's name").fill(testUser.password);
    
    // Assert - button should remain disabled with invalid email
    const joinButton = page.getByRole("button", { name: "Join" });
    await expect(joinButton).toBeDisabled();
  });

  test("should validate zip code format", async ({ page }) => {
    // Arrange
    const testUser = TestDataHelper.generateTestUser();
    
    // Act - fill form with invalid zip code
    await page.getByRole("textbox", { name: "First Name" }).fill(testUser.firstName);
    await page.getByRole("textbox", { name: "Last Name" }).fill(testUser.lastName);
    await page.getByRole("textbox", { name: "email" }).fill(testUser.email);
    await page.getByRole("textbox", { name: "phone" }).fill(testUser.phone);
    await page.getByRole("textbox", { name: "Zip Code" }).fill("123"); // Invalid zip
    await page.getByPlaceholder("Please don't use your dog's name").fill(testUser.password);
    
    // Assert - button should remain disabled with invalid zip
    const joinButton = page.getByRole("button", { name: "Join" });
    await expect(joinButton).toBeDisabled();
  });

  test("should enable submit button with valid form data", async ({ page }) => {
    // Arrange
    const testUser = TestDataHelper.generateTestUser();
    
    // Act - fill form with valid data
    await page.getByRole("textbox", { name: "First Name" }).fill(testUser.firstName);
    await page.getByRole("textbox", { name: "Last Name" }).fill(testUser.lastName);
    await page.getByRole("textbox", { name: "email" }).fill(testUser.email);
    await page.getByRole("textbox", { name: "phone" }).fill(testUser.phone);
    await page.getByRole("textbox", { name: "Zip Code" }).fill(testUser.zipCode);
    await page.getByPlaceholder("Please don't use your dog's name").fill(testUser.password);
    
    // Assert - button should be enabled with valid form
    const joinButton = page.getByRole("button", { name: "Join" });
    await expect(joinButton).toBeEnabled();
  });

  test("should navigate to login page when clicking login link", async ({ page }) => {
    // Act
    await page.getByRole("link", { name: "Login here." }).click();
    
    // Assert
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByText("Login to GoodParty.org")).toBeVisible();
  });

  test.skip("should complete registration flow with valid data", async ({ page }) => {
    // Skip this test as it would create actual accounts
    // This would be enabled in a test environment with proper cleanup
    
    const testUser = TestDataHelper.generateTestUser();
    
    // Fill registration form
    await page.getByRole("textbox", { name: "First Name" }).fill(testUser.firstName);
    await page.getByRole("textbox", { name: "Last Name" }).fill(testUser.lastName);
    await page.getByRole("textbox", { name: "email" }).fill(testUser.email);
    await page.getByRole("textbox", { name: "phone" }).fill(testUser.phone);
    await page.getByRole("textbox", { name: "Zip Code" }).fill(testUser.zipCode);
    await page.getByPlaceholder("Please don't use your dog's name").fill(testUser.password);
    
    // Submit form
    const joinButton = page.getByRole("button", { name: "Join" });
    await expect(joinButton).toBeEnabled();
    await joinButton.click();
    
    // Wait for redirect to onboarding flow
    await WaitHelper.waitForPageReady(page);
    
    // Should redirect to onboarding (exact URL may vary)
    await expect(page).toHaveURL(/\/(onboarding|dashboard)/);
  });
});
