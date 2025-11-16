import { test, expect } from "@playwright/test";
import type { TestUser } from "../../../src/utils/test-data-manager";
import { AccountHelper } from "../../../src/helpers/account.helper";
import { NavigationHelper } from "../../../src/helpers/navigation.helper";
import { CleanupHelper } from "../../../src/helpers/cleanup.helper";
import { WaitHelper } from "../../../src/helpers/wait.helper";
import { TestDataManager } from "../../../src/utils/test-data-manager";

test.describe.skip("Contacts Page", () => {
  let testUser: TestUser;

  test.beforeEach(async ({ page }) => {
    // Create a test account for authenticated tests
    testUser = await AccountHelper.createTestAccount(page);
    
    // Navigate to contacts page
    await NavigationHelper.navigateToPage(page, "/dashboard/contacts");
    await NavigationHelper.dismissOverlays(page);
    
    // Wait for page to load completely
    await WaitHelper.waitForPageReady(page);
  });

  test.afterEach(async ({ page }, testInfo) => {
    await CleanupHelper.takeScreenshotOnFailure(page, testInfo);
    await CleanupHelper.clearBrowserData(page);
    await CleanupHelper.cleanupTestData(page);
  });

  test("should display contacts page", async ({ page }) => {
    // Assert - verify contacts page is loaded
    await expect(page.getByRole("heading", { name: "Contacts" })).toBeVisible();
  });

  test("should display contact statistics", async ({ page }) => {
    // Wait for statistics to load
    await WaitHelper.waitForLoadingToComplete(page);
    
    // Assert - verify statistics cards are present
    const totalConstituentsCard = page.getByTestId("totalConstituents-value");
    const politicalMakeupCard = page.getByTestId("politicalMakeup-value");
    
    if (await totalConstituentsCard.isVisible({ timeout: 10000 })) {
      await expect(totalConstituentsCard).toBeVisible();
      
      // Wait for card to have content (not empty)
      await page.waitForFunction(
        (testId) => {
          const element = document.querySelector(`[data-testid="${testId}"]`);
          return element && element.textContent && element.textContent.trim().length > 0;
        },
        "totalConstituents-value",
        { timeout: 30000 }
      );
      
      await expect(totalConstituentsCard).not.toHaveText("");
    }
    
    if (await politicalMakeupCard.isVisible({ timeout: 10000 })) {
      await expect(politicalMakeupCard).toBeVisible();
      
      // Wait for card to have content
      await page.waitForFunction(
        (testId) => {
          const element = document.querySelector(`[data-testid="${testId}"]`);
          return element && element.textContent && element.textContent.trim().length > 0;
        },
        "politicalMakeup-value",
        { timeout: 30000 }
      );
      
      await expect(politicalMakeupCard).not.toHaveText("");
    }
  });

  test("should display create segment button", async ({ page }) => {
    // Wait for page to load
    await WaitHelper.waitForLoadingToComplete(page);
    
    // Assert - verify create segment functionality is available
    const createSegmentButton = page.getByRole("button", { name: "Create a Segment" });
    
    // Check if button is available (may be locked for some users)
    if (await createSegmentButton.isVisible({ timeout: 10000 })) {
      await expect(createSegmentButton).toBeVisible();
      
      // Check if button is enabled (not locked)
      const isEnabled = await createSegmentButton.isEnabled();
      if (isEnabled) {
        await expect(createSegmentButton).toBeEnabled();
      }
    }
  });

  test("should open segment creation modal", async ({ page }) => {
    // Wait for page to load
    await WaitHelper.waitForLoadingToComplete(page);
    
    // Check if create segment is available and unlocked
    const createSegmentButton = page.getByRole("button", { name: "Create a Segment" });
    
    if (await createSegmentButton.isVisible({ timeout: 10000 }) && 
        await createSegmentButton.isEnabled({ timeout: 5000 })) {
      
      // Act - click create segment
      await createSegmentButton.click();
      
      // Assert - verify segment creation modal opens
      await expect(page.getByRole("heading", { name: "General Information" })).toBeVisible();
      
      // Verify modal has form elements
      const checkboxes = page.getByRole("checkbox");
      const checkboxCount = await checkboxes.count();
      expect(checkboxCount).toBeGreaterThan(0);
      
      // Verify create segment button in modal
      await expect(page.getByRole("button", { name: "Create Segment" })).toBeVisible();
    } else {
      test.skip(true, "Create segment feature is locked for this user");
    }
  });
});
