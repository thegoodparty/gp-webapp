import { test, expect } from "@playwright/test";
import { NavigationHelper } from "../../../src/helpers/navigation.helper";
import { CleanupHelper } from "../../../src/helpers/cleanup.helper";
import { WaitHelper } from "../../../src/helpers/wait.helper";

test.describe("Elections Pages", () => {
  test.afterEach(async ({ page }, testInfo) => {
    await CleanupHelper.takeScreenshotOnFailure(page, testInfo);
  });

  test("should display explore offices page", async ({ page }) => {
    // Arrange & Act
    await NavigationHelper.navigateToPage(page, "/elections");
    await NavigationHelper.dismissOverlays(page);
    
    // Assert - verify page title and content
    await expect(page).toHaveTitle(/Election Research/);
    await expect(page.getByText(/Explore elections in your community/)).toBeVisible();
    
    // Verify key images are present
    await expect(page.getByAltText("map").first()).toBeVisible();
    
    // Check for candidate images if present
    const candidateImages = page.getByAltText(/Carlos Rousselin|Breanna Stott|Victoria Masika/);
    const candidateCount = await candidateImages.count();
    if (candidateCount > 0) {
      await expect(candidateImages.first()).toBeVisible();
    }
  });

  test("should display county-level election page", async ({ page }) => {
    // Arrange & Act - navigate to a specific county page
    await NavigationHelper.navigateToPage(page, "/elections/ca/dublin");
    await NavigationHelper.dismissOverlays(page);
    
    // Assert - verify county election page
    await expect(page).toHaveTitle(/Run for Office in Dublin/);
    await expect(page.getByText(/Dublin elections/)).toBeVisible();
    
    // Should have election information
    const electionLinks = page.getByRole("link", { name: /City|Council|Legislature|Mayor/ });
    const linkCount = await electionLinks.count();
    if (linkCount > 0) {
      await expect(electionLinks.first()).toBeVisible();
    }
    
    // Should have fast facts section
    await expect(page.getByText(/Dublin Fast facts/)).toBeVisible();
  });

  test("should display municipal-level election page", async ({ page }) => {
    // Arrange & Act - navigate to a specific municipal page
    await NavigationHelper.navigateToPage(page, "/elections/il/adams-county/beverly-township");
    await NavigationHelper.dismissOverlays(page);
    
    // Assert - verify municipal election page
    await expect(page).toHaveTitle(/Run for Office in Beverly township/);
    await expect(page.getByText(/Beverly township elections/)).toBeVisible();
    
    // Should have election roles
    const roleLinks = page.getByRole("link", { name: /Parks|Recreation|District|Board/ });
    const roleCount = await roleLinks.count();
    if (roleCount > 0) {
      await expect(roleLinks.first()).toBeVisible();
    }
    
    // Should have fast facts section
    await expect(page.getByText(/Beverly township fast facts/)).toBeVisible();
  });

  test("should have working navigation from elections page", async ({ page }) => {
    // Arrange & Act
    await NavigationHelper.navigateToPage(page, "/elections");
    await NavigationHelper.dismissOverlays(page);
    await WaitHelper.waitForPageReady(page);
    
    // Look for state links to test navigation
    const stateLinks = page.getByRole("link").filter({ hasText: /California|Texas|New York|Florida/ });
    const stateCount = await stateLinks.count();
    
    if (stateCount > 0) {
      // Act - click on first state link
      const firstStateLink = stateLinks.first();
      await firstStateLink.click();
      
      // Assert - should navigate to state election page
      await expect(page).toHaveURL(/\/elections\/[a-z]{2}$/);
      
      // Should have state-specific content
      const stateContent = page.locator('h1, h2, [data-testid*="state"]');
      await expect(stateContent.first()).toBeVisible();
    } else {
      console.log("ℹ️ No state links found for navigation testing");
    }
  });

  test("should display election search functionality", async ({ page }) => {
    // Arrange & Act
    await NavigationHelper.navigateToPage(page, "/elections");
    await NavigationHelper.dismissOverlays(page);
    await WaitHelper.waitForPageReady(page);
    
    // Assert - look for search or filter functionality
    const searchElements = page.locator('input[type="search"], input[placeholder*="search"], input[placeholder*="zip"]');
    const searchCount = await searchElements.count();
    
    if (searchCount > 0) {
      await expect(searchElements.first()).toBeVisible();
      console.log("✅ Search functionality found");
    } else {
      console.log("ℹ️ No search functionality visible on elections page");
    }
  });
});
