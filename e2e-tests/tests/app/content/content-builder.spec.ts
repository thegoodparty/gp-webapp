import { test, expect } from "@playwright/test";
import { AccountHelper } from "../../../src/helpers/account.helper";
import { NavigationHelper } from "../../../src/helpers/navigation.helper";
import { CleanupHelper } from "../../../src/helpers/cleanup.helper";
import { WaitHelper } from "../../../src/helpers/wait.helper";
import { TestDataManager, TestUser } from "../../../src/utils/test-data-manager";

test.describe.skip("Content Builder", () => {
  let testUser: TestUser;

  test.beforeEach(async ({ page }) => {
    // Create a test account for authenticated tests
    testUser = await AccountHelper.createTestAccount(page);
    
    // Navigate to content builder
    await NavigationHelper.navigateToPage(page, "/dashboard/content");
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

  test("should display content builder page", async ({ page }) => {
    // Wait for page to load completely
    await WaitHelper.waitForPageReady(page);
    await WaitHelper.waitForLoadingToComplete(page);
    
    // Assert - verify content builder page elements
    await expect(page.getByRole("heading", { name: "Content Builder" })).toBeVisible();
  });

  test("should display generate button", async ({ page }) => {
    // Wait for page to load completely
    await WaitHelper.waitForPageReady(page);
    await WaitHelper.waitForLoadingToComplete(page);
    
    // Assert - verify generate button is available
    const generateButton = page.getByRole("button", { name: /Generate/ });
    await expect(generateButton).toBeVisible({ timeout: 30000 });
  });

  test("should open template selection when generate is clicked", async ({ page }) => {
    // Wait for page to load completely
    await WaitHelper.waitForPageReady(page);
    await WaitHelper.waitForLoadingToComplete(page);
    
    // Act - click generate button
    const generateButton = page.getByRole("button", { name: /Generate/ });
    await expect(generateButton).toBeVisible({ timeout: 30000 });
    await generateButton.click();
    
    // Assert - verify template selection modal opens
    await expect(page.getByRole("heading", { name: "Select a Template" })).toBeVisible();
  });

  test("should display template options", async ({ page }) => {
    // Wait for page to load completely
    await WaitHelper.waitForPageReady(page);
    await WaitHelper.waitForLoadingToComplete(page);
    
    // Act - open template selection
    const generateButton = page.getByRole("button", { name: /Generate/ });
    await expect(generateButton).toBeVisible({ timeout: 30000 });
    await generateButton.click();
    
    // Assert - verify template options are available
    await expect(page.getByRole("heading", { name: "Select a Template" })).toBeVisible();
    
    // Look for common template types
    const templateButtons = page.getByRole("button").filter({ 
      hasText: /Email|Interview|Registration|Campaign/ 
    });
    const templateCount = await templateButtons.count();
    
    // Should have at least one template option
    expect(templateCount).toBeGreaterThan(0);
  });

  test("should select and use a template", async ({ page }) => {
    // Wait for page to load completely
    await WaitHelper.waitForPageReady(page);
    await WaitHelper.waitForLoadingToComplete(page);
    
    // Act - open template selection
    const generateButton = page.getByRole("button", { name: /Generate/ });
    await expect(generateButton).toBeVisible({ timeout: 30000 });
    await generateButton.click();
    
    // Wait for template modal
    await expect(page.getByRole("heading", { name: "Select a Template" })).toBeVisible();
    
    // Select first available template
    const templateButtons = page.getByRole("button").filter({ 
      hasText: /Email|Interview|Registration|Campaign|Voter/ 
    });
    
    if (await templateButtons.count() > 0) {
      const firstTemplate = templateButtons.first();
      await firstTemplate.click();
      
      // Wait for template to be selected/loaded
      await WaitHelper.waitForPageReady(page);
      
      // Assert - verify we're back to content builder with template selected
      await expect(page.getByRole("heading", { name: "Content Builder" })).toBeVisible();
    } else {
      test.skip(true, "No templates available for selection");
    }
  });
});
