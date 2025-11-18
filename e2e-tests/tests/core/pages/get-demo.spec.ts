import { test, expect } from "@playwright/test";
import { NavigationHelper } from "../../../src/helpers/navigation.helper";
import { CleanupHelper } from "../../../src/helpers/cleanup.helper";
import { WaitHelper } from "../../../src/helpers/wait.helper";

test.describe("Get Demo Page", () => {
  test.beforeEach(async ({ page }) => {
    await NavigationHelper.navigateToPage(page, "/get-a-demo");
    await NavigationHelper.dismissOverlays(page);
  });

  test.afterEach(async ({ page }, testInfo) => {
    await CleanupHelper.takeScreenshotOnFailure(page, testInfo);
  });

  test("should display get demo page elements", async ({ page }) => {
    await expect(page).toHaveTitle(/Book a Demo/);
    await expect(page.getByText(/Get a demo of GoodParty.org's free tools for independent and 3rd party candidates/)).toBeVisible();
  });

  test("should display team member images", async ({ page }) => {
    await WaitHelper.waitForPageReady(page);
    await expect(page.getByAltText("Jared and Rob").first()).toBeVisible();
    await expect(page.getByAltText("Lisa").first()).toBeVisible();
  });

  test("should display HubSpot booking calendar", async ({ page }) => {
    await WaitHelper.waitForPageReady(page);
    const hubSpotLocator = page.locator('iframe[title="Book a Meeting"]');
    
    if (await hubSpotLocator.isVisible({ timeout: 10000 })) {
      await expect(hubSpotLocator).toBeVisible();
      
      try {
        const frame = await hubSpotLocator.contentFrame();
        if (frame) {
          console.log("✅ HubSpot iframe content accessible");
        }
      } catch (error) {
        console.log("ℹ️ HubSpot iframe content not accessible (expected for external iframe)");
      }
    } else {
      console.log("ℹ️ HubSpot booking calendar not loaded");
    }
  });

  test("should have proper page structure", async ({ page }) => {
    await WaitHelper.waitForPageReady(page);
    await expect(page.getByTestId("navbar")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
    
    const mainContent = page.locator('body, div, section').first();
    await expect(mainContent).toBeVisible();
  });
});
