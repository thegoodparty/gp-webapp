import "dotenv/config";
import { test, expect } from "@playwright/test";
import { checkButtons, documentReady } from "helpers/domHelpers";
import { setupMultiTestReporting, setupTestReporting } from "helpers/testrailHelper";
import { TEST_IDS } from "constants/testIds";

test.beforeEach(async ({ page }) => {
  await page.goto("/blog", { waitUntil: "commit" });
});

setupMultiTestReporting(test, {
  'Verify Blog page': TEST_IDS.RESOURCES_BLOG,
  'Verify Blog filtering': TEST_IDS.BLOG_CATEGORIES_FILTERS,
  'Verify Blog article': TEST_IDS.BLOG_ARTICLE
});

test("Verify Blog page", async ({ page }) => {
  const pageTitle = "Blog";
  const pageSubtitle =
    /Insights into politics, running for office, and the latest updates from the independent movement/;
  const categoryButtons = [
    "Latest Articles",
    "News",
    "Politics",
    "Independent Cause"
  ];

  // Verify page title
  await expect(page.locator(`h1:has-text("${pageTitle}")`)).toBeVisible({
    timeout: 20000,
  });

  // Verify page contents
  await expect(page.getByText(pageSubtitle)).toBeVisible();

  // Verify page buttons
  await checkButtons(page, categoryButtons);

  // Verify opening blog article link
  await page.locator(`button:has-text("Read More")`).first().isEnabled();
  await page.locator(`button:has-text("Read More")`).first().click();
  await expect(page).toHaveURL(/.*\/article/, { timeout: 10000 });
});

test("Verify Blog filtering", async ({ page }) => {
  // Filter blog page by category
  await page
    .locator('a').filter({ hasText: /^News$/ })
    .click();

  // Verify user redirected to category page
  await expect(page).toHaveURL(
    new RegExp(`/section/news`, "i"),
    { timeout: 10000 }
  );

  // Filter blog page by topic
  await page
    .getByRole('link', { name: 'Campaign Finance' })
    .click();

  // Verify user redirected to topic page
  await documentReady(page);
  await expect(page).toHaveURL(/.*\/blog\/tag/, { timeout: 10000 });
});

test.skip("Verify Blog Article page", async ({ page }) => {
  // Navigate to featured blog article
  await page.locator(`button:has-text("Read More")`).first().click();
  await documentReady(page);
  await expect(page).toHaveURL(/.*\/article/, { timeout: 5000 });

  // Verify blog article contents
  await expect(page.getByTestId("articleHeroImage")).toBeVisible();
  await expect(page.getByTestId("articleTitle")).toBeVisible();
  await expect(page.getByTestId("articleCategory")).toBeVisible();
  await expect(page.getByTestId("blogAuthor")).toBeVisible();
  await expect(page.getByTestId("CMS-contentWrapper").first()).toBeVisible();

  // Verify article displays share links twice
  const shareBlogCount = await page
    .locator('[data-testid="shareBlog"]')
    .count();
  await expect(shareBlogCount).toBe(2);

  // Verify FAQ section displays
  await expect(page.getByTestId("faqSection")).toBeVisible();

  // Verify FAQ section link opens to /faqs page
  await page
    .locator('[data-testid="faqSection"] li:first-child button')
    .click();
  await documentReady(page);
  await expect(page).toHaveURL(/.*\/faqs/, { timeout: 5000 });
});
