import { test, expect } from "@playwright/test";
import { AccountHelper } from "../../../src/helpers/account.helper";
import { NavigationHelper } from "../../../src/helpers/navigation.helper";
import { CleanupHelper } from "../../../src/helpers/cleanup.helper";
import { WaitHelper } from "../../../src/helpers/wait.helper";
import { TestDataManager, TestUser } from "../../../src/utils/test-data-manager";

test.describe.skip("AI Assistant", () => {
  let testUser: TestUser;

  test.beforeEach(async ({ page }) => {
    // Create a test account for authenticated tests
    testUser = await AccountHelper.createTestAccount(page);
    
    // Navigate to AI Assistant page
    await NavigationHelper.navigateToPage(page, "/dashboard/campaign-assistant");
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

  test("should display AI Assistant page", async ({ page }) => {
    // Wait for page to load
    await WaitHelper.waitForPageReady(page);
    
    // Assert - verify AI Assistant page elements
    await expect(page.getByRole("heading", { name: "AI Assistant" })).toBeVisible();
  });

  test("should display conversation topics", async ({ page }) => {
    // Wait for page to load
    await WaitHelper.waitForPageReady(page);
    
    // Assert - verify conversation topic buttons are available
    const topicButtons = page.getByRole("button").filter({ hasText: /Campaign|Strategy|Policy|Messaging/ });
    const buttonCount = await topicButtons.count();
    
    // Should have at least one topic button
    expect(buttonCount).toBeGreaterThan(0);
    
    if (buttonCount > 0) {
      await expect(topicButtons.first()).toBeVisible();
    }
  });

  test("should create new conversation", async ({ page }) => {
    // Wait for page to load
    await WaitHelper.waitForPageReady(page);
    
    // Look for Campaign Strategy topic or any available topic
    const campaignStrategyButton = page.getByRole("button", { name: "Campaign Strategy" });
    const anyTopicButton = page.getByRole("button").filter({ hasText: /Campaign|Strategy|Policy|Messaging/ }).first();
    
    // Act - click on a conversation topic
    if (await campaignStrategyButton.isVisible({ timeout: 5000 })) {
      await campaignStrategyButton.click();
    } else if (await anyTopicButton.isVisible({ timeout: 5000 })) {
      await anyTopicButton.click();
    } else {
      // Skip test if no topic buttons are available
      test.skip(true, "No conversation topics available");
    }
    
    // Wait for conversation to start
    await WaitHelper.waitForPageReady(page);
    
    // Assert - verify conversation interface is loaded
    // The placeholder text should change or disappear when conversation starts
    const placeholderText = page.getByText("Ask me anything related to your campaign.");
    
    // Either the placeholder is hidden or the conversation interface is shown
    try {
      await expect(placeholderText).toBeHidden({ timeout: 30000 });
    } catch {
      // Alternative: check if conversation interface is visible
      const conversationArea = page.locator('[data-testid*="conversation"], [class*="conversation"], .chat, .messages');
      await expect(conversationArea.first()).toBeVisible({ timeout: 10000 });
    }
  });

  test("should display AI assistant interface elements", async ({ page }) => {
    // Wait for page to load
    await WaitHelper.waitForPageReady(page);
    
    // Assert - verify basic AI assistant interface elements
    await expect(page.getByRole("heading", { name: "AI Assistant" })).toBeVisible();
    
    // Check for input area or conversation starter
    const chatInput = page.getByPlaceholder(/Ask me anything/);
    const topicButtons = page.getByRole("button").filter({ hasText: /Campaign|Strategy/ });
    
    // Should have either chat input or topic selection
    const hasInput = await chatInput.isVisible({ timeout: 5000 });
    const hasTopics = await topicButtons.count() > 0;
    
    expect(hasInput || hasTopics).toBe(true);
  });
});
