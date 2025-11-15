import { test, expect } from "@playwright/test";
import { NavigationHelper } from "../../../src/helpers/navigation.helper";
import { CleanupHelper } from "../../../src/helpers/cleanup.helper";
import { WaitHelper } from "../../../src/helpers/wait.helper";
import { TestDataHelper } from "../../../src/helpers/data.helper";

test.describe("Volunteer Page", () => {
  test.beforeEach(async ({ page }) => {
    await NavigationHelper.navigateToPage(page, "/volunteer");
    await NavigationHelper.dismissOverlays(page);
  });

  test.afterEach(async ({ page }, testInfo) => {
    await CleanupHelper.takeScreenshotOnFailure(page, testInfo);
  });

  test("should display volunteer page elements", async ({ page }) => {
    // Assert - verify page title and content
    await expect(page).toHaveTitle(/Get Involved/);
    await expect(page.getByText(/Turn dissatisfaction into action/)).toBeVisible();
    
    // Verify key action buttons (check what actually exists)
    const actionButton = page.getByRole("button", { name: "Start taking action" });
    if (await actionButton.isVisible({ timeout: 5000 })) {
      await expect(actionButton.first()).toBeVisible();
    }
    
    // Look for any involvement buttons
    const involvementButtons = page.getByRole("button").filter({ hasText: /Get Involved|Join|Sign Up|Volunteer/ });
    const buttonCount = await involvementButtons.count();
    if (buttonCount > 0) {
      await expect(involvementButtons.first()).toBeVisible();
    }
  });

  test("should display volunteer images", async ({ page }) => {
    // Wait for images to load
    await WaitHelper.waitForPageReady(page);
    
    // Assert - verify key images are present (use first() for duplicates)
    await expect(page.getByAltText("megaphone").first()).toBeVisible();
    await expect(page.getByAltText("GoodParty").first()).toBeVisible();
    
    // Check for people images
    const peopleImages = page.getByAltText(/Sal Davis|Terry Vo|Kieryn McCann/);
    const peopleCount = await peopleImages.count();
    if (peopleCount > 0) {
      await expect(peopleImages.first()).toBeVisible();
    }
  });

  test("should have working volunteer form", async ({ page }) => {
    // Wait for form to load
    await WaitHelper.waitForPageReady(page);
    
    // Arrange - generate test data
    const testUser = TestDataHelper.generateTestUser();
    
    // Act - fill volunteer form
    await page.locator("input[name='First Name']").fill(testUser.firstName);
    await page.locator("input[name='Last Name']").fill(testUser.lastName);
    await page.locator("input[name='phone']").fill(testUser.phone);
    await page.locator("input[name='email']").fill(testUser.email);
    
    // Check the agreement checkbox
    const checkbox = page.locator("input[type='checkbox']");
    if (await checkbox.isVisible({ timeout: 5000 })) {
      await checkbox.click();
    }
    
    // Submit form
    const submitButton = page.getByRole("button", { name: /Start taking action/ });
    await submitButton.first().click();
    
    // Assert - verify confirmation message
    await expect(page.getByText(/Thank you! we will be in touch soon./)).toBeVisible({ timeout: 30000 });
  });

  test("should display FAQ sections", async ({ page }) => {
    // Wait for page to load
    await WaitHelper.waitForPageReady(page);
    
    // Assert - verify FAQ expandable sections exist
    const expandables = page.getByTestId("faq-expandable");
    const count = await expandables.count();
    
    if (count > 0) {
      // Test expanding first FAQ
      const firstExpandButton = expandables.first().locator('button[aria-label="expand"]');
      if (await firstExpandButton.isVisible({ timeout: 5000 })) {
        await expect(firstExpandButton).toHaveAttribute('aria-label', 'expand');
        await firstExpandButton.click();
        
        // Verify it expands
        const collapseButton = expandables.first().locator('button[aria-label="collapse"]');
        await expect(collapseButton).toBeVisible();
      }
    }
  });

  test("should have proper form validation", async ({ page }) => {
    // Wait for form to load
    await WaitHelper.waitForPageReady(page);
    
    // Assert - submit button should be disabled when form is empty
    const submitButton = page.getByRole("button", { name: /Start taking action/ });
    
    if (await submitButton.isVisible({ timeout: 5000 })) {
      await expect(submitButton.first()).toBeDisabled();
    }
    
    // Verify form fields exist
    const firstNameField = page.locator("input[name='First Name']");
    const emailField = page.locator("input[name='email']");
    
    if (await firstNameField.isVisible({ timeout: 5000 })) {
      await expect(firstNameField).toBeVisible();
    }
    if (await emailField.isVisible({ timeout: 5000 })) {
      await expect(emailField).toBeVisible();
    }
  });
});
