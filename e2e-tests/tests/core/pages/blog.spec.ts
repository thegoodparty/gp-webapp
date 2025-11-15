import { test, expect } from "@playwright/test";
import { NavigationHelper } from "../../../src/helpers/navigation.helper";
import { CleanupHelper } from "../../../src/helpers/cleanup.helper";
import { WaitHelper } from "../../../src/helpers/wait.helper";

test.describe("Blog Page", () => {
  test.beforeEach(async ({ page }) => {
    await NavigationHelper.navigateToPage(page, "/blog");
    await NavigationHelper.dismissOverlays(page);
  });

  test.afterEach(async ({ page }, testInfo) => {
    await CleanupHelper.takeScreenshotOnFailure(page, testInfo);
  });

  test("should display blog page elements", async ({ page }) => {
    // Assert - verify page title and content using user-facing locators
    await expect(page.getByRole("heading", { name: "Blog" })).toBeVisible();
    
    // Verify page subtitle
    await expect(page.getByText(/Insights into politics, running for office, and the latest updates from the independent movement/)).toBeVisible();
    
    // Verify category navigation buttons (use first() for duplicates)
    await expect(page.getByRole("link", { name: "Latest Articles" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "News" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Politics" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Independent Cause" }).first()).toBeVisible();
  });

  test("should display blog articles", async ({ page }) => {
    // Wait for articles to load
    await WaitHelper.waitForPageReady(page);
    
    // Assert - verify at least one article is displayed
    await expect(page.getByRole("button", { name: "Read More" }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: "Read More" }).first()).toBeEnabled();
  });

  test("should navigate to blog article", async ({ page }) => {
    // Wait for articles to load
    await WaitHelper.waitForPageReady(page);
    
    // Act - click on first "Read More" button
    await page.getByRole("button", { name: "Read More" }).first().click();
    
    // Assert - should navigate to article page
    await expect(page).toHaveURL(/.*\/article/);
  });

  test("should filter blog by news category", async ({ page }) => {
    // Act - click on News category (use first() for duplicates)
    await page.getByRole("link", { name: "News" }).first().click();
    
    // Assert - should navigate to news section
    await expect(page).toHaveURL(/\/section\/news/i);
    // Use testId to avoid multiple heading matches
    await expect(page.getByTestId("articleTitle")).toHaveText("News");
  });

  test("should filter blog by politics category", async ({ page }) => {
    // Act - click on Politics category (use first() for duplicates)
    await page.getByRole("link", { name: "Politics" }).first().click();
    
    // Assert - should navigate to politics section
    await expect(page).toHaveURL(/\/section\/politics/i);
    // Use testId to avoid multiple heading matches
    await expect(page.getByTestId("articleTitle")).toHaveText("Politics");
  });

  test("should navigate to blog article and display content", async ({ page }) => {
    // Arrange - wait for page to load
    await WaitHelper.waitForPageReady(page);
    
    // Act - navigate to first article
    await page.getByRole("button", { name: "Read More" }).first().click();
    await WaitHelper.waitForPageReady(page);
    
    // Assert - verify article page elements
    await expect(page.getByTestId("articleHeroImage")).toBeVisible();
    await expect(page.getByTestId("articleTitle")).toBeVisible();
    await expect(page.getByTestId("articleCategory")).toBeVisible();
    await expect(page.getByTestId("blogAuthor")).toBeVisible();
    await expect(page.getByTestId("CMS-contentWrapper").first()).toBeVisible();
    
    // Verify share functionality
    const shareButtons = page.getByTestId("shareBlog");
    await expect(shareButtons.first()).toBeVisible();
    
    // Verify FAQ section if present
    const faqSection = page.getByTestId("faqSection");
    if (await faqSection.isVisible({ timeout: 5000 })) {
      await expect(faqSection).toBeVisible();
    }
  });
});
