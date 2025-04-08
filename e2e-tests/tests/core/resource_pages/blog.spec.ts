import "dotenv/config";
import { test, expect } from "@playwright/test";
import { checkButtons } from "helpers/domHelpers";
import { addTestResult, handleTestFailure } from "helpers/testrailHelper";
import * as fs from "fs";
const runId = fs.readFileSync("testRunId.txt", "utf-8");

test.beforeEach(async ({ page }) => {
    await page.goto("/blog", {waitUntil: "commit"});
});

test("Verify Blog page", async ({ page }) => {
  const caseId = 12;
  const pageTitle = "Blog";
  const pageSubtitle =
    /Insights into politics, running for office, and the latest updates from the independent movement/;
  const categoryButtons = [
    "Latest Articles",
    "News",
    "Politics",
    "Independent Cause"
  ];

  try {
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

    // Report test results
    await addTestResult(runId, caseId, 1, "Test passed");
  } catch (error) {
    // Report test results
    const testrailBaseUrl = process.env.TESTRAIL_URL || 'https://goodparty.testrail.io';
    const testrailUrl = `${testrailBaseUrl}/index.php?/tests/view/${runId}_${caseId}`;
    const currentUrl = await page.url();
    await addTestResult(runId, caseId, 5, `Test failed (${testrailUrl}) at page ${currentUrl}: ${error.stack}`);
  }
});

test("Verify Blog filtering", async ({ page }) => {
  const caseId = 16;
  const categoryButtons = [
    "Latest Articles",
    "News",
    "Politics",
    "Independent Cause",
    "For Candidates",
    "For Voters",
  ];
  const topicsHeader = "Explore all Topics";
  const testTopic = "Campaign Finance";

  try {
    // Filter blog page by category
    await page
      .locator("nav")
      .locator(`a:has-text("${categoryButtons[1]}")`)
      .click();

    // Verify user redirected to category page
    await expect(page).toHaveURL(
      new RegExp(`/section/${categoryButtons[1]}`, "i"),
      { timeout: 5000 }
    );

    // Filter blog page by topic
    await page
      .locator(
        `div:has(h5:has-text("${topicsHeader}")) a:has-text("${testTopic}")`
      )
      .first()
      .click();

    // Verify user redirected to topic page
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/.*\/blog\/tag/, { timeout: 5000 });

    // Report test results
    await addTestResult(runId, caseId, 1, "Test passed");
  } catch (error) {
    // Report test results
    const testrailBaseUrl = process.env.TESTRAIL_URL || 'https://goodparty.testrail.io';
    const testrailUrl = `${testrailBaseUrl}/index.php?/tests/view/${runId}_${caseId}`;
    const currentUrl = await page.url();
    await addTestResult(runId, caseId, 5, `Test failed (${testrailUrl}) at page ${currentUrl}: ${error.stack}`);
  }
});

test("Verify Blog Article page", async ({ page }) => {
  const caseId = 17;

  try {
    // Navigate to featured blog article
    await page.locator(`button:has-text("Read More")`).first().click();
    await page.waitForLoadState("networkidle");
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
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/.*\/faqs/, { timeout: 5000 });

    // Report test results
    await addTestResult(runId, caseId, 1, "Test passed");
  } catch (error) {
    await handleTestFailure(page, runId, caseId, error);    
  }
});
