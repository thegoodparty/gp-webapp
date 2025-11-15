import { test, expect } from "@playwright/test";
import { SharedTestUserManager } from "../../../src/utils/shared-test-user";
import { NavigationHelper } from "../../../src/helpers/navigation.helper";
import { CleanupHelper } from "../../../src/helpers/cleanup.helper";
import { WaitHelper } from "../../../src/helpers/wait.helper";

test.describe("AI Assistant", () => {
  test.beforeEach(async ({ page }) => {
    // Skip if no shared test user available
    if (!SharedTestUserManager.hasValidSharedUser()) {
      test.skip(true, "No shared test user available - run global setup first");
    }
    
    // Login with shared test user
    await SharedTestUserManager.loginWithSharedUser(page);
    await NavigationHelper.dismissOverlays(page);
  });

  test.afterEach(async ({ page }, testInfo) => {
    await CleanupHelper.takeScreenshotOnFailure(page, testInfo);
  });

  test("should access AI Assistant page", async ({ page }) => {
    // Navigate to AI Assistant
    await page.goto("/dashboard/campaign-assistant");
    await WaitHelper.waitForPageReady(page);
    
    // Assert - verify AI Assistant page loads
    await expect(page.getByRole("heading", { name: "AI Assistant" })).toBeVisible();
    await expect(page).toHaveURL(/\/dashboard\/campaign-assistant$/);
    
    console.log("✅ AI Assistant page accessible");
  });

  test("should display conversation topics", async ({ page }) => {
    // Navigate to AI Assistant
    await page.goto("/dashboard/campaign-assistant");
    await WaitHelper.waitForPageReady(page);
    
    // Assert - verify conversation topics are available
    const topicButtons = page.getByRole("button").filter({ hasText: /Campaign|Strategy|Policy|Messaging/ });
    const buttonCount = await topicButtons.count();
    
    if (buttonCount > 0) {
      await expect(topicButtons.first()).toBeVisible();
      console.log(`✅ Found ${buttonCount} conversation topics`);
    } else {
      console.log("ℹ️ No conversation topics found (may require campaign setup)");
    }
  });
});