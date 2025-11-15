import { test, expect } from "@playwright/test";
import { NavigationHelper } from "../../../src/helpers/navigation.helper";
import { CleanupHelper } from "../../../src/helpers/cleanup.helper";
import { WaitHelper } from "../../../src/helpers/wait.helper";

test.describe("Navigation Bar", () => {
  test.beforeEach(async ({ page }) => {
    await NavigationHelper.navigateToPage(page, "/");
    await NavigationHelper.dismissOverlays(page);
  });

  test.afterEach(async ({ page }, testInfo) => {
    await CleanupHelper.takeScreenshotOnFailure(page, testInfo);
  });

  test("should display main navigation elements", async ({ page }) => {
    // Assert - verify navbar and logo are visible
    await expect(page.getByTestId("navbar")).toBeVisible();
    await expect(page.locator('[data-testid="navbar"] [data-cy="logo"]')).toBeVisible();
    
    // Verify main navigation links are visible
    await expect(page.getByTestId("nav-product")).toBeVisible();
    await expect(page.getByTestId("nav-resources")).toBeVisible();
    await expect(page.getByTestId("nav-about-us")).toBeVisible();
  });

  test("should expand product dropdown menu", async ({ page }) => {
    // Act - click on Product dropdown
    await page.getByTestId("nav-product").click();
    
    // Assert - verify product dropdown items are visible (use first() for duplicates)
    await expect(page.getByTestId("nav-campaign-tools").first()).toBeVisible();
    await expect(page.getByTestId("nav-template-library").first()).toBeVisible();
    await expect(page.getByTestId("nav-voter-data").first()).toBeVisible();
    await expect(page.getByTestId("nav-texting").first()).toBeVisible();
    await expect(page.getByTestId("nav-yard-signs").first()).toBeVisible();
    await expect(page.getByTestId("nav-serve").first()).toBeVisible();
    await expect(page.getByTestId("nav-pricing").first()).toBeVisible();
    await expect(page.getByTestId("nav-good-party-pro").first()).toBeVisible();
  });

  test("should expand resources dropdown menu", async ({ page }) => {
    // Act - click on Resources dropdown
    await page.getByTestId("nav-resources").click();
    
    // Assert - verify resources dropdown items are visible
    await expect(page.getByTestId("nav-get-demo")).toBeVisible();
    await expect(page.getByTestId("nav-blog")).toBeVisible();
    await expect(page.getByTestId("nav-community")).toBeVisible();
    await expect(page.getByTestId("nav-case-studies")).toBeVisible();
  });

  test("should expand about us dropdown menu", async ({ page }) => {
    // Act - click on About Us dropdown
    await page.getByTestId("nav-about-us").click();
    
    // Assert - verify about us dropdown items are visible
    await expect(page.getByTestId("nav-about")).toBeVisible();
    await expect(page.getByTestId("nav-team")).toBeVisible();
    await expect(page.getByTestId("nav-find-candidates")).toBeVisible();
    await expect(page.getByTestId("nav-contact-us")).toBeVisible();
  });

  test("should navigate to campaign tools page", async ({ page }) => {
    // Act
    await page.getByTestId("nav-product").click();
    await page.getByTestId("nav-campaign-tools").first().click();
    
    // Assert
    await expect(page).toHaveURL(/\/run-for-office$/);
    // Check for the actual heading text on the page
    await expect(page.getByText(/Supercharge your local campaign/)).toBeVisible();
  });

  test("should navigate to blog page", async ({ page }) => {
    // Act
    await page.getByTestId("nav-resources").click();
    await page.getByTestId("nav-blog").first().click();
    
    // Assert
    await expect(page).toHaveURL(/\/blog$/);
    await expect(page.getByRole("heading", { name: "Blog" })).toBeVisible();
  });

  test("should navigate to about page", async ({ page }) => {
    // Act
    await page.getByTestId("nav-about-us").click();
    await page.getByTestId("nav-about").click();
    
    // Assert
    await expect(page).toHaveURL(/\/about$/);
  });

  test("should close dropdown when clicking outside", async ({ page }) => {
    // Arrange - open product dropdown
    await page.getByTestId("nav-product").click();
    await expect(page.getByTestId("nav-campaign-tools")).toBeVisible();
    
    // Act - click outside the dropdown
    await page.locator("body").click();
    
    // Assert - dropdown should be hidden
    await expect(page.getByTestId("nav-campaign-tools")).not.toBeVisible();
  });
});
